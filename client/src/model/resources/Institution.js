import { Resource } from "../../library";
import API from "../../API";

const Institution = new Resource("institutions", "id");

/*
 * Get domain by name.
 */
export const getByDomain = Institution.createAction("GET_INSTITUTION", domain => API.getInstitutionByDomain(domain));
Institution.addProducer(getByDomain, ({ institution }) => institution);

export const selectByDomain = (domain) => {
    return Institution.select(institutions => institutions.find(institution => institution.domain === domain));
}

export default Institution;