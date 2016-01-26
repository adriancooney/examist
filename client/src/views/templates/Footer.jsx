import "../../../style/Template.scss";
import * as Config from "../../Config";
import React from "react";

export default function Footer() {
    return (
        <footer className="Footer">
            <p>&copy; { Config.APP_NAME } { Config.APP_YEAR }</p>
        </footer>
    );
}