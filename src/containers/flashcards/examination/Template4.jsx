import React, { Component } from "react";
import { Container, CardImg, Button } from "reactstrap";
import Collection from "lodash/collection";
import { apiConfigs } from "../../../constants";
import { userHelper } from "../../../helpers";
import $ from "jquery";

// fake data generator
const getItems = count =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
        id: `item-${k}`,
        content: `item ${k}`,
    }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: "auto",
    // change background colour if dragging
    backgroundColor: isDragging ? "#70bbfd" : "#f7f7f7",
    textAlign: "center",
    borderRadius: "5px",
    width: "10%",
    marginRight: "5px",

    // styles we need to apply on draggables
    ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
    display: "flex",
    padding: grid,
    overflow: "auto",
    borderRadius: "5px",
    border: isDraggingOver ? "1px dashed #70bbfd" : "1px dashed #6c757d",
    height: "100px",
});

export default class Template4 extends Component {
    constructor(props) {
        super(props);
        this.state = this.processData();
    }

    processData = () => {
        const { data, lang, questionData } = this.props;
        if (questionData) {
            const { templateData } = questionData;
            return { ...templateData };
        } else {
            let question = Collection.sample(data),
                arrCharacter = [];
            if (question["name"][lang]) {
                arrCharacter = question["name"][lang].split("");
                arrCharacter = Collection.shuffle(arrCharacter);
                arrCharacter = arrCharacter.map((character, index) => {
                    return {
                        content: character,
                        id: `item-${index}`,
                    };
                });
            }
            let arrCharacterAnswer = [],
                originalQuestion = [...arrCharacter];
            return {
                question,
                arrCharacter,
                arrCharacterAnswer,
                originalQuestion,
            };
        }
    };

    handleClickAddAnswerCha = (index, characterItem) => {
        if (!this.props.preview) {
            // Set Style for question index
            $(`#question-card-${index}`).css("background-color", "");
            $(`#question-card-${index}`).addClass(
                "bg-blue animated faster tada"
            );
            setTimeout(() => {
                $(`#question-card-${index}`).removeClass(
                    "bg-blue animated faster tada"
                );
                $(`#question-card-${index}`).css("background-color", "#f7f7f7");
                let newArrQuestChar = this.state.arrCharacter.filter(
                    (item, itemIndex) => itemIndex !== index
                );
                this.setState({
                    arrCharacterAnswer: [
                        ...this.state.arrCharacterAnswer,
                        characterItem,
                    ],
                    arrCharacter: newArrQuestChar,
                });
            }, 50);
        }
    };

    handleClickRemoveAnswerCha = (index, characterItem) => {
        if (!this.props.preview) {
            $(`#answer-card-${index}`).css("background-color", "");
            $(`#answer-card-${index}`).addClass(
                "bg-red animated faster bounce"
            );
            setTimeout(() => {
                $(`#answer-card-${index}`).removeClass(
                    "bg-red animated faster bounce"
                );
                $(`#answer-card-${index}`).css("background-color", "#f7f7f7");
                let newArrAnsChar = this.state.arrCharacterAnswer.filter(
                    (item, itemIndex) => itemIndex !== index
                );
                this.setState({
                    arrCharacter: [...this.state.arrCharacter, characterItem],
                    arrCharacterAnswer: newArrAnsChar,
                });
            }, 50);
        }
    };

    handlePlayVoice = type => {
        const { question } = this.state;
        const { lang } = this.props;
        let audio = question.audio;
        new Audio(userHelper.concatUrl(audio[type][lang]["directory"])).play();
    };

    componentWillUnmount = () => {
        const {
            question,
            arrCharacter,
            arrCharacterAnswer,
            originalQuestion,
        } = this.state;
        if (!this.props.preview)
            this.props.updateExaminationData({
                templateNumber: 5,
                templateData: {
                    question,
                    arrCharacter,
                    arrCharacterAnswer,
                    originalQuestion,
                },
            });
    };

    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity
    render() {
        const {
            question,
            arrCharacter,
            arrCharacterAnswer,
            originalQuestion,
        } = this.state;
        const { lang, preview } = this.props;

        // Check if preview then show original question to user, else show array character that user can sort
        let arrCharacterQuestion = preview ? originalQuestion : arrCharacter;
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

        // Render preview answer
        let arrRightAnswer = question["name"][lang].split("");
        arrRightAnswer = arrRightAnswer.map((character, index) => {
            return {
                content: character,
                id: `item-${index}`,
            };
        });
        let renderPreviewAnswer = (
            <div className="mb-4">
                <strong>Right Answer</strong>
                <div
                    className="character-questions-border bg-green"
                    style={getListStyle(false)}
                >
                    {arrRightAnswer.map((item, index) => (
                        <div
                            id={`answer-card-${index}`}
                            key={index}
                            index={index}
                            className="character-questions"
                            style={{
                                ...getItemStyle(false),
                                width: `${Math.floor(
                                    100 / arrRightAnswer.length
                                ) - 1}%`,
                            }}
                        >
                            <strong
                                style={{
                                    fontSize: "20px",
                                }}
                            >
                                {item.content}
                            </strong>
                        </div>
                    ))}
                </div>
            </div>
        );
        return (
            <Container className="mw-960 sm-pl-1 sm-pr-1">
                <div className="text-center mt-5 mb-3">
                    <h1 className="bg-lightgrey inline-block pl-2 pr-2 sm-fontSize18">
                        Click to each item of question to merge to merge
                        complete answer
                    </h1>
                </div>
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
                                    this.handlePlayVoice("male_voice")
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
                                    this.handlePlayVoice("female_voice")
                                }
                                className="btn-outline-danger btnIcon"
                            >
                                <i className="fal fa-headphones-alt center" />
                            </Button>
                        ) : (
                            ""
                        )}

                        <Button
                            color="primary"
                            onClick={this.handleCheckAnswer}
                        >
                            <i className="fal fa-check-circle" /> Check
                        </Button>
                    </div>
                </div>
                {preview ? renderPreviewAnswer : ""}
                <div>
                    <strong>Your Answer</strong>
                    <div
                        className={`character-questions-border ${
                            preview ? "bg-blue" : ""
                        }`}
                        style={getListStyle(false)}
                    >
                        {arrCharacterAnswer.map((item, index) => (
                            <div
                                id={`answer-card-${index}`}
                                key={index}
                                index={index}
                                className="character-questions"
                                style={{
                                    ...getItemStyle(false),
                                    width: `${Math.floor(
                                        100 /
                                            this.state.arrCharacterAnswer.length
                                    ) - 1}%`,
                                }}
                                onClick={() => {
                                    this.handleClickRemoveAnswerCha(
                                        index,
                                        item
                                    );
                                }}
                            >
                                <strong
                                    style={{
                                        fontSize: "20px",
                                    }}
                                >
                                    {item.content}
                                </strong>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-4">
                    <strong>Question</strong>
                    <div
                        className="character-answers-border"
                        style={getListStyle(false)}
                    >
                        {arrCharacterQuestion.map((item, index) => (
                            <div
                                id={`question-card-${index}`}
                                key={index}
                                index={index}
                                className="character-questions"
                                style={{
                                    ...getItemStyle(false),
                                    width: `${Math.floor(
                                        100 / arrCharacterQuestion.length
                                    ) - 1}%`,
                                }}
                                onClick={e => {
                                    this.handleClickAddAnswerCha(index, item);
                                }}
                            >
                                <strong
                                    style={{
                                        fontSize: "20px",
                                    }}
                                >
                                    {item.content}
                                </strong>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        );
    }
}
