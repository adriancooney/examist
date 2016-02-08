import Debug from "debug";
import { content } from "./i18n";

const debug = Debug("examist:config");

export const APP_NAME = content("app_name");
export const APP_YEAR = (new Date()).getFullYear();

export const ENV = process.env.NODE_ENV || "";
export const BROWSER = typeof window !== "undefined";
export const PRODUCTION = ENV === "production"; 
export const DEBUG = ENV.indexOf("production") === -1;
export const TEST = DEBUG && ENV.indexOf("test") !== -1;

export const API_BASE_URL = {
    hostname: BROWSER ? window.location.hostname : "localhost",
    port: DEBUG ? 5000 : 80,
    protocol: DEBUG ? "http" : "https"
};

if(DEBUG && BROWSER) {
    // Enable all debug messages if were debugging
    localStorage.debug = "examist:*";
}

debug(`Booting app with the following config: 
    ENV: ${ENV},
    BROWSER: ${BROWSER},
    PRODUCTION: ${PRODUCTION},
    DEBUG: ${DEBUG},
    TEST: ${TEST}
`);