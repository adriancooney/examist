import "../../../../style/ui/Module.scss";
import React, { PropTypes } from "react";
import { Link } from "react-router";
import { Box, FlexBox } from "../layout";

export default function Module(props) {
    let { code, name } = props.module;
    const link = `/module/${code.toLowerCase()}`;

    let match = code.match(/([A-Z]+)(\d+)(-\d+)?/);

    if(match) {
        let [ full, category, number ] = match;
        code = (
            <h4>
                <Link to={link}>
                    <strong>{ category }</strong>
                    <br/>
                    { number }
                </Link>
            </h4>
        );
    } else {
        code = <h4><Link to={link}>{ code }</Link></h4>
    }

    return (
        <div className="ModuleLink">
            <Box>
                <FlexBox justify="center">
                    { code }
                    <h3><Link to={link}>{ name }</Link></h3>
                </FlexBox>
            </Box>
        </div>
    );
}

Module.propTypes = {
    module: PropTypes.object.isRequired
};