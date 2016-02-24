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

const MATCH_EMAIL = /[^@]+@((?:[-_a-zA-Z]+\.?)+\.\w+)/; // Primitive email check.
const SIGNUP_REDIRECT = "/courses/pick";

class Signup extends Component {
    static selector = (state) => {
        let signupState = model.views.Signup.default.getState(state);

        return {
            state: signupState,
            institution: model.resources.Institution.selectByDomain(signupState.domain)(state),
            user: model.User.selectCurrent(state)
        }
    };

    static actions = {
        setDomain: model.views.Signup.setDomain,
        clearError: model.views.Signup.clearError,
        getInstitutionByDomain: model.resources.Institution.getByDomain,
        createUser: model.User.create,
        push: model.Routing.push,
        isLoadingNewUser: isPending(model.User.create.type)
    };

    /*
     * Make sure they're not already logged in when trying to signup,
     * if so, redirect the back to the dashboard. This scenario isn't
     * really possible unless they open the console and somehow mani-
     * pulate the history manually but every check counts (tm).
     */
    static onEnter = (nextState, replace) => {
        const user = model.User.selectCurrent();

        if(user)
            replace("/");
    };

    /*
     * On successful signin, we'll recieve our current user prop so
     * we can redirect them to their dashboard.
     */
    componentWillReceiveProps(props) {
        if(props.user) 
            this.props.push({
                pathname: SIGNUP_REDIRECT,
                state: "POST_SIGNUP"
            });
    }

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

                // Postpone the check if the user changes their input
                if(this.checkInsititutionDomain) clearTimeout(this.checkInsititutionDomain);

                // Display the institution after X timeout
                this.checkInsititutionDomain = setTimeout(this.loadInstitution.bind(this, domain), 500)
            }
        }
    }

    /* Clear any pending checks on domain when navigating away. */
    componentWillUnmount() {
        clearTimeout(this.checkInsititutionDomain);
    }

    /*
     * Load the insititution for the institution card.
     */
    loadInstitution(domain) {
        this.props.setDomain(domain);
        this.props.getInstitutionByDomain(domain);
    }
}

export default connect(Signup.selector, Signup.actions)(Signup);