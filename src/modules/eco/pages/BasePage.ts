import type { Page, Locator } from "playwright";
import type { Logger } from "../../../core/logging/Logger.js";
import { PageStateError } from "../../../core/errors/PageStateError.js";
import type { PageContext } from "./PageContext.js";
import { SiebelAppletTable } from "../support/siebel/SiebelAppletTable.js";

export abstract class BasePage {
  protected readonly page: Page;
  protected readonly logger: Logger;
  protected readonly baseUrl: string;

  constructor(protected readonly context: PageContext) {
    this.page = context.page;
    this.logger = context.logger;
    this.baseUrl = context.baseUrl;
  }

  abstract isLoaded(): Promise<boolean>;

  protected log(message: string, meta?: Record<string, unknown>): void {
    this.logger.info(`[${this.constructor.name}] ${message}`, meta);
  }

  protected debug(message: string, meta?: Record<string, unknown>): void {
    this.logger.debug(`[${this.constructor.name}] ${message}`, meta);
  }

  protected warn(message: string, meta?: Record<string, unknown>): void {
    this.logger.warn(`[${this.constructor.name}] ${message}`, meta);
  }

  protected error(message: string, meta?: Record<string, unknown>): void {
    this.logger.error(`[${this.constructor.name}] ${message}`, meta);
  }

  protected async goto(path = ""): Promise<void> {
    const url = path ? `${this.baseUrl}${path}` : this.baseUrl;
    this.log("Navigating", { url });
    await this.page.goto(url, { waitUntil: "domcontentloaded" });
    await this.waitForSiebelReady();
  }

  protected async safeIsVisible(locator: Locator): Promise<boolean> {
    try {
      return await locator.isVisible();
    } catch {
      return false;
    }
  }

  protected getAppletTable(title: string): SiebelAppletTable {
    return new SiebelAppletTable({
      page: this.page,
      logger: this.logger,
      title,
    });
  }

  async waitUntilLoaded(timeout = 10000, interval = 250): Promise<void> {
    const startedAt = Date.now();

    while (Date.now() - startedAt < timeout) {
      await this.waitForSiebelReady({
        timeout: Math.min(3000, interval * 4),
      }).catch(() => undefined);

      if (await this.isLoaded()) {
        this.log("Page loaded");
        return;
      }

      await this.page.waitForTimeout(interval);
    }

    throw new PageStateError(
      `${this.constructor.name} did not load within ${timeout}ms`,
    );
  }

  protected async waitForSiebelReady(
    options: { timeout?: number } = {},
  ): Promise<void> {
    const timeout = options.timeout ?? 20000;

    this.debug("Waiting for Siebel ready state", { timeout });

    try {
      await this.page.waitForFunction(
        () => {
          const isBusy = window.SiebelApp?.S_App?.uiStatus?.IsBusy?.() ?? true;

          const maskOverlay = document.querySelector(
            "#maskoverlay",
          ) as HTMLElement | null;
          const overlayDisplay = maskOverlay?.style?.display ?? "none";
          const isMaskOverlayVisible = overlayDisplay !== "none";

          return !isBusy && !isMaskOverlayVisible;
        },
        { timeout },
      );

      this.debug("Siebel ready state reached");
    } catch (error) {
      throw new PageStateError(
        `${this.constructor.name} timed out waiting for Siebel ready state`,
      );
    }
  }

  protected async withReadyState<T>(action: () => Promise<T>): Promise<T> {
    await this.waitForSiebelReady();
    const result = await action();
    await this.waitForSiebelReady();
    return result;
  }
}
