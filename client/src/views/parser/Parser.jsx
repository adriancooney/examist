import "../../../style/Parser.scss";
import React, { Component } from "react";
import PaperView from "./PaperView";
import InfoPanel from "./InfoPanel";
import Sidebar from "./Sidebar";
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