import { TemplateFormPage } from "../TemplateFormPage.js";

export class TypeOfWorkStep extends TemplateFormPage {
  async isLoaded(): Promise<boolean> {
    await this.waitForSiebelReady().catch(() => undefined);

    const current = await this.getCurrentStepName().catch(() => null);

    this.debug("Detected current template form step", {
      currentStep: current,
      expectedStep: "Type of Work",
    });

    return current === "Type of Work";
  }

  async continue(): Promise<void> {
    await this.waitForSiebelReady();

    this.log("Continuing from Type of Work");

    await this.clickNext();

    await this.waitForSiebelReady();
  }
}
