export {};

declare global {
  interface Window {
    SiebelApp?: {
      S_App?: {
        uiStatus?: {
          IsBusy?: () => boolean;
        };
      };
    };
  }
}
