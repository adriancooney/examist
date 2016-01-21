import React from "react";
import ErrorMessage from "./ErrorMessage";

export default function Error404() {
    return (<ErrorMessage code="404" message="Page Not Found." />);
}