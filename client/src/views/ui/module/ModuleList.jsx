import React, { PropTypes } from "react";
import ModulePlaceholder from "./ModulePlaceholder";
import ModuleLink from "./ModuleLink";

export default function ModuleList(props) {
    let modules = props.modules || [];

    modules = modules.map((mod, key) => {
        return (
            <ModuleLink 
                module={mod} 
                key={key} 
                onRemove={props.onRemove && props.onRemove.bind(null, mod)} 
                onAdd={props.onAdd && props.onAdd.bind(null, mod)} />
        );
    });

    if(props.placeholderCount && props.placeholderCount > modules.length) {
        for(let i = 0, count = props.placeholderCount - modules.length; i < count; i++) {
            modules.push(<ModulePlaceholder key={modules.length + i}/>);
        }
    }

    return (
        <div className="ModuleList">
            { modules }
        </div>
    );
}

ModuleList.propTypes = {
    placeholderCount: PropTypes.number, // The number of dummy items to place
    modules: PropTypes.array,
    onRemove: PropTypes.func,
    onAdd: PropTypes.func
};