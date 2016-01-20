import React, { Component } from "react";
import { Link } from "react-router";

export default function Header(props) {
    return (
        <header className="Header">
            <h1>Examist</h1>
            <nav>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/login">Login</Link></li>                   
            </nav>
        </header>
    );
}