import "../../../../style/app/Question.scss";
import React, { Component, PropTypes } from "react";
import { Box, Flex } from "../../ui/layout";
import Path from "./Path";

export default class Question extends Component {
    static propTypes = {
        question: PropTypes.object.isRequired
    };

    render() {
        return (
            <div className="Question">
                <Box>
                    <Path path={this.props.question.path} />
                    <Flex><h5>{ this.props.question.content }</h5></Flex>
                </Box>
            </div>
        );
    }
}