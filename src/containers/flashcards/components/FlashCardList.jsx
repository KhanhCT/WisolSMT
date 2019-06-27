import React, { Component } from "react";
import { ButtonGroup, Card, CardImg } from "reactstrap";
import Slider from "react-slick";
import $ from "jquery";
import { translate } from "react-i18next";
import { apiConfigs } from "../../../constants";
import Fullscreen from "react-full-screen";
import ToogleSetTimeAutoPlay from "./ToogleSetTimeAutoPlay";
import { userHelper } from "../../../helpers";

class FlashCardList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displaySub: true,
            autoSlide: false,
            playMale: true,
            playFemale: true,
            nav1: null,
            nav2: null,
            isFull: false,
            collapse: false,
            autoPlayTime: 1,
            currSlideIndex: 0,
            displayPronounciation: true,
        };
    }

    componentDidMount = () => {
        this.setState({
            nav1: this.slider1,
            nav2: this.slider2,
        });
    };

    onChangeAutoPlayTime = value => {
        this.setState({ autoPlayTime: value });
    };

    toggleCollapse = () => {
        this.setState({ collapse: !this.state.collapse });
    };

    backEdit = () => {
        const { setEdit } = this.props;
        setEdit(true);
    };

    fullScreenSlide = () => {
        this.setState({ isFull: true });
    };

    handleAutoSlide = () => {
        if (!this.state.autoSlide) {
            this.slider1.slickPlay();
            this.setState({ autoSlide: true });
        } else {
            this.slider1.slickPause();
            this.setState({ autoSlide: false });
        }
    };

    displaySub = () => {
        if (!this.state.displaySub) {
            this.setState({ displaySub: true });
            $(".slideText p").css("display", "block");
        } else {
            this.setState({ displaySub: false });
            $(".slideText p").css("display", "none");
        }
    };

    displayPronounciation = () => {
        this.setState({
            displayPronounciation: !this.state.displayPronounciation,
        });
    };

    togglePlayAudio = type => {
        const { currSlideIndex } = this.state;
        const { lstFlashCard, from } = this.props;
        let slideId = Object.keys(lstFlashCard)[currSlideIndex];
        new Audio(
            userHelper.concatUrl(
                lstFlashCard[slideId]["audio"][type][from]["directory"]
            )
        ).play();
    };

    beforeChangeSlide2 = (oldIndex, newIndex) => {
        // Call slide 1 goto
        this.slider1.slickGoTo(newIndex);
    };

    beforeChangeSlide1 = (oldIndex, newIndex) => {
        // Trick for set state with fade of react slick
        setTimeout(() => {
            this.setState({ currSlideIndex: newIndex });
        }, 10);
        // Call slide 2 goto
        this.slider2.slickGoTo(newIndex);
    };

    render() {
        const {
            autoSlide,
            displaySub,
            collapse,
            autoPlayTime,
            displayPronounciation,
        } = this.state;
        const { t, lstFlashCard, from, to } = this.props;

        const settings = {
            dots: false,
            infinite: true,
            speed: 500,
            autoplaySpeed: autoPlayTime * 1000,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: autoSlide,
            swipeToSlide: true,
            fade: true,
            // lazyLoad: "progressive",
            nextArrow: <SampleNextArrow1 />,
            prevArrow: <SamplePrevArrow1 />,
        };

        const settingSlider2 = {
            slidesToShow: 5,
            slidesToScroll: 1,
            focusOnSelect: true,
            centerMode: true,
            // lazyLoad: "progressive",
            nextArrow: <SampleNextArrow2 />,
            prevArrow: <SamplePrevArrow2 />,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 5,
                        slidesToScroll: 1,
                    },
                },

                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1,
                    },
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1,
                    },
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                    },
                },
                {
                    breakpoint: 320,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                    },
                },
            ],
        };

        let flashCards = Object.keys(lstFlashCard).map((flashcardId, index) => {
            let flashcard = lstFlashCard[flashcardId];
            return (
                <Card key={index} className="pb-0" id={index}>
                    <CardImg
                        style={{ borderRadius: "0px" }}
                        top
                        width="100%"
                        src={`${apiConfigs.CMS_BASE_URL}/${
                            flashcard.image.directory
                        }`}
                        alt="Card image cap"
                    />
                </Card>
            );
        });

        let slides = Object.keys(lstFlashCard).map((flashcardId, index) => {
            let flashcard = lstFlashCard[flashcardId],
                convertName = flashcard.name,
                audio = flashcard.audio;
            let isRenderMaleVoice = false,
                isRenderFenderFemaleVoice = false;
            if (
                audio &&
                audio["male_voice"] &&
                audio["male_voice"][from] &&
                audio["male_voice"][from]["directory"]
            )
                isRenderMaleVoice = true;
            if (
                audio &&
                audio["female_voice"] &&
                audio["female_voice"][from] &&
                audio["female_voice"][from]["directory"]
            )
                isRenderFenderFemaleVoice = true;

            return (
                <center key={index}>
                    <div className="pb-0 w-100-m w-80-d mb-3">
                        <div className="position-relative">
                            <CardImg
                                top
                                width="100%"
                                src={userHelper.concatUrl(
                                    flashcard.image.directory
                                )}
                                alt="Card image cap"
                            />
                            <div
                                style={{
                                    position: "absolute",
                                    top: "5px",
                                    right: "5px",
                                }}
                            >
                                <ButtonGroup>
                                    {isRenderMaleVoice ? (
                                        <button
                                            onClick={() =>
                                                this.togglePlayAudio(
                                                    "male_voice"
                                                )
                                            }
                                            className="btn btn-primary btn-sm"
                                        >
                                            <i className="fal fa-volume-up" />
                                        </button>
                                    ) : (
                                        ""
                                    )}
                                    {isRenderFenderFemaleVoice ? (
                                        <button
                                            onClick={() =>
                                                this.togglePlayAudio(
                                                    "female_voice"
                                                )
                                            }
                                            className="btn btn-danger border-left-0 btn-sm"
                                        >
                                            <i className="fal fa-volume-up" />
                                        </button>
                                    ) : (
                                        ""
                                    )}
                                </ButtonGroup>
                            </div>
                            <div className="sub-flashcard pl-2 pr-1 pt-1 pb-0">
                                <div className="clearfix">
                                    <div className="text-center">
                                        <h3 className="text-warning">
                                            <b>
                                                {convertName[from]}
                                                {["cn", "jp", "kr"].includes(
                                                    from
                                                )
                                                    ? displayPronounciation
                                                        ? ` (${
                                                              convertName[
                                                                  `${from}_pronunciation`
                                                              ]
                                                          })`
                                                        : ""
                                                    : ""}
                                            </b>
                                        </h3>
                                        {displaySub ? (
                                            <h6 className="text-white">
                                                {convertName[to]}
                                            </h6>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                    <div className="float-right" />
                                </div>
                            </div>
                        </div>
                    </div>
                </center>
            );
        });

        return (
            <div className="fullScreen">
                <div className="sticky-top bg-white box-shadow-1 p-2">
                    <div className="d-flex justify-content-between">
                        <div>
                            <img
                                className="md-height30 sm-height20"
                                style={{
                                    width: "auto",
                                    marginTop: "8px",
                                }}
                                src="images/logo-lingo-flashcards.svg"
                            />
                        </div>
                        <div>
                            <button
                                className="btn btn-danger mb-0"
                                style={{ padding: "5px 8px" }}
                                onClick={() => {
                                    this.props.setStartExerise(true);
                                }}
                            >
                                {t("common.practice")}
                            </button>
                            <button
                                className="btn btn-primary mb-0"
                                style={{ padding: "5px 8px" }}
                                onClick={() => {
                                    this.props.setStartExamination(true);
                                }}
                            >
                                {t("common.examination")}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="bg-white pt-3 pl-3 pr-3 mb-5">
                    <ToogleSetTimeAutoPlay
                        value={autoPlayTime}
                        collapse={collapse}
                        onChangeAutoPlayTime={this.onChangeAutoPlayTime}
                    />
                    <Fullscreen
                        enabled={this.state.isFull}
                        onChange={isFull => this.setState({ isFull })}
                    >
                        <Slider
                            beforeChange={this.beforeChangeSlide1}
                            ref={slider => (this.slider1 = slider)}
                            {...settings}
                        >
                            {slides}
                        </Slider>
                        <Slider
                            ref={slider => (this.slider2 = slider)}
                            {...settingSlider2}
                            beforeChange={this.beforeChangeSlide2}
                            infinite={
                                (flashCards.length > 5 &&
                                    $(window).width() >= 1024) ||
                                (flashCards.length > 3 &&
                                    1024 > $(window).width() >= 600) ||
                                (flashCards.length > 2 &&
                                    600 > $(window).width() > 320) ||
                                (flashCards.length > 1 &&
                                    $(window).width() < 320)
                            }
                        >
                            {flashCards}
                        </Slider>
                    </Fullscreen>
                </div>
                <div className="navBottom">
                    <div className="d-flex justify-content-custom">
                        <div>
                            <a
                                className="topIcon"
                                href="javascript:;"
                                onClick={this.handleAutoSlide}
                            >
                                <div>
                                    {autoSlide ? (
                                        <i className="fal fa-toggle-on Center" />
                                    ) : (
                                        <i className="fal fa-toggle-off  Center" />
                                    )}
                                </div>
                                <span>{t("common.auto")}</span>
                            </a>
                        </div>
                        <div>
                            <a
                                className="topIcon"
                                href="javascript:;"
                                onClick={this.toggleCollapse}
                            >
                                <div>
                                    <i className="fal fa-clock  Center" />
                                </div>
                                <span>{t("common.time")}</span>
                            </a>
                        </div>
                        <div>
                            <a
                                className="topIcon"
                                href="javascript:;"
                                onClick={this.fullScreenSlide}
                            >
                                <div>
                                    <i className="fal fa-expand-arrows-alt Center" />
                                </div>
                                <span>{t("common.fullscreen")}</span>
                            </a>
                        </div>
                        <div>
                            <a
                                className="topIcon"
                                href="javascript:;"
                                onClick={this.displaySub}
                            >
                                <div>
                                    {displaySub ? (
                                        <i className="fal fa-eye Center" />
                                    ) : (
                                        <i className="fal fa-eye-slash Center" />
                                    )}
                                </div>
                                <span>{t("common.subtitle")}</span>
                            </a>
                        </div>
                        <div>
                            <a
                                className="topIcon"
                                href="javascript:;"
                                onClick={this.displayPronounciation}
                            >
                                <div>
                                    {displayPronounciation ? (
                                        <i className="fal fa-microphone-alt Center" />
                                    ) : (
                                        <i className="fal fa-microphone-alt-slash Center" />
                                    )}
                                </div>
                                <span>{t("common.pronunciation")}</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div
                    className="btn-left-bottom box-shadow-1"
                    style={{ left: "5px", bottom: "55px" }}
                    title="Back"
                    onClick={this.backEdit}
                    href="javascript:;"
                >
                    <i
                        className="fal fa-chevron-left iconCenter"
                        style={{ width: "auto", height: "auto" }}
                    />
                </div>
            </div>
        );
    }
}

const tFlashCardList = translate("common")(FlashCardList);
export { tFlashCardList as FlashCardList };

function SampleNextArrow1({ currentSlide, slideCount, children, ...props }) {
    return (
        <button
            {...props}
            style={{
                display: "block",
                right: "30px",
                top: "50%",
                zIndex: "15",
                height: "40px",
                width: "40px",
                opacity: "1",
                background: "rgba(0,0,0,0.25)",
                borderRadius: "25px",
            }}
        >
            <img src="/img/next_arrow.svg" alt="arrow_right" />
        </button>
    );
}

function SamplePrevArrow1({ currentSlide, slideCount, children, ...props }) {
    return (
        <button
            {...props}
            style={{
                display: "block",
                left: "10px",
                top: "50%",
                zIndex: "15",
                height: "40px",
                width: "40px",
                opacity: "1",
                background: "rgba(0,0,0,0.25)",
                borderRadius: "25px",
            }}
        >
            <img src="/img/prev_arrow.svg" alt="arrow_left" />
        </button>
    );
}

function SampleNextArrow2({ currentSlide, slideCount, children, ...props }) {
    return (
        <button
            {...props}
            style={{
                display: "block",
                right: "30px",
                top: "50%",
                zIndex: "15",
                height: "40px",
                width: "40px",
                opacity: "1",
                background: "rgba(0,0,0,0.25)",
                borderRadius: "25px",
            }}
        >
            <img src="/img/next_arrow.svg" alt="arrow_right" />
        </button>
    );
}

function SamplePrevArrow2({ currentSlide, slideCount, children, ...props }) {
    return (
        <button
            {...props}
            style={{
                display: "block",
                left: "10px",
                top: "50%",
                zIndex: "15",
                height: "40px",
                width: "40px",
                opacity: "1",
                background: "rgba(0,0,0,0.25)",
                borderRadius: "25px",
            }}
        >
            <img src="/img/prev_arrow.svg" alt="arrow_left" />
        </button>
    );
}
