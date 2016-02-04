import Root from "../Root";
import { Resource } from "../../library";
import API from "../../API";

const Institution = Root.resoures.Institution;

/*
 * Get domain by name.
 */
export const getByDomain = Institution.createResourceAction(domain => API.getInstitutionByDomain(domain));

export const selectByDomain = (domain) => {
    return Institution.select(institutions => institutions.find(institution => institution.domain === domain));
};