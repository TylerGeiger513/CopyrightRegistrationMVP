import type { Locator } from "playwright";
import { PageStateError } from "../../../../core/errors/PageStateError.js";
import type {
  SiebelAppletContext,
  SiebelAppletElements,
  SiebelPagerState,
  SiebelTableCell,
  SiebelTableRow,
} from "./types.js";

export class SiebelAppletTable {
  constructor(private readonly context: SiebelAppletContext) {}

  private get page() {
    return this.context.page;
  }

  private get logger() {
    return this.context.logger;
  }

  get title(): string {
    return this.context.title;
  }

  get elements(): SiebelAppletElements {
    const root = this.page
      .locator('form[aria-label="Applet"]')
      .filter({
        has: this.page.getByRole("heading", { name: this.title }),
      })
      .first();

    return {
      root,
      heading: root.getByRole("heading", { name: this.title }),
      rowCounter: root.locator(".siebui-row-counter").first(),
      gridTable: root.locator('table[datatable="1"][role="grid"]').first(),
      headerTable: root.locator("table.ui-jqgrid-htable").first(),
      firstPageButton: root.locator('[id^="first_pager_"]').first(),
      previousPageButton: root.locator('[id^="prev_pager_"]').first(),
      nextPageButton: root.locator('[id^="next_pager_"]').first(),
      lastPageButton: root.locator('[id^="last_pager_"]').first(),
    };
  }

  async isVisible(): Promise<boolean> {
    try {
      return await this.elements.heading.isVisible();
    } catch {
      return false;
    }
  }

  async getRowCounterText(): Promise<string | null> {
    try {
      const counter = this.elements.rowCounter;

      if (!(await counter.isVisible())) {
        return null;
      }

      const text = await counter.textContent();
      return text?.trim() || null;
    } catch {
      return null;
    }
  }

  private get headerCells(): Locator {
    return this.elements.headerTable.locator("thead tr th");
  }

  private get bodyRows(): Locator {
    return this.elements.gridTable.locator("tbody > tr:not(.jqgfirstrow)");
  }

  async getHeaders(): Promise<string[]> {
    const headers: string[] = [];
    const count = await this.headerCells.count();

    for (let i = 0; i < count; i += 1) {
      const cell = this.headerCells.nth(i);
      const style = (await cell.getAttribute("style")) ?? "";

      if (style.includes("display: none")) {
        continue;
      }

      const text = ((await cell.textContent()) ?? "")
        .replace(/\s+/g, " ")
        .trim();
      if (text) {
        headers.push(text);
      }
    }

    return headers;
  }

  async getVisibleRows(): Promise<SiebelTableRow[]> {
    const headers = await this.getHeaders();
    const rows: SiebelTableRow[] = [];
    const rowCount = await this.bodyRows.count();

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
      const row = this.bodyRows.nth(rowIndex);
      const rowId = await row.getAttribute("id");
      const className = (await row.getAttribute("class")) ?? "";
      const ariaSelected = (await row.getAttribute("aria-selected")) ?? "false";

      const rawCells = row.locator("td");
      const rawCellCount = await rawCells.count();
      const cells: SiebelTableCell[] = [];

      let visibleColumnIndex = 0;

      for (let cellIndex = 0; cellIndex < rawCellCount; cellIndex += 1) {
        const cell = rawCells.nth(cellIndex);
        const style = (await cell.getAttribute("style")) ?? "";

        if (style.includes("display:none") || style.includes("display: none")) {
          continue;
        }

        const rawText = ((await cell.textContent()) ?? "")
          .replace(/\s+/g, " ")
          .trim();

        const imageAlts = await cell
          .locator("img")
          .evaluateAll((imgs) =>
            imgs.map((img) => img.getAttribute("alt") ?? "").filter(Boolean),
          );

        const text = [rawText, ...imageAlts]
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();

        cells.push({
          columnIndex: visibleColumnIndex,
          header: headers[visibleColumnIndex] ?? null,
          text,
        });

        visibleColumnIndex += 1;
      }

      rows.push({
        rowIndex,
        rowId,
        isSelected:
          className.includes("ui-state-highlight") || ariaSelected === "true",
        text: cells.map((cell) => cell.text).join(" | "),
        cells,
      });
    }

    return rows;
  }

  async getPagerState(): Promise<SiebelPagerState> {
    return {
      canGoFirst: await this.isPagerEnabled(this.elements.firstPageButton),
      canGoPrevious: await this.isPagerEnabled(
        this.elements.previousPageButton,
      ),
      canGoNext: await this.isPagerEnabled(this.elements.nextPageButton),
      canGoLast: await this.isPagerEnabled(this.elements.lastPageButton),
      rowCounterText: await this.getRowCounterText(),
    };
  }

  private async isPagerEnabled(button: Locator): Promise<boolean> {
    try {
      const className = (await button.getAttribute("class")) ?? "";
      return !className.includes("ui-state-disabled");
    } catch {
      return false;
    }
  }

  async goFirst(): Promise<boolean> {
    return this.clickPager(this.elements.firstPageButton, "first");
  }

  async goPrevious(): Promise<boolean> {
    return this.clickPager(this.elements.previousPageButton, "previous");
  }

  async goNext(): Promise<boolean> {
    return this.clickPager(this.elements.nextPageButton, "next");
  }

  async goLast(): Promise<boolean> {
    return this.clickPager(this.elements.lastPageButton, "last");
  }

  private async clickPager(
    button: Locator,
    direction: string,
  ): Promise<boolean> {
    if (!(await this.isPagerEnabled(button))) {
      return false;
    }

    this.logger.info(`[SiebelAppletTable:${this.title}] Navigating pager`, {
      direction,
    });

    await button.click();
    return true;
  }

  async findVisibleRowByCellText(
    columnName: string,
    value: string,
    exact = true,
  ): Promise<SiebelTableRow | null> {
    const normalizedTarget = value.trim().toLowerCase();
    const normalizedColumn = columnName.trim().toLowerCase();
    const rows = await this.getVisibleRows();

    for (const row of rows) {
      const match = row.cells.find((cell) => {
        const header = (cell.header ?? "").trim().toLowerCase();
        const text = cell.text.trim().toLowerCase();

        if (header !== normalizedColumn) {
          return false;
        }

        return exact
          ? text === normalizedTarget
          : text.includes(normalizedTarget);
      });

      if (match) {
        return row;
      }
    }

    return null;
  }

  async findRowByCellText(
    columnName: string,
    value: string,
    options: {
      exact?: boolean;
      maxPages?: number;
      startFromFirstPage?: boolean;
    } = {},
  ): Promise<SiebelTableRow | null> {
    const { exact = true, maxPages = 25, startFromFirstPage = true } = options;

    if (startFromFirstPage) {
      await this.goFirst().catch(() => undefined);
    }

    for (let pageIndex = 0; pageIndex < maxPages; pageIndex += 1) {
      const row = await this.findVisibleRowByCellText(columnName, value, exact);

      if (row) {
        return row;
      }

      const moved = await this.goNext();
      if (!moved) {
        break;
      }
    }

    return null;
  }

  async openRowDrilldown(row: SiebelTableRow): Promise<void> {
    let targetRow: Locator;

    if (row.rowId) {
      targetRow = this.elements.root.locator(`tr[id="${row.rowId}"]`).first();
    } else {
      targetRow = this.bodyRows.nth(row.rowIndex);
    }

    const templateNameCell = row.cells.find(
      (cell) => cell.header === "Template Name",
    );
    const targetText = templateNameCell?.text?.trim();

    const link = targetText
      ? targetRow.locator("a.drilldown", { hasText: targetText }).first()
      : targetRow.locator("a.drilldown").first();

    const count = await link.count();
    if (count === 0) {
      throw new PageStateError(
        `No drilldown link found for row "${row.rowId ?? row.rowIndex}" in applet "${this.title}"`,
      );
    }

    this.logger.info(`[SiebelAppletTable:${this.title}] Clicking drilldown`, {
      rowId: row.rowId,
      rowIndex: row.rowIndex,
      targetText,
    });

    await targetRow.scrollIntoViewIfNeeded().catch(() => undefined);
    await link.scrollIntoViewIfNeeded().catch(() => undefined);

    await link.click({ force: true });
  }

  async openRowByCellText(
    columnName: string,
    value: string,
    options: {
      exact?: boolean;
      maxPages?: number;
      startFromFirstPage?: boolean;
    } = {},
  ): Promise<void> {
    const row = await this.findRowByCellText(columnName, value, options);

    if (!row) {
      throw new PageStateError(
        `No row found in applet "${this.title}" for column "${columnName}" and value "${value}"`,
      );
    }

    this.logger.info(`[SiebelAppletTable:${this.title}] Opening row`, {
      rowId: row.rowId,
      rowIndex: row.rowIndex,
      rowText: row.text,
    });

    const targetRow = row.rowId
      ? this.elements.root.locator(`tr[id="${row.rowId}"]`).first()
      : this.bodyRows.nth(row.rowIndex);

    const link = targetRow.locator("a.drilldown", { hasText: value }).first();

    if ((await link.count()) === 0) {
      throw new PageStateError(
        `No drilldown link found for value "${value}" in applet "${this.title}"`,
      );
    }

    this.logger.info(
      `[SiebelAppletTable:${this.title}] Triggering drilldown click`,
      {
        value,
        rowId: row.rowId,
      },
    );

    await link.evaluate((element) => {
      (element as HTMLAnchorElement).click();
    });
    this.logger.info(
      `[SiebelAppletTable:${this.title}] Drilldown click dispatched`,
    );
  }
}
