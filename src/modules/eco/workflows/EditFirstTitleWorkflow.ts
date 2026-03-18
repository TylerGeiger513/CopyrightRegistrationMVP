import { BaseWorkflow } from "./BaseWorkflow.js";
import { ECO_PAGE_KEYS } from "../pages/PageKeys.js";
import { TypeOfWorkStep } from "../pages/steps/TypeOfWorkStep.js";
import { TitlesStep } from "../pages/steps/TitlesStep.js";
import { EditTitlePage } from "../pages/steps/EditTitlePage.js";

export class EditFirstTitleWorkflow extends BaseWorkflow {
  async execute(): Promise<void> {
    const typeOfWorkStep = this.client.getPage<TypeOfWorkStep>(
      ECO_PAGE_KEYS.TYPE_OF_WORK_STEP,
    );
    const titlesStep = this.client.getPage<TitlesStep>(
      ECO_PAGE_KEYS.TITLES_STEP,
    );
    const editTitlePage = this.client.getPage<EditTitlePage>(
      ECO_PAGE_KEYS.EDIT_TITLE_PAGE,
    );

    this.log("Starting edit first title workflow");

    await typeOfWorkStep.waitUntilLoaded();
    await typeOfWorkStep.continue();

    await titlesStep.waitUntilLoaded();
    await titlesStep.editFirstTitle();

    await editTitlePage.waitUntilLoaded();
    await editTitlePage.updateTitle("THIS IS A TEST TITLE");

    await titlesStep.waitUntilLoaded();

    this.log("First title updated successfully", {
      title: "THIS IS A TEST TITLE",
    });
  }
}
