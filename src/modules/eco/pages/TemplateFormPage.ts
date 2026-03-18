import { PageStateError } from "../../../core/errors/PageStateError.js";
import { BasePage } from "./BasePage.js";
import type { TemplateFormStep } from "../models/TemplateFormStep.js";

export class TemplateFormPage extends BasePage {
  private get navigationLocTable() {
    return this.page
      .locator("table.loc")
      .filter({
        has: this.page.locator("a.drilldown", { hasText: "Type of Work" }),
      })
      .filter({
        has: this.page.locator("a.drilldown", { hasText: "Titles" }),
      })
      .first();
  }

  private get navigationLocRows() {
    return this.navigationLocTable.locator("tbody > tr[id]");
  }

  protected get backButton() {
    return this.page
      .locator('a[role="link"]')
      .filter({
        has: this.page.locator('img[alt=":Back"]'),
      })
      .first();
  }

  protected get nextButton() {
    return this.page
      .locator('a[role="link"]')
      .filter({
        has: this.page.locator('img[alt=":Next"]'),
      })
      .first();
  }

  protected get saveForLaterButton() {
    return this.page
      .locator('a[role="link"]')
      .filter({
        has: this.page.locator('img[alt=":Save For Later"]'),
      })
      .first();
  }

  async isLoaded(): Promise<boolean> {
    await this.waitForSiebelReady().catch(() => undefined);

    return (
      (await this.safeIsVisible(this.navigationLocTable)) &&
      (await this.safeIsVisible(this.nextButton))
    );
  }

  async getSteps(): Promise<TemplateFormStep[]> {
    const rowCount = await this.navigationLocRows.count();
    const steps: TemplateFormStep[] = [];

    for (let i = 0; i < rowCount; i += 1) {
      const row = this.navigationLocRows.nth(i);
      const rowId = await row.getAttribute("id");

      const cells = row.locator("td");
      const pointerCell = cells.nth(0);
      const linkCell = cells.nth(1);
      const completedCell = cells.nth(2);

      const pointerAlt = await pointerCell
        .locator("img")
        .first()
        .getAttribute("alt")
        .catch(() => null);

      const name = ((await linkCell.textContent()) ?? "")
        .replace(/\s+/g, " ")
        .trim();

      const completedAlt = await completedCell
        .locator("img")
        .first()
        .getAttribute("alt")
        .catch(() => null);

      const isCurrent = (pointerAlt ?? "")
        .toLowerCase()
        .includes("record pointer yes");
      const isComplete =
        (completedAlt ?? "").toLowerCase().includes("validated") &&
        !(completedAlt ?? "").toLowerCase().includes("not validated");

      steps.push({
        rowId,
        name,
        isCurrent,
        isComplete,
      });
    }

    this.debug("Template form steps parsed", { steps });

    return steps;
  }

  async getCurrentStep(): Promise<TemplateFormStep> {
    const steps = await this.getSteps();
    const current = steps.find((step) => step.isCurrent);

    if (!current) {
      throw new PageStateError(
        "Could not determine current template form step",
      );
    }

    return current;
  }

  async getCurrentStepName(): Promise<string> {
    const current = await this.getCurrentStep();
    return current.name;
  }

  async goToStep(stepName: string): Promise<void> {
    await this.waitForSiebelReady();

    const normalized = stepName.trim().toLowerCase();
    const rowCount = await this.navigationLocRows.count();

    for (let i = 0; i < rowCount; i += 1) {
      const row = this.navigationLocRows.nth(i);
      const link = row.locator("a.drilldown").first();
      const text = ((await link.textContent()) ?? "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

      if (text === normalized) {
        this.log("Navigating to template form step", { stepName });

        await link.evaluate((element) => {
          (element as HTMLAnchorElement).click();
        });

        await this.waitForSiebelReady();
        return;
      }
    }

    throw new PageStateError(`Template form step not found: ${stepName}`);
  }

  protected async clickNext(): Promise<void> {
    await this.nextButton.evaluate((element) => {
      (element as HTMLAnchorElement).click();
    });
  }

  protected async clickBack(): Promise<void> {
    await this.backButton.evaluate((element) => {
      (element as HTMLAnchorElement).click();
    });
  }

  async continue(): Promise<void> {
    const before = await this.getCurrentStepName().catch(() => null);

    this.log("Continuing template form", { from: before });

    await this.waitForSiebelReady();
    await this.clickNext();
    await this.waitForSiebelReady();

    const after = await this.getCurrentStepName().catch(() => null);

    this.log("Template form continue completed", {
      from: before,
      to: after,
    });
  }

  async back(): Promise<void> {
    const before = await this.getCurrentStepName().catch(() => null);

    this.log("Going back in template form", { from: before });

    await this.waitForSiebelReady();
    await this.clickBack();
    await this.waitForSiebelReady();

    const after = await this.getCurrentStepName().catch(() => null);

    this.log("Template form back completed", {
      from: before,
      to: after,
    });
  }
}
