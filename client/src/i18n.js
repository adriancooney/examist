import React from "react";
import en from "../i18n/en.yaml";

/**
 * Get a i18n string by name.
 * @param  {String} target String descriptor.
 * @return {String}        Target string.
 */
export function content(target, jsx = false) {
    if(!en[target]) throw new Error(`i18n: Unknown string target '${target}'.`);
    else {
        let string = format(en[target], en);
        return jsx ? <div dangerouslySetInnerHTML={{__html: string }} /> : string;
    }
}

function format(string, vars) {
    return string.replace(/\{([^\}]+)\}/, (all, match) => vars[match]);
}