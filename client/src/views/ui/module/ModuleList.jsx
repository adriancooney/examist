import "../../../../style/ui/Module.scss";
import React, { PropTypes } from "react";
import ModuleLink from "./ModuleLink";
import Empty from "../Empty";

export default function ModuleList(props) {
    let modules = props.modules.map((mod, i) => <ModuleLink code={mod.code} key={i} />)

    if(!modules.length) {
        modules = <Empty item="Modules" />
    }

    return (
        <div className="ModuleList">
        { modules }
        </div>
    );
}

ModuleList.propTypes = {
    modules: PropTypes.array.isRequired
};