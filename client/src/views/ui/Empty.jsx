import "../../../style/ui/index.scss";
import React, { PropTypes } from "react";

export default function Empty(props) {
    let content;

    if(props.item) {
        content = <p>{ "No " + props.item + "." }</p>
    } else if(props.children) {
        content = props.children;
    }
    
    return (
        <div className="Empty">
            { content }
        </div>
    );
}

Empty.propTypes = {
    item: PropTypes.string
};