import API from "../API";
import { Enum, createRequestAction } from "../Util";

export const types = Enum(
    "INSTITUTION",
    "INSTITUTION_BY_DOMAIN"
);

export const getInstitutionByDomain = createRequestAction(types.INSTITUTION_BY_DOMAIN, 
    domain => API.getInstitutionByDomain(domain));