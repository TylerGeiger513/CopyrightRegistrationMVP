import { TemplateFormPage } from "../TemplateFormPage.js";

export class PublicationCompletionStep extends TemplateFormPage {
  private get publicationDateInput() {
    return this.page.getByLabel(/Date of First Publication/i).first();
  }

  private get yearOfCompletionInput() {
    return this.page.getByLabel(/Year of Completion/i).first();
  }

  private get preregistrationNumberInput() {
    return this.page.getByLabel(/Preregistration Number/i).first();
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

  async setPublicationDate(value: string): Promise<void> {
    await this.waitForSiebelReady();
    this.log("Setting publication date", { value });
    await this.publicationDateInput.fill(value);
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
    publicationDate?: string;
    yearOfCompletion?: string | number;
    preregistrationNumber?: string;
  }): Promise<void> {
    await this.waitForSiebelReady();

    if (data.publicationDate !== undefined) {
      await this.setPublicationDate(data.publicationDate);
    }

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
