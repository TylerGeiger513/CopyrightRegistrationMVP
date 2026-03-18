import { AppError } from "./AppError.js";

export class PageStateError extends AppError {
  constructor(message: string) {
    super(message);
    this.name = "PageStateError";
  }
}
