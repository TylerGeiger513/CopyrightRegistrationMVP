import type { Logger } from "../../../core/logging/Logger.js";
import { EcoClient } from "../client/EcoClient.js";

export abstract class BaseWorkflow {
  protected readonly logger: Logger;

  constructor(protected readonly client: EcoClient) {
    this.logger = client.getLogger();
  }

  protected log(message: string, meta?: Record<string, unknown>): void {
    this.logger.info(`[${this.constructor.name}] ${message}`, meta);
  }

  protected debug(message: string, meta?: Record<string, unknown>): void {
    this.logger.debug(`[${this.constructor.name}] ${message}`, meta);
  }

  protected warn(message: string, meta?: Record<string, unknown>): void {
    this.logger.warn(`[${this.constructor.name}] ${message}`, meta);
  }

  protected error(message: string, meta?: Record<string, unknown>): void {
    this.logger.error(`[${this.constructor.name}] ${message}`, meta);
  }
}
