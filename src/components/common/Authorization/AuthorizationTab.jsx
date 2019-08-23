import React, { Component } from "react";
import { userHelper } from "../../../helpers";

export const AuthorizationTab = allowedRoles => WrappedComponent => {
    return class WithAuthorization extends Component {
        constructor(props) {
            super(props);
        }
        render() {
            let userStorage = userHelper.getUserFromStorage();
            let roles = userStorage.roles;
            let checkUserAllow = false;
            for (const role of roles) {
                if (allowedRoles.includes(role)) {
                    checkUserAllow = true;
                    break;
                }
            }
            if (checkUserAllow) {
                return <WrappedComponent {...this.props} />;
            } else {
                return null;
            }
        }
    };
};
