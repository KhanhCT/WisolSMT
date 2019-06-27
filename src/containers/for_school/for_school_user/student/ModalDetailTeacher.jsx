import React, { PureComponent } from "react";
import { Button, Row, Col, Input, Form } from "reactstrap";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import Rating from "react-rating";
import { ModalComponent } from "../../../../components/bases";
import {
    validationHelper,
    callApi,
    errorHelper,
    utilHelper,
} from "../../../../helpers";

class ModalDetailTeacher extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            openRating: false,
            currRating: {
                question: {},
                number_star: 0,
                comment: "",
            },
            getStateFromProp: false,
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (state) {
            if (!state.getStateFromProp) {
                if (props.currRating && state.currRating != props.currRating) {
                    return {
                        currRating: props.currRating,
                        openRating: true,
                        getStateFromProp: true,
                    };
                }
            }
        }

        return null;
    }

    openContentRating = () => {
        this.setState({ openRating: !this.state.openRating });
    };

    checkResult = (index, resultId) => {
        this.setState({
            currRating: {
                ...this.state.currRating,
                question: {
                    ...this.state.currRating.question,
                    [index]: parseInt(resultId),
                },
            },
        });
    };

    handleChangeNumberStar = value => {
        this.setState({
            currRating: {
                ...this.state.currRating,
                number_star: value,
            },
        });
    };

    handleSubmitRating = () => {
        const { currRating } = this.state;
        const { question, number_star } = currRating;
        const { currTeacher, infoStudent, toggle } = this.props;

        let idForm = "form-rating";
        // Validate form
        validationHelper.validateForm(idForm);
        let formValues = validationHelper.getFormData(idForm);
        if (formValues) {
            let formData = {};
            for (const key in formValues) {
                formData[key] = formValues[key];
            }

            if (Object.keys(question).length < 10 || number_star == 0) {
                return alert("Xin vui lòng đánh giá đủ số câu hỏi và số sao");
            }

            if (currTeacher) formData["teacher_id"] = currTeacher["id"];
            if (infoStudent) formData["student_id"] = infoStudent["id"];
            formData["question"] = question;
            formData["number_star"] = number_star;

            callApi("for_school/ratings", "POST", null, formData)
                .then(res => {
                    toggle();
                })
                .catch(error => {
                    let processError = errorHelper.commonProcessError.bind(
                        this
                    );
                    processError(error, "RATING");
                });
        }
    };

    render() {
        const { openRating, currRating } = this.state;
        const { question, number_star, comment } = currRating;
        const {
            modalIsOpen,
            toggle,
            t,
            i18n,
            currTeacher,
            isRating,
        } = this.props;
        const ratingTranKey = `for_school:STUDENT.rating`;
        let renderListQuest = null;
        let currentLang = i18n["language"].split("-")[0];

        let objResult = {
            1: "fa-frown",
            2: "fa-meh",
            3: "fa-smile",
        };

        let listQuest = {
            vi: [
                {
                    title: `${t(`${ratingTranKey}.title_quest_1`)}`,
                    content: `${t(`${ratingTranKey}.content_quest_1`)}`,
                    result: objResult,
                },
                {
                    title: `${t(`${ratingTranKey}.title_quest_2`)}`,
                    content: `${t(`${ratingTranKey}.content_quest_2`)}`,
                    result: objResult,
                },
                {
                    title: `${t(`${ratingTranKey}.title_quest_3`)}`,
                    content: `${t(`${ratingTranKey}.content_quest_3`)}`,
                    result: objResult,
                },
                {
                    title: `${t(`${ratingTranKey}.title_quest_4`)}`,
                    content: `${t(`${ratingTranKey}.content_quest_4`)}`,
                    result: objResult,
                },
                {
                    title: `${t(`${ratingTranKey}.title_quest_5`)}`,
                    content: `${t(`${ratingTranKey}.content_quest_5`)}`,
                    result: objResult,
                },
                {
                    title: `${t(`${ratingTranKey}.title_quest_6`)}`,
                    content: `${t(`${ratingTranKey}.content_quest_6`)}`,
                    result: objResult,
                },
                {
                    title: `${t(`${ratingTranKey}.title_quest_7`)}`,
                    content: `${t(`${ratingTranKey}.content_quest_7`)}`,
                    result: objResult,
                },
                {
                    title: `${t(`${ratingTranKey}.title_quest_8`)}`,
                    content: `${t(`${ratingTranKey}.content_quest_8`)}`,
                    result: objResult,
                },
                {
                    title: `${t(`${ratingTranKey}.title_quest_9`)}`,
                    content: `${t(`${ratingTranKey}.content_quest_9`)}`,
                    result: objResult,
                },
                {
                    title: `${t(`${ratingTranKey}.title_quest_10`)}`,
                    content: `${t(`${ratingTranKey}.content_quest_10`)}`,
                    result: objResult,
                },
            ],
            en: [
                {
                    title: `${t(`${ratingTranKey}.title_quest_1`)}`,
                    content: `${t(`${ratingTranKey}.content_quest_1`)}`,
                    result: objResult,
                },
                {
                    title: `${t(`${ratingTranKey}.title_quest_2`)}`,
                    content: `${t(`${ratingTranKey}.content_quest_2`)}`,
                    result: objResult,
                },
                {
                    title: `${t(`${ratingTranKey}.title_quest_3`)}`,
                    content: `${t(`${ratingTranKey}.content_quest_3`)}`,
                    result: objResult,
                },
                {
                    title: `${t(`${ratingTranKey}.title_quest_4`)}`,
                    content: `${t(`${ratingTranKey}.content_quest_4`)}`,
                    result: objResult,
                },
                {
                    title: `${t(`${ratingTranKey}.title_quest_5`)}`,
                    content: `${t(`${ratingTranKey}.content_quest_5`)}`,
                    result: objResult,
                },
                {
                    title: `${t(`${ratingTranKey}.title_quest_6`)}`,
                    content: `${t(`${ratingTranKey}.content_quest_6`)}`,
                    result: objResult,
                },
                {
                    title: `${t(`${ratingTranKey}.title_quest_7`)}`,
                    content: `${t(`${ratingTranKey}.content_quest_7`)}`,
                    result: objResult,
                },
                {
                    title: `${t(`${ratingTranKey}.title_quest_8`)}`,
                    content: `${t(`${ratingTranKey}.content_quest_8`)}`,
                    result: objResult,
                },
                {
                    title: `${t(`${ratingTranKey}.title_quest_9`)}`,
                    content: `${t(`${ratingTranKey}.content_quest_9`)}`,
                    result: objResult,
                },
                {
                    title: `${t(`${ratingTranKey}.title_quest_10`)}`,
                    content: `${t(`${ratingTranKey}.content_quest_10`)}`,
                    result: objResult,
                },
            ],
        };

        if (listQuest[currentLang].length > 0) {
            renderListQuest = listQuest[currentLang].map((item, index) => {
                let indexActive = question[index];
                return (
                    <Row key={index}>
                        <Col sm={8}>
                            <div className="d-flex mb-3">
                                <div className="position-relative">
                                    <div
                                        style={{
                                            width: "80px",
                                            height: "60px",
                                        }}
                                    >
                                        <h1
                                            className="center text-secondary font-weight-bold"
                                            style={{ fontSize: "50px" }}
                                        >
                                            {index + 1}
                                        </h1>
                                    </div>
                                </div>
                                <div className="text-left">
                                    <b>{item["title"]}</b>
                                    <br />({item["content"]})
                                </div>
                            </div>
                        </Col>
                        <Col sm={4}>
                            <div className="d-flex justify-content-around">
                                {Object.keys(item["result"]).map(resultId => {
                                    return (
                                        <div
                                            key={resultId}
                                            className="position-relative block-emotion"
                                            style={{ height: "60px" }}
                                        >
                                            <a
                                                className={`center bg-transparent border-0 btn-smile ${
                                                    isRating ? "disabled" : ""
                                                }`}
                                                href="javascript:;"
                                                onClick={() => {
                                                    this.checkResult(
                                                        index,
                                                        resultId
                                                    );
                                                }}
                                            >
                                                <i
                                                    className={`fal ${
                                                        item["result"][resultId]
                                                    } fa-2x icon-result ${
                                                        indexActive ===
                                                        parseInt(resultId)
                                                            ? "text-success font-weight-bold"
                                                            : ""
                                                    }`}
                                                />
                                            </a>
                                        </div>
                                    );
                                })}
                            </div>
                        </Col>
                    </Row>
                );
            });
        }

        return (
            <div>
                <ModalComponent
                    color="primary"
                    class="modal-for-school modal-650"
                    title="Chi tiết giáo viên"
                    header
                    toggle={toggle}
                    isOpen={modalIsOpen}
                    size="lg"
                >
                    <div className="personal-info text-center">
                        <p>
                            {currTeacher ? (
                                <img
                                    src={utilHelper.getAvatarUser(
                                        currTeacher.user["avatar"],
                                        currTeacher.user["gender"]
                                    )}
                                    alt={currTeacher.user["fullname"]}
                                    style={{ width: "84px" }}
                                    className="rounded-circle"
                                />
                            ) : (
                                ""
                            )}
                        </p>
                        <h4 className="personal-name font-weight-bold">
                            {currTeacher ? currTeacher.user.fullname : ""}
                        </h4>
                        <p className="personal-role mt-0 mb-3">Teacher</p>
                        <div style={{ maxWidth: "300px", margin: "0 auto" }}>
                            <Button
                                color="secondary"
                                size="sm"
                                className="text-secondary w-100 mb-2"
                            >
                                Xem trang cá nhân
                            </Button>
                            {!isRating ? (
                                <Button
                                    onClick={this.openContentRating}
                                    color="danger"
                                    size="sm"
                                    className="w-100"
                                >
                                    Đánh giá
                                </Button>
                            ) : (
                                ""
                            )}
                        </div>

                        {openRating ? (
                            <div className="rating mt-3">
                                <form id="form-rating">
                                    <h3 className="text-secondary text-uppercase font-weight-bold mb-3">
                                        {isRating ? "Kết quả" : ""} Đánh giá
                                    </h3>
                                    {renderListQuest}
                                    <div className="box-comment p-4 mb-3 mt-2">
                                        <h4>
                                            Bạn sẽ đánh giá giáo viên{" "}
                                            <b>
                                                {currTeacher
                                                    ? currTeacher.user.fullname
                                                    : ""}
                                            </b>{" "}
                                            như thế nào?
                                        </h4>
                                        <Rating
                                            {...this.props}
                                            initialRating={number_star}
                                            emptySymbol={
                                                <i className="fal fa-star" />
                                            }
                                            fullSymbol={
                                                <i
                                                    className="fas fa-star"
                                                    style={{
                                                        color:
                                                            "rgb(255, 180, 0)",
                                                    }}
                                                />
                                            }
                                            onChange={
                                                this.handleChangeNumberStar
                                            }
                                            readonly={isRating}
                                        />
                                        <Input
                                            type="textarea"
                                            name="comment"
                                            rows={3}
                                            defaultValue={comment}
                                            className="mt-3"
                                            placeholder="Nhận xét của bạn về giáo viên này..."
                                            disabled={isRating}
                                        />
                                    </div>
                                    {!isRating ? (
                                        <Button
                                            onClick={this.handleSubmitRating}
                                        >
                                            GỬI
                                        </Button>
                                    ) : (
                                        ""
                                    )}
                                </form>
                            </div>
                        ) : (
                            ""
                        )}
                    </div>
                </ModalComponent>
            </div>
        );
    }
}

const tTrans = translate(["common", "for_school"])(ModalDetailTeacher);
const mapStateToProps = state => {
    const { forSchoolReducer } = state;
    return {
        infoStudent: forSchoolReducer.infoStudent,
    };
};
export default connect(mapStateToProps)(tTrans);
