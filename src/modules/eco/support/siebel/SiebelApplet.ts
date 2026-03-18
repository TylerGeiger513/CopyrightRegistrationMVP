import type { Locator } from "playwright";
import type { SiebelAppletContext } from "./types.js";

export class SiebelApplet {
  constructor(private readonly context: SiebelAppletContext) {}

  private get page() {
    return this.context.page;
  }

  private get logger() {
    return this.context.logger;
  }

  get title(): string {
    return this.context.title;
  }

  get root(): Locator {
    return this.page
      .locator('form[aria-label="Applet"]')
      .filter({
        has: this.page.getByRole("heading", { name: this.title }),
      })
      .first();
  }

  get heading(): Locator {
    return this.root.getByRole("heading", { name: this.title });
  }

  get errorContainer(): Locator {
    return this.root.locator('span[id$="_c_err"]').first();
  }

  get rowCounter(): Locator {
    return this.root.locator(".siebui-row-counter").first();
  }

  get firstPageButton(): Locator {
    return this.root.locator('[id^="first_pager_"]').first();
  }

  get previousPageButton(): Locator {
    return this.root.locator('[id^="prev_pager_"]').first();
  }

  get nextPageButton(): Locator {
    return this.root.locator('[id^="next_pager_"]').first();
  }

  get lastPageButton(): Locator {
    return this.root.locator('[id^="last_pager_"]').first();
  }

  get gridTable(): Locator {
    return this.root.locator('table[datatable="1"][role="grid"]').first();
  }

  get headerTable(): Locator {
    return this.root.locator("table.ui-jqgrid-htable").first();
  }

  async isVisible(): Promise<boolean> {
    try {
      return await this.heading.isVisible();
    } catch {
      return false;
    }
  }

  async getRowCounterText(): Promise<string | null> {
    try {
      if (await this.rowCounter.isVisible()) {
        const text = await this.rowCounter.textContent();
        return text?.trim() || null;
      }
    } catch {
      return null;
    }

    return null;
  }

  log(message: string, meta?: Record<string, unknown>): void {
    this.logger.info(`[SiebelApplet:${this.title}] ${message}`, meta);
  }
}
