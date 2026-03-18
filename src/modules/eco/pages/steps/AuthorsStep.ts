import { TemplateFormPage } from "../TemplateFormPage.js";

export class AuthorsStep extends TemplateFormPage {
  async isLoaded(): Promise<boolean> {
    await this.waitForSiebelReady().catch(() => undefined);
    const current = await this.getCurrentStepName().catch(() => null);
    return current === "Authors";
  }

  async continue(): Promise<void> {
    await this.waitForSiebelReady();
    await this.clickNext();
    await this.waitForSiebelReady();
  }
}
