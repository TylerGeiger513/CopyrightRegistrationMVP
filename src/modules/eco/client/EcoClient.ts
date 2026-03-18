import type { Page } from "playwright";
import { AppError } from "../../../core/errors/AppError.js";
import { BrowserManager } from "../../../core/browser/BrowserManager.js";
import type { BrowserSession } from "../../../core/browser/BrowserSession.js";
import type { Logger } from "../../../core/logging/Logger.js";
import type { EcoConfig } from "../support/EcoConfig.js";
import type { PageContext } from "../pages/PageContext.js";
import { PageRegistry } from "../pages/PageRegistry.js";
import type { BasePage } from "../pages/BasePage.js";
import { LoginPage } from "../pages/LoginPage.js";
import { ECO_PAGE_KEYS } from "../pages/PageKeys.js";
import { TemplatePage } from "../pages/TemplatePage.js";
import { HomePage } from "../pages/HomePage.js";
import { TemplateFormPage } from "../pages/TemplateFormPage.js";
import { EditTitlePage } from "../pages/steps/EditTitlePage.js";
import { TitlesStep } from "../pages/steps/TitlesStep.js";
import { TypeOfWorkStep } from "../pages/steps/TypeOfWorkStep.js";

export class EcoClient {
  private readonly browserManager: BrowserManager;
  private readonly pageRegistry: PageRegistry;

  private session: BrowserSession | null = null;
  private pageContext: PageContext | null = null;

  private attachDialogHandler(): void {
    const page = this.getBrowserPage();

    page.on("dialog", async (dialog) => {
      this.logger.debug("Browser dialog detected", {
        type: dialog.type(),
        message: dialog.message(),
        defaultValue: dialog.defaultValue(),
      });

      try {
        await dialog.dismiss();
        this.logger.debug("Browser dialog dismissed", {
          type: dialog.type(),
          message: dialog.message(),
        });
      } catch (error) {
        this.logger.error("Failed to dismiss browser dialog", {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    });
  }

  constructor(
    private readonly config: EcoConfig,
    private readonly logger: Logger,
  ) {
    this.browserManager = new BrowserManager();
    this.pageRegistry = new PageRegistry();
  }

  async start(): Promise<void> {
    if (this.session) {
      this.logger.warn("ECO client already started");
      return;
    }

    this.logger.info("Starting ECO client", {
      baseUrl: this.config.baseUrl,
      headless: this.config.headless,
      slowMo: this.config.slowMo,
    });

    this.session = await this.browserManager.launch({
      headless: this.config.headless,
      slowMo: this.config.slowMo,
    });

    this.pageContext = {
      page: this.session.page,
      logger: this.logger,
      baseUrl: this.config.baseUrl,
    };

    this.attachDialogHandler();
    this.registerCorePages();

    this.logger.info("ECO client started successfully", {
      registeredPages: this.pageRegistry.keys(),
    });
  }

  async close(): Promise<void> {
    if (!this.session) {
      this.logger.warn("ECO client close called before start");
      return;
    }

    this.logger.info("Closing ECO client");

    await this.browserManager.close(this.session);

    this.session = null;
    this.pageContext = null;
    this.pageRegistry.clear();

    this.logger.info("ECO client closed");
  }

  private registerCorePages(): void {
    const context = this.getPageContext();

    this.registerPage(ECO_PAGE_KEYS.LOGIN, new LoginPage(context));
    this.registerPage(ECO_PAGE_KEYS.HOME, new HomePage(context));
    this.registerPage(ECO_PAGE_KEYS.TEMPLATE, new TemplatePage(context));

    this.registerPage(
      ECO_PAGE_KEYS.TEMPLATE_FORM,
      new TemplateFormPage(context),
    );
    this.registerPage(
      ECO_PAGE_KEYS.TYPE_OF_WORK_STEP,
      new TypeOfWorkStep(context),
    );
    this.registerPage(ECO_PAGE_KEYS.TITLES_STEP, new TitlesStep(context));
    this.registerPage(
      ECO_PAGE_KEYS.EDIT_TITLE_PAGE,
      new EditTitlePage(context),
    );
  }

  registerPage<T extends BasePage>(key: string, page: T): T {
    this.logger.debug("Registering page", {
      key,
      pageClass: page.constructor.name,
    });

    return this.pageRegistry.register(key, page);
  }

  getPage<T extends BasePage>(key: string): T {
    return this.pageRegistry.get<T>(key);
  }

  hasPage(key: string): boolean {
    return this.pageRegistry.has(key);
  }

  getBrowserPage(): Page {
    if (!this.session) {
      throw new AppError("ECO client has not been started");
    }

    return this.session.page;
  }

  getPageContext(): PageContext {
    if (!this.pageContext) {
      throw new AppError(
        "Page context is unavailable because the client is not started",
      );
    }

    return this.pageContext;
  }

  getPageRegistry(): PageRegistry {
    return this.pageRegistry;
  }

  getLogger(): Logger {
    return this.logger;
  }

  async goto(url?: string): Promise<void> {
    const page = this.getBrowserPage();
    const targetUrl = url ?? this.config.baseUrl;

    this.logger.info("Navigating browser", { url: targetUrl });

    await page.goto(targetUrl, {
      waitUntil: "domcontentloaded",
    });
  }

  async reload(): Promise<void> {
    const page = this.getBrowserPage();

    this.logger.info("Reloading current page", {
      url: page.url(),
    });

    await page.reload({
      waitUntil: "domcontentloaded",
    });
  }

  async getCurrentUrl(): Promise<string> {
    return this.getBrowserPage().url();
  }

  isStarted(): boolean {
    return this.session !== null;
  }
}
