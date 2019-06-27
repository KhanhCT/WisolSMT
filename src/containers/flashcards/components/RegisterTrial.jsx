import React, { Component, Fragment } from "react";
import Panel from "../../../components/Panel";
import { callApi, userHelper } from "../../../helpers";
import { ConfirmModal } from "../../../components/common";
import moment from "moment";
import Countdown from "react-countdown-now";
import $ from "jquery";
import { translate } from "react-i18next";

class RegisterTrial extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmModalIsOpen: false,
            currTimeCountDown: null,
            checkUserRegistereded: false,
            checkUserHasExpiredTime: false,
        };
    }
    toggleConfirmModal = () => {
        this.setState({ confirmModalIsOpen: !this.state.confirmModalIsOpen });
    };

    componentDidMount = () => {
        this.checkUserTrialFlashcard();
    };

    checkUserTrialFlashcard = () => {
        let userStorage = userHelper.getUserFromStorage();
        callApi("user_flashcards/check-user-trial-flashcard", "GET", {
            user_id: userStorage.user_id,
        })
            .then(res => {
                if (res.data.data.statusCode === "00") {
                    this.setState({
                        checkUserRegistered: true,
                        currTimeCountDown: new Date(
                            res.data.data.data.expire_date
                        ).getTime(),
                    });
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    handleOpenRegisterTrialFlashcard = e => {
        this.setState({ confirmModalIsOpen: true });
    };

    handleRegisterTrial = () => {
        let userStorage = userHelper.getUserFromStorage();
        let startDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        let expireDate = moment()
            .add("days", 7)
            .format("YYYY-MM-DD HH:mm:ss");
        let objCreateUserFlashcard = {
            start_date: startDate,
            expire_date: expireDate,
            user_id: userStorage.user_id,
        };

        callApi("user_flashcards", "POST", null, objCreateUserFlashcard)
            .then(res => {
                this.setState(
                    {
                        checkUserRegistered: true,
                        currTimeCountDown: expireDate,
                    },
                    () => {
                        userHelper.showToastMessage(
                            "REGISTER_TRIAL_FLASHCARD_SUCCESS",
                            "success"
                        );
                        this.toggleConfirmModal();
                    }
                );
            })
            .catch(error => {
                console.log(error);
            });
    };

    handleOnCompleteTimer = () => {
        this.setState({ checkUserHasExpiredTime: true });
    };

    handeleStartLeaning = () => {
        this.props.setStartLearning(true);
    };

    handleBuyFlashcard = () => {
        alert("Buy flashcard");
    };

    render() {
        const { t } = this.props;
        const {
            confirmModalIsOpen,
            currTimeCountDown,
            checkUserRegistered,
            checkUserHasExpiredTime,
        } = this.state;

        // Random component
        const Completionist = () => (
            <div>
                <h1 className="title-countdown" style={{ color: "red" }}>
                    {t("flash_card.text_expire_time")}
                </h1>
            </div>
        );

        const renderer = ({ days, hours, minutes, seconds, completed }) => {
            if (completed) {
                <Completionist />;
            } else {
                if (days <= 1) {
                    $("ul.countdown-timer li span").css("color", "red");
                }
                // Render a countdown
                return (
                    <div>
                        <h1 className="title-countdown">
                            {t("flash_card.title_countdown")}
                        </h1>
                        <ul className="countdown-timer">
                            <li>
                                <span id="days">{days}</span>
                                {t("flash_card.days")}
                            </li>
                            <li>
                                <span id="hours">{hours}</span>
                                {t("flash_card.hours")}
                            </li>
                            <li>
                                <span id="minutes">{minutes}</span>
                                {t("flash_card.minutes")}
                            </li>
                            <li>
                                <span id="seconds">{seconds}</span>
                                {t("flash_card.seconds")}
                            </li>
                        </ul>
                    </div>
                );
            }
        };
        let renderFlascardIntro = (
            <Panel sm={12} title="Register trial flashcard">
                <div className="row align-items-center">
                    <div className="col-6 mx-auto col-md-6 order-md-2">
                        <img
                            class="img-fluid mb-3 mb-md-0"
                            src={`${process.env.PUBLIC_URL +
                                "/img/avatar-male.svg"}`}
                            style={{ width: "60%" }}
                        />
                    </div>
                    <div className="col-md-6 order-md-1 text-center text-md-left pr-md-5">
                        <h1 className="mb-3 bd-text-purple-bright">
                            Flashcard
                        </h1>
                        <p className="lead">{t("flash_card.intro_lead_1")}</p>
                        <p className="lead mb-4">
                            {t("flash_card.intro_lead_2")}
                        </p>
                        <div className="d-flex flex-column flex-md-row lead mb-3">
                            <button
                                class="btn btn-lg btn-primary"
                                onClick={this.handleOpenRegisterTrialFlashcard}
                            >
                                <i className="fas fa-hourglass-start fa-lg" />{" "}
                                {t("flash_card.btn_trial_flashcard")}
                            </button>
                        </div>
                    </div>
                </div>
            </Panel>
        );
        let renderCoundownTimer = (
            <Panel sm={12} title="Start learning">
                <div style={{ textAlign: "center" }}>
                    <Countdown
                        renderer={renderer}
                        onComplete={this.handleOnCompleteTimer}
                        date={currTimeCountDown}
                    />

                    {checkUserHasExpiredTime ? (
                        <button
                            class="btn btn-lg btn-danger"
                            onClick={this.handleBuyFlashcard}
                        >
                            {t("flash_card.btn_buy_now")}
                        </button>
                    ) : (
                        <button
                            class="btn btn-lg btn-success"
                            onClick={this.handeleStartLeaning}
                        >
                            {t("flash_card.btn_start_learning")}
                        </button>
                    )}
                </div>
            </Panel>
        );

        let renderData = !checkUserRegistered
            ? renderFlascardIntro
            : renderCoundownTimer;

        return (
            <Fragment>
                {renderData}
                <ConfirmModal
                    headerContent={t(
                        "flash_card.header_text_modal_confirm_trial_flashcard"
                    )}
                    bodyContent={t(
                        "flash_card.body_text_modal_confirm_trial_flashcard"
                    )}
                    modalIsOpen={confirmModalIsOpen}
                    toggle={this.toggleConfirmModal}
                    handleConfirmAction={this.handleRegisterTrial}
                />
            </Fragment>
        );
    }
}

const tRegisterTrial = translate("common")(RegisterTrial);
export { tRegisterTrial as RegisterTrial };
