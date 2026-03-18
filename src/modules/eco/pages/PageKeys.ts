export const ECO_PAGE_KEYS = {
  LOGIN: "login",
  HOME: "home",
  TEMPLATE: "template",
  TEMPLATE_FORM: "template-form",
  TYPE_OF_WORK_STEP: "type-of-work-step",
  TITLES_STEP: "titles-step",
  EDIT_TITLE_PAGE: "edit-title-page",
} as const;

export type EcoPageKey = (typeof ECO_PAGE_KEYS)[keyof typeof ECO_PAGE_KEYS];
