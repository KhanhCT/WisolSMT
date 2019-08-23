import React, { PureComponent } from "react";
import RegisterForm from "./components/RegisterForm";
import { Link, Route } from "react-router-dom";
import FacebookIcon from "mdi-react/FacebookIcon";
import GooglePlusIcon from "mdi-react/GooglePlusIcon";
import { ROUTES } from "../../../constants";
import { translate } from "react-i18next";
import { connect } from "react-redux";

class SignUp extends PureComponent {
    render() {
        const { t } = this.props;

        return (
            <div className="account">
                <div className="account__wrapper">
                    <div className="account__card box-shadow-1">
                        <div className="text-center">
                            <a className="companyName" href="/">
                                <img
                                    className="width150 xs-width100"
                                    src="images/main-logo.svg"
                                />
                            </a>
                        </div>
                        <Route component={RegisterForm} />
                        <div className="account__have-account">
                            <p>
                                {t("signup.have_account")}{" "}
                                <Link to={ROUTES.LOGIN}>
                                    {t("common.sign_in")}
                                </Link>
                            </p>
                        </div>
                        {/* <div className="account__or">
                            <p>Or Easily Using</p>
                        </div>
                        <div className="account__social">
                            <Link
                                className="account__social-btn account__social-btn--facebook"
                                to="/dashboard_default"
                            >
                                <FacebookIcon />
                            </Link>
                            <Link
                                className="account__social-btn account__social-btn--google"
                                to="/dashboard_default"
                            >
                                <GooglePlusIcon />
                            </Link>
                        </div> */}
                    </div>
                </div>
            </div>
        );
    }
}
const tSignUp = translate("common")(SignUp);
const mapStateToProps = () => ({});

export default connect(mapStateToProps)(tSignUp);
