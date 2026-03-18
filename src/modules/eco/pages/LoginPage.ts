import { BasePage } from "./BasePage.js";
import type { EcoCredentials } from "../models/EcoCredentials.js";

export class LoginPage extends BasePage {
  private readonly introText =
    "If you are a registered user, please login here.";

  private get introMessage() {
    return this.page.getByText(this.introText);
  }

  private get usernameInput() {
    return this.page.getByLabel("User ID");
  }

  private get passwordInput() {
    return this.page.getByLabel("Password");
  }

  private get loginButton() {
    return this.page.getByRole("button", { name: "Login" });
  }

  async goto(): Promise<void> {
    await super.goto();
  }

  async isLoaded(): Promise<boolean> {
    return (
      (await this.safeIsVisible(this.introMessage)) &&
      (await this.safeIsVisible(this.usernameInput)) &&
      (await this.safeIsVisible(this.passwordInput)) &&
      (await this.safeIsVisible(this.loginButton))
    );
  }

  async fillUsername(username: string): Promise<void> {
    await this.withReadyState(async () => {
      this.log("Filling username");
      await this.usernameInput.fill(username);
    });
  }

  async fillPassword(password: string): Promise<void> {
    await this.withReadyState(async () => {
      this.log("Filling password");
      await this.passwordInput.fill(password);
    });
  }

  async clear(): Promise<void> {
    await this.withReadyState(async () => {
      this.log("Clearing login form");
      await this.usernameInput.clear();
      await this.passwordInput.clear();
    });
  }

  async submit(): Promise<void> {
    await this.withReadyState(async () => {
      this.log("Submitting login form");
      await this.loginButton.click();
    });
  }

  async login(credentials: EcoCredentials): Promise<void> {
    this.log("Performing login");

    await this.fillUsername(credentials.username);
    await this.fillPassword(credentials.password);
    await this.submit();
  }

  async getErrorText(): Promise<string | null> {
    await this.waitForSiebelReady().catch(() => undefined);

    const errorLocator = this.page.locator("font.error").first();

    try {
      if (await errorLocator.isVisible()) {
        const text = await errorLocator.textContent();
        return text?.trim() || null;
      }
    } catch {
      return null;
    }

    return null;
  }
}
