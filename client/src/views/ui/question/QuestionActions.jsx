import React, { PropTypes } from "react";
import { classify } from "../../../Util";
import { Box } from "../layout";

export default function QuestionActions(props) {
    return (
        <Box className={classify("QuestionActions", { "side-actions": props.vertical }, props.className)} vertical={props.vertical}>
            { props.children }
        </Box>
    );  
}

QuestionActions.propTypes = {
    vertical: PropTypes.bool
};