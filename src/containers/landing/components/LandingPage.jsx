import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../constants";
import { translate } from "react-i18next";
import Footer from "./Footer";
import Header from "./Header";

class LandingPage extends PureComponent {
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
                    <div className="container text-center pt-5 pb-5">
                        <h1 className="mb-4">
                            <div id="flip">
                                <div>
                                    <div>{t("landing_page:home.slogan_2")}</div>
                                </div>
                                <div>
                                    <div>{t("landing_page:home.slogan_1")}</div>
                                </div>
                                <div>
                                    <div>{t("landing_page:home.slogan")}</div>
                                </div>
                            </div>
                        </h1>
                        <a
                            href="#get-starter"
                            className="btn btn-primary rounded text-uppercase mr-0"
                        >
                            {t("landing_page:home.get_started")}
                        </a>
                        <img
                            width="100%"
                            height="auto"
                            src="images/homepage.svg"
                        />
                    </div>
                </div>
                <div className="bg-lightgrey">
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

                <div className="bg-white">
                    <div className="contaner mw-960 pt-5 pb-5">
                        <h1 className="text-center mb-4 text-uppercase">
                            {t("common.what")}?
                        </h1>
                        <center>
                            <div className="hrMin" />
                        </center>
                        <div className="homc_pc">
                            <div className="homec_row1">
                                <div className="homec_work_img1">
                                    <img src="images/fc_3.gif" alt="" />
                                </div>
                                <div className="homec_workstep1">
                                    <div className="work_intropart">
                                        <span className="step">1</span>
                                        <div className="workinro">
                                            <div className="home-work-title">
                                                <img
                                                    style={{
                                                        height: "20px",
                                                        width: "auto",
                                                    }}
                                                    src="images/main-logo.svg"
                                                />{" "}
                                                Flashcards
                                            </div>
                                            <p className="home-work-intro">
                                                {t(
                                                    "landing_page:home.home-work-intro"
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="homc_mob">
                            <div className="work_intropart">
                                <div className="workinro">
                                    <div className="home-work-title">
                                        <img
                                            style={{
                                                height: "20px",
                                                width: "auto",
                                            }}
                                            src="images/main-logo.svg"
                                        />{" "}
                                        Flashcards
                                    </div>
                                    <p className="home-work-intro">
                                        {t("landing_page:home.home-work-intro")}
                                    </p>
                                </div>
                            </div>

                            <div className="homc_mob_img">
                                <img src="images/fc_3.gif" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-lightgrey">
                    <div className="contaner text-center mw-960 pt-5 pb-5">
                        <h1 className="mb-4 text-uppercase">
                            {t("common.how")}?
                        </h1>
                        <center>
                            <div className="hrMin" />
                        </center>
                        <h3 className="mb-4">
                            {t("landing_page:home.available")}
                        </h3>
                        <Link
                            className="btn btn-primary rounded text-uppercase"
                            to={ROUTES.HOW}
                        >
                            {t("landing_page:home.take_tour")}
                        </Link>
                    </div>
                </div>
                <div id="get-starter" className="bg-lightblue">
                    <div className="contaner mw-960 pt-5 pb-5">
                        <h1 className="text-center text-white mb-4 text-uppercase">
                            {t("landing_page:home.become_membership")}
                        </h1>
                        <center>
                            <div
                                className="hrMin"
                                style={{ borderColor: "#fff" }}
                            />
                        </center>
                        <h3 className="mb-4 text-center text-white">
                            {t("landing_page:home.create_free")}
                        </h3>
                        <center>
                            <Link
                                to={ROUTES.SIGNUP}
                                className="btn btn-warning rounded text-uppercase"
                            >
                                {" "}
                                {t("common.sign_up")}
                            </Link>
                            <Link
                                className="btn bg-white text-secondary rounded text-uppercase"
                                to={ROUTES.PRICE}
                            >
                                {t("common.membership")}
                            </Link>
                        </center>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

const tLandingPage = translate(["common", "landing_page"])(LandingPage);
export { tLandingPage as LandingPage };
