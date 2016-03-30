import "../../../../style/Editor.scss";
import React, { Component } from "react";
import { Box, Flex } from "../layout";
import { Button } from "../input";
import Preview from "./Preview";

export default class Editor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            previewing: false,
            value: props.defaultValue || "",
            selection: null,
            cursor: props.defaultValue ? props.defaultValue.length : 0
        };
    }

    render() {
        let content, actions;

        if(this.state.previewing) {
            content = <Preview>{ this.state.value }</Preview>
        } else {
            content = (
                <textarea 
                    ref="textarea"
                    onMouseUp={::this.onSelection}
                    onChange={::this.onChange}
                    value={this.state.value} />
            );
        }

        const hasSelection = !!this.state.selection;

        if(this.props.children) {
            actions = (
                <div className="actions">{ this.props.children }</div>
            );
        }

        return (
            <div className="Editor">
                <Box className="toolbar">
                    <Button disabled={!hasSelection} icon="bold" onClick={::this.boldSelection} />
                    <Button disabled={!hasSelection} icon="italic" onClick={::this.italicizeSelection} />
                    <Button icon="list-ol" onClick={::this.insertOrderedList} />
                    <Button icon="list-ul" onClick={::this.insertUnorderedList} />
                    <Button icon="code" onClick={::this.insertCodeBlock} />
                    <Flex />
                    <Button icon="eye" textual onClick={::this.togglePreview} activated={this.state.previewing}>Preview</Button>
                </Box>

                { content }
                { actions }
            </div>
        );
    }

    focus() {
        if(this.refs.textarea)
            this.refs.textarea.focus();
    }

    setCursorPosition(position) {
        const textarea = this.refs.textarea;

        if(textarea) {
            textarea.setSelectionRange(position, position);
        }
    }

    togglePreview() {
        this.setState({ 
            previewing: !this.state.previewing
        });
    }

    onChange(event) {
        if(this.state.selection)
            this.clearSelection();

        this.setState({ value: event.target.value });
    }

    onSelection(event) {
        const start = event.target.selectionStart;
        const end = event.target.selectionEnd;

        if(!start && !end) return;

        if(start === end) {
            this.setState({
                selection: null,
                cursor: start
            });
        } else {
            this.setState({
                selection: {
                    start, end,
                    content: this.state.value.substring(start, end)
                },
                cursor: start
            });
        }
    }

    clearSelection() {
        this.setState({
            selection: null
        });
    }

    boldSelection() {
        this.surroundSelection("**");
    }

    italicizeSelection() {
        this.surroundSelection("_")
    }

    insertUnorderedList() {
        this.insert("\n\n1. ");
    }

    insertOrderedList() {
        this.insert("\n\n * ");
    }

    insertCodeBlock() {
        this.insert("\n\n    ");
    }

    insert(text) {
        const cursor = this.state.cursor;
        this.replaceText(cursor, cursor, text);
        this.focus();
        
        setTimeout(() => { this.setCursorPosition(cursor + text.length); }, 100);
    }

    surroundSelection(marker) {
        this.replaceSelection(marker + this.state.selection.content + marker);
    }

    replaceSelection(content) {
        const { start, end } = this.state.selection;
        this.replaceText(start, end, content)
        this.clearSelection();
    }

    replaceText(start, end, content) {
        const value = this.state.value;

        this.setState({
            value: value.substring(0, start) + content + value.substring(end)
        });
    }

    getValue(clear) {
        const value = this.state.value;
        if(clear) this.clear();
        return value;
    }

    clear() {
        this.setState({ value: "" });
    }
}