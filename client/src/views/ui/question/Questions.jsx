import React, { PropTypes } from "react";
import { omit } from "lodash/object";
import { QuestionList } from "../question";
import { Empty } from "../";

export default function Questions(props) {
    let { questions, papers, rootQuestions, rootQuestion } = props;
    const getPaper = papers ? id => papers.find(paper => paper.id === id) : undefined;
    const getQuestion = id => questions.find(q => q.id === id);

    // Allow for passing of single rootQuestion prop
    if(rootQuestion) 
        rootQuestions = [rootQuestion.id];

    // Only do toplevel questions (i.e. path.length === 1)
    if(!rootQuestions && props.toplevel) 
        rootQuestions = questions.filter(q => !q.parent_id).map(q => q.id);

    // If not root questions, show all.
    if(!rootQuestions) 
        rootQuestions = questions.map(q => q.id);

    let content;
    if(rootQuestions.length) {
        content = (
            <QuestionList {...omit(props, "papers")} 
                questions={rootQuestions}
                getPaper={getPaper}
                getQuestion={getQuestion} />
        );
    } else {
        content = (
            <Empty>
                <p>No Questions</p>
            </Empty>
        );
    }

    return (
        <div className="Questions">
            { content }
        </div>
    );
}

Questions.propTypes = {
    course: PropTypes.object.isRequired, 
    questions: PropTypes.array.isRequired,
    papers: PropTypes.array,
    rootQuestions: PropTypes.array
};