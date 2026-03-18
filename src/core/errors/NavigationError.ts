import { AppError } from "./AppError.js";

export class NavigationError extends AppError {
  constructor(message: string) {
    super(message);
    this.name = "NavigationError";
  }
}
