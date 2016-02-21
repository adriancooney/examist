import "../../../../style/ui/Module.scss";
import React, { PropTypes } from "react";
import { Link } from "react-router";
import { Box, FlexBox } from "../layout";

export default function Module(props) {
    const { code, name } = props.module;
    const link = `/module/${code.toLowerCase()}`;

    return (
        <div className="ModuleLink">
            <Box>
                <FlexBox justify="center">
                    <h4><Link to={link}>{ code }</Link></h4>
                    <h4><Link to={link}>{ name }</Link></h4>
                </FlexBox>
            </Box>
        </div>
    );
}

Module.propTypes = {
    module: PropTypes.object.isRequired
};