import "../../../../style/ui/Question.scss";
import React, { PropTypes, Children } from "react";
import { Link } from "react-router";
import { Box } from "../layout";

export default function QuestionIndex(props) {
    const { question, link } = props;
    const path = question.formatted_path;
    let indexes = props.full ? path : path.slice(-1);

    indexes = indexes.map((index, i, all) => {
        let indexContent = index;

        if(i === all.length - 1 && question.is_section)
            indexContent = `Sec ${indexContent}`;

        return <h5><Link to={link}>{ indexContent + "." }</Link></h5>;
    });

    return (
        <Box className="QuestionIndex">
            { Children.toArray(indexes) }     
        </Box>
    );
}

QuestionIndex.propTypes = {
    question: PropTypes.object.isRequired,
    full: PropTypes.bool,
    link: PropTypes.string.isRequired
};