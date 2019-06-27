import React, { Component, Fragment } from "react";
import {
    // ErrorModal,
    ConfirmFinishLession,
} from "../../../components/common";
import { callApi, errorHelper, userHelper } from "../../../helpers";
import { errorConstants, ROUTES } from "../../../constants";
import $ from "jquery";
import { translate } from "react-i18next";
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
} from "reactstrap";
import classnames from "classnames";
import { Vocabulary } from "./Vocabulary";
import Conversation from "./Conversation";
import Panel from "../../../components/Panel";
import { ResponsiveContainer } from "recharts";

class LessionDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            lession: null,
            lessionData: null,
            vocabularyData: [],
            extensionData: {
                conversation: [],
                vocabulary: [],
            },
            conversationData: [],
            structureData: {
                conversation: [],
                vocabulary: [],
            },
            activeTab: null,
        };
    }

    toggle = tab => {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab,
            });
        }
    };

    componentDidMount = () => {
        this.getLessionData();
    };

    getVocabularyData = () => {
        const { lessionData } = this.state;
        let vocabData = null;
        if (lessionData) vocabData = lessionData["vocabulary"];
        if (Array.isArray(vocabData))
            if (vocabData.length > 0) {
                this.getFlashCardData(
                    vocabData,
                    errorConstants.GET_VOCABULARY,
                    "vocabulary"
                );
            }
    };

    getExtensionVocabData = () => {
        const { lessionData } = this.state;
        let extensionData = {},
            extensionVocabData = [];
        if (lessionData) {
            extensionData = lessionData["extension"];
            extensionVocabData = extensionData["vocabulary"];
        }

        if (Array.isArray(extensionVocabData))
            if (extensionVocabData.length > 0) {
                this.getFlashCardData(
                    extensionVocabData,
                    errorConstants.GET_EXPANSION,
                    "extension"
                );
            }
    };

    getStructureVocabData = () => {
        const { lessionData } = this.state;
        let structureData = {},
            structureVocabData = [];
        if (lessionData) {
            structureData = lessionData["structure"];
            structureVocabData = structureData["vocabulary"];
        }

        if (Array.isArray(structureVocabData))
            if (structureVocabData.length > 0) {
                this.getFlashCardData(
                    structureVocabData,
                    errorConstants.GET_EXPANSION,
                    "structure"
                );
            }
    };

    getFlashCardData = (lstFlashCardId, errorKeyConstant, type) => {
        callApi("flash_cards", "GET", {
            list_id: JSON.stringify(lstFlashCardId),
        })
            .then(res => {
                switch (type) {
                    case "vocabulary":
                        this.setState({
                            vocabularyData: res.data.data.rows,
                        });
                        break;
                    case "extension":
                        this.setState({
                            extensionData: {
                                ...this.state.extensionData,
                                vocabulary: res.data.data.rows,
                            },
                        });
                        break;
                    case "structure":
                        this.setState({
                            structureData: {
                                ...this.state.structureData,
                                vocabulary: res.data.data.rows,
                            },
                        });
                        break;
                    default:
                        break;
                }
            })
            .catch(error => {
                let errorData = error.response.data;
                let processError = errorHelper.commonProcessError.bind(this);
                processError(errorData, errorKeyConstant);
            });
    };

    getLessionData = () => {
        // Get lession_code from url
        const { match } = this.props;
        let lessionCode = match.params.lession_code;
        // Get user from storage
        let userStorage = userHelper.getUserFromStorage();
        if (lessionCode && userStorage) {
            callApi("lessions/detail", "GET", {
                code: lessionCode,
                user_id: userStorage.user_id,
            })
                .then(res => {
                    let lessionData = res.data.data.data;
                    if (typeof lessionData === "string")
                        lessionData = JSON.parse(lessionData);
                    this.setState({
                        error: null,
                        lession: res.data.data,
                    });
                    if (lessionData) {
                        this.setState(
                            {
                                lessionData: lessionData,
                                conversationData: lessionData["conversation"],
                                structureData: lessionData["structure"],
                            },
                            () => {
                                this.getVocabularyData();
                                this.getExtensionVocabData();
                                this.getStructureVocabData();
                            }
                        );
                    }
                })
                .catch(error => {
                    let errorData = error.response.data;
                    let processError = errorHelper.commonProcessError.bind(
                        this
                    );
                    processError(errorData, errorConstants.LESSION_DETAIL);
                });
        }
    };

    handlePlayAudioLink = e => {
        // Stop forward link
        e.preventDefault();
        let audio = $(e.target).find("audio:hidden")[0];
        if (audio) audio.play();
    };

    handleFinishLession = () => {
        // Get user from storage
        let userStorage = userHelper.getUserFromStorage();
        const { lession } = this.state;
        if (lession && userStorage) {
            callApi("lessions/updateFinishLession", "POST", null, {
                user_id: userStorage.user_id,
                lession_id: lession.id,
            })
                .then(res => {
                    $("#btn-close-confirm-lession-modal").trigger("click");
                    const { match, history } = this.props;
                    let bookCode = match.params.book_code;
                    history.push(`${ROUTES.BOOKS}/${bookCode}`);
                })
                .catch(error => {
                    let errorData = error.response.data;
                    let processError = errorHelper.commonProcessError.bind(
                        this
                    );
                    processError(
                        errorData,
                        errorConstants.UPDATE_FINISH_LESSION
                    );
                });
        }
    };

    handleBack = () => {
        this.props.history.push(
            `/vietnamese-books/${this.props.match.params.book_code}`
        );
    };

    render() {
        const { t } = this.props;
        const {
            error,
            vocabularyData,
            extensionData,
            conversationData,
            structureData,
            lession,
        } = this.state;
        let renderConversation = null,
            renderVocabulary = null,
            renderStructureVocab = null,
            renderStructureConv = null,
            renderExtensionVocab = null,
            renderExtensionConv = null;

        let renderFinishButton = null;
        let currActiveTab = null;
        if (lession)
            if (lession.users.length == 0)
                renderFinishButton = (
                    <ConfirmFinishLession
                        handleFinishLession={this.handleFinishLession}
                    />
                );
        if (conversationData.length > 0) {
            currActiveTab = !currActiveTab ? "1" : currActiveTab;
            renderConversation = (
                <Conversation conversationData={conversationData} />
            );
        }

        if (vocabularyData.length > 0) {
            currActiveTab = !currActiveTab ? "2" : currActiveTab;
            renderVocabulary = <Vocabulary lstFlashCard={vocabularyData} />;
        }

        if (structureData.vocabulary.length > 0) {
            currActiveTab = !currActiveTab ? "3" : currActiveTab;
            renderStructureVocab = (
                <Vocabulary lstFlashCard={structureData.vocabulary} />
            );
        }

        if (structureData.conversation.length > 0) {
            currActiveTab = !currActiveTab ? "3" : currActiveTab;
            renderStructureConv = (
                <Conversation conversationData={structureData.conversation} />
            );
        }

        if (extensionData.vocabulary.length > 0) {
            currActiveTab = !currActiveTab ? "4" : currActiveTab;
            renderExtensionVocab = (
                <Vocabulary lstFlashCard={extensionData.vocabulary} />
            );
        }

        if (extensionData.conversation.length > 0) {
            currActiveTab = !currActiveTab ? "4" : currActiveTab;
            renderExtensionConv = (
                <Conversation conversationData={extensionData.conversation} />
            );
        }

        console.log("active tab", this.state.activeTab, currActiveTab);

        return (
            <Container>
                <Row>
                    {/* <ErrorModal error={error} /> */}
                    <Col md={12} lg={12} xl={12} className="p-0-m">
                        <div className="card__title m-3-m mt-2 mb-2">
                            <h4 className="bold-text">
                                <i
                                    onClick={this.handleBack}
                                    class="fas fa-chevron-left"
                                />{" "}
                                &nbsp;&nbsp;&nbsp;&nbsp;{" "}
                                {lession
                                    ? `${lession.name}: ${lession.description}`
                                    : ""}{" "}
                            </h4>
                        </div>
                        <Card>
                            <CardBody className="p-0-m">
                                <div className="tabs tabs--justify tabs--bordered-bottom">
                                    <div className="tabs__wrap">
                                        <Nav tabs>
                                            {renderConversation ? (
                                                <NavItem>
                                                    <NavLink
                                                        className={classnames({
                                                            active: this.state
                                                                .activeTab
                                                                ? this.state
                                                                      .activeTab ===
                                                                  "1"
                                                                : currActiveTab ==
                                                                  "1",
                                                        })}
                                                        onClick={() => {
                                                            this.toggle("1");
                                                        }}
                                                    >
                                                        {t(
                                                            "lesson_detail.conversation"
                                                        )}
                                                    </NavLink>
                                                </NavItem>
                                            ) : (
                                                ""
                                            )}
                                            {renderVocabulary ? (
                                                <NavItem>
                                                    <NavLink
                                                        className={classnames({
                                                            active: this.state
                                                                .activeTab
                                                                ? this.state
                                                                      .activeTab ===
                                                                  "2"
                                                                : currActiveTab ===
                                                                  "2",
                                                        })}
                                                        onClick={() => {
                                                            this.toggle("2");
                                                        }}
                                                    >
                                                        {t(
                                                            "lesson_detail.vocabulary"
                                                        )}
                                                    </NavLink>
                                                </NavItem>
                                            ) : (
                                                ""
                                            )}
                                            {renderStructureConv ||
                                            renderStructureVocab ? (
                                                <NavItem>
                                                    <NavLink
                                                        className={classnames({
                                                            active: this.state
                                                                .activeTab
                                                                ? this.state
                                                                      .activeTab ===
                                                                  "3"
                                                                : currActiveTab ===
                                                                  "3",
                                                        })}
                                                        onClick={() => {
                                                            this.toggle("3");
                                                        }}
                                                    >
                                                        {t(
                                                            "lesson_detail.structure"
                                                        )}
                                                    </NavLink>
                                                </NavItem>
                                            ) : (
                                                ""
                                            )}
                                            {renderExtensionConv ||
                                            renderExtensionVocab ? (
                                                <NavItem>
                                                    <NavLink
                                                        className={classnames({
                                                            active: this.state
                                                                .activeTab
                                                                ? this.state
                                                                      .activeTab ===
                                                                  "4"
                                                                : currActiveTab ===
                                                                  "4",
                                                        })}
                                                        onClick={() => {
                                                            this.toggle("4");
                                                        }}
                                                    >
                                                        {t(
                                                            "lesson_detail.extension"
                                                        )}
                                                    </NavLink>
                                                </NavItem>
                                            ) : (
                                                ""
                                            )}
                                        </Nav>
                                        <TabContent
                                            activeTab={
                                                this.state.activeTab
                                                    ? this.state.activeTab
                                                    : currActiveTab
                                            }
                                        >
                                            <TabPane
                                                tabId="1"
                                                className="p-0-m"
                                            >
                                                {renderConversation}
                                            </TabPane>
                                            <TabPane tabId="2">
                                                {renderVocabulary}
                                            </TabPane>
                                            <TabPane
                                                tabId="3"
                                                className="p-0-m"
                                            >
                                                {renderStructureConv ? (
                                                    <Panel
                                                        xl={12}
                                                        lg={12}
                                                        md={12}
                                                        title="Conversation"
                                                        className="p-0-m"
                                                    >
                                                        {/* <ResponsiveContainer> */}
                                                        {renderStructureConv}
                                                        {/* </ResponsiveContainer> */}
                                                    </Panel>
                                                ) : (
                                                    ""
                                                )}
                                                {renderStructureVocab ? (
                                                    <Panel
                                                        xl={12}
                                                        lg={12}
                                                        md={12}
                                                        title="Vocabulary"
                                                    >
                                                        {/* <ResponsiveContainer> */}
                                                        {renderStructureVocab}
                                                        {/* </ResponsiveContainer> */}
                                                    </Panel>
                                                ) : (
                                                    ""
                                                )}
                                            </TabPane>
                                            <TabPane tabId="4">
                                                {renderExtensionConv ? (
                                                    <Panel
                                                        xl={12}
                                                        lg={12}
                                                        md={12}
                                                        title="Conversation"
                                                    >
                                                        {/* <ResponsiveContainer> */}
                                                        {renderExtensionConv}
                                                        {/* </ResponsiveContainer> */}
                                                    </Panel>
                                                ) : (
                                                    ""
                                                )}
                                                {renderExtensionVocab ? (
                                                    <Panel
                                                        xl={12}
                                                        lg={12}
                                                        md={12}
                                                        title="Vocabulary"
                                                    >
                                                        {/* <ResponsiveContainer> */}
                                                        {renderExtensionVocab}
                                                        {/* </ResponsiveContainer> */}
                                                    </Panel>
                                                ) : (
                                                    ""
                                                )}
                                            </TabPane>
                                        </TabContent>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col>{renderFinishButton}</Col>
                </Row>
            </Container>
        );
    }
}

let tLessionDetail = translate("common")(LessionDetail);
export { tLessionDetail as LessionDetail };
