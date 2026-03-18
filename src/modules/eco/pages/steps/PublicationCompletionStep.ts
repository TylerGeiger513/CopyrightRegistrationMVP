import { TemplateFormPage } from "../TemplateFormPage.js";

export class PublicationCompletionStep extends TemplateFormPage {
  private get yearOfCompletionInput() {
    return this.page.locator('input[name="s_7_1_44_0"]').first();
  }

  private get preregistrationNumberInput() {
    return this.page.locator('input[name="s_7_1_41_0"]').first();
  }

  async isLoaded(): Promise<boolean> {
    await this.waitForSiebelReady().catch(() => undefined);

    const current = await this.getCurrentStepName().catch(() => null);

    this.debug("Detected current template form step", {
      currentStep: current,
      expectedStep: "Publication/Completion",
    });

    return current === "Publication/Completion";
  }

  async setYearOfCompletion(year: string | number): Promise<void> {
    await this.waitForSiebelReady();

    const value = String(year);

    this.log("Setting year of completion", { value });

    await this.yearOfCompletionInput.fill(value);
  }

  async setPreregistrationNumber(value: string): Promise<void> {
    await this.waitForSiebelReady();

    this.log("Setting preregistration number", { value });

    await this.preregistrationNumberInput.fill(value);
  }

  async fillPublicationCompletion(data: {
    yearOfCompletion?: string | number;
    preregistrationNumber?: string;
  }): Promise<void> {
    await this.waitForSiebelReady();

    if (data.yearOfCompletion !== undefined) {
      await this.setYearOfCompletion(data.yearOfCompletion);
    }

    if (data.preregistrationNumber !== undefined) {
      await this.setPreregistrationNumber(data.preregistrationNumber);
    }
  }

  async continue(): Promise<void> {
    await this.waitForSiebelReady();

    this.log("Continuing from Publication/Completion");

    await this.clickNext();

    await this.waitForSiebelReady();
  }
}
