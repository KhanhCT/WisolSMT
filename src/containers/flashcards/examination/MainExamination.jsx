import React, { Component } from "react";
import Collection from "lodash/collection";
import Template1 from "./Template1";
import Template2 from "./Template2";
import Template3 from "./Template3";
import Template4 from "./Template4";
import Template5 from "./Template5";
import ConfirmBack from "../exercise_templates/ConfirmBack";
import { Button, Progress } from "reactstrap";
import CustomizeLevel from "./CustomizeLevel";
import ExamResult from "./ExamResult";
import ConfirmFinish from "./ConfirmFinish";
import CountDownClock from "./CountDownClock";
import TimeUpModal from "./TimeUpModal";

export class MainExamination extends Component {
    constructor(props) {
        super(props);
        this.state = {
            numberQuestion: 10,
            numberTemplate: 2,
            randomTemplateNumber: Math.floor(Math.random() * 2) + 1,
            data: null,
            getStateFromProp: false,
            isCustomiseInfo: true,
            numberQuestion: 10,
            numberCurrentQuestion: 1,
            mappingLevel: {
                1: "Easy",
                2: "Normal",
                3: "Hard",
                4: "Super Hard",
            },
            level: {
                value: 1,
                name: "Easy",
                numberSecondPerQuestion: 1 * 60,
            },
            isFinish: false,
            modalIsOpen: false,
            currentClickBack: null,
            examinationData: {},
            loadingNext: false,
            loadingPrev: false,
            modalConfirmFinish: false,
            modalTimeUp: false,
        };
    }

    static getDerivedStateFromProps(props, states) {
        if (!states.getStateFromProp)
            return {
                data: Collection.shuffle(props.data),
                getStateFromProp: true,
            };
        return null;
    }

    changeCustomiseInfo = () => {
        this.setState({
            isCustomiseInfo: !this.state.isCustomiseInfo,
            isFinish: false,
            numberCurrentQuestion: 1,
        });
    };

    onChangeLevel = value => {
        let numberTemplate = 2;
        let numberSecondPerQuestion = 1 * 60;
        switch (value) {
            case 1:
                numberSecondPerQuestion = 1 * 60;
                break;
            case 2:
                numberSecondPerQuestion = 45;
                break;
            case 3:
                numberSecondPerQuestion = 30;
                numberTemplate = 4;
                break;
            case 4:
                numberSecondPerQuestion = 15;
                numberTemplate = 5;
                break;
            default:
                break;
        }
        this.setState({
            level: {
                value: value,
                name: this.state.mappingLevel[value],
                numberSecondPerQuestion: numberSecondPerQuestion,
            },
            numberTemplate: numberTemplate,
        });
    };

    onChangeNumberQuestion = value => {
        this.setState({ numberQuestion: value });
    };

    updateExaminationData = examData => {
        const { numberCurrentQuestion, examinationData } = this.state;
        this.setState({
            examinationData: {
                ...examinationData,
                [numberCurrentQuestion]: examData,
            },
        });
    };

    handleNextBtn = () => {
        const {
            numberCurrentQuestion,
            examinationData,
            numberQuestion,
        } = this.state;
        if (numberCurrentQuestion === numberQuestion)
            this.setState({ modalConfirmFinish: true });
        else {
            let questionData = examinationData[numberCurrentQuestion + 1];
            let templateNumber = null;
            if (questionData) templateNumber = questionData["templateNumber"];
            const newData = [...this.state.data];
            this.setState({
                loadingNext: true,
                data: null,
            });
            setTimeout(() => {
                this.setState({
                    loadingNext: false,
                    randomTemplateNumber: templateNumber
                        ? templateNumber
                        : Math.floor(
                              Math.random() * this.state.numberTemplate
                          ) + 1,
                    data: newData,
                    numberCurrentQuestion: this.state.numberCurrentQuestion + 1,
                });
            }, 300);
        }
    };

    handlePrevBtn = () => {
        const { examinationData, numberCurrentQuestion } = this.state;
        let questionData = examinationData[numberCurrentQuestion - 1];
        const { templateNumber } = questionData;
        const newData = [...this.state.data];
        this.setState({
            loadingPrev: true,
            data: null,
        });
        setTimeout(() => {
            this.setState({
                loadingPrev: false,
                randomTemplateNumber: templateNumber,
                data: newData,
                numberCurrentQuestion: this.state.numberCurrentQuestion - 1,
            });
        }, 200);
    };

    handleBackBtn = () => {
        const { numberCurrentQuestion, numberQuestion } = this.state;
        if (
            numberCurrentQuestion == 1 ||
            numberCurrentQuestion == numberQuestion
        ) {
            this.setState({ getStateFromProp: false });
            this.props.resetStateToLearning();
        } else
            this.setState({ currentClickBack: "learning", modalIsOpen: true });
    };

    handleBackToCustomize = () => {
        const { numberCurrentQuestion, numberQuestion } = this.state;
        if (
            numberCurrentQuestion == 1 ||
            numberCurrentQuestion == numberQuestion
        )
            this.setState({ isCustomiseInfo: true });
        else
            this.setState({ currentClickBack: "customise", modalIsOpen: true });
    };

    toggleModalIsOpen = () => {
        this.setState({ modalIsOpen: !this.state.modalIsOpen });
    };

    handleConfirmAction = () => {
        const { currentClickBack } = this.state;
        switch (currentClickBack) {
            case "learning":
                this.setState({ getStateFromProp: false, modalIsOpen: false });
                this.props.resetStateToLearning();
                break;
            case "customise":
                this.setState({
                    isCustomiseInfo: !this.state.isCustomiseInfo,
                    numberCurrentQuestion: 1,
                    modalIsOpen: false,
                });
                break;
            default:
                break;
        }
    };

    toggleModalConfirmFinish = () => {
        this.setState({ modalConfirmFinish: !this.state.modalConfirmFinish });
    };

    handleConfirmFinishAction = () => {
        this.setState({ isFinish: true, modalConfirmFinish: false });
    };

    onCompleteCountDown = () => {
        this.setState({
            modalTimeUp: true,
            isFinish: true,
            modalIsOpen: false,
            modalConfirmFinish: false,
        });
    };

    // Modal Time Up
    handleConfirmTimeUp = () => {
        this.setState({
            numberCurrentQuestion: 1,
            modalTimeUp: false,
        });
    };

    render() {
        const {
            numberQuestion,
            randomTemplateNumber,
            data,
            numberCurrentQuestion,
            examinationData,
            level,
            isCustomiseInfo,
            isFinish,
            loadingNext,
            loadingPrev,
        } = this.state;
        const { lang } = this.props;
        const { numberSecondPerQuestion } = level;

        let renderRandomTemplate = null;
        if (data)
            switch (randomTemplateNumber) {
                case 1:
                    renderRandomTemplate = (
                        <Template1
                            data={data}
                            lang={lang}
                            level={level}
                            questionData={
                                examinationData[numberCurrentQuestion]
                            }
                            updateExaminationData={this.updateExaminationData}
                        />
                    );
                    break;
                case 2:
                    renderRandomTemplate = (
                        <Template2
                            data={data}
                            lang={lang}
                            level={level}
                            questionData={
                                examinationData[numberCurrentQuestion]
                            }
                            updateExaminationData={this.updateExaminationData}
                        />
                    );
                    break;
                case 3:
                    renderRandomTemplate = (
                        <Template3
                            data={data}
                            lang={lang}
                            level={level}
                            questionData={
                                examinationData[numberCurrentQuestion]
                            }
                            updateExaminationData={this.updateExaminationData}
                        />
                    );
                    break;
                case 4:
                    renderRandomTemplate = (
                        <Template4
                            data={data}
                            lang={lang}
                            level={level}
                            questionData={
                                examinationData[numberCurrentQuestion]
                            }
                            updateExaminationData={this.updateExaminationData}
                        />
                    );
                    break;
                case 5:
                    renderRandomTemplate = (
                        <Template5
                            data={data}
                            lang={lang}
                            level={level}
                            questionData={
                                examinationData[numberCurrentQuestion]
                            }
                            updateExaminationData={this.updateExaminationData}
                        />
                    );
                    break;
                default:
                    break;
            }
        let renderCustomiseLevel = (
            <CustomizeLevel
                numberQuestion={numberQuestion}
                onChangeNumberQuestion={this.onChangeNumberQuestion}
                changeCustomiseInfo={this.changeCustomiseInfo}
                level={this.state.level}
                onChangeLevel={this.onChangeLevel}
            />
        );
        let renderNextBtn = null,
            renderPrevBtn = null,
            renderProgress = null,
            renderData = null,
            renderCountDown = null;

        if (!isCustomiseInfo && !isFinish) {
            renderNextBtn = (
                <Button
                    href="javascript:;"
                    className="btn btn-success mb-0 sm-right5 md-right15"
                    onClick={this.handleNextBtn}
                    disabled={loadingNext}
                    color="success"
                >
                    {loadingNext ? (
                        <i className="fas fa-spinner fa-spin fa-lg" />
                    ) : (
                        ""
                    )}{" "}
                    {loadingNext
                        ? ""
                        : numberCurrentQuestion == numberQuestion
                        ? "Finish"
                        : "Next"}
                </Button>
            );

            renderCountDown = (
                <CountDownClock
                    numberSecondPerQuestion={numberSecondPerQuestion}
                    numberQuestion={numberQuestion}
                    onCompleteCountDown={this.onCompleteCountDown}
                />
            );

            if (numberCurrentQuestion > 1)
                renderPrevBtn = (
                    <Button
                        href="javascript:;"
                        className="btn btn-danger mb-0 sm-right5 md-right15"
                        onClick={this.handlePrevBtn}
                        disabled={loadingPrev}
                        color="danger"
                    >
                        {loadingPrev ? (
                            <i className="fas fa-spinner fa-spin fa-lg" />
                        ) : (
                            ""
                        )}{" "}
                        {loadingPrev ? "" : "Prev"}
                    </Button>
                );
        }

        if (!isCustomiseInfo && !isFinish)
            renderProgress = (
                <Progress
                    style={{
                        position: "fixed",
                        top: "59px",
                        left: "0px",
                        right: "0px",
                        borderRadius: "0px",
                        zIndex: "100",
                    }}
                    value={(numberCurrentQuestion / numberQuestion) * 100}
                >
                    {numberCurrentQuestion}
                </Progress>
            );

        if (isCustomiseInfo) renderData = renderCustomiseLevel;
        else if (!isFinish) renderData = renderRandomTemplate;
        else
            renderData = (
                <ExamResult
                    examData={this.state.examinationData}
                    numberQuestion={numberQuestion}
                    data={data}
                    lang={lang}
                    level={level}
                    updateExaminationData={this.updateExaminationData}
                />
            );

        return (
            <div className="fullScreen">
                <div className="sticky-top bg-white box-shadow-1 p-2 mb-3">
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
                            {renderPrevBtn}
                            {renderNextBtn}
                        </div>
                    </div>
                </div>

                <a
                    className="btn-left-bottom box-shadow-1"
                    href="javascript:;"
                    onClick={this.handleBackBtn}
                >
                    <i
                        className="fal fa-chevron-left iconCenter"
                        style={{ width: "auto", height: "auto" }}
                    />
                </a>
                <div className="bg-white">
                    {renderProgress}
                    {renderData}
                    <center>{renderCountDown}</center>
                    <ConfirmBack
                        modalIsOpen={this.state.modalIsOpen}
                        toggleModalIsOpen={this.toggleModalIsOpen}
                        handleConfirmAction={this.handleConfirmAction}
                        numberCurrentQuestion={numberCurrentQuestion}
                        size="sm"
                    />
                    <ConfirmFinish
                        modalIsOpen={this.state.modalConfirmFinish}
                        toggleModalIsOpen={this.toggleModalConfirmFinish}
                        handleConfirmAction={this.handleConfirmFinishAction}
                        size="sm"
                    />
                    <TimeUpModal
                        btnOkHanlder={this.handleConfirmTimeUp}
                        modalIsOpen={this.state.modalTimeUp}
                        size="sm"
                    />
                </div>
            </div>
        );
    }
}
