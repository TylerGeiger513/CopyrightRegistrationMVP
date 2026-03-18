import { PageStateError } from "../../../core/errors/PageStateError.js";
import { ECO_PAGE_KEYS } from "../pages/PageKeys.js";
import { LoginPage } from "../pages/LoginPage.js";
import type { EcoCredentials } from "../models/EcoCredentials.js";
import { BaseWorkflow } from "./BaseWorkflow.js";

export class LoginWorkflow extends BaseWorkflow {
  async execute(credentials: EcoCredentials): Promise<void> {
    const loginPage = this.client.getPage<LoginPage>(ECO_PAGE_KEYS.LOGIN);

    this.log("Starting login workflow");

    await loginPage.goto();
    await loginPage.waitUntilLoaded();
    await loginPage.login(credentials);

    const errorText = await loginPage.getErrorText();
    if (errorText) {
      throw new PageStateError(`Login failed: ${errorText}`);
    }

    this.log("Login submission completed");
  }
}
