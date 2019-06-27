import React, { Component } from "react";
import { translate } from "react-i18next";
import { Container } from "reactstrap";
import $ from "jquery";
import { ModalCustom } from "../../../components/common";

export default class FlashcardIntro extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
        };
    }

    toggle = () => {
        this.setState({ modalIsOpen: !this.state.modalIsOpen });
    };

    openModal = () => {
        this.setState({ modalIsOpen: true });
    };

    onClickSetFrom = (e, value) => {
        const { setFrom } = this.props;
        console.log("onClickSetFrom");
        // Remove old active
        $(".list_1.set-from").removeClass("active");
        $(e.target).addClass("active");
        setFrom(value);
    };

    onClickSetTo = (e, value) => {
        const { setTo } = this.props;
        console.log("onClickSetTo");
        // Remove old active
        $(".list_1.set-to").removeClass("active");
        $(e.target).addClass("active");
        setTo(value);
    };

    render() {
        const { modalIsOpen } = this.state;
        const { setStartLearning, t, from, to } = this.props;
        return (
            <Container>
                <div className="text-center">
                    <h1 className="mb-3 mt-4" style={{ fontWeight: "500" }}>
                        Flashcards
                    </h1>
                </div>
                <div className="container-cust">
                    <hr style={{ borderStyle: "dashed" }} />
                    <div className="text-center">
                        <div className="position-relative">
                            {t("common.hdsd")}:
                            <div
                                className="guide_icon"
                                onClick={this.openModal}
                            >
                                <span style={{ cursor: "pointer" }}>?</span>
                            </div>
                        </div>
                    </div>
                    <hr style={{ borderStyle: "dashed" }} />

                    <h5 className="text-center">
                        {t("common.w_yourlanguage")}
                    </h5>
                    <div
                        className="overflow-center mt-3 mb-4"
                        id="style-scroll"
                    >
                        <div
                            className={`list_1 set-to ${
                                to === "vi" ? "active" : ""
                            }`}
                            onClick={e => this.onClickSetTo(e, "vi")}
                        >
                            <a className="border-hover">
                                <div className="avatar">
                                    <img
                                        src="images/lang-vi.png"
                                        alt="Card image cap"
                                    />
                                    <span className="borderAvatar" />
                                </div>
                                <div className="listTitle">
                                    <span className="listTitle--parent">
                                        {t("common.vietnamese")}
                                    </span>
                                </div>
                            </a>
                        </div>
                        <div
                            className={`list_1 set-to ${
                                to === "en" ? "active" : ""
                            }`}
                            onClick={e => this.onClickSetTo(e, "en")}
                        >
                            <a className="border-hover">
                                <div className="avatar">
                                    <img
                                        src="images/lang-en.png"
                                        alt="Card image cap"
                                    />
                                    <span className="borderAvatar" />
                                </div>
                                <div className="listTitle">
                                    <span className="listTitle--parent">
                                        {t("common.english")}
                                    </span>
                                </div>
                            </a>
                        </div>
                        <div
                            className={`list_1 set-to ${
                                to === "cn" ? "active" : ""
                            }`}
                            onClick={e => this.onClickSetTo(e, "cn")}
                        >
                            <a className="border-hover">
                                <div className="avatar">
                                    <img
                                        src="images/lang-cn.png"
                                        alt="Card image cap"
                                    />
                                    <span className="borderAvatar" />
                                </div>
                                <div className="listTitle">
                                    <span className="listTitle--parent">
                                        {t("common.chinese")}
                                    </span>
                                </div>
                            </a>
                        </div>
                        <div
                            className={`list_1 set-to ${
                                to === "kr" ? "active" : ""
                            }`}
                            onClick={e => this.onClickSetTo(e, "kr")}
                        >
                            <a className="border-hover">
                                <div className="avatar">
                                    <img
                                        src="images/lang-kr.png"
                                        alt="Card image cap"
                                    />
                                    <span className="borderAvatar" />
                                </div>
                                <div className="listTitle">
                                    <span className="listTitle--parent">
                                        {t("common.korean")}
                                    </span>
                                </div>
                            </a>
                        </div>
                        <div
                            className={`list_1 set-to ${
                                to === "jp" ? "active" : ""
                            }`}
                            onClick={e => this.onClickSetTo(e, "jp")}
                        >
                            <a className="border-hover">
                                <div className="avatar">
                                    <img
                                        src="images/lang-jp.png"
                                        alt="Card image cap"
                                    />
                                    <span className="borderAvatar" />
                                </div>
                                <div className="listTitle">
                                    <span className="listTitle--parent">
                                        {t("common.japanese")}
                                    </span>
                                </div>
                            </a>
                        </div>
                    </div>
                    <h5 className="text-center">{t("video.w_lang")} </h5>
                    <div
                        className="overflow-center mt-3 mb-4"
                        id="style-scroll"
                    >
                        <div
                            className={`list_1 set-from ${
                                from === "vi" ? "active" : ""
                            }`}
                            onClick={e => this.onClickSetFrom(e, "vi")}
                        >
                            <a className="border-hover">
                                <div className="avatar">
                                    <img
                                        src="images/lang-vi.png"
                                        alt="Card image cap"
                                    />
                                    <span className="borderAvatar" />
                                </div>
                                <div className="listTitle">
                                    <span className="listTitle--parent">
                                        {t("common.vietnamese")}
                                    </span>
                                </div>
                            </a>
                        </div>
                        <div
                            className={`list_1 set-from ${
                                from === "en" ? "active" : ""
                            }`}
                            onClick={e => this.onClickSetFrom(e, "en")}
                        >
                            <a className="border-hover">
                                <div className="avatar">
                                    <img
                                        src="images/lang-en.png"
                                        alt="Card image cap"
                                    />
                                    <span className="borderAvatar" />
                                </div>
                                <div className="listTitle">
                                    <span className="listTitle--parent">
                                        {t("common.english")}
                                    </span>
                                </div>
                            </a>
                        </div>
                        <div
                            className={`list_1 set-from ${
                                from === "cn" ? "active" : ""
                            }`}
                            onClick={e => this.onClickSetFrom(e, "cn")}
                        >
                            <a className="border-hover">
                                <div className="avatar">
                                    <img
                                        src="images/lang-cn.png"
                                        alt="Card image cap"
                                    />
                                    <span className="borderAvatar" />
                                </div>
                                <div className="listTitle">
                                    <span className="listTitle--parent">
                                        {t("common.chinese")}
                                    </span>
                                </div>
                            </a>
                        </div>
                        <div
                            className={`list_1 set-from ${
                                from === "kr" ? "active" : ""
                            }`}
                            onClick={e => this.onClickSetFrom(e, "kr")}
                        >
                            <a className="border-hover">
                                <div className="avatar">
                                    <img
                                        src="images/lang-kr.png"
                                        alt="Card image cap"
                                    />
                                    <span className="borderAvatar" />
                                </div>
                                <div className="listTitle">
                                    <span className="listTitle--parent">
                                        {t("common.korean")}
                                    </span>
                                </div>
                            </a>
                        </div>
                        <div
                            className={`list_1 set-from ${
                                from === "jp" ? "active" : ""
                            }`}
                            onClick={e => this.onClickSetFrom(e, "jp")}
                        >
                            <a className="border-hover">
                                <div className="avatar">
                                    <img
                                        src="images/lang-jp.png"
                                        alt="Card image cap"
                                    />
                                    <span className="borderAvatar" />
                                </div>
                                <div className="listTitle">
                                    <span className="listTitle--parent">
                                        {t("common.japanese")}
                                    </span>
                                </div>
                            </a>
                        </div>
                    </div>
                    <hr style={{ borderStyle: "dashed" }} />
                </div>
                <center>
                    <button
                        className="btn btn-lg btn-warning mt-3"
                        onClick={() => setStartLearning(true)}
                    >
                        {t("common.start")}{" "}
                        <i className="fal fa-long-arrow-right" />
                    </button>
                </center>

                <ModalCustom
                    color="primary"
                    title={t("common.hdsd")}
                    btn="Default"
                    modalIsOpen={modalIsOpen}
                    btnOkHanlder={this.toggle}
                    toggleHeader={true}
                    toggle={this.toggle}
                    size="lg"
                >
                    <div className="">
                        <div
                            className="bg-white box-shadow-1 rounded p-3"
                            style={{ textAlign: "justify" }}
                        >
                            <p>
                                {t("common.step")} 1: {t("flash_card.guilde_1")}
                            </p>
                            <p>
                                {t("common.step")} 2: {t("flash_card.guilde_2")}
                            </p>
                            <p>
                                {t("common.step")} 3: {t("common.click")}{" "}
                                <label className="bg-warning pt-1 pb-1 pl-2 pr-2 rounded">
                                    {t("common.start")}
                                </label>{" "}
                                {t("flash_card.guilde_3")}
                            </p>
                            <p>
                                {t("common.step")} 4: {t("common.click")}{" "}
                                <i className="fal fa-folders" />{" "}
                                {t("flash_card.guilde_4")}{" "}
                            </p>
                            <p>
                                {t("common.step")} 5: {t("flash_card.guilde_5")}
                            </p>
                            <p>- {t("flash_card.guilde_5_1")}</p>
                            <p>
                                - {t("common.click")}{" "}
                                <i className="fal fa-check-double" />{" "}
                                {t("flash_card.guilde_5_2")}
                            </p>
                            <p>
                                - {t("flash_card.guilde_5_3_1")}{" "}
                                {t("common.click")}{" "}
                                <i className="fal fa-minus" />{" "}
                                {t("flash_card.guilde_5_3_2")}{" "}
                                {t("common.click")}{" "}
                                <i className="fal fa-sync" />{" "}
                                {t("flash_card.guilde_5_3_3")}
                            </p>
                            <p>
                                {t("common.step")} 6: {t("common.click")}{" "}
                                <i className="fas fa-play-circle text-danger" />{" "}
                                {t("flash_card.guilde_6")}
                            </p>
                            <p>
                                {t("common.step")} 7: {t("flash_card.guilde_7")}
                            </p>
                            <p>
                                - {t("common.click")}{" "}
                                <i className="fal fa-volume-up text-primary" />{" "}
                                {t("flash_card.guilde_7_1")}
                            </p>
                            <p>
                                - {t("common.click")}{" "}
                                <i className="fal fa-volume-up text-danger" />{" "}
                                {t("flash_card.guilde_7_2")}
                            </p>
                            <p>
                                - {t("common.click")}{" "}
                                <i className="fal fa-chevron-left" />{" "}
                                {t("flash_card.guilde_7_3_1")}{" "}
                                {t("common.click")}{" "}
                                <i className="fal fa-chevron-right" />{" "}
                                {t("flash_card.guilde_7_3_2")}
                            </p>
                            <p>
                                - {t("common.click")}{" "}
                                <i className="fal fa-toggle-off" />{" "}
                                {t("flash_card.guilde_7_4")}
                            </p>
                            <p>
                                - {t("common.click")}{" "}
                                <i className="fal fa-clock" />{" "}
                                {t("flash_card.guilde_7_5")}
                            </p>
                            <p>
                                - {t("common.click")}{" "}
                                <i className="fal fa-expand-arrows-alt" />{" "}
                                {t("flash_card.guilde_7_6")}
                            </p>
                            <p>
                                - {t("common.click")}{" "}
                                <i className="fal fa-eye" />{" "}
                                {t("flash_card.guilde_7_7")}
                            </p>
                            <p>
                                - {t("common.click")}{" "}
                                <i className="fal fa-microphone-alt" />{" "}
                                {t("flash_card.guilde_7_8")}
                            </p>
                            <p>
                                - {t("common.click")}{" "}
                                <label className="bg-danger text-white pt-1 pb-1 pl-2 pr-2 rounded">
                                    {t("flash_card.practice")}
                                </label>{" "}
                                {t("flash_card.guilde_7_9")}
                            </p>
                            <p>
                                - {t("common.click")}{" "}
                                <label className="bg-primary text-white pt-1 pb-1 pl-2 pr-2 rounded">
                                    {t("flash_card.examination")}
                                </label>{" "}
                                {t("flash_card.guilde_7_10")}{" "}
                                <i className="fal fa-medal text-warning" />.
                            </p>
                        </div>
                    </div>
                </ModalCustom>
            </Container>
        );
    }
}

const tRegisterTrial = translate("common")(FlashcardIntro);
export { tRegisterTrial as FlashcardIntro };
