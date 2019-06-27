import React, { Component } from "react";
import { Link } from "react-router-dom";
import { callApi } from "../../../helpers";
import { ROUTES, apiConfigs } from "../../../constants";
import { translate } from "react-i18next";
import { Container } from "reactstrap";
import { ModalCustom } from "../../../components/common";

export default class ListVideoLanguage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lstVideoLanguage: [],
            error: null,
            modalIsOpen: false,
        };
    }

    toggle = () => {
        this.setState({ modalIsOpen: !this.state.modalIsOpen });
    };

    openModal = () => {
        this.setState({ modalIsOpen: true });
    };

    componentDidMount = () => {
        this.getListVideoLanguage();
    };

    getListVideoLanguage = () => {
        callApi(`video_categories_lang`, "GET", { limit: 1000 })
            .then(res => {
                this.setState({
                    lstVideoLanguage: res.data.data,
                });
            })
            .catch(error => {
                console.log(error);
            });
    };

    render() {
        const { lstVideoLanguage, modalIsOpen } = this.state;
        const { t } = this.props;
        let renderData = null;
        if (lstVideoLanguage.length > 0) {
            renderData = lstVideoLanguage.map((item, index) => {
                return (
                    <div className="list_1 ">
                        <Link
                            className="border-hover"
                            to={{
                                pathname: ROUTES.VIDEO_CATEGORY,
                                state: { currLang: item.data },
                            }}
                        >
                            <div className="avatar">
                                {item.data.cover_image ? (
                                    <img
                                        src={`${apiConfigs.BASE_IMAGE_URL}${
                                            item.data.cover_image
                                        }`}
                                        alt={item.data.name}
                                    />
                                ) : (
                                    <img
                                        src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180"
                                        alt="Card image cap"
                                    />
                                )}
                                <span className="borderAvatar" />
                            </div>
                            <div className="listTitle">
                                <span className="listTitle--parent">
                                    {item.data["name"].toUpperCase()}
                                </span>
                                <span className="listTitle--child">
                                    {item.total_video_category} category
                                </span>
                            </div>
                        </Link>
                    </div>
                );
            });
        }

        return (
            <Container>
                <h1
                    className="mb-3 mt-4 text-center"
                    style={{ fontWeight: "500" }}
                >
                    {t("common.listening")}
                </h1>
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

                    <h5 className="text-center">{t("video.w_lang")}</h5>
                    <div
                        className="overflow-center mt-3 mb-1"
                        id="style-scroll"
                    >
                        {renderData}
                    </div>
                    <hr style={{ borderStyle: "dashed" }} />
                </div>
                <a className="btn-left-bottom box-shadow-1" href="/">
                    <i
                        className="fal fa-chevron-left iconCenter"
                        style={{ width: "auto", height: "auto" }}
                    />
                </a>
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
                            <hr style={{ borderStyle: "dashed" }} />
                            <p>
                                {t("common.step")} 1: {t("flash_card.guilde_2")}
                            </p>
                            <p>
                                {t("common.step")} 2: {t("video.guilde_2")}
                            </p>
                            <p>
                                {t("common.step")} 3: {t("common.click")}{" "}
                                <i class="fal fa-play" /> {t("video.guilde_3")}
                            </p>
                            <p>
                                - {t("common.click")}{" "}
                                <i class="fal fa-volume-up" />{" "}
                                {t("video.guilde_3_1")}
                            </p>
                            <p>
                                - {t("common.click")}{" "}
                                <i class="fal fa-walking" />{" "}
                                {t("video.guilde_3_2")}
                            </p>
                            <p>
                                - {t("common.click")}{" "}
                                <i class="fal fa-closed-captioning" />{" "}
                                {t("video.guilde_3_3")}
                            </p>
                            <p>
                                - {t("common.click")}{" "}
                                <i class="fal fa-arrows-alt" />{" "}
                                {t("video.guilde_3_4")}
                            </p>
                            <p>- {t("video.guilde_3_5")}</p>
                        </div>
                    </div>
                </ModalCustom>
            </Container>
        );
    }
}
const tListVideoLanguage = translate(["common", "landing_page"])(
    ListVideoLanguage
);
export { tListVideoLanguage as ListVideoLanguage };
