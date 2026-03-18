import { BaseWorkflow } from "./BaseWorkflow.js";
import { ECO_PAGE_KEYS } from "../pages/PageKeys.js";
import { HomePage } from "../pages/HomePage.js";
import { PublicationCompletionStep } from "../pages/steps/PublicationCompletionStep.js";
import { TemplatePage } from "../pages/TemplatePage.js";

export class OpenTemplateFromHomeWorkflow extends BaseWorkflow {
  async execute(templateName: string): Promise<void> {
    const homePage = this.client.getPage<HomePage>(ECO_PAGE_KEYS.HOME);
    const templatePage = this.client.getPage<TemplatePage>(
      ECO_PAGE_KEYS.TEMPLATE,
    );
    const publicationCompletionStep =
      this.client.getPage<PublicationCompletionStep>(
        ECO_PAGE_KEYS.PUBLICATION_COMPLETION_STEP,
      );

    this.log("Starting open-template-from-home workflow", { templateName });

    await homePage.waitUntilLoaded();
    await homePage.clickUseExistingTemplate();

    await templatePage.waitUntilLoaded();
    await templatePage.openTemplateByName(templateName);

    this.log("Template opened successfully", { templateName });
  }
}
