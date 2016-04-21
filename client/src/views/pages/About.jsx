import React from "react";
import { Markdown } from "../ui";

export default function About() {
    return (
        <div className="About">
            <Markdown>{`
# Welcome to Examist

Examist is an online learning platform for students based
around exam papers. Student's can post notes, solutions and
comments on questions from all past exam papers in their
courses.
            `}</Markdown>
        </div>
    );
}