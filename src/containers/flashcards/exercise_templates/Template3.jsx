import React, { Component } from "react";
import { Container, Row, Col, Card, Button } from "reactstrap";
import Collection from "lodash/collection";
import { apiConfigs } from "../../../constants";
import { userHelper } from "../../../helpers";
import $ from "jquery";

const removeQuestionCss = () => {
    $(`a.quest-left`).removeClass(
        "animated faster tada bg-green bg-red swing borderBlueThin clickMe"
    );
    $(`a.quest-right`).removeClass(
        "animated faster tada bg-green bg-red swing borderBlueThin clickMe"
    );
    $(`a.quest-left`).addClass("clickMe");
    $(`a.quest-right`).addClass("clickMe");
};

export default class Template3 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.processData(),
            arrAnswer: [],
            currLeftQuest: null,
            currRightQuest: null,
        };
    }

    processData = () => {
        const { data, level } = this.props;
        let numberFlashCard = 2;
        switch (level["value"]) {
            case 1:
                numberFlashCard = 2;
                break;
            case 2:
                numberFlashCard = 3;
                break;
            case 3:
                numberFlashCard = 5;
                break;
            case 4:
                numberFlashCard = 8;
                break;
            default:
                numberFlashCard = 2;
        }
        let arrQuest = Collection.sampleSize(data, numberFlashCard);
        let arrQuestLeft = Collection.shuffle(arrQuest),
            arrQuestRight = Collection.shuffle(arrQuestLeft);
        return { arrQuestLeft, arrQuestRight };
    };

    handleClickFlashcardLeft = index => {
        const {
            currRightQuest,
            arrAnswer,
            arrQuestLeft,
            arrQuestRight,
        } = this.state;
        let leftQuestChoosed = this.state.arrQuestLeft[index];
        if (currRightQuest) {
            if (leftQuestChoosed.id === currRightQuest.id) {
                userHelper.playSound("correct");
                $(`#quest-right-${currRightQuest.id}`).addClass(
                    "animated faster tada bg-green"
                );
                $(`#quest-left-${leftQuestChoosed.id}`).addClass(
                    "animated faster tada bg-green"
                );
                setTimeout(() => {
                    removeQuestionCss();
                    let newArrQuestLeft = arrQuestLeft.filter(
                            item => item.id !== leftQuestChoosed.id
                        ),
                        newArrQuestRight = arrQuestRight.filter(
                            item => item.id !== leftQuestChoosed.id
                        );
                    this.setState({
                        arrAnswer: [...arrAnswer, leftQuestChoosed],
                        arrQuestLeft: newArrQuestLeft,
                        arrQuestRight: newArrQuestRight,
                    });
                }, 1000);
            } else {
                userHelper.playSound("incorrect");
                $(`#quest-right-${currRightQuest.id}`).addClass(
                    "animated faster swing bg-red"
                );
                $(`#quest-left-${leftQuestChoosed.id}`).addClass(
                    "animated faster swing bg-red"
                );
                setTimeout(removeQuestionCss, 1000);
            }
            this.setState({
                currLeftQuest: null,
                currRightQuest: null,
            });
        } else {
            $("a.quest-left").removeClass("borderBlueThin clickMe");
            $("a.quest-left").addClass("clickMe");
            $(`#quest-left-${leftQuestChoosed.id}`).removeClass("clickMe");
            $(`#quest-left-${leftQuestChoosed.id}`).addClass("borderBlueThin");
            this.setState({ currLeftQuest: leftQuestChoosed });
        }
    };

    handleClickFlashcardRigth = index => {
        const {
            currLeftQuest,
            arrAnswer,
            arrQuestLeft,
            arrQuestRight,
        } = this.state;
        let rightQuestChoosed = arrQuestRight[index];
        if (currLeftQuest) {
            if (rightQuestChoosed.id === currLeftQuest.id) {
                userHelper.playSound("correct");
                $(`#quest-left-${currLeftQuest.id}`).addClass(
                    "animated faster tada bg-green"
                );
                $(`#quest-right-${rightQuestChoosed.id}`).addClass(
                    "animated faster tada bg-green"
                );
                setTimeout(() => {
                    removeQuestionCss();
                    let newArrQuestLeft = arrQuestLeft.filter(
                            item => item.id !== rightQuestChoosed.id
                        ),
                        newArrQuestRight = arrQuestRight.filter(
                            item => item.id !== rightQuestChoosed.id
                        );
                    this.setState({
                        arrAnswer: [...arrAnswer, rightQuestChoosed],
                        arrQuestLeft: newArrQuestLeft,
                        arrQuestRight: newArrQuestRight,
                    });
                }, 1000);
            } else {
                userHelper.playSound("incorrect");
                $(`#quest-left-${currLeftQuest.id}`).addClass(
                    "animated faster swing bg-red"
                );
                $(`#quest-right-${rightQuestChoosed.id}`).addClass(
                    "animated faster swing bg-red"
                );
                setTimeout(removeQuestionCss, 1000);
            }
            this.setState({
                currLeftQuest: null,
                currRightQuest: null,
            });
        } else {
            $("a.quest-right").removeClass("borderBlueThin clickMe");
            $("a.quest-right").addClass("clickMe");
            $(`#quest-right-${rightQuestChoosed.id}`).removeClass("clickMe");
            $(`#quest-right-${rightQuestChoosed.id}`).addClass(
                "borderBlueThin"
            );
            this.setState({ currRightQuest: rightQuestChoosed });
        }
    };

    handlePlayAudio = (type, index) => {
        const { arrQuestLeft } = this.state;
        let question = arrQuestLeft[index];
        const { lang } = this.props;
        let audio = question.audio;
        new Audio(userHelper.concatUrl(audio[type][lang]["directory"])).play();
    };

    render() {
        const { lang } = this.props;
        const { arrAnswer, arrQuestLeft, arrQuestRight } = this.state;
        let renderAnswer = arrAnswer.map((answer, index) => {
            return (
                <div
                    className="p-2 mr-3--mobi sm-mb-3 text-center rounded box-shadow-1"
                    key={index}
                >
                    <img
                        style={{ width: "150px" }}
                        className="rounded"
                        src={
                            answer["image"]
                                ? `${apiConfigs.CMS_BASE_URL}/${
                                      answer["image"]["directory"]
                                  }`
                                : ""
                        }
                        alt="Card image cap"
                    />
                    <div className="pt-2">{answer["name"][lang]}</div>
                </div>
            );
        });

        let renderQuestionLeft = arrQuestLeft.map((quest, index) => {
            let audioQuestion = quest.audio,
                renderMaleVoice = false,
                renderFemaleVoice = false;
            if (
                audioQuestion &&
                audioQuestion["male_voice"] &&
                audioQuestion["male_voice"][lang] &&
                audioQuestion["male_voice"][lang]["directory"]
            )
                renderMaleVoice = true;
            if (
                audioQuestion &&
                audioQuestion["female_voice"] &&
                audioQuestion["female_voice"][lang] &&
                audioQuestion["female_voice"][lang]["directory"]
            )
                renderFemaleVoice = true;
            return (
                <div key={index}>
                    <a
                        id={`quest-left-${quest.id}`}
                        style={{
                            padding: "5px",
                        }}
                        className="rounded mb-2 clickMe quest-left md-width240 sm-width120 sm-height125 md-width240 sm-inline-block md-d-block"
                        href="javascript:;"
                        onClick={() => {
                            this.handleClickFlashcardLeft(index);
                        }}
                    >
                        <img
                            className="rounded"
                            style={{ width: "100px" }}
                            src={
                                quest["image"]
                                    ? `${apiConfigs.CMS_BASE_URL}/${
                                          quest["image"]["directory"]
                                      }`
                                    : ""
                            }
                            alt="Card image cap"
                        />
                        <div
                            className="md-ml-3 sm-mt-1"
                            style={{ display: "inline-block" }}
                        >
                            {renderMaleVoice ? (
                                <Button
                                    onClick={() =>
                                        this.handlePlayAudio(
                                            "male_voice",
                                            index
                                        )
                                    }
                                    className="btn-outline-primary btnIcon mb-0"
                                >
                                    <i className="fal fa-headphones-alt center" />
                                </Button>
                            ) : (
                                ""
                            )}
                            {renderFemaleVoice ? (
                                <Button
                                    onClick={() =>
                                        this.handlePlayAudio(
                                            "female_voice",
                                            index
                                        )
                                    }
                                    className="btn-outline-danger btnIcon mb-0"
                                >
                                    <i className="fal fa-headphones-alt center" />
                                </Button>
                            ) : (
                                ""
                            )}
                        </div>
                    </a>
                </div>
            );
        });

        let renderQuestionRight = arrQuestRight.map((quest, index) => {
            return (
                <div key={index}>
                    <a
                        id={`quest-right-${quest.id}`}
                        className="rounded text-secondary mb-2 clickMe quest-right md-width240 sm-width120 sm-height125 md-width240 sm-inline-block md-d-block sm-heightLine125 md-heightLine75"
                        href="javascript:;"
                        onClick={() => {
                            this.handleClickFlashcardRigth(index);
                        }}
                    >
                        <span>{quest["name"][lang]}</span>
                    </a>
                </div>
            );
        });

        return (
            <Container className="mw-960 sm-pl-1 sm-pr-1 sm-mb-5">
                <div className="text-center mt-5 mb-3">
                    <h1 className="bg-lightgrey inline-block pl-2 pr-2 sm-fontSize18">
                        Choose the correct answer mapped between 2 colums
                    </h1>
                </div>
                <Card>
                    <Row>{renderAnswer}</Row>
                </Card>
                <Card>
                    <Row>
                        <Col col={6} className="text-center sm-pl-0 sm-pr-0">
                            {renderQuestionLeft}
                        </Col>
                        <Col col={6} className="text-center sm-pl-0 sm-pr-0">
                            {renderQuestionRight}
                        </Col>
                    </Row>
                </Card>
            </Container>
        );
    }
}
