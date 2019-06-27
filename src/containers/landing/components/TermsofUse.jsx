import React, { PureComponent } from "react";
import { translate } from "react-i18next";
import Footer from "./Footer";
import Header from "./Header";

class TermsofUse extends PureComponent {
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
                        {t("common.terms_of_use")}
                    </h1>
                    <div>
                        <p>{t("landing_page:term.0_1")}</p>
                        <p>{t("landing_page:term.0_2")}</p>
                        <p>{t("landing_page:term.0_3")}</p>
                        <p>{t("landing_page:term.0_4")}</p>
                        <p class="font-weight-bold">
                            1. {t("landing_page:term.1")}
                        </p>
                        <p>- {t("landing_page:term.1_1")}</p>
                        <p>- {t("landing_page:term.1_2")}</p>
                        <p>- {t("landing_page:term.1_3")}</p>
                        <p>- {t("landing_page:term.1_4")}</p>
                        <p class="font-weight-bold">
                            2. {t("landing_page:term.2")}
                        </p>
                        <p>- {t("landing_page:term.2_1")}</p>
                        <p>- {t("landing_page:term.2_2")}</p>
                        <p>- {t("landing_page:term.2_3")}</p>
                        <p>- {t("landing_page:term.2_4")}</p>
                        <p>- {t("landing_page:term.2_5")}</p>
                        <p>- {t("landing_page:term.2_6")}</p>
                        <p>- {t("landing_page:term.2_7")}</p>
                        <p>- {t("landing_page:term.2_8")}</p>
                        <p>- {t("landing_page:term.2_9")}</p>
                        <p className="font-weight-bold">
                            3. {t("landing_page:term.3")}
                        </p>
                        <p>- {t("landing_page:term.3_1")}</p>
                        <p>- {t("landing_page:term.3_2")}</p>
                        <p>- {t("landing_page:term.3_3")}</p>
                        <p>- {t("landing_page:term.3_4")}</p>
                        <p className="font-weight-bold">
                            4. {t("landing_page:term.4")}
                        </p>

                        <p>- {t("landing_page:term.4_1")}</p>
                        <p>- {t("landing_page:term.4_2")}</p>
                        <p>- {t("landing_page:term.4_3")}</p>
                        <p>- {t("landing_page:term.4_4")}</p>

                        <p>{t("landing_page:term.4_5")}</p>
                        <p>{t("landing_page:term.4_6")}</p>
                        <p>
                            <b>{t("landing_page:term.5")}</b>
                        </p>
                    </div>
                </div>

                <Footer />
            </div>
        );
    }
}

const tTermsofUse = translate(["common", "landing_page"])(TermsofUse);
export { tTermsofUse as TermsofUse };
