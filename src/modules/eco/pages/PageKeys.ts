export const ECO_PAGE_KEYS = {
  LOGIN: "login",
  HOME: "home",
  TEMPLATE: "template",
  TEMPLATE_FORM: "template-form",
  TYPE_OF_WORK_STEP: "type-of-work-step",
  TITLES_STEP: "titles-step",
  EDIT_TITLE_PAGE: "edit-title-page",
  PUBLICATION_COMPLETION_STEP: "publication-completion-step",
  AUTHORS_STEP: "authors-step",
  LIMITATION_OF_CLAIM_STEP: "limitation-of-claim-step",
  RIGHTS_PERMISSIONS_STEP: "rights-permissions-step",
  REVIEW_SUBMISSION_STEP: "review-submission-step",
} as const;

export type EcoPageKey = (typeof ECO_PAGE_KEYS)[keyof typeof ECO_PAGE_KEYS];
