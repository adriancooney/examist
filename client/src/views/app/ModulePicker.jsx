import React, { Component } from "react";
import { connect } from "react-redux";
import { isPending } from "redux-pending";
import * as model from "../../model";
import { selector } from "../../library/Selector";
import { ModuleList } from "../ui/module";
import { Input } from "../ui/input";
import { Box, Flex, FlexBox } from "../ui/layout";
import { Loading } from "../ui";

const MODULE_COLUMN_HEIGHT = 6;
const SEARCH_INTENT_TIMEOUT = 400;

class ModulePicker extends Component {
    static selector = selector({
        user: model.User.selectCurrent,
        userModules: model.User.selectModules,
        searchResults: model.views.Picker.selectResults,

        // Loading states of our actions.
        isLoadingUserModules: isPending(model.User.getModules.type),
        isLoadingSearchResults: isPending(model.resources.Module.search.type),
        location: state => state.routing.location
    });

    static actions = {
        getModules: model.User.getModules,
        addModule: model.User.addModule,
        removeModule: model.User.removeModule,
        searchModules: model.resources.Module.search,
        clearResults: model.views.Picker.clearResults
    };

    componentWillMount() {
        // If our user modules is null, it means we haven't attempted to load them
        // yet. If it's empty, it means the user has no modules.
        if(!this.props.user.modules)
            this.props.getModules();    
    }

    render() {
        let userModules, searchResults;

        if(this.props.isLoadingUserModules) {
            userModules = <Loading />;
        } else {
            if(this.props.userModules && !this.props.userModules.length && this.props.location.state === "POST_SIGNUP") {
                userModules = (
                    <div className="welcome">
                        <h1>Welcome to Examist.</h1>
                        <p>To get started, you need to have picked some modules.
                        Please select the modules for your course using the 
                        search box on the right. Enter the module code or course name.</p>
                    </div>
                );
            } else {
                userModules = (
                    <ModuleList 
                        placeholderCount={MODULE_COLUMN_HEIGHT} 
                        modules={this.props.userModules} 
                        onRemove={::this.onRemoveModule} />
                );
            }
        }

        if(this.props.isSearchingModules) {
            searchResults = <Loading />;
        } else if(this.props.searchResults && this.props.searchResults.length) {
            searchResults = (
                <ModuleList 
                    modules={this.props.searchResults.slice(0, 6)}
                    onAdd={::this.onAddModule} />
            );
        } else {
            searchResults = <p className="empty">Nothing found.</p>;
        }

        return (
            <Flex className="ModulePicker">
                <Box className="header">
                    <Flex className="your-modules">
                        <h5>Your modules</h5>
                        { userModules }
                    </Flex>
                    <Flex vertical className="search-results">
                        <Input 
                            placeholder="Find modules.." 
                            name="module" 
                            ref="search" 
                            loading={this.props.isLoadingSearchResults}
                            onClear={::this.onClearResults}
                            onChange={::this.onSearchChange} />

                        { searchResults }
                    </Flex>
                </Box>
            </Flex>
        );
    }

    onSearchChange() {
        if(this.searchTimeout) clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(this.searchModule.bind(this, this.refs.search.getValue()), SEARCH_INTENT_TIMEOUT);
    }

    searchModule(query) {
        this.props.searchModules(query);
    }

    onRemoveModule(mod) {
        this.props.removeModule(mod);
    }

    onAddModule(mod) {
        this.props.addModule(mod);
    }

    onClearResults() {
        this.props.clearResults();
    }
}

export default connect(ModulePicker.selector, ModulePicker.actions)(ModulePicker);