import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { userHelper } from "../../../helpers";
import { ROUTES } from "../../../constants";

export const Authentication = WrappedComponent => {
    return class WithAuthentication extends Component {
        constructor(props) {
            super(props);
            this.state = {};
        }
        render() {
            // Check user exists on localstorage
            if (!userHelper.getUserFromStorage())
                return <Redirect to={ROUTES.LOGIN} />;
            return <WrappedComponent {...this.props} />;
        }
    };
};
