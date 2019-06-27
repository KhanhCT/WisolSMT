import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { userHelper } from "../../../helpers";
import { ROUTES } from "../../../constants";
import { translate } from "react-i18next";

class Header extends Component {
    render() {
        let checkUserLoggedIn = !userHelper.getUserFromStorage() ? false : true;
        const { t } = this.props;
        return (
            <Fragment>
                <div className="header">
                    <h3 className="headerLogo">
                        <Link className="companyName" to={ROUTES.LANDING_PAGE}>
                            <img
                                className="companyLogo"
                                src="images/main-logo.svg"
                            />
                        </Link>
                    </h3>
                    {!checkUserLoggedIn ? (
                        <Link
                            className="btn btn-secondary btn-sm text-uppercase position-absolute"
                            style={{
                                top: "15px",
                                right: "15px",
                            }}
                            to={ROUTES.LOGIN}
                        >
                            {t("common.sign_in")}
                        </Link>
                    ) : (
                        ""
                    )}
                </div>
                <nav className="mob">
                    <ul className="headerNav">
                        <li>
                            <Link to={ROUTES.WHY}>WHY</Link>
                        </li>
                        <li>
                            <Link to={ROUTES.WHAT}>WHAT</Link>
                        </li>
                        <li>
                            <Link to={ROUTES.HOW}>HOW</Link>
                        </li>
                        <li>
                            <Link to={ROUTES.NAVIGATION}>
                                <i className="fal fa-ellipsis-h" />
                            </Link>
                        </li>
                    </ul>
                </nav>
                <nav className="des">
                    <ul className="headerNav">
                        <li>
                            <Link to={ROUTES.WHY}>WHY</Link>
                        </li>
                        <li>
                            <Link to={ROUTES.WHAT}>WHAT</Link>
                        </li>
                        <li>
                            <Link to={ROUTES.HOW}>HOW</Link>
                        </li>
                        <li>
                            <Link to={ROUTES.PRICE}>MEMB</Link>
                        </li>

                        <li>
                            <Link to={ROUTES.NAVIGATION}>
                                <i className="fal fa-ellipsis-h" />
                            </Link>
                        </li>
                    </ul>
                </nav>
            </Fragment>
        );
    }
}

export default translate(["common", "landing_page"])(Header);
