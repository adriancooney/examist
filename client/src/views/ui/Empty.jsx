import React, { PropTypes } from "react";

export default function Empty(props) {
    let message = props.item ? `No ${props.item}.` : "Nothing here.";

    return (
        <div className="Empty">
            <p>{ message }</p>
        </div>
    );
}

Empty.propTypes = {
    item: PropTypes.string
};