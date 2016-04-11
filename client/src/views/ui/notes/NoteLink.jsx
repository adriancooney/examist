import React, { Component } from "react";
import { Link } from "react-router";
import url from "url";
import moment from "moment";
import { Icon } from "../";
import { Button } from "../input";
import { Box } from "../layout";

const LINK_DISPLAY_MAX_LENGTH = 35;

export default class NoteLink extends Component {
    render() {
        const { note } = this.props;
        const parsed = url.parse(note.link);
        const path = (parsed.path.length + parsed.host.length) > LINK_DISPLAY_MAX_LENGTH ?
            parsed.path.substr(0, LINK_DISPLAY_MAX_LENGTH - parsed.host.length) + ".." : parsed.path; 
        const timestamp = moment(note.created_at);

        return (
            <div className="NoteLink">
                <blockquote>{ note.description }</blockquote>

                <div className="link">
                    <a href={note.link} target="_blank">
                        <Icon name="external-link" /> <strong>{parsed.host}</strong>{ path }
                    </a>
                </div>

                <Box className="actions">
                    <p>{ `Posted ${timestamp.fromNow()}.` }</p>
                    <Button textual>Like</Button>
                    <Link to="#">Comments</Link>
                    <Button textual danger>Report</Button>
                </Box>
            </div>
        );
    }
}