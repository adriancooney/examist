import React from "react";
import { Link } from "react-router";
import ErrorPage from "../ui/error/ErrorPage";

export default function Error404() {
    return (
        <ErrorPage code="404">
            <p>Page not found. <Link to="/">Go home.</Link></p>
        </ErrorPage>
    );
}