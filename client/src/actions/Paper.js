import { Enum, createNetworkAction } from "../Util";

export const types = Enum(
    "PAPER"
);

export const getPaper = createNetworkAction(types.PAPER, 
    (api, module, year, period) => api.getPaper(module, year, period));