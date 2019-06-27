import React, { PureComponent } from "react";
import { translate } from "react-i18next";
import Footer from "./Footer";
import Header from "./Header";

class Why extends PureComponent {
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

                <div className="bg-white">
                    <div className="contaner mw-960 pt-5 pb-5 pl-0 pr-0">
                        <h1 className="mb-4 ml-3 text-uppercase">
                            {t("common.why")}?
                        </h1>
                        <div className="hrMin ml-3" />
                        <h3 className="ml-3">
                            {t("landing_page:home.why_text_1")}
                        </h3>
                        <div className="d-flex justify-content-center">
                            <div
                                className="text-right"
                                style={{
                                    textDecoration: "line-through",
                                    color: "#EE6F70",
                                }}
                            >
                                <h3 className="fontSize30 xs-fontSize20 font-weight-bold text-secondary">
                                    {t("landing_page:home.advertisers")}
                                </h3>
                                <ul className="mt-3 fontSize24 xs-fontSize14 pl-0 list-unstyled text-secondary">
                                    <li>{t("landing_page:home.quantity")}</li>
                                    <li>
                                        <span>
                                            {t(
                                                "landing_page:home.complex_content"
                                            )}
                                        </span>
                                    </li>
                                    <li>
                                        <span>
                                            {t("landing_page:home.complicated")}
                                        </span>
                                    </li>
                                    <li>
                                        <span>
                                            {t("landing_page:home.clickbait")}
                                        </span>
                                    </li>
                                    <li>
                                        <span>
                                            {t("landing_page:home.pageviews")}
                                        </span>
                                    </li>
                                </ul>
                                <img
                                    className="width200 xs-width150 mt-2 align-content-start"
                                    src="images/home_img_1.svg"
                                />
                            </div>
                            <div
                                className="text-left position-relative border-left-bleed"
                                style={{ marginLeft: "30px" }}
                            >
                                <h3
                                    className="fontSize30 xs-fontSize20 font-weight-bold"
                                    style={{ color: "#70bbfd" }}
                                >
                                    {t("landing_page:home.people")}
                                </h3>
                                <ul className="mt-3 fontSize24 xs-fontSize14 pl-0 list-unstyled text-secondary">
                                    <li>
                                        <span>
                                            {t("landing_page:home.quality")}
                                        </span>
                                    </li>
                                    <li>
                                        <span>
                                            {t(
                                                "landing_page:home.simple_content"
                                            )}
                                        </span>
                                    </li>
                                    <li>
                                        <span>
                                            {t(
                                                "landing_page:home.uncomplicated"
                                            )}
                                        </span>
                                    </li>
                                    <li>
                                        <span>
                                            {t(
                                                "landing_page:home.engaging_insightful"
                                            )}
                                        </span>
                                    </li>
                                    <li>
                                        <span>
                                            {t("landing_page:home.viewpoints")}
                                        </span>
                                    </li>
                                </ul>
                                <img
                                    className="width200 xs-width150 mt-2 align-content-end marginBottomNegative50"
                                    src="images/home_img_2.svg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

const tWhy = translate(["common", "landing_page"])(Why);
export { tWhy as Why };
