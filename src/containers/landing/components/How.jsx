import React, { PureComponent } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { translate } from "react-i18next";
import Footer from "./Footer";
import Header from "./Header";

class How extends PureComponent {
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
                <div className="bg-white pb-5">
                    <h1
                        className="mb-3 mt-4 text-center"
                        style={{ fontWeight: "500" }}
                    >
                        {t("landing_page:home.how_work")}
                    </h1>
                    <center>
                        <div className="hrMin mb-4 mt-3" />
                    </center>
                    <Tabs>
                        <TabList className="overflow-center">
                            <Tab className="nav_cust_link">
                                <a href="javascript:;">
                                    <h4 className="text-center mt-3">
                                        <img
                                            style={{
                                                height: "20px",
                                                width: "auto",
                                            }}
                                            src="images/main-logo.svg"
                                        />{" "}
                                        Flashcards
                                    </h4>
                                </a>
                            </Tab>
                        </TabList>
                        <TabPanel className="mt-4 contaner mw-960">
                            <div className="homc_pc">
                                <div className="homec_row1">
                                    <div className="homec_work_img1">
                                        <img src="images/fc_1.gif" alt="" />
                                    </div>
                                    <div className="homec_workstep1">
                                        <div className="work_intropart">
                                            <span className="step">1</span>
                                            <div className="workinro">
                                                <div className="home-work-title">
                                                    {t(
                                                        "landing_page:home.how_work_step_1"
                                                    )}
                                                </div>
                                                <p className="home-work-intro">
                                                    {t(
                                                        "landing_page:home.how_work_step_1_content"
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="homec_row1">
                                    <div
                                        className="homec_workstep1"
                                        style={{ width: "46%" }}
                                    >
                                        <div className="work_intropart">
                                            <div className="homec_data_change">
                                                <div className="home-work-title2">
                                                    {t(
                                                        "landing_page:home.how_work_step_2"
                                                    )}
                                                </div>
                                                <div className="home-work-intro2">
                                                    {t(
                                                        "landing_page:home.how_work_step_2_content"
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="step2">2</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="homec_work_img2 homec_work_img1">
                                        <img src="images/fc_2.gif" alt="" />
                                    </div>
                                </div>
                                <div className="homec_row1">
                                    <div className="homec_work_img1">
                                        <img src="images/fc_3.gif" alt="" />
                                    </div>
                                    <div className="homec_workstep1">
                                        <div className="work_intropart">
                                            <span className="step">3</span>
                                            <div className="workinro">
                                                <div className="home-work-title">
                                                    {t(
                                                        "landing_page:home.how_work_step_3"
                                                    )}
                                                </div>
                                                <p className="home-work-intro">
                                                    {t(
                                                        "landing_page:home.how_work_step_3_content"
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="homc_mob">
                                <div>
                                    <div className="work_intropart">
                                        <div className="workinro">
                                            <div className="home-work-title">
                                                {t(
                                                    "landing_page:home.how_work_step_1"
                                                )}
                                            </div>
                                            <p className="home-work-intro">
                                                {t(
                                                    "landing_page:home.how_work_step_1_content"
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="homc_mob_img">
                                    <img src="images/fc_1.gif" alt="" />
                                </div>
                                <div className="">
                                    <div className="">
                                        <div className="work_intropart">
                                            <div className="workinro">
                                                <div className="home-work-title">
                                                    {t(
                                                        "landing_page:home.how_work_step_2"
                                                    )}
                                                </div>
                                                <p className="home-work-intro">
                                                    {t(
                                                        "landing_page:home.how_work_step_2_content"
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="homc_mob_img">
                                        <img src="images/fc_2.gif" alt="" />
                                    </div>
                                </div>
                                <div className="">
                                    <div className="">
                                        <div className="work_intropart">
                                            <div className="workinro">
                                                <div className="home-work-title">
                                                    {t(
                                                        "landing_page:home.how_work_step_3"
                                                    )}
                                                </div>
                                                <p className="home-work-intro">
                                                    {t(
                                                        "landing_page:home.how_work_step_3_content"
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="homc_mob_img">
                                        <img src="images/fc_3.gif" alt="" />
                                    </div>
                                </div>
                            </div>
                        </TabPanel>
                    </Tabs>
                </div>

                <Footer />
            </div>
        );
    }
}

const tHow = translate(["common", "landing_page"])(How);
export { tHow as How };
