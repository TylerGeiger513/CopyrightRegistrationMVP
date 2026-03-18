import type { Locator } from "playwright";
import { TemplateFormPage } from "../TemplateFormPage.js";

type ReviewGridRow = Record<string, string | boolean | null>;

export interface ReviewSubmissionData {
  caseSummary: {
    caseNumber: string | null;
    applicationFormat: string | null;
    caseType: string | null;
    contactName: string | null;
    opened: string | null;
  };

  allTitles: Array<{
    titleOfWork: string | null;
    volume: string | null;
    number: string | null;
    issueDate: string | null;
    type: string | null;
    onPage: string | null;
  }>;

  publicationCompletion: Array<{
    publishedWork: string | null;
    yearCreated: string | null;
    publicationDate: string | null;
    nationOfFirstPublication: string | null;
    isnType: string | null;
    isNumber: string | null;
    preregistrationNumber: string | null;
  }>;

  authorsContributions: Array<{
    name: string | null;
    organizationName: string | null;
    workForHire: string | null;
    citizenship: string | null;
    domicile: string | null;
    yearOfBirth: string | null;
    yearOfDeath: string | null;
    anonymous: string | null;
    pseudonymous: string | null;
    pseudonym: string | null;
    text: string | null;
    photo: string | null;
    art: string | null;
    editing?: string | null;
    computerProgram: string | null;
    translation?: string | null;
    compilation?: string | null;
    createdOther: string | null;
  }>;

  claimants: Array<{
    name: string | null;
    organizationName: string | null;
    transferStatement: string | null;
    transferStmtOther: string | null;
    address: string | null;
  }>;

  claimLimitationReview: {
    materialExcluded: {
      text: boolean;
      artwork: boolean;
      photographs: boolean;
      computerProgram: boolean;
      other: string | null;
    };
    newMaterialIncluded: {
      text: boolean;
      artwork: boolean;
      photographs: boolean;
      computerProgram: boolean;
      other: string | null;
    };
    previousRegistration: {
      firstPrevRegNumber: string | null;
      firstPrevRegYear: string | null;
      secondPrevRegNumber: string | null;
      secondPrevRegYear: string | null;
    };
  };

  rightsPermissions: {
    firstName: string | null;
    middleName: string | null;
    lastName: string | null;
    email: string | null;
    phone: string | null;
    alternatePhone: string | null;
    organizationName: string | null;
    address1: string | null;
    address2: string | null;
    city: string | null;
    state: string | null;
    postalCode: string | null;
    country: string | null;
  };

  correspondent: {
    firstName: string | null;
    middleName: string | null;
    lastName: string | null;
    email: string | null;
    phone: string | null;
    alternatePhone: string | null;
    fax: string | null;
    organizationName: string | null;
    address1: string | null;
    address2: string | null;
    city: string | null;
    state: string | null;
    postalCode: string | null;
    country: string | null;
  };

  mailCertificate: {
    firstName: string | null;
    middleName: string | null;
    lastName: string | null;
    organizationName: string | null;
    address1: string | null;
    address2: string | null;
    city: string | null;
    state: string | null;
    postalCode: string | null;
    country: string | null;
  };

  certification: {
    name: string | null;
    certified: boolean;
    specialHandling: boolean;
    internalTrackingNumber: string | null;
    noteToCopyrightOffice: string | null;
  };
}

export class ReviewSubmissionStep extends TemplateFormPage {
  protected get backButton() {
    return this.page.getByRole("link", { name: /back/i }).first();
  }

  protected get saveForLaterButton() {
    return this.page.getByRole("link", { name: /save for later/i }).first();
  }

  protected get saveAsTemplateButton() {
    return this.page.getByRole("link", { name: /save as template/i }).first();
  }

  private get addToCartButton() {
    return this.page.getByRole("link", { name: /add to cart/i }).first();
  }

  async isLoaded(): Promise<boolean> {
    await this.waitForSiebelReady().catch(() => undefined);

    const current = await this.getCurrentStepName().catch(() => null);

    this.debug("Detected current template form step", {
      currentStep: current,
      expectedStep: "Review Submission",
    });

    return current === "Review Submission";
  }

  async extractReviewSubmission(): Promise<ReviewSubmissionData> {
    await this.waitForSiebelReady();

    return {
      caseSummary: await this.extractCaseSummary(),
      allTitles: await this.extractAllTitles(),
      publicationCompletion: await this.extractPublicationCompletion(),
      authorsContributions: await this.extractAuthorsContributions(),
      claimants: await this.extractClaimants(),
      claimLimitationReview: await this.extractClaimLimitationReview(),
      rightsPermissions: await this.extractRightsPermissions(),
      correspondent: await this.extractCorrespondent(),
      mailCertificate: await this.extractMailCertificate(),
      certification: await this.extractCertification(),
    };
  }

  async goBack(): Promise<void> {
    await this.waitForSiebelReady();
    this.log("Going back from Review Submission");
    await this.backButton.click();
    await this.waitForSiebelReady();
  }

  async saveForLater(): Promise<void> {
    await this.waitForSiebelReady();
    this.log("Saving review submission for later");
    await this.saveForLaterButton.click();
    await this.waitForSiebelReady();
  }

  async saveAsTemplate(): Promise<void> {
    await this.waitForSiebelReady();
    this.log("Saving review submission as template");
    await this.saveAsTemplateButton.click();
    await this.waitForSiebelReady();
  }

  async addToCart(): Promise<void> {
    await this.waitForSiebelReady();
    this.log("Adding review submission to cart");
    await this.addToCartButton.click();
    await this.waitForSiebelReady();
  }

  async submit(): Promise<void> {
    await this.addToCart();
  }

  private async extractCaseSummary(): Promise<
    ReviewSubmissionData["caseSummary"]
  > {
    const applet = this.getFormAppletByTitle("Case Summary");

    return {
      caseNumber: await this.readFieldByLabel(applet, "Case Number"),
      applicationFormat: await this.readFieldByLabel(
        applet,
        "Application Format",
      ),
      caseType: await this.readFieldByLabel(applet, "Case Type"),
      contactName: await this.readFieldByLabel(applet, "Contact Name"),
      opened: await this.readFieldByLabel(applet, "Opened"),
    };
  }

  private async extractAllTitles(): Promise<ReviewSubmissionData["allTitles"]> {
    const rows = await this.readGridAppletByTitle("All Titles");

    return rows.map((row) => ({
      titleOfWork: this.asString(row["Title of Work"]),
      volume: this.asString(row["Volume"]),
      number: this.asString(row["Number"]),
      issueDate: this.asString(row["Issue Date"]),
      type: this.asString(row["Type"]),
      onPage: this.asString(row["On Page"]),
    }));
  }

  private async extractPublicationCompletion(): Promise<
    ReviewSubmissionData["publicationCompletion"]
  > {
    const rows = await this.readGridAppletByTitle("Publication/Completion");

    return rows.map((row) => ({
      publishedWork: this.asString(row["Published Work"]),
      yearCreated: this.asString(row["Year Created"]),
      publicationDate: this.asString(row["Publication Date"]),
      nationOfFirstPublication: this.asString(
        row["Nation of First Publication"],
      ),
      isnType: this.asString(row["ISN Type"]),
      isNumber: this.asString(row["IS Number"]),
      preregistrationNumber: this.asString(row["Preregistration Number"]),
    }));
  }

  private async extractAuthorsContributions(): Promise<
    ReviewSubmissionData["authorsContributions"]
  > {
    const rows = await this.readGridAppletByTitle("Authors & Contributions");

    return rows.map((row) => ({
      name: this.asString(row["Name"]),
      organizationName: this.asString(row["Organization Name"]),
      workForHire: this.asString(row["Work For Hire"]),
      citizenship: this.asString(row["Citizenship"]),
      domicile: this.asString(row["Domicile"]),
      yearOfBirth: this.asString(row["Year of Birth"]),
      yearOfDeath: this.asString(row["Year of Death"]),
      anonymous: this.asString(row["Anonymous"]),
      pseudonymous: this.asString(row["Pseudonymous"]),
      pseudonym: this.asString(row["Pseudonym"]),
      text: this.asString(row["Text"]),
      photo: this.asString(row["Photo"]),
      art: this.asString(row["Art"]),
      editing: this.asString(row["Editing"]),
      computerProgram: this.asString(row["Computer Program"]),
      translation: this.asString(row["Translation"]),
      compilation: this.asString(row["Compilation"]),
      createdOther: this.asString(row["Created Other"]),
    }));
  }

  private async extractClaimants(): Promise<ReviewSubmissionData["claimants"]> {
    const rows = await this.readGridAppletByTitle("Claimants");

    return rows.map((row) => ({
      name: this.asString(row["Name"]),
      organizationName: this.asString(row["Organization Name"]),
      transferStatement: this.asString(row["Transfer Statement"]),
      transferStmtOther: this.asString(row["Transfer Stmt Other"]),
      address: this.asString(row["Address"]),
    }));
  }

  private async extractClaimLimitationReview(): Promise<
    ReviewSubmissionData["claimLimitationReview"]
  > {
    const applet = this.getFormAppletByTitle("Claim Limitations review");

    return {
      materialExcluded: {
        text: await this.readCheckboxByLabel(applet, "Text", 0),
        artwork: await this.readCheckboxByLabel(applet, "Artwork", 0),
        photographs: await this.readCheckboxByLabel(applet, "Photograph(s)", 0),
        computerProgram: await this.readCheckboxByLabel(
          applet,
          "Computer Program",
          0,
        ),
        other: await this.readInputByLabel(applet, "Other", 0),
      },
      newMaterialIncluded: {
        text: await this.readCheckboxByLabel(applet, "Text", 1),
        artwork: await this.readCheckboxByLabel(applet, "Artwork", 1),
        photographs: await this.readCheckboxByLabel(applet, "Photograph(s)", 1),
        computerProgram: await this.readCheckboxByLabel(
          applet,
          "Computer Program",
          1,
        ),
        other: await this.readInputByLabel(applet, "Other", 1),
      },
      previousRegistration: {
        firstPrevRegNumber: await this.readInputByLabel(
          applet,
          "1st Prev. Reg. #",
        ),
        firstPrevRegYear: await this.readInputByLabel(applet, "Year", 0),
        secondPrevRegNumber: await this.readInputByLabel(
          applet,
          "2nd Prev. Reg. #",
        ),
        secondPrevRegYear: await this.readInputByLabel(applet, "Year", 1),
      },
    };
  }

  private async extractRightsPermissions(): Promise<
    ReviewSubmissionData["rightsPermissions"]
  > {
    const applet = this.getFormAppletByTitle("Rights & Permissions");

    return {
      firstName: await this.readFieldByLabel(applet, "First Name"),
      middleName: await this.readFieldByLabel(applet, "Middle Name"),
      lastName: await this.readFieldByLabel(applet, "Last Name"),
      email: await this.readFieldByLabel(applet, "Email"),
      phone: await this.readFieldByLabel(applet, "Phone"),
      alternatePhone: await this.readFieldByLabel(applet, "Alternate Phone"),
      organizationName: await this.readFieldByLabel(
        applet,
        "Organization Name",
      ),
      address1: await this.readFieldByLabel(applet, "Address 1"),
      address2: await this.readFieldByLabel(applet, "Address 2"),
      city: await this.readFieldByLabel(applet, "City"),
      state: await this.readFieldByLabel(applet, "State"),
      postalCode: await this.readFieldByLabel(applet, "Postal Code"),
      country: await this.readFieldByLabel(applet, "Country"),
    };
  }

  private async extractCorrespondent(): Promise<
    ReviewSubmissionData["correspondent"]
  > {
    const applet = this.getFormAppletByTitle("Correspondent");

    return {
      firstName: await this.readFieldByLabel(applet, "First Name"),
      middleName: await this.readFieldByLabel(applet, "Middle Name"),
      lastName: await this.readFieldByLabel(applet, "Last Name"),
      email: await this.readFieldByLabel(applet, "Email"),
      phone: await this.readFieldByLabel(applet, "Phone"),
      alternatePhone: await this.readFieldByLabel(applet, "Alternate Phone"),
      fax: await this.readFieldByLabel(applet, "Fax"),
      organizationName: await this.readFieldByLabel(
        applet,
        "Organization Name",
      ),
      address1: await this.readFieldByLabel(applet, "Address 1"),
      address2: await this.readFieldByLabel(applet, "Address 2"),
      city: await this.readFieldByLabel(applet, "City"),
      state: await this.readFieldByLabel(applet, "State"),
      postalCode: await this.readFieldByLabel(applet, "Postal Code"),
      country: await this.readFieldByLabel(applet, "Country"),
    };
  }

  private async extractMailCertificate(): Promise<
    ReviewSubmissionData["mailCertificate"]
  > {
    const applet = this.getFormAppletByTitle("Mail Certificate");

    return {
      firstName: await this.readFieldByLabel(applet, "First Name"),
      middleName: await this.readFieldByLabel(applet, "Middle Name"),
      lastName: await this.readFieldByLabel(applet, "Last Name"),
      organizationName: await this.readFieldByLabel(
        applet,
        "Organization Name",
      ),
      address1: await this.readFieldByLabel(applet, "Address 1"),
      address2: await this.readFieldByLabel(applet, "Address 2"),
      city: await this.readFieldByLabel(applet, "City"),
      state: await this.readFieldByLabel(applet, "State"),
      postalCode: await this.readFieldByLabel(applet, "Postal Code"),
      country: await this.readFieldByLabel(applet, "Country"),
    };
  }

  private async extractCertification(): Promise<
    ReviewSubmissionData["certification"]
  > {
    const applet = this.getFormAppletByTitle("Certification");

    return {
      name: await this.readFieldByLabel(applet, "Name"),
      certified: await this.readCheckboxByLabel(applet, "Certified"),
      specialHandling: await this.readCheckboxByLabel(
        applet,
        "Special Handling",
      ),
      internalTrackingNumber: await this.readFieldByLabel(
        applet,
        "Applicant's Internal Tracking Number",
      ),
      noteToCopyrightOffice: await this.readFieldByLabel(
        applet,
        "Note to Copyright Office",
      ),
    };
  }

  private getAppletByTitle(title: string): Locator {
    return this.page
      .locator("div[role='region']")
      .filter({
        has: this.page
          .locator(".siebui-applet-title, .FormSection, span")
          .filter({ hasText: title }),
      })
      .first();
  }

  private getFormAppletByTitle(title: string): Locator {
    return this.getAppletByTitle(title);
  }

  private getGridAppletByTitle(title: string): Locator {
    return this.getAppletByTitle(title);
  }

  private async getByLabelWithFallback(
    applet: Locator,
    label: string,
    index = 0,
  ): Promise<Locator | null> {
    const exact = applet
      .getByLabel(new RegExp(`^${this.escapeRegex(label)}:?\\s*$`, "i"))
      .nth(index);

    if ((await exact.count()) > 0) {
      return exact;
    }

    const fallback = applet
      .getByLabel(new RegExp(this.escapeRegex(label), "i"))
      .nth(index);

    if ((await fallback.count()) > 0) {
      return fallback;
    }

    return null;
  }

  private async readFieldByLabel(
    applet: Locator,
    label: string,
    index = 0,
  ): Promise<string | null> {
    const direct = await this.getByLabelWithFallback(applet, label, index);

    if (direct) {
      const tagName = await direct.evaluate((el: HTMLElement) =>
        el.tagName.toLowerCase(),
      );

      if (tagName === "textarea") {
        return this.normalize(await direct.inputValue());
      }

      if (tagName === "input") {
        const type = await direct.getAttribute("type");

        if (type === "checkbox") {
          return (await direct.isChecked()) ? "Y" : "N";
        }

        return this.normalize(await direct.inputValue());
      }

      return this.normalize(await direct.textContent());
    }

    const rowField = await this.readFieldFromRowByLabel(applet, label, index);
    return rowField;
  }

  private async readInputByLabel(
    applet: Locator,
    label: string,
    index = 0,
  ): Promise<string | null> {
    const direct = await this.getByLabelWithFallback(applet, label, index);

    if (direct) {
      return this.normalize(await direct.inputValue());
    }

    return this.readFieldFromRowByLabel(applet, label, index);
  }

  private async readCheckboxByLabel(
    applet: Locator,
    label: string,
    index = 0,
  ): Promise<boolean> {
    const direct = applet
      .locator("input[type='checkbox']")
      .filter({
        has: applet.locator(
          `[aria-label="${label}"], [aria-label*="${label}"]`,
        ),
      })
      .nth(index);

    if ((await direct.count()) > 0) {
      const ariaChecked = await direct.getAttribute("aria-checked");
      const value = await direct.getAttribute("value");
      return ariaChecked === "true" || value === "Y";
    }

    const row = await this.getRowByLabel(applet, label, index);

    if (!row) {
      return false;
    }

    const checkbox = row.locator("input[type='checkbox']").first();

    if ((await checkbox.count()) === 0) {
      return false;
    }

    const ariaChecked = await checkbox.getAttribute("aria-checked");
    const value = await checkbox.getAttribute("value");

    return ariaChecked === "true" || value === "Y";
  }

  private async getRowByLabel(
    applet: Locator,
    label: string,
    index = 0,
  ): Promise<Locator | null> {
    const escaped = this.escapeRegex(label);

    const rows = applet.locator("tr").filter({
      has: applet.locator(`span[id$='_Label'], span, div.mceLabel`).filter({
        hasText: new RegExp(escaped, "i"),
      }),
    });

    const count = await rows.count();

    if (count <= index) {
      return null;
    }

    return rows.nth(index);
  }

  private async readFieldFromRowByLabel(
    applet: Locator,
    label: string,
    index = 0,
  ): Promise<string | null> {
    const row = await this.getRowByLabel(applet, label, index);

    if (!row) {
      return null;
    }

    const input = row.locator("input:not([type='checkbox']), textarea").first();

    if ((await input.count()) > 0) {
      const tagName = await input.evaluate((el: HTMLElement) =>
        el.tagName.toLowerCase(),
      );

      if (tagName === "textarea") {
        return this.normalize(await input.inputValue());
      }

      return this.normalize(await input.inputValue());
    }

    const checkbox = row.locator("input[type='checkbox']").first();

    if ((await checkbox.count()) > 0) {
      const ariaChecked = await checkbox.getAttribute("aria-checked");
      const value = await checkbox.getAttribute("value");
      return ariaChecked === "true" || value === "Y" ? "Y" : "N";
    }

    const fieldText = row.locator("td, span.mceField, div.mceGridField").last();

    if ((await fieldText.count()) > 0) {
      return this.normalize(await fieldText.textContent());
    }

    return null;
  }

  private async readGridAppletByTitle(title: string): Promise<ReviewGridRow[]> {
    const applet = this.getGridAppletByTitle(title);

    const locTable = applet.locator("div[id^='loclist_'] table.loc").first();
    if ((await locTable.count()) > 0) {
      return this.readAccessibleGridTable(locTable);
    }

    const jqTable = applet.locator("table.ui-jqgrid-btable").first();
    if ((await jqTable.count()) > 0) {
      return this.readJqGridTable(jqTable);
    }

    return [];
  }

  private async readAccessibleGridTable(
    table: Locator,
  ): Promise<ReviewGridRow[]> {
    const rows = table.locator("tbody > tr");
    const rowCount = await rows.count();

    if (rowCount < 2) {
      return [];
    }

    const headerCells = rows.first().locator("th");
    const headersRaw = await headerCells.allTextContents();
    const headers = headersRaw.map((h) => this.normalize(h) ?? "");

    const results: ReviewGridRow[] = [];

    for (let i = 1; i < rowCount; i++) {
      const row = rows.nth(i);
      const cells = row.locator("td");
      const cellCount = await cells.count();

      if (cellCount === 0) {
        continue;
      }

      if (cellCount !== headers.length) {
        continue;
      }

      const rowData: ReviewGridRow = {};
      let hasAnyValue = false;

      for (let j = 0; j < headers.length; j++) {
        const header = headers[j];
        const value = this.normalize(await cells.nth(j).textContent());

        if (value !== null && value !== "No Records") {
          hasAnyValue = true;
        }

        rowData[header] = value;
      }

      if (!hasAnyValue) {
        continue;
      }

      results.push(rowData);
    }

    return results;
  }

  private async readJqGridTable(table: Locator): Promise<ReviewGridRow[]> {
    const headerContainer = table.locator(
      "xpath=preceding::div[contains(@class,'ui-jqgrid-hdiv')][1]",
    );

    const headers = await headerContainer
      .locator("th[role='columnheader']")
      .evaluateAll((ths: HTMLElement[]) =>
        ths
          .filter((th) => {
            const style = (th.getAttribute("style") || "").toLowerCase();
            return !style.includes("display: none");
          })
          .map((th) => (th.textContent || "").replace(/\s+/g, " ").trim()),
      );

    const bodyRows = table.locator("tbody > tr[role='row']").filter({
      hasNot: table.locator(".jqgfirstrow"),
    });

    const rowCount = await bodyRows.count();
    const rows: ReviewGridRow[] = [];

    for (let i = 0; i < rowCount; i++) {
      const row = bodyRows.nth(i);
      const cells = row
        .locator("td[role='gridcell']")
        .filter({ hasNot: row.locator("input.cbox") });

      const cellCount = await cells.count();
      const rowData: ReviewGridRow = {};

      for (let j = 0; j < headers.length; j++) {
        const header = headers[j];
        const cell = cells.nth(j);

        if (j >= cellCount) {
          rowData[header] = null;
          continue;
        }

        rowData[header] = await this.readGridCellValue(cell);
      }

      const hasAnyValue = Object.values(rowData).some(
        (value) => value !== null && value !== "",
      );

      if (hasAnyValue) {
        rows.push(rowData);
      }
    }

    return rows;
  }

  private async readGridCellValue(
    cell: Locator,
  ): Promise<string | boolean | null> {
    const hiddenSpan = cell.locator("span[style*='display:none']").first();

    if ((await hiddenSpan.count()) > 0) {
      const hiddenText = this.normalize(await hiddenSpan.textContent());

      if (hiddenText === "Y") return "Y";
      if (hiddenText === "N") return "N";
    }

    const title = this.normalize(await cell.getAttribute("title"));

    if (title === "Checked") return "Y";
    if (title === "Unchecked") return "N";

    return this.normalize(await cell.textContent());
  }

  private normalize(value: string | null | undefined): string | null {
    if (value == null) {
      return null;
    }

    const normalized = value
      .replace(/\u00a0/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return normalized === "" ? null : normalized;
  }

  private asString(value: string | boolean | null | undefined): string | null {
    if (value == null) {
      return null;
    }

    if (typeof value === "boolean") {
      return value ? "Y" : "N";
    }

    return this.normalize(String(value));
  }

  private escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}
