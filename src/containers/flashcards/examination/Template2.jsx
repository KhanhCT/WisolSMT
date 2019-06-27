import React, { Component } from "react";
import { Container, Button, Card } from "reactstrap";
import Collection from "lodash/collection";
import { apiConfigs } from "../../../constants";
import $ from "jquery";
import { userHelper } from "../../../helpers";

export default class Template2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.processData(),
            isAnswer: false,
        };
    }

    processData = () => {
        const { data, level, questionData } = this.props;
        if (questionData) {
            const { templateData } = questionData;
            return { ...templateData };
        } else {
            let numberFlashCard = 2;
            switch (level["value"]) {
                case 1:
                    numberFlashCard = 3;
                    break;
                case 2:
                    numberFlashCard = 4;
                    break;
                case 3:
                    numberFlashCard = 6;
                    break;
                case 4:
                    numberFlashCard = 8;
                    break;
                default:
                    numberFlashCard = 3;
            }
            let arrAnswer = Collection.sampleSize(data, numberFlashCard);
            let question = Collection.sample(arrAnswer);
            let userAnswer = null;
            return { arrAnswer, question, userAnswer };
        }
    };

    handleClickAnswer = (e, answerIndex) => {
        if (!this.props.preview) {
            this.setState({ userAnswer: this.state.arrAnswer[answerIndex] });
            $("div.ml-0.rounded").removeClass("borderBlue");
            $(e.target).addClass("borderBlue");
        }
    };

    handlePlayVoice = type => {
        const { question } = this.state;
        const { lang } = this.props;
        let audio = question.audio;
        new Audio(userHelper.concatUrl(audio[type][lang]["directory"])).play();
    };

    componentWillUnmount = () => {
        const { arrAnswer, question, userAnswer } = this.state;
        if (!this.props.preview)
            this.props.updateExaminationData({
                templateNumber: 2,
                templateData: { arrAnswer, question, userAnswer },
            });
    };

    render() {
        const { arrAnswer, question, userAnswer } = this.state;
        const { lang, preview } = this.props;
        let audioQuestion = question.audio,
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
        let renderLstAnswer = arrAnswer.map((answer, index) => {
            return (
                <div
                    className="inline-block sm-w-47 md-w-32 mr-3--mobi mr-3--dest mb-3"
                    key={index}
                >
                    <a
                        className="d-block rounded"
                        style={{
                            position: "relative",
                        }}
                        href="javascript:;"
                        onClick={e => {
                            this.handleClickAnswer(e, index);
                        }}
                    >
                        <img
                            className="w-100 rounded"
                            src={
                                answer["image"]
                                    ? `${apiConfigs.CMS_BASE_URL}/${
                                          answer["image"]["directory"]
                                      }`
                                    : ""
                            }
                            alt="Card image cap"
                        />
                        <div
                            style={{
                                position: "absolute",
                                top: "0px",
                                right: "0px",
                                left: "0px",
                                bottom: "0px",
                            }}
                            className={`ml-0 rounded ${
                                preview && question.id === answer.id
                                    ? "borderGreen"
                                    : ""
                            } ${
                                userAnswer && userAnswer.id === answer.id
                                    ? "borderBlue"
                                    : ""
                            }`}
                        />
                    </a>
                </div>
            );
        });
        return (
            <Container className="mw-960 sm-pl-1 sm-pr-1">
                <div className="text-center mt-5 mb-3">
                    <h1 className="bg-lightgrey inline-block pl-2 pr-2 sm-fontSize18">
                        Listen and choose the correct answer
                    </h1>
                </div>
                <Card>
                    <div className="text-center">
                        <div
                            className="p-3"
                            style={{
                                border: "1px dashed #6c757d",
                                display: "inline-block",
                                borderRadius: "5px",
                                fontSize: "28px",
                                color: "#6c757d",
                            }}
                        >
                            <span>{question["name"][lang]}</span>
                        </div>
                        <div className="text-center mt-3">
                            {renderMaleVoice ? (
                                <Button
                                    onClick={() =>
                                        this.handlePlayVoice(`male_voice`)
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
                                        this.handlePlayVoice(`female_voice`)
                                    }
                                    className="btn-outline-danger btnIcon"
                                >
                                    <i className="fal fa-headphones-alt center" />
                                </Button>
                            ) : (
                                ""
                            )}
                        </div>
                    </div>
                    <div className="d-block justify-content-center">
                        {renderLstAnswer}
                    </div>
                </Card>
            </Container>
        );
    }
}
