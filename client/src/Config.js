if(__DEV__ && typeof window !== "undefined") {
    // Enable all debug messages if were debugging
    localStorage.debug = "examist:*";
}

export const APP_NAME = "Examist";
export const APP_YEAR = (new Date()).getFullYear();

