import { Enum, createNetworkAction } from "../Util";

export const types = Enum(
    "MODULE"
);

export const getModule = createNetworkAction(types.MODULE, (api, id) => api.getModule(id));