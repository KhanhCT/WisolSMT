import React, { PureComponent } from "react";
import { translate } from "react-i18next";
import Footer from "./Footer";
import Header from "./Header";

class PrivacyPolicy extends PureComponent {
    responsive = {
        0: { items: 4 },
        600: { items: 5 },
        1024: { items: 6 },
    };
    render() {
        const { t } = this.props;
        return (
            <div>
                <Header />
                <div className="container-cust">
                    <h1
                        className="mb-3 mt-4 text-center"
                        style={{ fontWeight: "500" }}
                    >
                        {t("common.privacy_policy")}
                    </h1>
                    <div>
                        <p className="font-weight-bold">
                            1. {t("landing_page:pp.1")}
                        </p>
                        <p>{t("landing_page:pp.1_1")}</p>
                        <p>{t("landing_page:pp.1_2")}</p>
                        <p>{t("landing_page:pp.1_3")}</p>
                        <p className="font-weight-bold">
                            {t("landing_page:pp.2")}
                        </p>
                        <p>{t("landing_page:pp.2_1")}:</p>
                        <p>- {t("landing_page:pp.2_2")}</p>
                        <p>- {t("landing_page:pp.2_3")}</p>
                        <p>- {t("landing_page:pp.2_4")}</p>
                        <p>- {t("landing_page:pp.2_5")}</p>
                        <p>- {t("landing_page:pp.2_6")}</p>
                        <p>- {t("landing_page:pp.2_7")}</p>
                        <p>- {t("landing_page:pp.2_8")}</p>
                        <p>- {t("landing_page:pp.2_9")}</p>
                        <p>- {t("landing_page:pp.2_10")}</p>
                        <p className="font-weight-bold">
                            3. {t("landing_page:pp.3")}
                        </p>
                        <p>{t("landing_page:pp.3_1")}</p>
                        <p>{t("landing_page:pp.3_2")}</p>
                        <p className="font-weight-bold">
                            4. {t("landing_page:pp.4")}
                        </p>
                        <h5 className="mt-2 text-uppercase font-weight-bold">
                            {t("common.company_name")}
                        </h5>
                        <p>
                            {t("common.main_office")}: {t("common.hana_add")}
                        </p>
                        <p>{t("common.phone")}: +84 989 312 085</p>
                        <p>
                            Email:{" "}
                            <a href="info@hanaspeak.com">info@hanaspeak.com</a>
                        </p>
                        <p className="font-weight-bold">
                            5. {t("landing_page:pp.5")}
                        </p>
                        <p>- {t("landing_page:pp.5_1")}</p>
                        <p>- {t("landing_page:pp.5_2")}</p>
                        <p className="font-weight-bold">
                            6. {t("landing_page:pp.6")}
                        </p>
                        <p>- {t("landing_page:pp.6_1")}</p>
                        <p>- {t("landing_page:pp.6_2")}</p>
                        <p>- {t("landing_page:pp.6_3")}</p>
                        <p>- {t("landing_page:pp.6_4")}</p>
                        <p>- {t("landing_page:pp.6_5")}</p>
                        <p>- {t("landing_page:pp.6_6")}</p>
                        <p>
                            {t("landing_page:pp.6_7")}{" "}
                            <a href="mailto:support@hanaspeak.com">
                                support@hanaspeak.com
                            </a>
                            .
                        </p>
                        <p>
                            {t("landing_page:pp.6_8")}{" "}
                            <a href="https://support.lingo.page">
                                https://support.lingo.page
                            </a>
                            .
                        </p>
                        <p>
                            <b>{t("landing_page:pp.7")}</b>
                        </p>
                    </div>
                </div>

                <Footer />
            </div>
        );
    }
}

const tPrivacyPolicy = translate(["common", "landing_page"])(PrivacyPolicy);
export { tPrivacyPolicy as PrivacyPolicy };
