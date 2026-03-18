import type { Page, Locator } from "playwright";
import type { Logger } from "../../../../core/logging/Logger.js";

export interface SiebelAppletContext {
  page: Page;
  logger: Logger;
  title: string;
}

export interface SiebelTableCell {
  columnIndex: number;
  header: string | null;
  text: string;
}

export interface SiebelTableRow {
  rowIndex: number;
  rowId: string | null;
  isSelected: boolean;
  text: string;
  cells: SiebelTableCell[];
}

export interface SiebelPagerState {
  canGoFirst: boolean;
  canGoPrevious: boolean;
  canGoNext: boolean;
  canGoLast: boolean;
  rowCounterText: string | null;
}

export interface SiebelAppletElements {
  root: Locator;
  heading: Locator;
  rowCounter: Locator;
  gridTable: Locator;
  headerTable: Locator;
  firstPageButton: Locator;
  previousPageButton: Locator;
  nextPageButton: Locator;
  lastPageButton: Locator;
}
