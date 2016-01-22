import React from "react";

export default function Avatar(props) {
    let contents = null;

    if(props.initials) {
        contents = <h3>{ props.initials }</h3>
    } else if(props.image) {
        contents = <img src={props.image} />
    }

    return (
        <div className="Avatar">{ contents }</div>
    );
}