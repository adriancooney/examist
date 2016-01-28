import React, { PropTypes } from "react";

export default function Path(props) {
    return (
        <div className="Path">{ props.path.map((comp, i) => <span key={i}>{comp}.</span>) }</div>
    );
}

Path.propTypes = {
    path: PropTypes.array.isRequired
};