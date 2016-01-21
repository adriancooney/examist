import "../../../style/Error.scss";
import React, { PropTypes } from "react";
import { FlexBox } from "../ui";

export default function ErrorMessage(props) {
    let title = null;

    if(props.title) title = <h1>{props.title}</h1>
    else title = <h1>Error {props.code || ""}</h1>; 

    return (
        <FlexBox vertical center className="Error">
            { title }
            <h3>{ props.message }</h3>
        </FlexBox>
    );
}

Error.propTypes = {
    code: PropTypes.number,
    title: PropTypes.string,
    message: PropTypes.string.isRequired
};