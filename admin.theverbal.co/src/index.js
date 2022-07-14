import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import ErrorBoundary from "../src/components/error/ErrorBoundary";
import CssBaseline from "@material-ui/core/CssBaseline";

ReactDOM.render(
    <>
        <CssBaseline />
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </>,
    document.getElementById("root"),
);
