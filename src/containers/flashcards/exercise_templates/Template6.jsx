import React, { Component } from "react";
import { Container, CardImg, Button } from "reactstrap";
import Collection from "lodash/collection";
import { apiConfigs } from "../../../constants";
import $ from "jquery";
import { userHelper } from "../../../helpers";

export default class Template6 extends Component {
    constructor(props) {
        super(props);
        this.state = this.processData();
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
        return { arrQuest };
    };

    handleCheckAnswer = questIndex => {
        $(`#card-answer-${questIndex}`).removeClass(
            "bg-red bg-green animated faster tada swing"
        );
        const { lang } = this.props;
        let inputAnswer = $(`#input-answer-${questIndex}`)
            .val()
            .toLowerCase()
            .trim();
        let answer = this.state.arrQuest[questIndex];
        if (answer["name"][lang].toLowerCase() === inputAnswer) {
            userHelper.playSound("correct");
            $(`#card-answer-${questIndex}`).addClass(
                "bg-green animated faster tada"
            );
            setTimeout(() => {
                $(`#card-answer-${questIndex}`).removeClass(
                    "animated faster tada swing"
                );
            }, 1000);
        } else {
            userHelper.playSound("incorrect");
            $(`#card-answer-${questIndex}`).addClass(
                "bg-red animated faster swing"
            );
            setTimeout(() => {
                $(`#card-answer-${questIndex}`).removeClass(
                    "bg-red animated faster tada swing"
                );
            }, 1000);
        }
    };

    handlePlayAudio = (type, index) => {
        const { arrQuest } = this.state;
        let question = arrQuest[index];
        const { lang } = this.props;
        let audio = question.audio;
        new Audio(userHelper.concatUrl(audio[type][lang]["directory"])).play();
    };

    render() {
        const { arrQuest } = this.state;
        const { lang } = this.props;
        let renderQuestions = arrQuest.map((quest, index) => {
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
                <div
                    className="inline-block sm-w-47 md-w-32 mr-3--mobi mr-3--dest mb-3"
                    key={index}
                >
                    <div className="text-center">
                        <div
                            className="rounded p-2"
                            style={{ border: "1px solid #d7d7d7" }}
                            id={`card-answer-${index}`}
                        >
                            <CardImg
                                top
                                className="w-100 box-shadow-1 rounded"
                                src={
                                    quest["image"]
                                        ? `${apiConfigs.CMS_BASE_URL}/${
                                              quest["image"]["directory"]
                                          }`
                                        : ""
                                }
                                alt="Card image cap"
                            />
                            <div className="text-center mt-3">
                                {renderMaleVoice ? (
                                    <Button
                                        onClick={() =>
                                            this.handlePlayAudio(
                                                "male_voice",
                                                index
                                            )
                                        }
                                        className="btn-outline-primary btnIcon"
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
                                        className="btn-outline-danger btnIcon"
                                    >
                                        <i className="fal fa-headphones-alt center" />
                                    </Button>
                                ) : (
                                    ""
                                )}
                            </div>
                            <div className="input-group">
                                <input
                                    type="text"
                                    id={`input-answer-${index}`}
                                    className="form-control"
                                />
                                <div className="input-group-append">
                                    <button
                                        style={{ padding: "7.7px 5px" }}
                                        className="btn btn-primary mb-0"
                                        type="button"
                                        onClick={() => {
                                            this.handleCheckAnswer(index);
                                        }}
                                    >
                                        Check
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        });
        return (
            <Container className="mw-960 sm-pl-1 sm-pr-1">
                <div className="text-center mt-5">
                    <h1 className="bg-lightgrey inline-block pl-2 pr-2 sm-fontSize18">
                        Listen and write the correct answer
                    </h1>
                </div>
                <div className="d-block justify-content-center mt-3 mb-5">
                    {renderQuestions}
                </div>
            </Container>
        );
    }
}
