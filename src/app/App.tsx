import React, { Component, useEffect, useState } from 'react';

import { Router, Route, Switch, withRouter } from "react-router-dom";
import history from "./_helpers/history";
import { connect } from "react-redux";
import LayoutComponent from "./shared/LayoutComponent";
import ForgotPassword from "./auth/login/ForgotPassword";
import ChangePassword from "./auth/login/ChangePassword";
import Login from "./auth/login/Login";
export class App extends Component<any, any>{
    /*    const { loggedIn } = props.authentication; */
    render() {
        return (
            <div className="App">
                <Router history={history}>
                    <Switch>
                        <Route exact path={["/", "/login"]} component={Login} />
                        <Route exact path={["/forgotPassword"]} component={ForgotPassword} />
                        <Route exact path={["/changepwd"]} component={ChangePassword} />
                        <LayoutComponent />
                    </Switch>
                </Router>
            </div>
        );
    }
}
function mapState(state: any) {
    const { authentication } = state;
    return { authentication };
}
export default (connect(mapState)(App));
