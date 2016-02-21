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

class ModulePicker extends Component {
    static selector = selector({
        user: model.User.selectCurrent,
        userModules: model.User.selectModules,

        // Loading states of our actions.
        isLoadingUserModules: isPending(model.User.getModules.type),
        searchResults: model.views.Picker.selectResults
    });

    static actions = {
        getModules: model.User.getModules,
        addModule: model.User.addModule,
        searchModules: model.resources.Module.search
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
            userModules = (
                <ModuleList 
                    placeholderCount={MODULE_COLUMN_HEIGHT} 
                    modules={this.props.userModules} 
                    onRemove={::this.onRemoveModule} />
            );
        }

        if(this.props.isSearchingModules) {
            searchResults = <Loading />;
        } else if(this.props.searchResults && this.props.searchResults.length) {
            searchResults = (
                <ModuleList 
                    placeholderCount={MODULE_COLUMN_HEIGHT}
                    modules={this.props.searchResults.slice(0, 6)}
                    onAdd={::this.onAddModule} />
            );
        } else {
            searchResults = <p>Nothing found.</p>;
        }

        return (
            <Flex className="ModulePicker">
                <Box className="header">
                    <Flex className="your-modules">
                        <h5>Your modules</h5>
                        { userModules }
                    </Flex>
                    <Flex vertical className="search-results">
                        <Input placeholder="Find modules.." name="module" ref="search" onChange={::this.onSearchChange}/>
                        { searchResults }
                    </Flex>
                </Box>
            </Flex>
        );
    }

    onSearchChange() {
        if(this.searchTimeout) clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(this.searchModule.bind(this, this.refs.search.getValue()), 1000);
    }

    searchModule(query) {
        this.props.searchModules(query);
    }

    onRemoveModule(mod) {
        console.log("Removing module: ", mod);
    }

    onAddModule(mod) {
        this.props.addModule(mod);
    }
}

export default connect(ModulePicker.selector, ModulePicker.actions)(ModulePicker);