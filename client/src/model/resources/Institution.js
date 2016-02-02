import { Resource, Reducer } from "../../Library";
import API from "../../API";

const Institution = new Resource("institution", "id");

/*
 * Get domain by name.
 */
export const getByDomain = Institution.createResourceAction(domain => API.getInstitutionByDomain(domain));

export default Institution;