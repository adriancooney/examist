import "../../../../style/ui/Note.scss"
import React, { Component } from "react";
import { Box, Flex } from "../layout";
import { Field, Input, Textarea, Button } from "../input";
import { Icon } from "../";

// Copyright (c) 2010-2013 Diego Perini, MIT licensed
// https://gist.github.com/dperini/729294
// see also https://mathiasbynens.be/demo/url-regex
// modified to allow protocol-relative URLs
const URL_VALIDATOR = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i

export default class NoteForm extends Component {
    state = {};

    render() {
        return (
            <Box className="NoteForm">
                { this.renderLinkForm() }
                <span className="or">OR</span>
                { this.renderUploadForm() }
            </Box>
        );
    }

    renderLinkForm() {
        let linkError;
        if(this.state.linkError) {
            linkError = <p className="error">{this.state.linkError}</p>
        }

        return (
            <Flex className="link-form">
                <h3>Submit Link</h3>
                <Field label="URL">
                    <Input ref="link" name="link" placeholder="http://paulgrapham.com/essays.html" />
                </Field>
                <Field label="Small Description">
                    <Textarea ref="linkDescription" placeholder="Great notes on page 2-5 by Author Paul Graham."/>
                </Field>
                <Box>
                    <Button onClick={::this.onSubmitLink}>Submit</Button>
                    { linkError }
                </Box>
            </Flex>
        )
    }

    renderUploadForm() {
        return (
            <Flex className="upload-form">
                <h3>Upload File</h3>
                <Box>
                    <Flex className="upload-icon"><Icon name="file" size={5} /></Flex>
                    <Flex className="upload-input"><input type="file" /></Flex>
                </Box>
                <Button>Continue</Button>
            </Flex>
        );
    }

    onSubmitLink() {
        const description = this.refs.linkDescription.getValue().trim();
        const link = this.refs.link.getValue().trim();

        if(link.length === 0)
            return this.setState({ linkError: "Link is missing." });

        if(!link.match(URL_VALIDATOR)) // EXTREMELY simple URL validation
            return this.setState({ linkError: "Please specify a valid URL." });

        if(description.length === 0)
            return this.setState({ linkError: "Short description is missing." });

        this.clearErrors();
        this.props.onSubmitLink(link, description);
    }

    clearErrors() {
        this.setState({
            linkError: null,
            uploadError: null
        });
    }
}