import React from "react";
import ErrorPage from "../ui/error/ErrorPage";

export default function Error404() {
    return <ErrorPage code="404" message="Page Not Found." />;
}