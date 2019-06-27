import React, { Component } from "react";
import { Col, Container, Row, Card, Button } from "reactstrap";
import Scrollbar from "react-smooth-scrollbar";
import ReactPlayer from "react-player";
import Fullscreen from "react-full-screen";
import { Link } from "react-router-dom";
import $ from "jquery";
import VideoSub from "./VideoSub";
import VideoByLession from "./VideoByLession";
import Duration from "./Duration";
import { callApi, userHelper, errorHelper, utilHelper } from "../../../helpers";
import { errorConstants, ROUTES } from "../../../constants";
import VideoExerciseModal from "./VideoExerciseModal";
import UserExerciseResultModal from "./UserExerciseResultModal";
var scrollIntoView = require("scroll-into-view");

export class VideoDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFull: false,
            url: null,
            playing: false,
            volume: 0.8,
            seeking: false,
            muted: false,
            played: 0,
            loaded: 0,
            duration: 0,
            playbackRate: 1,
            subType: 2,
            loop: false,
            currentSub: null,
            currentVideoByLession: null,
            subTitle: null,
            lstSubDefault: {},
            keySub: null,
            heightScroll: 0,
            textHover: null,
            lstVideoByLession: [],
            isOpenSpeed: false,
            isOpenSubtitle: false,
            dataUserActivity: false,
            modalExerciseIsOpen: false,
            modalUserResultIsOpen: false,
            userAnswer: {
                multiple_choice: {},
                fillword: {},
            },
        };
    }

    toggleModalExercise = () => {
        this.setState({ modalExerciseIsOpen: !this.state.modalExerciseIsOpen });
    };

    toggleModalUserResult = () => {
        this.setState({
            modalUserResultIsOpen: !this.state.modalUserResultIsOpen,
        });
    };

    componentDidMount = () => {
        const { location } = this.props;
        let defaultSub = location.state.currVideo.default_subtitle;

        // get video_id with url
        // let urlYoutube = "https://www.youtube.com/watch?v=GxXGEQ0VlBE";
        // let video_id = utilHelper.youTubeGetID(urlYoutube);
        // console.log(video_id);
        // END get video_id with url

        this.load(location.state.currVideo.url); // load url video

        // set height list sub default when screen resize
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();

        // event mouse pointer to screen video
        $(".player").mouseover(e => {
            this.setState({ dataUserActivity: true });
        });

        // event mouse pointer leaves controls video
        $(".player").mouseout(e => {
            this.setState({ dataUserActivity: false });
        });

        // // event mouse pointer to word translate
        // $(".word").mouseover(e => {
        //     this.setState({ playing: false });
        //     $(".wordtext").css("display", "block");
        //     this.setState({ textHover: null }, () => {
        //         this.setState({ textHover: e.target.textContent });
        //     });

        //     fetch(
        //         `https://translation.googleapis.com/language/translate/v2?q=${encodeURIComponent(
        //             e.target.textContent
        //         )}&source=vi&target=en&key=AIzaSyBOiIncTRabO05GEr3Rvi8G-efHM249UqU`
        //     )
        //         .then(response => response.json())
        //         .then(data => console.log(data));
        // });

        // // event mouse pointer leaves the element
        // $(".word").mouseout(e => {
        //     this.setState({ playing: true });
        // });

        if (defaultSub && typeof defaultSub === "string") {
            defaultSub = JSON.parse(defaultSub);

            // let data = Object.keys(defaultSub).map(item => {
            //     defaultSub[item].vi_sub = defaultSub[item].vi_sub.split(" ");
            //     return defaultSub[item];
            // });
            this.setState({
                subTitle: defaultSub,
                lstSubDefault: defaultSub,
                keySub: Object.keys(defaultSub).map(idx => {
                    return parseInt(idx);
                }),
                currentVideoByLession: location.state.currVideo.id,
            });
        }

        this.createNewUserVideo();
        this.getListVideoByLession();
    };

    // function create new user_video when seen video
    createNewUserVideo = () => {
        // Get video_id from url
        const { match } = this.props;
        let videoId = parseInt(match.params.video_id);
        // Get user from storage
        let userStorage = userHelper.getUserFromStorage();
        if (userStorage) {
            let objUserVideo = {
                user_id: userStorage.user_id,
                video_id: videoId,
            };
            callApi(`user_videos`, "POST", null, objUserVideo)
                .then(res => {
                    // console.log(res);
                })
                .catch(error => {
                    console.log(error);
                    // let errorData = error.response.data;
                    // let processError = errorHelper.commonProcessError.bind(
                    //     this
                    // );
                    // processError(errorData, errorConstants.USER_VIDEO);
                });
        }
    };

    // function update user seen video
    updateUserSeenVideo = () => {
        // Get video_id from url
        const { match } = this.props;
        let videoId = parseInt(match.params.video_id);
        // Get user from storage
        let userStorage = userHelper.getUserFromStorage();
        if (userStorage) {
            callApi(`user_videos/find-and-update-user-seen-video`, "GET", {
                user_id: userStorage.user_id,
                video_id: videoId,
            })
                .then(res => {
                    // console.log(res);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    };

    getListVideoByLession = () => {
        // Get param lession_id
        const { location } = this.props;
        let lessionId = location.state.currVideo.lession_id;
        if (lessionId) {
            callApi("videos/get-video-by-lession-id", "GET", {
                lession_id: lessionId,
            })
                .then(res => {
                    this.setState({
                        error: null,
                        lstVideoByLession: res.data.data.rows,
                    });
                })
                .catch(error => {
                    console.log(error);
                });
        }
    };

    load = url => {
        this.setState({
            url,
            played: 0,
            loaded: 0,
        });
    };

    resize() {
        this.setState({ heightScroll: $(".player").height() });
    }

    playPause = () => {
        this.setState({ playing: !this.state.playing });
    };

    toggleMuted = () => {
        this.setState({ muted: !this.state.muted });
    };

    setPlaybackRate = e => {
        this.setState(
            {
                playbackRate: parseFloat(e.target.value),
                isOpenSpeed: !this.state.isOpenSpeed,
            },
            () => {
                $(".dropdown-speed").removeClass("visible-menu");
            }
        );
    };

    setSubType = e => {
        this.setState(
            {
                subType: parseInt(e.target.value),
                isOpenSubtitle: !this.state.isOpenSubtitle,
            },
            () => {
                $(".dropdown-subtitle").removeClass("visible-menu");
            }
        );
        switch (parseInt(e.target.value)) {
            case 0:
                return (
                    $("#cue-vi").css("display", "none"),
                    $("#cue-en").css("display", "none")
                );
            case 1:
                return (
                    $("#cue-vi").css("display", "none"),
                    $("#cue-en").css("display", "block")
                );
            case 2:
                return (
                    $("#cue-vi").css("display", "block"),
                    $("#cue-en").css("display", "none")
                );
            case 3:
                return (
                    $("#cue-vi").css("display", "block"),
                    $("#cue-en").css("display", "block")
                );
        }
    };

    onSeekMouseDown = e => {
        this.setState({ seeking: true });
    };

    onPlay = () => {
        this.setState({ playing: true });
    };
    onPause = () => {
        this.setState({ playing: false });
    };

    onSeekChange = e => {
        const { lstSubDefault } = this.state;
        this.setState({ played: parseFloat(e.target.value) });
        let secondProgress = Math.floor(
            parseFloat(e.target.value) * this.state.duration
        );
        let seekedItem = null;
        for (const idx of this.state.keySub) {
            if (secondProgress < idx) {
                let idxPosition = this.state.keySub.findIndex(item => {
                    return item >= secondProgress;
                });
                let prevIdx = this.state.keySub[idxPosition - 1];
                if (lstSubDefault.hasOwnProperty(prevIdx)) {
                    seekedItem = lstSubDefault[prevIdx];
                    this.setState({
                        subTitle: seekedItem,
                        currentSub: seekedItem,
                    });
                }
                break;
            }
        }
    };

    onSeekMouseUp = e => {
        this.setState({ seeking: false });
        this.player.seekTo(parseFloat(e.target.value));
    };

    handleOnProgress = played => {
        let secondProgress = Math.floor(played.playedSeconds);
        let subDefaultItem;

        const { lstSubDefault, currentSub, subType } = this.state;

        if (lstSubDefault.hasOwnProperty(secondProgress)) {
            scrollIntoView(this.refs[secondProgress], {
                validTarget: function(target, parentsScrolled) {
                    // Only scroll the first two elements that don't have the class "dontScroll"
                    // Element.matches is not supported in IE11, consider using Element.prototype.msMatchesSelector if you need to support that browser
                    return (
                        parentsScrolled < 2 &&
                        target !== window &&
                        !target.matches(".dontScroll")
                    );
                },
            });
            subDefaultItem = lstSubDefault[secondProgress];
            this.setState({
                subTitle: subDefaultItem,
                currentSub: subDefaultItem,
            });
        } else if (currentSub) {
            if (secondProgress > currentSub.end) {
                $("#cue-vi").css("display", "none");
                $("#cue-en").css("display", "none");
            } else {
                if (subType == 1) {
                    $("#cue-en").css("display", "block");
                } else if (subType == 2) {
                    $("#cue-vi").css("display", "block");
                } else if (subType == 3) {
                    $("#cue-en").css("display", "block");
                    $("#cue-vi").css("display", "block");
                }
            }
        }

        if (!this.state.seeking) {
            this.setState(played);
        }
        if (
            Math.floor(played.playedSeconds) === Math.floor(this.state.duration)
        ) {
            this.setState({ playing: false }, () => {
                this.updateUserSeenVideo();
            });
        }
    };

    onDuration = duration => {
        this.setState({ duration });
    };

    onClickFullscreen = () => {
        this.setState({ isFull: !this.state.isFull });
    };

    handleSeekTime = (subId, seekTimeItem, e) => {
        e.preventDefault();
        this.setState({
            currentSub: seekTimeItem,
        });
        this.player.seekTo(subId);
    };

    onChangeSpeed = () => {
        this.setState({
            isOpenSpeed: !this.state.isOpenSpeed,
        });
        $(".dropdown-subtitle").removeClass("visible-menu");
        if (!this.state.isOpenSpeed) {
            $(".dropdown-speed").addClass("visible-menu");
        } else {
            $(".dropdown-speed").removeClass("visible-menu");
        }
    };

    onChangeSubtile = () => {
        this.setState({
            isOpenSubtitle: !this.state.isOpenSubtitle,
        });
        $(".dropdown-speed").removeClass("visible-menu");
        if (!this.state.isOpenSubtitle) {
            $(".dropdown-subtitle").addClass("visible-menu");
        } else {
            $(".dropdown-subtitle").removeClass("visible-menu");
        }
    };

    refreshPage = video => {
        this.setState({ currentVideoByLession: video.id }, () => {
            window.location.reload();
        });
    };

    ref = player => {
        this.player = player;
    };

    // Update user answer of exercise
    updateUserAnswer = data => {
        this.setState({ userAnswer: data });
    };

    // View user result
    handleUserResult = () => {
        this.setState({ modalUserResultIsOpen: true });
    };

    render() {
        const { match, location } = this.props;
        const {
            subTitle,
            lstSubDefault,
            url,
            playing,
            played,
            volume,
            muted,
            playbackRate,
            duration,
            heightScroll,
            textHover,
            lstVideoByLession,
            dataUserActivity,
            modalExerciseIsOpen,
            modalUserResultIsOpen,
            userAnswer,
        } = this.state;
        let currVideo = location.state.currVideo;
        let renderLstSubDefault = null,
            renderLstViSubSpanHover = null,
            renderLstVideoByLession = null,
            renderLstSpeed = null,
            renderLstSubtitleType = null;

        // let arrTmp = ["Chao", "mung", "ban", "den", "voi", "Hanaspeak"];
        let arrSpeed = [
            {
                key: 2,
                label: "2.0",
            },
            {
                key: 1.5,
                label: "1.5",
            },
            {
                key: 1,
                label: "1.0",
            },
            {
                key: 0.75,
                label: "0.75",
            },
            {
                key: 0.5,
                label: "0.5",
            },
            {
                key: 0.25,
                label: "0.25",
            },
        ];
        let arrSubtitleType = [
            {
                key: 0,
                label: "Tắt",
            },
            {
                key: 1,
                label: "Tiếng Anh",
            },
            {
                key: 2,
                label: "Tiếng Việt",
            },
            {
                key: 3,
                label: "Song Ngữ",
            },
        ];

        // render list sub default
        if (Object.keys(lstSubDefault).length > 0) {
            renderLstSubDefault = Object.keys(lstSubDefault).map(
                (subId, index) => {
                    let subDefault = lstSubDefault[subId];
                    return (
                        <a
                            key={index}
                            onClick={e =>
                                this.handleSeekTime(subId, subDefault, e)
                            }
                            ref={subId}
                        >
                            <VideoSub
                                active={subDefault === this.state.currentSub}
                                sub={subDefault}
                                subId={subId}
                            />
                        </a>
                    );
                }
            );
        }

        // if (subTitle && subTitle.vi_sub.length > 0) {
        //     renderLstViSubSpanHover = subTitle.vi_sub.map((item, i) => {
        //         return (
        //             <span className="word" key={i}>
        //                 {item}
        //                 <span className="wordtext">{textHover}</span>
        //             </span>
        //         );
        //     });
        // }

        // render list video by lession
        if (lstVideoByLession.length > 0) {
            renderLstVideoByLession = lstVideoByLession.map((item, i) => {
                return (
                    <Link
                        key={i}
                        onClick={e => this.refreshPage(item, e)}
                        to={{
                            pathname: `${ROUTES.VIDEOS}/${
                                match.params.book_id
                            }/${match.params.lession_id}/${item.id}`,
                            state: { currVideo: item },
                        }}
                    >
                        <VideoByLession
                            active={
                                item.id === this.state.currentVideoByLession
                            }
                            video={item}
                        />
                    </Link>
                );
            });
        }

        // render list speed type
        if (arrSpeed.length > 0) {
            renderLstSpeed = arrSpeed.map((item, i) => {
                return (
                    <li key={i} className="speed-type" role="presentation">
                        <input
                            id={`speed-${i}`}
                            type="radio"
                            name="radio-group"
                            onChange={this.setPlaybackRate}
                            value={item.key}
                            checked={this.state.playbackRate === item.key}
                        />{" "}
                        <label htmlFor={`speed-${i}`}>{item.label}</label>
                    </li>
                );
            });
        }

        // render list subtitle type
        if (arrSubtitleType.length > 0) {
            renderLstSubtitleType = arrSubtitleType.map((item, i) => {
                return (
                    <li key={i} className="subtitle-type" role="presentation">
                        <input
                            id={`subtype-${i}`}
                            type="radio"
                            name="radioName"
                            onChange={this.setSubType}
                            value={item.key}
                            checked={this.state.subType === item.key}
                        />{" "}
                        <label htmlFor={`subtype-${i}`}>{item.label}</label>
                    </li>
                );
            });
        }

        return (
            <Container>
                <Row>
                    <div className="player-inside">
                        <Fullscreen
                            enabled={this.state.isFull}
                            onChange={isFull => {
                                this.setState({ isFull });
                                this.setState({
                                    heightScroll: $(".player").height(),
                                });
                            }}
                        >
                            <div className="player">
                                <div
                                    className="mediaplayer videoplayer"
                                    data-state={playing}
                                    data-useractivity={dataUserActivity}
                                >
                                    <ReactPlayer
                                        ref={this.ref}
                                        width="100%"
                                        url={url}
                                        volume={volume}
                                        muted={muted}
                                        onPlay={this.onPlay}
                                        onPause={this.onPause}
                                        playing={playing}
                                        playbackRate={playbackRate}
                                        onProgress={this.handleOnProgress}
                                        onDuration={this.onDuration}
                                    />
                                    {subTitle ? (
                                        <div className="cue-display">
                                            <span
                                                className="cue-wrapper"
                                                style={{ fontSize: "150%" }}
                                            >
                                                <span
                                                    id="cue-vi"
                                                    className="cue-line"
                                                >
                                                    <span className="cue">
                                                        {subTitle.vi_sub}
                                                    </span>
                                                </span>
                                                <span
                                                    id="cue-en"
                                                    className="cue-line"
                                                >
                                                    <span className="cue">
                                                        {subTitle.en_sub}
                                                    </span>
                                                </span>
                                            </span>
                                        </div>
                                    ) : (
                                        ""
                                    )}

                                    <div className="jme-controlbar">
                                        <div className="jme-cb-box media-controls">
                                            <div className="play-pause-container">
                                                <button
                                                    className="play-pause state-paused"
                                                    type="button"
                                                    onClick={this.playPause}
                                                >
                                                    {playing ? (
                                                        <i className="fas fa-pause" />
                                                    ) : (
                                                        <i className="fas fa-play" />
                                                    )}
                                                </button>
                                            </div>
                                            {/* <div className="jump-container">
                                                <button
                                                    className="jump-10"
                                                    type="button"
                                                >
                                                    <i class="fas fa-angle-double-left" />
                                                </button>
                                            </div>
                                            <div className="jump-container">
                                                <button
                                                    className="jump-10-2"
                                                    type="button"
                                                >
                                                    <i class="fas fa-angle-double-right" />
                                                </button>
                                            </div> */}
                                            <div className="currenttime-container">
                                                <div className="currenttime-display">
                                                    <Duration
                                                        seconds={
                                                            duration * played
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="progress-container">
                                                <input
                                                    type="range"
                                                    style={{ width: "100%" }}
                                                    min={0}
                                                    max={1}
                                                    step="any"
                                                    value={played}
                                                    onMouseDown={
                                                        this.onSeekMouseDown
                                                    }
                                                    onChange={this.onSeekChange}
                                                    onMouseUp={
                                                        this.onSeekMouseUp
                                                    }
                                                />
                                            </div>

                                            <div className="duration-container">
                                                <div className="duration-display">
                                                    <Duration
                                                        seconds={duration}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mute-container">
                                                <button
                                                    className="mute-unmute state-mute"
                                                    type="button"
                                                    onClick={this.toggleMuted}
                                                >
                                                    {muted ? (
                                                        <i className="fas fa-volume-off" />
                                                    ) : (
                                                        <i className="fas fa-volume-up" />
                                                    )}
                                                </button>
                                            </div>

                                            <div className="speed-container">
                                                <button
                                                    className="speed-read"
                                                    type="button"
                                                    onClick={this.onChangeSpeed}
                                                >
                                                    <i className="fas fa-walking" />
                                                </button>
                                                <div className="mediamenu dropdown-speed speed-menu">
                                                    <div className="speed-list">
                                                        <li className="title-menu">
                                                            Speed
                                                        </li>
                                                        {renderLstSpeed}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="cc-container">
                                                <button
                                                    className="cc-language"
                                                    type="button"
                                                    onClick={
                                                        this.onChangeSubtile
                                                    }
                                                >
                                                    <i className="fas fa-closed-captioning" />
                                                </button>

                                                <div className="mediamenu dropdown-subtitle subtitle-menu">
                                                    <div>
                                                        <ul role="presentation">
                                                            <li className="title-menu">
                                                                Subtitle
                                                            </li>
                                                            {
                                                                renderLstSubtitleType
                                                            }
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="fullscreen-container">
                                                <button
                                                    className="fullscreen"
                                                    type="button"
                                                    onClick={
                                                        this.onClickFullscreen
                                                    }
                                                >
                                                    <i className="fas fa-arrows-alt" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Fullscreen>

                        <div
                            className="scroll-sub-inside"
                            style={{ height: heightScroll }}
                        >
                            {/* <div className="botom-scroll-sub-top">
                                <span className="info-video">Hướng dẫn</span>
                                <span id="subtitle-obtion">Sub Option</span>
                                <span id="usersub-option">User Sub</span>
                            </div> */}
                            <div className="scroll-sub">
                                {renderLstSubDefault}
                            </div>
                        </div>
                    </div>
                </Row>

                <Row className="video_content">
                    <div id="left-c">
                        <div className="container container-video-single">
                            {" "}
                            <br />
                            <Button
                                color="danger"
                                onClick={() => {
                                    this.setState({
                                        modalExerciseIsOpen: true,
                                    });
                                }}
                            >
                                Làm bài tập
                            </Button>
                            <Button
                                color="warning"
                                onClick={this.handleUserResult}
                            >
                                Xem kết quả
                            </Button>
                            <h1 className="title single">{currVideo.name}</h1>
                            <div className="info-single">
                                {" "}
                                <div className="viewss-single">
                                    288.819 lượt xem
                                </div>
                                <div className="menu-undervideo">
                                    {" "}
                                    <span className="btn-list-single">
                                        <a href="#" className="like" name="482">
                                            <i
                                                className="fa fa-thumbs-up fa-lg like-single"
                                                aria-hidden="true"
                                                data-toggle="tooltip"
                                                title=""
                                                data-original-title="Thích video này"
                                            >
                                                {" "}
                                                <span className="like-num">
                                                    82
                                                </span>
                                            </i>
                                        </a>
                                    </span>{" "}
                                </div>
                            </div>
                        </div>
                        <div className="container content-video-single">
                            <div className="top-row-single">
                                {" "}
                                <div className="user-avatar">
                                    <a href="#">
                                        <img
                                            id="img"
                                            className="image-user-avatar"
                                            width="48"
                                            src="https://toomva.com/Data/Avatar/faster-phu-de.jpg"
                                        />
                                    </a>
                                </div>
                                <div className="user-info single">
                                    {" "}
                                    <span className="user-name">
                                        {" "}
                                        <a href="#">icandoit</a>{" "}
                                    </span>{" "}
                                    <span className="single-time">
                                        {" "}
                                        Xuất bản Jul 6, 2015
                                    </span>{" "}
                                </div>
                                <div
                                    className="btn btn-group btn-danger subscribe-single"
                                    name="13"
                                    data="0"
                                >
                                    <span>ĐĂNG KÝ</span>
                                    <span className="subscribe-num"> 1386</span>
                                </div>
                            </div>

                            <div className="body single with-seek-time">
                                <div
                                    className="content-video"
                                    dangerouslySetInnerHTML={{
                                        __html: currVideo.description,
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div id="right-c">
                        <div className="chat">
                            <div className="chat__contact-list">
                                <div className="chat__contacts">
                                    <Scrollbar
                                        className="scroll chat__contacts-scroll"
                                        alwaysShowTracks
                                    >
                                        {renderLstVideoByLession}
                                    </Scrollbar>
                                </div>
                            </div>
                        </div>
                    </div>
                </Row>
                <VideoExerciseModal
                    modalIsOpen={modalExerciseIsOpen}
                    toggle={this.toggleModalExercise}
                    updateUserAnswer={this.updateUserAnswer}
                    userAnswer={userAnswer}
                />
                <UserExerciseResultModal
                    modalIsOpen={modalUserResultIsOpen}
                    toggle={this.toggleModalUserResult}
                    userAnswer={userAnswer}
                />
            </Container>
        );
    }
}
