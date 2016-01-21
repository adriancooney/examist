import "../../style/Container.scss";
import React, { Component } from "react";
import { Header, Footer } from "./template";
import { Box, FlexBox, Solid } from "./ui";

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