import React, { PureComponent } from "react";
import LogInForm from "./components/LogInForm";
import { Route } from "react-router-dom";
import { ROUTES } from "../../../constants";

export default class LogIn extends PureComponent {
  render() {
    return (
      <div className="account">
        <div className="account__wrapper">
          <div className="account__card box-shadow-1">
            <div className="text-center">
              <a className="companyName" href={ROUTES.LANDING_PAGE}>
                <h1>
                  <strong>LOGIN</strong>
                </h1>
              </a>
            </div>
            <Route component={LogInForm} />
          </div>
        </div>
      </div>
    );
  }
}
