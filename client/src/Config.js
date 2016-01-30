import { content } from "./i18n";

if(__DEV__ && typeof window !== "undefined") {
    // Enable all debug messages if were debugging
    localStorage.debug = "examist:*";
}

export const APP_NAME = content("app_name");
export const APP_YEAR = (new Date()).getFullYear();

