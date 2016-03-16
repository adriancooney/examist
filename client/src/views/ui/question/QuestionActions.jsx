import React, { PropTypes } from "react";
import { Box } from "../layout";
import { TextButton } from "../input/Button";
import { Icon } from "../";

const ACTIONS = {
    // handlerName: text, icon]
    "onEdit": ["Edit", "edit"],
    "onAdd": ["Add", "plus"],
    "onDelete": ["Delete", "remove"]
};

export default function QuestionActions(props) {
    // Renders actions based on action handlers passed
    let actions = Object.keys(props)
        .filter(key => key.match(/^on[A-Z]\w+/))
        .map(handlerName => [props[handlerName], ...ACTIONS[handlerName]])

    actions = actions.map(([handler, text, icon], i) => {
        return (
            <TextButton key={i} onClick={handler}>
                <Icon name={icon} size={1} title={text}/>
                { props.hideText ? " " + text : null}
            </TextButton>
        );
    });

    return (
        <Box className={"QuestionActions" + (props.className ? " " + props.className : "")} vertical={props.vertical}>
            { actions }
        </Box>
    );  
}

QuestionActions.propTypes = {
    hideText: PropTypes.bool,

    // Possible actions
    onEdit: PropTypes.func,
    onAdd: PropTypes.func,
    onDelete: PropTypes.func
};