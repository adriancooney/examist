export function getByDomain(domain) {
    return (state) => state.institutions.find(institution => institution.domain === domain);
}