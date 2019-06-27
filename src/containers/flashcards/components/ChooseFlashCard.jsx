import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import { ListCategorySelect } from "./ListCategorySelect";
import { callApi, utilHelper } from "../../../helpers";
import $ from "jquery";
import { FlashcardPicker } from "../../../components/common";
import { translate } from "react-i18next";
import Dock from "react-dock";
import ObjectLodash from "lodash/object";
import ArrayLodash from "lodash/array";

const styles = {
    dockContent: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
    },
};

class ChooseFlashCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCategory: null,
            lstAllChoosedFlashcard: {},
            lstFlashcardOfCategory: {},
            lstFlashcardFilter: {},
            isCheckAll: false,
            positionIdx: 0,
            dimModeIdx: 0,
            isVisible: true,
            fluid: true,
            customAnimation: false,
            slow: false,
            isSize: false,
            size: 0.001,
        };
    }

    componentDidMount = () => {
        const { lstFlashCard } = this.props;
        this.setState({ lstAllChoosedFlashcard: lstFlashCard });
    };

    setSelectedCategory = selectedCategory => {
        this.setState({
            selectedCategory: selectedCategory,
        });
        // Call API get List Flashcard by Category Id
        callApi("flash_cards/list-flash-card-by-category-id", "GET", {
            flashcard_category_id: selectedCategory.id,
        })
            .then(res => {
                let newLstFlashcardOfCategory = {};
                // Convert audio, name, example from string to json
                res.data.data.rows.map(flashcard => {
                    ["audio", "name", "example"].map(item => {
                        if (
                            flashcard[item] &&
                            typeof flashcard[item] === "string"
                        )
                            flashcard[item] = JSON.parse(flashcard[item]);
                    });
                    newLstFlashcardOfCategory[flashcard["id"]] = flashcard;
                });
                this.setState({
                    lstFlashcardOfCategory: newLstFlashcardOfCategory,
                    lstFlashcardFilter: newLstFlashcardOfCategory,
                });
            })
            .catch(error => {
                this.setState({
                    lstFlashcardOfCategory: {},
                    lstFlashcardFilter: {},
                });
                console.log(error);
            });
    };

    handleChooseAllBtn = () => {
        const { lstFlashcardOfCategory, lstAllChoosedFlashcard } = this.state;
        let newLstAllChoosedFlashcard = { ...lstAllChoosedFlashcard };
        Object.keys(lstFlashcardOfCategory).map(flashcardId => {
            if (!newLstAllChoosedFlashcard[flashcardId]) {
                newLstAllChoosedFlashcard[flashcardId] =
                    lstFlashcardOfCategory[flashcardId];
            }
        });
        this.setState({
            lstAllChoosedFlashcard: newLstAllChoosedFlashcard,
        });
        this.props.setLstCategoryIdChoosed(
            ArrayLodash.unionBy(
                ObjectLodash.values(newLstAllChoosedFlashcard),
                "category_id"
            ).map(flashcard => flashcard.category_id)
        );
    };

    handleClearAllBtn = () => {
        const { lstFlashcardOfCategory, lstAllChoosedFlashcard } = this.state;
        let newLstAllChoosedFlashcard = { ...lstAllChoosedFlashcard };
        Object.keys(lstFlashcardOfCategory).map(flashcardId => {
            delete newLstAllChoosedFlashcard[flashcardId];
        });
        this.setState({
            lstAllChoosedFlashcard: newLstAllChoosedFlashcard,
        });
        this.props.setLstCategoryIdChoosed(
            ArrayLodash.unionBy(
                ObjectLodash.values(newLstAllChoosedFlashcard),
                "category_id"
            ).map(flashcard => flashcard.category_id)
        );
    };

    handleRemoveAllChoosedFlashcard = () => {
        this.setState({
            lstAllChoosedFlashcard: {},
        });
        this.props.setLstCategoryIdChoosed(
            ArrayLodash.unionBy(ObjectLodash.values({}), "category_id").map(
                flashcard => flashcard.category_id
            )
        );
    };

    onKeyUpHandler = e => {
        const { lstFlashcardFilter } = this.state;
        let newLstFilter = {};
        Object.keys(lstFlashcardFilter).map(flashcardId => {
            let flashcard = lstFlashcardFilter[flashcardId];
            let convertStr = utilHelper.convertVietnamese(
                flashcard.name.toLowerCase()
            );
            if (convertStr.includes(e.target.value))
                newLstFilter[flashcardId] = flashcard;
        });
        this.setState({
            lstFlashcardOfCategory: newLstFilter,
        });
    };

    handleDeleteFlashcard = e => {
        let flashcardId = parseInt($(e.target).attr("flascard-index"));
        // copy new array flashcard
        let newLstFlashcard = { ...this.state.lstAllChoosedFlashcard };
        delete newLstFlashcard[flashcardId];
        this.setState({ lstAllChoosedFlashcard: newLstFlashcard });
    };

    handleSubmit = () => {
        const { setEdit, setLstFlashcard } = this.props;
        const { lstAllChoosedFlashcard } = this.state;
        setLstFlashcard(lstAllChoosedFlashcard);
        setEdit(false);
    };

    onPickImages(lstFlashcardChoosed) {
        this.setState({
            lstAllChoosedFlashcard: lstFlashcardChoosed,
        });
        this.props.setLstCategoryIdChoosed(
            ArrayLodash.unionBy(
                ObjectLodash.values(lstFlashcardChoosed),
                "category_id"
            ).map(flashcard => flashcard.category_id)
        );
    }

    handlePositionClick = () => {
        this.setState({ isSize: !this.state.isSize }, () => {
            if (!this.state.isSize) {
                this.setState({ size: 0 });
            } else {
                this.setState({ size: 1 });
            }
        });
    };

    handleVisibleChange = isVisible => {
        this.setState({ isVisible });
    };

    handleBack = e => {
        e.preventDefault();
        this.props.resetStateToIntro();
    };

    handleCloseDock = () => {
        this.setState({ size: 0, isSize: false });
    };

    render() {
        const { t, from, to, lstCategoryIdChoosed } = this.props;
        const { lstAllChoosedFlashcard, lstFlashcardOfCategory } = this.state;

        const positions = ["bottom"];
        const dimModes = ["transparent", "none", "opaque"];

        const duration = this.state.slow ? 2000 : 200;
        const dur = duration / 1000;
        const transitions = ["left", "top", "width", "height"]
            .map(p => `${p} ${dur}s cubic-bezier(0, 1.5, 0.5, 1)`)
            .join(",");

        return (
            <div className="fullScreen">
                <div className="sticky-top bg-white box-shadow-1 p-2">
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
                    </div>
                </div>

                <Container className="bg-border heightNav--bottom">
                    <Dock
                        position={positions[this.state.positionIdx]}
                        size={this.state.size}
                        dimMode="none"
                        isVisible={this.state.isVisible}
                        fluid={this.state.fluid}
                        dimStyle={{
                            background: "rgba(0, 0, 100, 0.2)",
                        }}
                        dockStyle={
                            this.state.customAnimation
                                ? { transition: transitions }
                                : null
                        }
                        dockHiddenStyle={
                            this.state.customAnimation
                                ? {
                                      transition: [
                                          transitions,
                                          `opacity 0.01s linear ${dur}s`,
                                      ].join(","),
                                  }
                                : null
                        }
                        duration={duration}
                    >
                        {({ position, isResizing }) => (
                            <div style={[styles.dockContent]}>
                                <ListCategorySelect
                                    setSelectedCategory={
                                        this.setSelectedCategory
                                    }
                                    lstCategoryIdChoosed={lstCategoryIdChoosed}
                                    to={to}
                                    handleCloseDock={this.handleCloseDock}
                                />
                            </div>
                        )}
                    </Dock>
                    <form id="flashcard-choosed-form" className="mb-5 pb-5">
                        <FlashcardPicker
                            from={from}
                            to={to}
                            lstFlashcardCategory={lstFlashcardOfCategory}
                            lstFlashcardChoosed={lstAllChoosedFlashcard}
                            onPick={this.onPickImages.bind(this)}
                            multiple
                        />

                        <Row>
                            <Col>
                                {Object.keys(lstAllChoosedFlashcard).length >
                                0 ? (
                                    <a
                                        onClick={this.handleSubmit}
                                        className="btn-play"
                                        href="javascript:;"
                                    >
                                        <i className="fas fa-play-circle Center" />{" "}
                                        <span className="bagde-noti">
                                            {
                                                Object.keys(
                                                    lstAllChoosedFlashcard
                                                ).length
                                            }
                                        </span>
                                    </a>
                                ) : (
                                    ""
                                )}
                            </Col>
                        </Row>
                    </form>
                </Container>
                <a
                    className="btn-left-bottom box-shadow-1"
                    style={{ bottom: "50px" }}
                    href="javascript:;"
                    onClick={this.handleBack}
                >
                    <i
                        className="fal fa-chevron-left iconCenter"
                        style={{ width: "auto", height: "auto" }}
                    />
                </a>
                <div className="navBottom">
                    <div className="d-flex justify-content-custom">
                        <div>
                            <a
                                className="topIcon"
                                href="javascript:;"
                                onClick={this.handlePositionClick}
                            >
                                <div>
                                    <i className="fal fa-folders Center" />
                                </div>
                                <span>{t("common.topic")}</span>
                                {lstCategoryIdChoosed.length > 0 ? (
                                    <span className="bagde-noti">
                                        {lstCategoryIdChoosed.length}
                                    </span>
                                ) : (
                                    ""
                                )}
                            </a>
                        </div>
                        <div>
                            <a
                                className="topIcon"
                                href="javascript:;"
                                onClick={this.handleChooseAllBtn}
                            >
                                <div>
                                    <i className="fal fa-check-double Center" />
                                </div>
                                <span>{t("common.select_all")}</span>
                            </a>
                        </div>
                        {Object.keys(lstAllChoosedFlashcard).length > 0 ? (
                            <div>
                                <a
                                    className="topIcon"
                                    href="javascript:;"
                                    onClick={this.handleClearAllBtn}
                                >
                                    <div>
                                        <i className="fal fa-minus Center" />
                                    </div>
                                    <span>{t("common.unchecked")}</span>
                                </a>
                            </div>
                        ) : (
                            ""
                        )}

                        {Object.keys(lstAllChoosedFlashcard).length > 0 ? (
                            <div>
                                <a
                                    className="topIcon"
                                    href="javascript:;"
                                    onClick={
                                        this.handleRemoveAllChoosedFlashcard
                                    }
                                >
                                    <div>
                                        <i className="fal fa-sync Center" />
                                    </div>
                                    <span>{t("common.refresh")}</span>
                                </a>
                            </div>
                        ) : (
                            ""
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

const tChooseFlashCard = translate("common")(ChooseFlashCard);
export { tChooseFlashCard as ChooseFlashCard };
