import React, { Component } from "react";
import { Container, CardImg, Button } from "reactstrap";
import Collection from "lodash/collection";
import { apiConfigs } from "../../../constants";
import { userHelper } from "../../../helpers";
import $ from "jquery";

export default class Template1 extends Component {
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
            // Switch level with number question
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
            $("div.p-3.rounded").removeClass("bg-blue");
            $(e.target).addClass("bg-blue");
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
                templateNumber: 1,
                templateData: { arrAnswer, question, userAnswer },
            });
    };

    render() {
        const { arrAnswer, question, isAnswer, userAnswer } = this.state;
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
                    className="sm-inline-block sm-w-47 mr-3--mobi sm-mb-3"
                    key={index}
                >
                    <a
                        className="d-block rounded text-dark text-center"
                        style={{ position: "relative" }}
                        href="javascript:;"
                        onClick={e => {
                            this.handleClickAnswer(e, index);
                        }}
                    >
                        <div
                            className={`p-3 rounded ${
                                userAnswer && userAnswer.id === answer.id
                                    ? "bg-blue"
                                    : ""
                            } ${
                                preview && question.id === answer.id
                                    ? "bg-green"
                                    : ""
                            }`}
                            style={{
                                border: `${
                                    !isAnswer
                                        ? "1px dashed #d7d7d7"
                                        : "1px solid #4ce1b6"
                                }`,
                            }}
                        >
                            <span style={{ pointerEvents: "none" }}>
                                <strong>{answer["name"][lang]}</strong>
                            </span>
                        </div>
                    </a>
                </div>
            );
        });
        return (
            <Container className="mw-960 sm-pl-1 sm-pr-1 mb-5">
                <div className="text-center mt-5 mb-3">
                    <h1 className="bg-lightgrey inline-block pl-2 pr-2 sm-fontSize18">
                        Listen and choose the correct answer
                    </h1>
                </div>
                <div>
                    <div className="text-center">
                        <CardImg
                            top
                            className="w-80-d box-shadow-1 rounded"
                            src={
                                question["image"]
                                    ? `${apiConfigs.CMS_BASE_URL}/${
                                          question["image"]["directory"]
                                      }`
                                    : ""
                            }
                            alt="Card image cap"
                        />
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
                </div>
                <div className="md-d-flex sm-d-block justify-content-center">
                    {renderLstAnswer}
                </div>
            </Container>
        );
    }
}
