import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "./App.css";
import Routes from "./components/routing/Routes";
import { AuthProvider } from "./contexts/auth.context";

export default function App(): React.ReactElement {
    return (
        <Router>
            <Fragment>
                <Switch>
                    <AuthProvider>
                        <Route component={Routes} />
                    </AuthProvider>
                </Switch>
            </Fragment>
        </Router>
    );
}
