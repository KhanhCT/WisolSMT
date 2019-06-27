import React, { Component, Fragment } from "react";
import Template1 from "./Template1";
import Template2 from "./Template2";
import Template3 from "./Template3";
import Template4 from "./Template4";
import Template5 from "./Template5";
import Template6 from "./Template6";
import { Button, Progress } from "reactstrap";
import Collection from "lodash/collection";
import CustomizeLevel from "./CustomizeLevel";
import FinishExerise from "./FinishExerise";
import ConfirmBack from "./ConfirmBack";
import { translate } from "react-i18next";

class MainExercise extends Component {
    constructor(props) {
        super(props);
        this.state = {
            numberQuestion: 10,
            numberTemplate: 3,
            mappingTemplate: {
                1: Template1,
                2: Template2,
                3: Template3,
                4: Template4,
                5: Template5,
            },
            randomTemplateNumber: Math.floor(Math.random() * 3) + 1,
            data: null,
            loading: false,
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
            level: { value: 1, name: "Easy" },
            isFinish: false,
            modalIsOpen: false,
            currentClickBack: null,
        };
    }

    static getDerivedStateFromProps(props, states) {
        if (states) {
            if (!states.getStateFromProp)
                return {
                    data: Collection.shuffle(props.data),
                    getStateFromProp: true,
                };
        }
        return null;
    }

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

    onChangeNumberQuestion = value => {
        this.setState({ numberQuestion: value });
    };

    onChangeLevel = value => {
        let numberTemplate = 3;
        switch (value) {
            case 3:
                numberTemplate = 5;
                break;
            case 4:
                numberTemplate = 6;
                break;
            default:
                break;
        }
        this.setState({
            level: { value: value, name: this.state.mappingLevel[value] },
            numberTemplate: numberTemplate,
        });
    };

    changeCustomiseInfo = () => {
        this.setState({
            isCustomiseInfo: !this.state.isCustomiseInfo,
            isFinish: false,
            numberCurrentQuestion: 1,
        });
    };

    handleNextBtn = () => {
        const { numberCurrentQuestion, numberQuestion } = this.state;
        if (numberCurrentQuestion == numberQuestion) {
            this.setState({
                isFinish: true,
            });
        } else {
            const newData = [...this.state.data];
            this.setState({
                loading: true,
                data: null,
            });
            setTimeout(() => {
                this.setState({
                    loading: false,
                    randomTemplateNumber:
                        Math.floor(Math.random() * this.state.numberTemplate) +
                        1,
                    data: newData,
                    numberCurrentQuestion: this.state.numberCurrentQuestion + 1,
                });
            }, 300);
        }
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

    render() {
        const {
            randomTemplateNumber,
            loading,
            data,
            isCustomiseInfo,
            numberCurrentQuestion,
            numberQuestion,
            level,
            isFinish,
        } = this.state;
        const { lang, t } = this.props;
        let renderRandomTemplate = null;
        if (data)
            switch (randomTemplateNumber) {
                case 1:
                    renderRandomTemplate = (
                        <Template1 data={data} lang={lang} level={level} />
                    );
                    break;
                case 2:
                    renderRandomTemplate = (
                        <Template2 data={data} lang={lang} level={level} />
                    );
                    break;
                case 3:
                    renderRandomTemplate = (
                        <Template3 data={data} lang={lang} level={level} />
                    );
                    break;
                case 4:
                    renderRandomTemplate = (
                        <Template4 data={data} lang={lang} level={level} />
                    );
                    break;
                case 5:
                    renderRandomTemplate = (
                        <Template5 data={data} lang={lang} level={level} />
                    );
                    break;
                case 6:
                    renderRandomTemplate = (
                        <Template6 data={data} lang={lang} level={level} />
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

                        {!isCustomiseInfo ? (
                            <div>
                                <a
                                    href="javascript:;"
                                    className="btn btn-danger mb-0"
                                    onClick={this.handleBackToCustomize}
                                >
                                    {t("common.customize")}
                                </a>
                            </div>
                        ) : (
                            ""
                        )}
                    </div>
                </div>
                {!isCustomiseInfo ? (
                    !isFinish ? (
                        <Button
                            style={{
                                position: "fixed",
                                bottom: "15px",
                                zIndex: "100",
                            }}
                            href="javascript:;"
                            className="btn btn-success mb-0 sm-right5 md-right15"
                            onClick={this.handleNextBtn}
                            disabled={loading}
                            color="success"
                        >
                            {loading ? (
                                <i className="fas fa-spinner fa-spin fa-lg" />
                            ) : (
                                ""
                            )}{" "}
                            {loading
                                ? ""
                                : numberCurrentQuestion == numberQuestion
                                ? "Finish"
                                : "Next"}
                        </Button>
                    ) : (
                        ""
                    )
                ) : (
                    ""
                )}
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
                    {!isCustomiseInfo ? (
                        <Progress
                            style={{
                                position: "fixed",
                                top: "59px",
                                left: "0px",
                                right: "0px",
                                borderRadius: "0px",
                                zIndex: "100",
                            }}
                            value={
                                (numberCurrentQuestion / numberQuestion) * 100
                            }
                        >
                            {numberCurrentQuestion}
                        </Progress>
                    ) : null}

                    {isCustomiseInfo ? (
                        renderCustomiseLevel
                    ) : !isFinish ? (
                        renderRandomTemplate
                    ) : (
                        <FinishExerise />
                    )}
                    <ConfirmBack
                        modalIsOpen={this.state.modalIsOpen}
                        toggleModalIsOpen={this.toggleModalIsOpen}
                        handleConfirmAction={this.handleConfirmAction}
                        numberCurrentQuestion={numberCurrentQuestion}
                    />
                </div>
            </div>
        );
    }
}

const tMainExercise = translate("common")(MainExercise);
export { tMainExercise as MainExercise };
