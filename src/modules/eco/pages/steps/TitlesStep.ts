import { PageStateError } from "../../../../core/errors/PageStateError.js";
import { TemplateFormPage } from "../TemplateFormPage.js";

export class TitlesStep extends TemplateFormPage {
  private get titlesLocTable() {
    return this.page
      .locator("table.loc")
      .filter({
        has: this.page.locator("th", { hasText: "Title of Work" }),
      })
      .filter({
        has: this.page.locator("th", { hasText: "Edit" }),
      })
      .first();
  }

  private get firstTitleLocalRow() {
    return this.titlesLocTable.locator("tbody > tr[id]").first();
  }

  async isLoaded(): Promise<boolean> {
    await this.waitForSiebelReady().catch(() => undefined);

    const currentStep = await this.getCurrentStepName().catch(() => null);

    this.debug("Detected current template form step", {
      currentStep,
      expectedStep: "Titles",
    });

    return currentStep === "Titles";
  }

  async editFirstTitle(): Promise<void> {
    await this.waitForSiebelReady();

    if ((await this.firstTitleLocalRow.count()) === 0) {
      throw new PageStateError("No title rows found in local All Titles table");
    }

    const editButton = this.firstTitleLocalRow
      .locator("span.loc-edit-btn")
      .first();

    if ((await editButton.count()) === 0) {
      throw new PageStateError("Could not find edit button in first title row");
    }

    this.log("Editing first title");

    await editButton.evaluate((element) => {
      (element as HTMLElement).click();
    });

    this.log("Edit first title click dispatched");
  }

  async continue(): Promise<void> {
    await this.waitForSiebelReady();

    this.log("Continuing from Titles");

    await this.clickNext();

    await this.waitForSiebelReady();
  }
}
