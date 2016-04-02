import React, { PropTypes, Children } from "react";
import { Empty } from "../";
import NoteForm from "./NoteForm";
import NoteLink from "./NoteLink";

export default function Notes(props) {
    const { notes, user } = props;
    let content, form;

    if(notes.length) {
        content = Children.toArray(notes.map(note => {
            if(note.type === "note_link") return <NoteLink note={note} />;
        }));
    } else {
        content = (
            <Empty>
                <p>No Notes</p>
            </Empty>
        );
    }

    if(user) {
        form = <NoteForm onSubmitLink={props.onSubmitLink} />;
    }

    return (
        <div className="Notes">
            { content }
            { form }
        </div>
    );
}

Notes.propTypes = {
    notes: PropTypes.array.isRequired,
    user: PropTypes.object
};