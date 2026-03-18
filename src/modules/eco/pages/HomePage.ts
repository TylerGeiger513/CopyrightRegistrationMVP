import { BasePage } from "./BasePage.js";

export class HomePage extends BasePage {
  private get table() {
    return this.getAppletTable("Open Cases");
  }

  private get useExistingTemplateLink() {
    return this.page.getByRole("link", { name: "Use an Existing Template" });
  }

  async goto(): Promise<void> {
    await super.goto();
  }

  async isLoaded(): Promise<boolean> {
    await this.waitForSiebelReady().catch(() => undefined);

    return (
      (await this.table.isVisible()) &&
      (await this.safeIsVisible(this.useExistingTemplateLink))
    );
  }

  async clickUseExistingTemplate(): Promise<void> {
    await this.withReadyState(async () => {
      this.log("Clicking Use an Existing Template");
      await this.useExistingTemplateLink.click();
    });
  }
}
