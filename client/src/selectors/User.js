/*
 * Return the current user.
 */
export function current(state) {
    return state.user;
}

/*
 * Return the currently logged in user's modules.
 */
export function modules(state) {
    return state.user.modules;
}

export function api(state) {
    return state.user.api;
}