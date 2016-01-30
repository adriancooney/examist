import "../../../../style/ui/Module.scss";
import React from "react";
import { Link } from "react-router";
import { Box, FlexBox } from "../layout";
import Avatar from "../Avatar";

const CODE_REGEX = /([a-z]{2})/i;

export default function Module(props) {
    // Our PropTypes throw an error if it doesn't match
    let initials = props.code.match(CODE_REGEX)[0].toUpperCase();

    return (
        <div className="ModuleLink">
            <Box>
                <div><Avatar initials={initials} /></div>
                <FlexBox middle><h4><Link to={`/module/${props.code.toLowerCase()}`}>{ props.code }</Link></h4></FlexBox>
            </Box>
        </div>
    );
}

Module.propTypes = {
    code: (props, propName) => {
        if(!CODE_REGEX.test(props[propName])) {
            return new Error(`Module code "${props[propName]}" does not match module code pattern ${CODE_REGEX.toString()}.`);
        }
    }
};