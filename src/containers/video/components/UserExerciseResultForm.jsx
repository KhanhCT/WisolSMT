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

class UserExerciseResultForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            multipleChoiceData: [],
            fillWordData: [],
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

    calculateUserResult = () => {
        // Calculate user exercise result
        let multipleChoiceResult = 0,
            fillwordResult = 0,
            multipleChoiceLength = 0,
            fillwordLength = 0;
        const { location } = this.props;
        const { userAnswer } = this.state;
        if (location.state.currVideo) {
            let exerciseData = location.state.currVideo.exercise;
            if (exerciseData) {
                // Filter Data
                let multipleChoiceData = exerciseData.filter(
                        item => item.type === "1"
                    )[0].data,
                    fillWordData = exerciseData.filter(
                        item => item.type === "2"
                    )[0].data;
                multipleChoiceLength = multipleChoiceData.length;
                fillwordLength = fillWordData.length;
                // Calculate result
                // Multiple choice
                const { multiple_choice, fillword } = userAnswer;
                multipleChoiceData.map((quest, index) => {
                    if (objectLodash.has(multiple_choice, index)) {
                        if (
                            parseInt(quest.right_answer) ===
                            multiple_choice[index]
                        )
                            multipleChoiceResult += 1;
                    }
                });
                // fillword
                fillWordData.map((quest, index) => {
                    if (objectLodash.has(fillword, index)) {
                        if (quest.right_answer === fillword[index])
                            fillwordResult += 1;
                    }
                });
            }
        }

        return {
            multiple_choice: `${multipleChoiceResult}/${multipleChoiceLength}`,
            fillword: `${fillwordResult}/${fillwordLength}`,
        };
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
                    let renderAnswer = null;
                    if (objectLodash.has(multiple_choice, index)) {
                        renderAnswer = quest.answer.map(
                            (answer, answerIndex) => {
                                let labelCheck = null;
                                if (
                                    answerIndex ===
                                        parseInt(quest.right_answer) ||
                                    answerIndex === multiple_choice[index]
                                )
                                    labelCheck = (
                                        <i
                                            className="fas fa-check"
                                            style={{ color: "green" }}
                                        />
                                    );
                                if (
                                    answerIndex === multiple_choice[index] &&
                                    answerIndex !== parseInt(quest.right_answer)
                                )
                                    labelCheck = (
                                        <i
                                            className="far fa-times-circle"
                                            style={{ color: "red" }}
                                        />
                                    );

                                return (
                                    <FormGroup check>
                                        <Label check>
                                            <Input
                                                checked={[
                                                    parseInt(
                                                        quest.right_answer
                                                    ),
                                                    multiple_choice[index],
                                                ].includes(answerIndex)}
                                                disabled
                                                type="radio"
                                                name={`multiple_choice_${index}`}
                                            />{" "}
                                            {answer} {labelCheck}
                                        </Label>
                                    </FormGroup>
                                );
                            }
                        );
                    } else {
                        renderAnswer = quest.answer.map(
                            (answer, answerIndex) => {
                                return (
                                    <FormGroup check>
                                        <Label check>
                                            <Input
                                                disabled
                                                type="radio"
                                                name={`multiple_choice_${index}`}
                                            />{" "}
                                            {answer}
                                        </Label>
                                    </FormGroup>
                                );
                            }
                        );
                    }

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
                let labelCheck = null;
                if (quest.right_answer === fillword[index])
                    labelCheck = (
                        <i
                            className="fas fa-check"
                            style={{ color: "green" }}
                        />
                    );
                else
                    labelCheck = (
                        <i
                            className="far fa-times-circle"
                            style={{ color: "red" }}
                        />
                    );
                return (
                    <li>
                        <p>
                            <strong>{quest.question}</strong> {labelCheck}
                        </p>
                        <Row>
                            <Col lg={5}>
                                <Label>Your Answer</Label>
                                <Input
                                    disabled
                                    type="text"
                                    placeholder={`answer question ${index}`}
                                    value={fillword[index]}
                                />
                            </Col>
                            <Col lg={5}>
                                <Label>Right Answer</Label>
                                <Input
                                    disabled
                                    type="text"
                                    placeholder={`answer question ${index}`}
                                    value={quest.right_answer}
                                />
                            </Col>
                        </Row>
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

const tUserExerciseResultForm = connect(mapStateToProps)(
    translate(["common", "for_school"])(UserExerciseResultForm)
);
export default tUserExerciseResultForm;
