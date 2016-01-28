import "../../../../style/Error.scss";
import React, { PropTypes } from "react";
import { FlexBox } from "../layout";

export default function ErrorMessage(props) {
    let title, message;

    if(props.title) title = <h1>{props.title}</h1>
    else title = <h1>Error {props.code || ""}</h1>;

    if(props.error) message = <pre>{ props.error.stack }</pre>;
    else message = props.message

    return (
        <FlexBox vertical center className="Error">
            { title }
            { message }
        </FlexBox>
    );
}

Error.propTypes = {
    code: PropTypes.number,
    title: PropTypes.string,
    message: PropTypes.string.isRequired
};