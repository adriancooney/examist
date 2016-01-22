import "../../../style/Container.scss";
import React, { Component } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Box, FlexBox, Solid } from "../ui/layout";

export default class Container extends Component {
    render() {
        return (
            <Box className="Container" vertical>
                <Solid><Header /></Solid>
                <FlexBox>{this.props.children}</FlexBox>
                <Solid><Footer /></Solid>
            </Box>
        );
    }
}