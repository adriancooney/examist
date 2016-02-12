import "../../../style/pages/Signup.scss";
import React, { Component } from "react";
import { connect } from "react-redux";
import { isPending } from "redux-pending";
import * as model from "../../model";
import { Institution } from "../ui";
import { ErrorMessage } from "../ui/error";
import { Flex, Box } from "../ui/layout";
import { Form, Input } from "../ui/input";
import { content } from "../../i18n";

// Primitive email check.
const MATCH_EMAIL = /[^@]+@((?:[-_a-zA-Z]+\.?)+\.\w+)/

class Signup extends Component {
    static selector = (state) => {
        let signupState = model.views.Signup.default.getState(state);

        return {
            state: signupState,
            institution: model.resources.Institution.selectByDomain(signupState.domain)(state)
        }
    };

    static actions = {
        setDomain: model.views.Signup.setDomain,
        clearError: model.views.Signup.clearError,
        getInstitutionByDomain: model.resources.Institution.getByDomain,

        createUser: model.User.create,
        isLoadingNewUser: isPending(model.User.create.type)
    };

    render() {
        const error = this.props.state.error ? <ErrorMessage error={this.props.state.error} /> : null;

        return (
            <Box className="Signup">
                <Flex>
                    <p>{ content("signup_institution_address") }</p>
                    <p>{ content("signup_young") }</p>
                </Flex>
                <Flex grow={2.5}>
                    { error }
                    <Form onSubmit={::this.onSubmit} onChange={::this.onChange}>
                        <Input name="name" label="Name" placeholder="e.g. John Smith" />
                        <Input name="email" label="Institution Email" placeholder="e.g. john.smith@nuigalway.ie" />
                        <Input name="password" label="Password" password />
                    </Form>
                </Flex>
                <Flex className="institution-view">
                    <Institution institution={this.props.institution}/>
                </Flex>
            </Box>
        );
    }

    /**
     * Create the new user.
     * @private
     * @param  {Object} details Form values.
     */
    onSubmit(details) {
        this.props.createUser(details);
    }

    /*
     * Handle when the email changes on the login form to display the institution as
     * they type.
     */
    onChange(name, value) {
        // Remove any errors if we have any
        if(this.props.state.error) this.props.clearError();

        // Show the institution dynamically if it exists
        if(name === "email") {
            let email = value.toLowerCase(); // Emails are case insensitive!
            let matched = email.match(MATCH_EMAIL);

            if(matched) {
                let [ _, domain ] = matched;

                if(this.checkInsititutionDomain) clearTimeout(this.checkInsititutionDomain);
                this.checkInsititutionDomain = setTimeout(this.loadInstitution.bind(this, domain), 500)
            }
        }
    }

    /* Clear any pending checks on domain when navigating away. */
    componentWillUnmount() {
        clearTimeout(this.checkInsititutionDomain);
    }

    loadInstitution(domain) {
        this.props.setDomain(domain);
        this.props.getInstitutionByDomain(domain);
    }
}

export default connect(Signup.selector, Signup.actions)(Signup);