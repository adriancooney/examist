import "../../../style/Parser.scss";
import React, { Component } from "react";
import { Sidebar, InfoPanel, PaperView } from "../ui/parser";
import { FlexBox } from "../ui/layout";

export default class Parser extends Component {
    render() {
        return (
            <FlexBox className="Parser">
                <Sidebar />
                <InfoPanel />
                <PaperView />
            </FlexBox>
        );
    }
}