import { createAction } from "redux-actions";

/**
 * Attempt to log the user in.
 */
export const login = createAction("LOGIN", ({ username, password }) => ({ username, password }));