import React, { PureComponent } from "react";
import {
    Col,
    Button,
    ButtonToolbar,
    Container,
    Row,
    Input,
    FormGroup,
    Label,
} from "reactstrap";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import objectLodash from "lodash/object";

class VideoExerciseForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            multipleChoiceData: [],
            fillWordData: [],
            userAnswer: {
                multiple_choice: {},
                fillword: {},
            },
        };
    }

    componentDidUpdate = (prevProps, prevState) => {
        const { location } = this.props;
        if (location.state.currVideo) {
            let exerciseData = location.state.currVideo.exercise;
            if (exerciseData) {
                // Filter Data
                let multipleChoiceData = exerciseData.filter(
                        item => item.type === "1"
                    ),
                    fillWordData = exerciseData.filter(
                        item => item.type === "2"
                    );
                this.setState({
                    multipleChoiceData: multipleChoiceData[0].data,
                    fillWordData: fillWordData[0].data,
                });
            }
        }
    };

    // Handle user answer multiple choice data
    handleMultipleChoiceQuest = (questIndex, answerIndex) => {
        const { userAnswer } = this.state;
        let newUserMultipleChoice = { ...userAnswer.multiple_choice };
        newUserMultipleChoice[questIndex] = answerIndex;
        this.setState({
            userAnswer: {
                ...userAnswer,
                multiple_choice: newUserMultipleChoice,
            },
        });
    };

    // Handle user fillword data
    handleFillWordQuest = (questIndex, e) => {
        const { userAnswer } = this.state;
        let questAnswer = e.target.value.trim().toLowerCase();
        let newUserFillWordData = { ...userAnswer.fillword };
        newUserFillWordData[questIndex] = questAnswer;
        this.setState({
            userAnswer: {
                ...userAnswer,
                fillword: newUserFillWordData,
            },
        });
    };

    // Hanlde submit user answer
    handleUserSubmit = () => {
        const { userAnswer } = this.state;
        let userAnswerProp = this.props.userAnswer;
        let multipleChoiceState = { ...userAnswer.multiple_choice },
            multipleChoiceProp = { ...userAnswerProp.multiple_choice },
            fillWordState = { ...userAnswer.fillword },
            fillWordProp = { ...userAnswerProp.fillword };
        let newMultipleChoiceState = objectLodash.assignIn(
            {},
            multipleChoiceProp,
            multipleChoiceState
        );
        let newFillWordState = objectLodash.assignIn(
            {},
            fillWordProp,
            fillWordState
        );
        this.setState({
            userAnswer: {
                ...userAnswer,
                multiple_choice: newMultipleChoiceState,
                fillword: newFillWordState,
            },
        });
        this.props.updateUserAnswer({
            multiple_choice: newMultipleChoiceState,
            fillword: newFillWordState,
        });
        this.props.toggle();
    };

    render() {
        const { multipleChoiceData, fillWordData } = this.state;
        const { toggle, t, userAnswer } = this.props;
        const { multiple_choice, fillword } = userAnswer;
        let renderMultipleChoiceData = null,
            renderFillwordData = null;

        if (multipleChoiceData.length > 0) {
            renderMultipleChoiceData = multipleChoiceData.map(
                (quest, index) => {
                    let renderAnswer = quest.answer.map(
                        (answer, answerIndex) => {
                            return (
                                <FormGroup check>
                                    <Label check>
                                        <Input
                                            defaultChecked={
                                                objectLodash.has(
                                                    multiple_choice,
                                                    index
                                                ) &&
                                                multiple_choice[index] ===
                                                    answerIndex
                                            }
                                            type="radio"
                                            name={`multiple_choice_${index}`}
                                            onChange={() => {
                                                this.handleMultipleChoiceQuest(
                                                    index,
                                                    answerIndex
                                                );
                                            }}
                                        />{" "}
                                        {answer}
                                    </Label>
                                </FormGroup>
                            );
                        }
                    );
                    return (
                        <li>
                            <p>
                                <strong>{quest.question}</strong>
                            </p>
                            <Col lg={12}>
                                <FormGroup tag="fieldset">
                                    {renderAnswer}
                                </FormGroup>
                            </Col>
                        </li>
                    );
                }
            );
        }
        if (fillWordData.length > 0) {
            renderFillwordData = fillWordData.map((quest, index) => {
                return (
                    <li>
                        <p>
                            <strong>{quest.question}</strong>
                        </p>
                        <Col lg={12}>
                            <Input
                                type="text"
                                placeholder={`answer question ${index}`}
                                onBlur={e => this.handleFillWordQuest(index, e)}
                                defaultValue={
                                    objectLodash.has(fillword, index)
                                        ? fillword[index]
                                        : ""
                                }
                            />
                        </Col>
                    </li>
                );
            });
        }
        return (
            <Container>
                <Row>
                    <Col md={12} lg={12} xl={12}>
                        {renderMultipleChoiceData ? (
                            <h4>Dạng 1: Chọn đáp án đúng</h4>
                        ) : (
                            ""
                        )}
                        <ol>{renderMultipleChoiceData}</ol>
                    </Col>
                </Row>
                <Row>
                    <Col md={12} lg={12} xl={12}>
                        {renderFillwordData ? (
                            <h4>Dạng 2: Điền đáp án đúng vào chỗ trống</h4>
                        ) : (
                            ""
                        )}
                        <ol>{renderFillwordData}</ol>
                    </Col>
                </Row>
                <Row>
                    <ButtonToolbar style={{ margin: "10px auto 0 auto" }}>
                        <Button
                            color="primary"
                            type="button"
                            onClick={this.handleUserSubmit}
                        >
                            Nộp bài
                        </Button>
                        <Button type="button" onClick={toggle}>
                            {t("common.cancel")}
                        </Button>
                    </ButtonToolbar>
                </Row>
            </Container>
        );
    }
}

const mapStateToProps = state => {
    const { forSchoolReducer } = state;
    return {
        currSchool: forSchoolReducer.currSchool,
    };
};

const tVideoExerciseForm = connect(mapStateToProps)(
    translate(["common", "for_school"])(VideoExerciseForm)
);
export default tVideoExerciseForm;
