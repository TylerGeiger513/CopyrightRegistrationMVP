import { BasePage } from "../BasePage.js";

export class EditTitlePage extends BasePage {
  private get titleTextarea() {
    return this.page.locator('textarea[name="s_1_1_8_0"]').first();
  }

  private get saveButton() {
    return this.page
      .locator('a[role="link"]')
      .filter({
        has: this.page.locator('img[alt="Title Form:Save"]'),
      })
      .first();
  }

  private get cancelButton() {
    return this.page
      .locator('a[role="link"]')
      .filter({
        has: this.page.locator('img[alt="Title Form:Cancel"]'),
      })
      .first();
  }

  async isLoaded(): Promise<boolean> {
    const textareaVisible = await this.safeIsVisible(this.titleTextarea);
    const saveVisible = await this.safeIsVisible(this.saveButton);

    this.debug("Edit title control visibility", {
      textarea: textareaVisible,
      saveButton: saveVisible,
    });

    return textareaVisible && saveVisible;
  }

  async setTitle(title: string): Promise<void> {
    this.log("Setting title", { title });
    await this.titleTextarea.fill(title);
  }

  async save(): Promise<void> {
    this.log("Saving title");

    await this.saveButton.evaluate((element) => {
      (element as HTMLAnchorElement).click();
    });
  }

  async cancel(): Promise<void> {
    this.log("Cancelling title edit");

    await this.cancelButton.evaluate((element) => {
      (element as HTMLAnchorElement).click();
    });
  }

  async updateTitle(title: string): Promise<void> {
    await this.setTitle(title);
    await this.save();
  }
}
