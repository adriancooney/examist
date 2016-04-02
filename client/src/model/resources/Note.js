import { Resource } from "../../library";
import * as User from "../User";

const Note = new Resource("notes", "id");

export const createLink = Note.createStatefulAction("CREATE_NOTE", User.selectAPI, 
    (api, ...args) => api.createNoteLink(...args));

export const getNotes = Note.createStatefulAction("GET_NOTES", User.selectAPI,
    (api, ...args) => api.getNotes(...args));

Note.addProducer(createLink, ({ note }) => note);
Note.addProducer(getNotes, ({ notes }) => notes);

export default Note;