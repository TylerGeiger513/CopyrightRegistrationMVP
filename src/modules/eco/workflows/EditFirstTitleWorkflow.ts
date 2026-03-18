import { BaseWorkflow } from "./BaseWorkflow.js";
import { ECO_PAGE_KEYS } from "../pages/PageKeys.js";
import { TypeOfWorkStep } from "../pages/steps/TypeOfWorkStep.js";
import { TitlesStep } from "../pages/steps/TitlesStep.js";
import { EditTitlePage } from "../pages/steps/EditTitlePage.js";
import { PublicationCompletionStep } from "../pages/steps/PublicationCompletionStep.js";
import { AuthorsStep } from "../pages/steps/AuthorsStep.js";
import { ReviewSubmissionStep } from "../pages/steps/ReviewSubmissionStep.js";
import { LimitationOfClaimStep } from "../pages/steps/LimitationOfClaimStep.js";
import { RightsPermissionsStep } from "../pages/steps/RightsPermissionsStep.js";
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

    const AuthorsStep = this.client.getPage<AuthorsStep>(
      ECO_PAGE_KEYS.AUTHORS_STEP,
    );
    const publicationCompletionStep =
      this.client.getPage<PublicationCompletionStep>(
        ECO_PAGE_KEYS.PUBLICATION_COMPLETION_STEP,
      );

    const reviewSubmissionStep = this.client.getPage<ReviewSubmissionStep>(
      ECO_PAGE_KEYS.REVIEW_SUBMISSION_STEP,
    );

    const limitationOfClaimStep = this.client.getPage<LimitationOfClaimStep>(
      ECO_PAGE_KEYS.LIMITATION_OF_CLAIM_STEP,
    );

    const rightsPermissionsStep = this.client.getPage<RightsPermissionsStep>(
      ECO_PAGE_KEYS.RIGHTS_PERMISSIONS_STEP,
    );

    this.log("Starting edit first title workflow");

    await typeOfWorkStep.waitUntilLoaded();
    await typeOfWorkStep.continue();

    await titlesStep.waitUntilLoaded();
    await titlesStep.editFirstTitle();

    await editTitlePage.waitUntilLoaded();
    await editTitlePage.updateTitle("THIS IS A TEST TITLE");

    await titlesStep.waitUntilLoaded();
    await titlesStep.continue();

    await publicationCompletionStep.waitUntilLoaded();
    await publicationCompletionStep.setYearOfCompletion(2024);
    await publicationCompletionStep.setPublicationDate("2024-01-01");
    await publicationCompletionStep.continue();
    await AuthorsStep.waitUntilLoaded();
    await AuthorsStep.goToStep("Limitation of Claim");

    await limitationOfClaimStep.waitUntilLoaded();
    await limitationOfClaimStep.setFirstPreviousRegistrationNumber(
      "TX123456789",
    );
    await limitationOfClaimStep.setFirstPreviousRegistrationYear(2020);

    await limitationOfClaimStep.setSecondPreviousRegistrationNumber(
      "TX987654321",
    );
    await limitationOfClaimStep.setSecondPreviousRegistrationYear(2019);

    await limitationOfClaimStep.continue();

    await rightsPermissionsStep.waitUntilLoaded();
    await rightsPermissionsStep.goToStep("Review Submission");
    await reviewSubmissionStep.waitUntilLoaded();
    const data = await reviewSubmissionStep.extractReviewSubmission();
    await this.log("Extracted review submission data:", {
      data: JSON.stringify(data),
    });

    await this.log(
      " Log of all Non-Null Data Extracted from Review Submission Step:",
      {
        nonNullData: JSON.stringify(
          Object.fromEntries(
            Object.entries(data).filter(([_, value]) => value !== null),
          ),
        ),
      },
    );

    await reviewSubmissionStep.addToCart();

    await this.log("First title updated successfully", {
      title: "THIS IS A TEST TITLE",
    });
  }
}
