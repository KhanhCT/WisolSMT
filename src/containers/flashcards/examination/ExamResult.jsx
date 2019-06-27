import React, { Component, Fragment } from "react";
import { Col, Card, CardBody } from "reactstrap";
import QuestionReviewModal from "./QuestionReviewModal";
import { TableComponent } from "../../../components/common";
import { callApi } from "../../../helpers";

export default class ExamResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            questionData: null,
            updateUserMedal: false,
        };
    }

    componentDidUpdate() {
        const { updateUserMedal } = this.state;
        if (!updateUserMedal) {
            this.setState({ updateUserMedal: true }, () => {
                const { examData, numberQuestion, lang } = this.props;
                let numberRightAnswer = 0;
                Object.keys(examData).map(questNum => {
                    let questionData = examData[questNum];
                    const { templateData, templateNumber } = questionData;
                    if ([1, 2].includes(templateNumber)) {
                        const { question, userAnswer } = templateData;
                        if (userAnswer) {
                            if (userAnswer.id === question.id) {
                                numberRightAnswer += 1;
                            }
                        }
                    } else if (templateNumber === 3) {
                        const {
                            question,
                            arrCharacter,
                            userAnswer,
                        } = templateData;
                        if (userAnswer) {
                            let resultText = arrCharacter
                                .map(item => item.content)
                                .join("");
                            if (resultText === question["name"][lang]) {
                                numberRightAnswer += 1;
                            }
                        }
                    } else if (templateNumber === 4) {
                        const { arrQuest, arrAnswer } = templateData;
                        let numberQuestRight = 0;
                        arrQuest.map((quest, index) => {
                            if (
                                quest["name"][lang].toLowerCase() ===
                                arrAnswer[index]
                            )
                                numberQuestRight += 1;
                        });
                        if (Object.keys(arrAnswer).length > 0) {
                            if (numberQuestRight === arrQuest.length) {
                                numberRightAnswer += 1;
                            }
                        }
                    } else {
                        const {
                            question,
                            arrCharacter,
                            arrCharacterAnswer,
                        } = templateData;
                        if (arrCharacterAnswer.length > 0) {
                            let resultText = arrCharacterAnswer
                                .map(item => item.content)
                                .join("");
                            if (resultText === question["name"][lang]) {
                                numberRightAnswer += 1;
                            }
                        }
                    }
                });
                let countStarPercent =
                        (numberRightAnswer * 100) / numberQuestion,
                    numberMedal = 0;
                if (countStarPercent >= 90) numberMedal += 5;
                else if (countStarPercent >= 80) numberMedal += 4;
                else if (countStarPercent >= 70) numberMedal += 3;
                else if (countStarPercent >= 60) numberMedal += 2;
                else if (countStarPercent >= 50) numberMedal += 1;

                // Call API update number Medal
                if (numberMedal > 0)
                    callApi("users/update-user-info", "POST", null, {
                        number_medal: numberMedal,
                    })
                        .then(res => {})
                        .catch(error => {
                            console.log(error);
                            this.setState({ updateUserMedal: false });
                        });
            });
        }
    }

    toggleModal = () => {
        this.setState({ modalIsOpen: !this.state.modalIsOpen });
    };

    openReviewModal = questNumber => {
        // Set current data and template
        const { examData } = this.props;
        this.setState({ questionData: examData[questNumber] }, () => {
            this.setState({ modalIsOpen: true });
        });
    };

    render() {
        const { modalIsOpen, questionData } = this.state;
        const {
            examData,
            numberQuestion,
            data,
            lang,
            level,
            updateExaminationData,
        } = this.props;
        let numberRightAnswer = 0;
        let renderResults = Object.keys(examData).map(numberQuestion => {
            let renderAnswer = (
                <i
                    className="fal fa-square fa-lg"
                    style={{ color: "#70bbfd" }}
                />
            );
            let questionData = examData[numberQuestion];
            const { templateData, templateNumber } = questionData;

            if ([1, 2].includes(templateNumber)) {
                const { question, userAnswer } = templateData;
                if (userAnswer) {
                    if (userAnswer.id === question.id) {
                        numberRightAnswer += 1;
                        renderAnswer = (
                            <i
                                className="fal fa-check-square fa-lg"
                                style={{ color: "#4ce1b6" }}
                            />
                        );
                    } else
                        renderAnswer = (
                            <i
                                className="fal fa-times-square fa-lg"
                                style={{ color: "#ff4861" }}
                            />
                        );
                }
            } else if (templateNumber === 3) {
                const { question, arrCharacter, userAnswer } = templateData;
                if (userAnswer) {
                    let resultText = arrCharacter
                        .map(item => item.content)
                        .join("");
                    if (resultText === question["name"][lang]) {
                        numberRightAnswer += 1;
                        renderAnswer = (
                            <i
                                className="fal fa-check-square fa-lg"
                                style={{ color: "#4ce1b6" }}
                            />
                        );
                    } else
                        renderAnswer = (
                            <i
                                className="fal fa-times-square fa-lg"
                                style={{ color: "#ff4861" }}
                            />
                        );
                }
            } else if (templateNumber === 4) {
                const { arrQuest, arrAnswer } = templateData;
                let numberQuestRight = 0;
                arrQuest.map((quest, index) => {
                    if (quest["name"][lang].toLowerCase() === arrAnswer[index])
                        numberQuestRight += 1;
                });
                if (Object.keys(arrAnswer).length > 0) {
                    if (numberQuestRight === arrQuest.length) {
                        numberRightAnswer += 1;
                        renderAnswer = (
                            <i
                                className="fal fa-check-square fa-lg"
                                style={{ color: "#4ce1b6" }}
                            />
                        );
                    } else
                        renderAnswer = (
                            <i
                                className="fal fa-times-square fa-lg"
                                style={{ color: "#ff4861" }}
                            />
                        );
                }

                renderAnswer = (
                    <Fragment>
                        {renderAnswer}{" "}
                        <strong style={{ color: "#4ce1b6" }}>
                            {numberQuestRight}
                        </strong>
                        /
                        <strong style={{ color: "#70bbfd" }}>
                            {arrQuest.length}
                        </strong>
                    </Fragment>
                );
            } else {
                const {
                    question,
                    arrCharacter,
                    arrCharacterAnswer,
                } = templateData;
                if (arrCharacterAnswer.length > 0) {
                    let resultText = arrCharacterAnswer
                        .map(item => item.content)
                        .join("");
                    if (resultText === question["name"][lang]) {
                        numberRightAnswer += 1;
                        renderAnswer = (
                            <i
                                className="fal fa-check-square fa-lg"
                                style={{ color: "#4ce1b6" }}
                            />
                        );
                    } else
                        renderAnswer = (
                            <i
                                className="fal fa-times-square fa-lg"
                                style={{ color: "#ff4861" }}
                            />
                        );
                }
            }

            return (
                <tr key={numberQuestion}>
                    <td>{numberQuestion}</td>
                    <td>{renderAnswer}</td>
                    <td>
                        <i
                            className="far fa-eye fa-lg"
                            style={{ color: "#70bbfd" }}
                            onClick={() => {
                                this.openReviewModal(numberQuestion);
                            }}
                        />
                    </td>
                </tr>
            );
        });

        let renderMedal = (
                <i
                    className="fal fa-medal fa-lg fa-2x"
                    style={{ color: "#ff8000" }}
                />
            ),
            renderAllMedal = null,
            countStarPercent = (numberRightAnswer * 100) / numberQuestion;
        if (countStarPercent >= 90)
            renderAllMedal = (
                <Fragment>
                    {renderMedal} {renderMedal} {renderMedal} {renderMedal}{" "}
                    {renderMedal}
                </Fragment>
            );
        else if (countStarPercent >= 80)
            renderAllMedal = (
                <Fragment>
                    {renderMedal} {renderMedal} {renderMedal} {renderMedal}
                </Fragment>
            );
        else if (countStarPercent >= 70)
            renderAllMedal = (
                <Fragment>
                    {renderMedal} {renderMedal} {renderMedal}
                </Fragment>
            );
        else if (countStarPercent >= 60)
            renderAllMedal = (
                <Fragment>
                    {renderMedal} {renderMedal}
                </Fragment>
            );
        else if (countStarPercent >= 50)
            renderAllMedal = <Fragment>{renderMedal}</Fragment>;

        return (
            <div>
                <center>
                    <h4>
                        YOUR RESULT: {numberRightAnswer}/{numberQuestion}
                    </h4>
                    <p>{renderAllMedal}</p>
                    <Col md={12} lg={12} xl={6}>
                        <Card>
                            <CardBody>
                                <TableComponent
                                    responsive
                                    hover
                                    striped
                                    className="table--bordered "
                                >
                                    <thead>
                                        <tr>
                                            <th>Question Number</th>
                                            <th>Result</th>
                                            <th>Preview</th>
                                        </tr>
                                    </thead>
                                    <tbody>{renderResults}</tbody>
                                </TableComponent>
                                <QuestionReviewModal
                                    modalIsOpen={modalIsOpen}
                                    toggle={this.toggleModal}
                                    data={data}
                                    lang={lang}
                                    level={level}
                                    questionData={questionData}
                                    updateExaminationData={
                                        updateExaminationData
                                    }
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </center>
            </div>
        );
    }
}
