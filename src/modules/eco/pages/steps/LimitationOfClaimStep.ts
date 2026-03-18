import { TemplateFormPage } from "../TemplateFormPage.js";

export class LimitationOfClaimStep extends TemplateFormPage {
  private get firstPreviousRegistrationNumberInput() {
    return this.page.getByLabel(/1st Prev\. Reg\. #/i).first();
  }

  private get secondPreviousRegistrationNumberInput() {
    return this.page.getByLabel(/2nd Prev\. Reg\. #/i).first();
  }

  private get previousRegistrationYearInputs() {
    return this.page.getByLabel(/^Year$/i);
  }

  private get firstPreviousRegistrationYearInput() {
    return this.previousRegistrationYearInputs.nth(0);
  }

  private get secondPreviousRegistrationYearInput() {
    return this.previousRegistrationYearInputs.nth(1);
  }

  async isLoaded(): Promise<boolean> {
    await this.waitForSiebelReady().catch(() => undefined);

    const current = await this.getCurrentStepName().catch(() => null);

    this.debug("Detected current template form step", {
      currentStep: current,
      expectedStep: "Limitation of Claim",
    });

    return current === "Limitation of Claim";
  }

  async setFirstPreviousRegistrationNumber(value: string): Promise<void> {
    await this.waitForSiebelReady();

    this.log("Setting 1st previous registration number", { value });

    await this.firstPreviousRegistrationNumberInput.fill(value);
  }

  async setFirstPreviousRegistrationYear(year: string | number): Promise<void> {
    await this.waitForSiebelReady();

    const value = String(year);

    this.log("Setting 1st previous registration year", { value });

    await this.firstPreviousRegistrationYearInput.fill(value);
  }

  async setSecondPreviousRegistrationNumber(value: string): Promise<void> {
    await this.waitForSiebelReady();

    this.log("Setting 2nd previous registration number", { value });

    await this.secondPreviousRegistrationNumberInput.fill(value);
  }

  async setSecondPreviousRegistrationYear(
    year: string | number,
  ): Promise<void> {
    await this.waitForSiebelReady();

    const value = String(year);

    this.log("Setting 2nd previous registration year", { value });

    await this.secondPreviousRegistrationYearInput.fill(value);
  }

  async fillLimitationOfClaim(data: {
    firstPreviousRegistrationNumber?: string;
    firstPreviousRegistrationYear?: string | number;
    secondPreviousRegistrationNumber?: string;
    secondPreviousRegistrationYear?: string | number;
  }): Promise<void> {
    await this.waitForSiebelReady();

    if (data.firstPreviousRegistrationNumber !== undefined) {
      await this.setFirstPreviousRegistrationNumber(
        data.firstPreviousRegistrationNumber,
      );
    }

    if (data.firstPreviousRegistrationYear !== undefined) {
      await this.setFirstPreviousRegistrationYear(
        data.firstPreviousRegistrationYear,
      );
    }

    if (data.secondPreviousRegistrationNumber !== undefined) {
      await this.setSecondPreviousRegistrationNumber(
        data.secondPreviousRegistrationNumber,
      );
    }

    if (data.secondPreviousRegistrationYear !== undefined) {
      await this.setSecondPreviousRegistrationYear(
        data.secondPreviousRegistrationYear,
      );
    }
  }

  async continue(): Promise<void> {
    await this.waitForSiebelReady();

    this.log("Continuing from Limitation of Claim");

    await this.clickNext();

    await this.waitForSiebelReady();
  }
}
