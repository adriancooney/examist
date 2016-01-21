import "../../../style/Template.scss";
import React from "react";

export default function Footer() {
    return (
        <footer className="Footer">
            <p>&copy; Examist { (new Date()).getFullYear() }</p>
        </footer>
    );
}