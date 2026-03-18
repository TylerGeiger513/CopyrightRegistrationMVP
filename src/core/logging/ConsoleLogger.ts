import type { Logger } from "./Logger.js";

export class ConsoleLogger implements Logger {
  debug(message: string, meta?: Record<string, unknown>): void {
    console.debug(`[DEBUG] ${message}`, meta ?? {});
  }

  info(message: string, meta?: Record<string, unknown>): void {
    console.info(`[INFO] ${message}`, meta ?? {});
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    console.warn(`[WARN] ${message}`, meta ?? {});
  }

  error(message: string, meta?: Record<string, unknown>): void {
    console.error(`[ERROR] ${message}`, meta ?? {});
  }
}
