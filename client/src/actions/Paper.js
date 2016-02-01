import { Enum, createAuthorizedRequestAction } from "../Util";

export const types = Enum(
    "PAPER"
);

export const getPaper = createAuthorizedRequestAction(types.PAPER, 
    (api, module, year, period) => api.getPaper(module, year, period));