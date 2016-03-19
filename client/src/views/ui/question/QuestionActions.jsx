import React, { PropTypes } from "react";
import { Box } from "../layout";
import { TextButton } from "../input/Button";
import { Icon } from "../";

const ACTIONS = {
    // handlerName: text, icon]
    "onEdit": ["Edit", "edit"],
    "onAdd": ["Add Sub Question", "plus"],
    "onRemove": ["Delete", "remove"]
};

export default function QuestionActions(props) {
    // Renders actions based on action handlers passed
    let actions = Object.keys(props)
        .filter(key => key.match(/^on[A-Z]\w+/))
        .map(handlerName => {
            if(!ACTIONS[handlerName])
                throw new Error(`Unknown action handler name "${handlerName}".`);

            return [props[handlerName], ...ACTIONS[handlerName]]
        });

    actions = actions.map(([handler, text, icon], i) => {
        return (
            <TextButton key={i} onClick={handler.bind(null, props.question)}>
                <Icon name={icon} size={1} title={text}/>
                { !props.hideText ? " " + text : null}
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
    vertical: PropTypes.bool,
    question: PropTypes.object,

    // Possible actions
    onEdit: PropTypes.func,
    onAdd: PropTypes.func,
    onDelete: PropTypes.func
};