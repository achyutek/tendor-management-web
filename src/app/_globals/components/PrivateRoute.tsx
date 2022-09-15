import React from "react";
import { Route, Redirect } from "react-router-dom";

export const PrivateRoute = ({ component: Comp, loggedIn, isAccess, path, ...rest }: any) => {
    let params = { ...rest };

    if (!loggedIn || !isAccess) {
        return (
            <Route
                path={path}
                render={(props) => {
                    return (
                        <Redirect
                            to={{
                                pathname: "/",
                                state: {
                                    from: params.location.pathname,
                                    search: params.location.search,
                                },
                            }}
                        />
                    );
                }}
            />
        );
    } else {
        return (
            <Route
                path={path}
                {...rest}
                render={(props) => {
                    return <Comp {...props} />;
                }}
            />
        );
    }
};
