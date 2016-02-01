import * as en from "../i18n/en";

/**
 * Get a i18n string by name.
 * @param  {String} target String descriptor.
 * @return {String}        Target string.
 */
export function content(target) {
    if(!en[target]) throw new Error(`i18n: Unknown string target '${target}'.`);
    return en[target];
}