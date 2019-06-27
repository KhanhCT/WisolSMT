import React, { Component } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../constants";
import MobileApp from "./MobileApp";
import ChangeLanguage from "./ChangeLanguage";
import { translate } from "react-i18next";

class Footer extends Component {
    render() {
        const { t } = this.props;
        return (
            <footer>
                {/* <MobileApp/> */}
                <ChangeLanguage />
                <div className="text-center white-text">
                    <Link to={ROUTES.PRIVACYPOLICY}>
                        <span className="tight">
                            {t("common.privacy_policy")}
                        </span>
                    </Link>
                    &nbsp; | &nbsp;
                    <Link to={ROUTES.TERMSOFUSE}>
                        <span className="tight">
                            {t("common.terms_of_use")}
                        </span>
                    </Link>
                </div>
                <div className="spacer" />
                <center>
                    <p className="white-text">
                        © 2018 {t("common.company_name")}.
                        <br />
                        {t("common.all_rights_reserved")}.
                    </p>
                </center>
                <br />
            </footer>
        );
    }
}
export default translate(["common", "landing_page"])(Footer);
