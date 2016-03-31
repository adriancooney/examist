import "../../../style/app/App.scss";
import React, { Component } from "react";
import { connect } from "react-redux";
import * as model from "../../model";
import { FlexBox } from "../ui/layout";
import { selector } from "../../library/Selector";
import ErrorPage from "../ui/error/ErrorPage";

export class App extends Component {
    static selector = state => ({
        error: model.Error.getState(state)
    });

    render() {
        let content = this.props.error ? <ErrorPage error={this.props.error} /> : this.props.children;

        return (
            <FlexBox className="App">
                { content }
            </FlexBox>
        );
    }
}

export default connect(App.selector)(App);