import { BasePage } from "./BasePage.js";
import type { SiebelTableRow } from "../support/siebel/types.js";

export class TemplatePage extends BasePage {
  private get table() {
    return this.getAppletTable("Case Templates");
  }

  async isLoaded(): Promise<boolean> {
    await this.waitForSiebelReady().catch(() => undefined);
    return this.table.isVisible();
  }

  async getVisibleTemplates(): Promise<SiebelTableRow[]> {
    await this.waitForSiebelReady();
    return this.table.getVisibleRows();
  }

  async openTemplateByName(templateName: string): Promise<void> {
    await this.waitForSiebelReady();

    this.log("Opening template by name", { templateName });

    await this.table.openRowByCellText("Template Name", templateName, {
      exact: true,
      startFromFirstPage: true,
      maxPages: 50,
    });
  }
}
