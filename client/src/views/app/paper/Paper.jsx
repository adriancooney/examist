import React, { Component } from "react";
import { connect } from "react-redux";
import { isPending } from "redux-pending";
import * as actions from "../../../actions";
import * as selectors from "../../../selectors";
import { Loading, Empty } from "../../ui";
import { QuestionList } from "../question";
import { Enum } from "../../../Util";

export const PAPER_TYPE = Enum(
    "UNAVAILABLE", // The paper was not available on the server
    "UNINDEXED", // The paper is available but not yet indexed
    "AVAILABLE" // The paper is available and is indexed
);

class Paper extends Component {
    static selectors = (state, props) => {
        const paper = selectors.Paper.getPaper(
            props.params.module,
            props.params.year,
            props.params.period
        )(state);

        return {
            paper, questions: paper ? selectors.Paper.getQuestions(paper.id)(state) : null,

            // Loading states
            isLoadingPaper: isPending(actions.Paper.types.PAPER)(state)
        }
    };

    static actions = {
        getPaper: actions.Paper.getPaper
    };

    componentWillMount() {
        if(!this.props.paper)
            this.props.getPaper(this.props.params.module, this.props.params.year, this.props.params.period);
    }

    render() {
        if(this.props.isLoadingPaper) {
            return <Loading />
        }

        let questions = <Empty/>;

        if(this.props.questions && this.props.questions.length) {
            questions = <QuestionList questions={this.props.questions} />
        }

        return (
            <div className="Paper">
                <h3>Questions</h3>
                { questions }
            </div>
        );
    }
}

export default connect(Paper.selectors, Paper.actions)(Paper);