import React, { Component, PropTypes } from "react";
import { uniq } from "lodash/array";

export default class PaperGrid extends Component {
    static propTypes = {
        papers: PropTypes.array.isRequired
    };

    render() {
        // Extract out the years
        let years = uniq(this.props.papers.map((paper) => paper.year))
            .map((year, i) => <td key={i}>{year}</td>);

        return (
            <div className="PaperGrid">
                <table>
                    <tbody>
                        <tr>{years}</tr>
                    </tbody>
                </table>
            </div>
        );
    }
}