import React, { PureComponent } from "react";
import { translate } from "react-i18next";
import Footer from "./Footer";
import Header from "./Header";

class What extends PureComponent {
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
                <Footer />
            </div>
        );
    }
}

const tWhat = translate(["common", "landing_page"])(What);
export { tWhat as What };
