import { TemplateFormPage } from "../TemplateFormPage.js";

export class RightsPermissionsStep extends TemplateFormPage {
  async isLoaded(): Promise<boolean> {
    await this.waitForSiebelReady().catch(() => undefined);

    const current = await this.getCurrentStepName().catch(() => null);

    this.debug("Detected current template form step", {
      currentStep: current,
      expectedStep: "Rights & Permissions",
    });

    return current === "Rights & Permissions";
  }

  async continue(): Promise<void> {
    await this.waitForSiebelReady();

    this.log("Continuing from Rights & Permissions");

    await this.clickNext();

    await this.waitForSiebelReady();
  }
}
