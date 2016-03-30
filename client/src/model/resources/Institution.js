import { Resource } from "../../library";
import API from "../../API";

const Institution = new Resource("institutions", "id");

/*
 * Get domain by name.
 */
export const getByDomain = Institution.createResourceAction(domain => API.getInstitutionByDomain(domain));

export const selectByDomain = (domain) => {
    return Institution.select(institutions => institutions.find(institution => institution.domain === domain));
}

export default Institution;