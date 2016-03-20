import "../../../../style/Editor.scss";
import React, { Component } from "react";
import { Box, Flex } from "../layout";
import { Button } from "../input";
import Textarea from "./Textarea";

export default class Editor extends Component {
    render() {
        return (
            <div className="Editor">
                <Box className="toolbar">
                    <Button icon="bold" />
                    <Button icon="italic" />
                    <Button icon="underline" />
                    <Flex />
                    <Button icon="list-ol" />
                    <Button icon="list-ul" />
                    <Button icon="code" />
                </Box>
                <Textarea />
            </div>
        );
    }

    getValue() {

    }
}