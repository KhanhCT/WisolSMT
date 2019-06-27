import React, { PureComponent, Fragment } from "react";
import { ResponsiveContainer, PieChart, Pie } from "recharts";
import { translate } from "react-i18next";
import Stepper from "react-stepper-horizontal";
import { CardBody } from "reactstrap";
import PencilIcon from "mdi-react/PencilIcon";
import { callApi, userHelper } from "../../../../helpers";
import Countdown from "react-countdown-now";
import moment from "moment";
class UserLearningLevel extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            userLearnOfflineData: [],
            currUserActiveLevel: null,
            userInfo: {},
            languageLevelData: [],
        };
    }

    componentDidMount = () => {
        this.getUserLearningData();
        this.getListLanguageLevel();
        this.getUserInfo();
    };

    getUserLearningData = () => {
        // Get user from storage
        let userStorage = userHelper.getUserFromStorage();
        if (userStorage) {
            callApi("user_learn_offlines", "GET", {
                user_id: userStorage.user_id,
            })
                .then(res => {
                    for (const item of res.data.data.rows) {
                        if (item.active_current_level == 1) {
                            this.setState({ currUserActiveLevel: item });
                            break;
                        }
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    };

    getListLanguageLevel = () => {
        callApi("language_levels", "GET", {})
            .then(res => {
                this.setState({ languageLevelData: res.data.data });
            })
            .catch(error => {
                console.log(error);
            });
    };

    getUserInfo = () => {
        callApi("users/get-user-by-id", "GET", null)
            .then(res => {
                this.setState({
                    userInfo: res.data.data,
                });
            })
            .catch(error => {
                console.log(error);
            });
    };

    render() {
        const { t } = this.props;
        const { languageLevelData, currUserActiveLevel, userInfo } = this.state;
        let stepData = [],
            activeStep = null;
        if (languageLevelData.length > 0) {
            stepData = languageLevelData.map((item, index) => {
                item["title"] = `Level ${item["name"]}`;
                if (currUserActiveLevel)
                    if (currUserActiveLevel.book.language_level.id == item.id) {
                        activeStep = index;
                    }
                return item;
            });
        }
        let userLearnTimeChartData = [
            {
                value: currUserActiveLevel
                    ? (currUserActiveLevel["total_minutes_user_learned"] /
                          currUserActiveLevel["total_minutes_user_register"]) *
                      100
                    : 0,
                fill: "#ff4861",
            },
            {
                value: currUserActiveLevel
                    ? 100 -
                      (currUserActiveLevel["total_minutes_user_learned"] /
                          currUserActiveLevel["total_minutes_user_register"]) *
                          100
                    : 0,
                fill: "#ff4861",
                fill: "#eeeeee",
            },
        ];

        // Count down VIP member
        // Random component
        const Completionist = () => <span>You are good to go!</span>;

        // Renderer callback with condition
        const renderer = ({
            total,
            days,
            hours,
            minutes,
            seconds,
            completed,
        }) => {
            if (completed) {
                // Render a completed state
                return <Completionist />;
            } else {
                // Render a countdown
                return (
                    <h3>
                        {days} days, {hours} hours {minutes} minutes {seconds}{" "}
                        seconds
                    </h3>
                );
            }
        };
        let expireDate = userInfo.cod ? userInfo.cod.expire_date : null;
        let expireMilisecond = moment(expireDate)
            .add(1, "day")
            .diff(moment(new Date()), "milliseconds");
        expireMilisecond += Date.now();
        return (
            <div className="sm-pl-1 sm-pr-1">
                <div className="panel box-shadow-1">
                    <div className="p-0-m col-md-12 col-lg-12 col-xl-12">
                        <div className="panel__body p-0-m card-body">
                            <h5 className="bold-text">
                                {t("dashboard_student.road_map")}
                            </h5>
                            <Stepper steps={stepData} activeStep={activeStep} />
                        </div>
                    </div>
                </div>
                {/* <div className="panel box-shadow-1 mt-3">
                    <div className="p-0-m col-md-12 col-lg-12 col-xl-12">
                        <div className="panel__body p-0-m card-body">
                            <h5 className="bold-text">
                                {t("dashboard_student.offline_user_learning")}
                            </h5>

                            <CardBody className="dashboard__health-chart-card">
                                <div className="dashboard__health-chart">
                                    <ResponsiveContainer height={180}>
                                        <PieChart>
                                            <Pie
                                                data={userLearnTimeChartData}
                                                dataKey="value"
                                                cy={85}
                                                innerRadius={80}
                                                outerRadius={90}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="dashboard__health-chart-info">
                                        <PencilIcon
                                            style={{ fill: "#ff4861" }}
                                        />
                                        <p className="dashboard__health-chart-number">
                                            {currUserActiveLevel
                                                ? parseInt(
                                                      currUserActiveLevel[
                                                          "total_minutes_user_learned"
                                                      ] / 60
                                                  )
                                                : 0}
                                        </p>
                                        <p className="dashboard__health-chart-units">
                                            hours learned
                                        </p>
                                    </div>
                                </div>
                                <p className="dashboard__goal">
                                    Your registered:{" "}
                                    {currUserActiveLevel
                                        ? parseInt(
                                              currUserActiveLevel[
                                                  "total_minutes_user_register"
                                              ] / 60
                                          )
                                        : 0}{" "}
                                    hours
                                </p>
                            </CardBody>
                        </div>
                    </div>
                </div> */}
                {/* <div className="panel box-shadow-1 mt-3 col-md-12 col-lg-12 col-xl-12">
                    <div className="p-0-m">
                        <div className="panel__body p-0-m card-body">
                            <h5 className="bold-text">Số lượng huy chương</h5>

                            <CardBody className="dashboard__health-chart-card">
                                <div className="dashboard__health-chart">
                                    <i
                                        className="fal fa-medal fa-lg fa-4x"
                                        style={{ color: "#ff8000" }}
                                    />{" "}
                                    <i
                                        className="fal fa-medal fa-lg fa-4x"
                                        style={{ color: "#ff8000" }}
                                    />{" "}
                                    <i
                                        className="fal fa-medal fa-lg fa-4x"
                                        style={{ color: "#ff8000" }}
                                    />
                                </div>
                                <h3>{userInfo["number_medal"]} medals</h3>
                            </CardBody>
                        </div>
                    </div>
                </div> */}
                <div className="panel box-shadow-1 mt-3 col-md-12 col-lg-12 col-xl-12">
                    <div className="p-0-m">
                        <div className="panel__body p-0-m card-body">
                            <h5 className="bold-text">Thời hạn VIP Member</h5>
                            {expireDate ? (
                                <CardBody className="dashboard__health-chart-card">
                                    <Countdown
                                        renderer={renderer}
                                        date={expireMilisecond}
                                    />
                                </CardBody>
                            ) : (
                                "Tài khoản của bạn không phải là tài khoản VIP"
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default translate("common")(UserLearningLevel);
