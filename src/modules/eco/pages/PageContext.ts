import type { Page } from "playwright";
import type { Logger } from "../../../core/logging/Logger.js";

export interface PageContext {
  page: Page;
  logger: Logger;
  baseUrl: string;
}
