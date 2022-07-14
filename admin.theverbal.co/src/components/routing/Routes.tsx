import React from "react";
import { Switch } from "react-router-dom";
import Login from "../auth/Login";
import { BaseRoute } from "./PrivateRoute";
import { Dashboard } from "../dashboard/Dashboard";
import PermissionDenied from "./PermissionDenied";

const Routes = (): React.ReactElement => {
    return (
        <>
            <Switch>
                <BaseRoute path="/dashboard" component={Dashboard} permission="WidgetView" />
                <BaseRoute path="/403" component={PermissionDenied} />
                <BaseRoute path="/" component={Login} />
            </Switch>
        </>
    );
};

export default Routes;
