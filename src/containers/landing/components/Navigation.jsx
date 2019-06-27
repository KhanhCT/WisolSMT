import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../constants";
import { translate } from "react-i18next";
import Footer from "./Footer";
import Header from "./Header";

class Navigation extends PureComponent {
    responsive = {
        0: { items: 4 },
        600: { items: 5 },
        1024: { items: 6 },
    };
    render() {
        return (
            <div>
                <Header />
                <div className="container-cust">
                    <h1
                        className="mb-3 mt-4 text-center"
                        style={{ fontWeight: "500" }}
                    >
                        Navigation
                    </h1>
                    <div className="list-icon-nav">
                        <ul>
                            <li>
                                <Link to={ROUTES.TERMSOFUSE}>
                                    <img
                                        style={{ width: "50px" }}
                                        src="images/terms_icon.svg"
                                    />
                                    <h4 className="mt-2">Terms</h4>
                                </Link>
                            </li>
                            <li>
                                <Link to={ROUTES.PRIVACYPOLICY}>
                                    <img
                                        style={{ width: "50px" }}
                                        src="images/privacy_icon.svg"
                                    />
                                    <h4 className="mt-2">Privacy</h4>
                                </Link>
                            </li>
                            <li>
                                <Link to={ROUTES.UPDATES}>
                                    <img
                                        style={{ width: "50px" }}
                                        src="images/updates_icon.svg"
                                    />
                                    <h4 className="mt-2">Updates</h4>
                                </Link>
                            </li>
                            <li>
                                <Link to={ROUTES.MOBILE}>
                                    <img
                                        style={{ width: "50px" }}
                                        src="images/mobile_icon.svg"
                                    />
                                    <h4 className="mt-2">Mobile</h4>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

const tNavigation = translate(["common", "landing_page"])(Navigation);
export { tNavigation as Navigation };
