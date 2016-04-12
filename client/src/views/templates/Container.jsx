import "../../../style/Container.scss";
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Box, FlexBox, Solid } from "../ui/layout";

export default function Container(props) {
    return (
        <Box className="Container" vertical>
            <Solid>
                <Header />
            </Solid>
            <FlexBox>{props.children}</FlexBox>
            <Solid>
                <Footer />
            </Solid>
        </Box>
    );
}