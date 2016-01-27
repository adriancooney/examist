import "../../../../style/app/modules/PaperGrid.scss";
import React, { Component, PropTypes } from "react";
import { range } from "lodash/util";
import { capitalize } from "lodash/string";

import PaperLink from "./PaperLink";

// The range of years to display
const YEAR_END = (new Date()).getFullYear();
const YEAR_START = YEAR_END - 10;
const YEARS = range(YEAR_START, YEAR_END);

export default class PaperGrid extends Component {
    static propTypes = {
        papers: PropTypes.array.isRequired,
        module: PropTypes.string.isRequired
    };

    render() {
        // Extract out the years for our table header
        let years = YEARS;
        // Group by period
        let periods = this.groupByPeriod(this.props.papers);

        // Create our table header
        let header = (
            <tr>
                { ["Year"].concat(years).map((year, i) => <th key={i}>{ year }</th>) }
            </tr>
        );

        // Create our table body
        let body = Object.keys(periods).map((period) => {

            // Create the dot for each year
            let items = years.map((year) => {
                return (<PaperLink paper={periods[period][year]}/>);
            });

            // Add in our period as the first column
            items.unshift(capitalize(period));

            // Convert them to 
            items = items.map((v, i) => <td key={i}>{v}</td>);

            return (<tr key={period}>{ items }</tr>);
        });

        return (
            <div className="PaperGrid">
                <table>
                    <tbody>
                        { header }
                        { body }
                    </tbody>
                </table>
            </div>
        );
    }

    groupByPeriod(papers) {
        return papers.reduce((groups, paper) => {
            if(!groups[paper.period]) groups[paper.period] = {};
            groups[paper.period][paper.year] = paper;
            return groups;
        }, {});
    }
}