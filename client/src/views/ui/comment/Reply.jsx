import React, { Component } from "react";
import { Button } from "../input";
import { Box } from "../layout";
import { Editor } from "../editor";

export default class Reply extends Component {
    render() {
        return (
            <div className="Reply">
                <Editor ref="editor" />
                <Box className="actions">
                    <Button onClick={::this.onPost}>Post</Button>
                    {this.props.onCancel ? <Button onClick={this.props.onCancel} danger>Cancel</Button> : null}
                </Box>
            </div>
        );
    }

    onPost() {
        if(this.props.onReply) {
            this.props.onReply(this.refs.editor.getValue());
            this.refs.editor.clear();
        }
    }
}