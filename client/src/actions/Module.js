import { Enum, createFatalAuthorizedRequestAction } from "../Util";

export const types = Enum(
    "MODULE"
);

export const getModule = createFatalAuthorizedRequestAction(types.MODULE, (api, id) => api.getModule(id));