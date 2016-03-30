import { Resource } from "../../library";

const People = new Resource("people", "id");

People.addProducer("GET_COMMENTS", ({ users }) => users);

export function selectById(id) {
    return state => state.resources.people.find(user => user.id === id);
}

export default People;