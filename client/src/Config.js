import { content } from "./i18n";

export const APP_NAME = content("app_name");
export const APP_YEAR = (new Date()).getFullYear();

export const ENV = process.env.NODE_ENV || "";
export const BROWSER = typeof window !== "undefined";
export const PRODUCTION = ENV === "production"; 
export const DEBUG = ENV.indexOf("production") === -1;
export const TEST = DEBUG && ENV.indexOf("test");

if(DEBUG && BROWSER) {
    // Enable all debug messages if were debugging
    localStorage.debug = "examist:*";
}