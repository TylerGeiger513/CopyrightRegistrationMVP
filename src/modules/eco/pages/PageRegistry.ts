import { AppError } from "../../../core/errors/AppError.js";
import type { BasePage } from "./BasePage.js";

export class PageRegistry {
  private readonly pages = new Map<string, BasePage>();

  register<T extends BasePage>(key: string, page: T): T {
    this.pages.set(key, page);
    return page;
  }

  get<T extends BasePage>(key: string): T {
    const page = this.pages.get(key);

    if (!page) {
      throw new AppError(`Page not registered: ${key}`);
    }

    return page as T;
  }

  has(key: string): boolean {
    return this.pages.has(key);
  }

  clear(): void {
    this.pages.clear();
  }

  keys(): string[] {
    return [...this.pages.keys()];
  }
}
