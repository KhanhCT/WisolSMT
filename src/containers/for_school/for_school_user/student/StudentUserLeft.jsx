import React, { Component } from "react";
import { Col } from "reactstrap";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { utilHelper, userHelper, callApi } from "../../../../helpers";
import ListTeacherOfStudent from "./ListTeacherOfStudent";
import { ModalPayment } from "./payment/ModalPayment";
import { StudentPaymentHistoryModal } from "./StudentPaymentHistoryModal";
import ContractModal from "./ContractModal";

class StudentUserLeft extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listContract: [],
            modalPaymentIsOpen: false,
            modalPaymentHistory: false,
            modalContractIsOpen: false,
        };
    }

    togglePayment = () => {
        this.setState({ modalPaymentIsOpen: !this.state.modalPaymentIsOpen });
    };

    toggleStudentPaymentHistory = () => {
        this.setState({
            modalPaymentHistory: !this.state.modalPaymentHistory,
        });
    };

    toggleContract = () => {
        this.setState({ modalContractIsOpen: !this.state.modalContractIsOpen });
    };

    getListContract = id => {
        // Call API get list contract
        callApi("for_school/contracts", "GET", {
            student_id: id,
        })
            .then(res => {
                this.setState({
                    listContract: res.data.data.rows,
                });
            })
            .catch(error => {
                console.log(error);
            });
    };

    openModalPayment = () => {
        this.setState({ modalPaymentIsOpen: true });
    };

    handleOpenModalHistory = () => {
        this.setState({ modalPaymentHistory: true });
    };

    handleOpenUploadContract = () => {
        const { infoStudent } = this.props;
        this.getListContract(infoStudent.id);
        this.setState({
            modalContractIsOpen: true,
        });
    };

    render() {
        const {
            listContract,
            modalPaymentIsOpen,
            modalPaymentHistory,
            modalContractIsOpen,
        } = this.state;
        const { currDept, infoStudent, t } = this.props;
        let userStorage = userHelper.getUserFromStorage();
        let hourseRegisterExpired = null;
        if (infoStudent) {
            hourseRegisterExpired =
                (parseInt(infoStudent.total_minute_learned) -
                    parseInt(infoStudent.total_minute_registered)) /
                60;
        }
        const studentTranKey = `for_school:STUDENT.leftbar`;
        return (
            <Col sm={3} className="student-user-left p-2">
                <div className="personal-info text-center">
                    <div className="position-relative mb-2">
                        {userStorage ? (
                            <img
                                className="img-fluid rounded-circle"
                                style={{
                                    width: "100px",
                                    height: "100px",
                                }}
                                src={utilHelper.getAvatarUser(
                                    userStorage["avatar"],
                                    userStorage["gender"]
                                )}
                                alt={userStorage["fullname"]}
                            />
                        ) : (
                            ""
                        )}
                        <span
                            className="center rounded-circle"
                            style={{
                                width: "100px",
                                height: "100px",
                                border: "1px solid rgba(0,0,0,0.15)",
                            }}
                        />
                    </div>
                    <h4 className="personal-name font-weight-bold">
                        {userStorage ? userStorage["fullname"] : ""}
                    </h4>
                    <p className="personal-role mt-0">
                        {t(`${studentTranKey}.student`)}
                    </p>
                    <div className="d-flex justify-content-around mt-3">
                        <div>
                            <a href="javascript:;" className="text-dark">
                                <div
                                    className="position-relative"
                                    style={{
                                        height: "50px",
                                    }}
                                >
                                    <div
                                        className="bg-lightgrey center rounded-circle"
                                        style={{
                                            width: "42px",
                                            height: "42px",
                                        }}
                                    >
                                        <i className="fal fa-bell center fa-2x" />
                                    </div>
                                    <span className="bagde-noti bg-red">3</span>
                                </div>
                                <span style={{ fontSize: "12px" }}>
                                    {t(`${studentTranKey}.noty`)}
                                </span>
                            </a>
                        </div>
                        <div className="ml-3 mr-3">
                            <a
                                href="javascript:;"
                                className="text-dark"
                                onClick={this.openModalPayment}
                            >
                                <div
                                    className="position-relative"
                                    style={{
                                        height: "50px",
                                    }}
                                >
                                    <div
                                        className="bg-lightgrey center rounded-circle"
                                        style={{
                                            width: "42px",
                                            height: "42px",
                                        }}
                                    >
                                        <i className="fal fa-hand-holding-usd center fa-2x" />
                                    </div>
                                </div>
                                <span style={{ fontSize: "12px" }}>
                                    {t(`${studentTranKey}.online_payment`)}
                                </span>
                            </a>
                        </div>
                        <div>
                            <a
                                href="javascript:;"
                                className="text-dark"
                                onClick={this.handleOpenModalHistory}
                            >
                                <div
                                    className="position-relative"
                                    style={{
                                        height: "50px",
                                    }}
                                >
                                    <div
                                        className="bg-lightgrey center rounded-circle"
                                        style={{
                                            width: "42px",
                                            height: "42px",
                                        }}
                                    >
                                        <i className="fal fa-list-alt center fa-2x" />
                                    </div>
                                </div>
                                <span style={{ fontSize: "12px" }}>
                                    {t(`${studentTranKey}.payment_history`)}
                                </span>
                            </a>
                        </div>
                        <div>
                            <a
                                href="javascript:;"
                                onClick={this.handleOpenUploadContract}
                                className="text-dark"
                            >
                                <div
                                    className="position-relative"
                                    style={{
                                        height: "50px",
                                    }}
                                >
                                    <div
                                        className="bg-lightgrey center rounded-circle"
                                        style={{
                                            width: "42px",
                                            height: "42px",
                                        }}
                                    >
                                        <i className="fal fa-file-alt center fa-2x" />
                                    </div>
                                </div>
                                <span style={{ fontSize: "12px" }}>
                                    {t(`${studentTranKey}.contract`)}
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="main-info">
                    <p className="font-weight-bold">
                        {t(`${studentTranKey}.base_of_study`)}:
                    </p>
                    <p className="mt-0">{currDept ? currDept["name"] : ""}</p>
                    <p className="font-weight-bold">
                        {t(`${studentTranKey}.address`)}:
                    </p>
                    <p className="mt-0">
                        {currDept ? currDept["address"] : ""}
                    </p>
                    <p className="mb-3">
                        <b> {t(`${studentTranKey}.language_learning`)}: </b>
                        {t(`${studentTranKey}.vietnamese`)}
                    </p>

                    <div className="d-flex mb-3">
                        <div className="mr-auto">
                            <b>{t(`${studentTranKey}.number_hours`)}</b>
                        </div>
                        <div className="position-relative mr-3">
                            <div
                                className="bg-lightgrey center rounded-circle"
                                style={{
                                    width: "28px",
                                    height: "28px",
                                }}
                            >
                                <span className="center">
                                    <b>
                                        {infoStudent
                                            ? Math.round(
                                                  parseInt(
                                                      infoStudent[
                                                          "total_minute_learned"
                                                      ]
                                                  ) / 60
                                              )
                                            : ""}
                                    </b>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex mb-3">
                        <div className="mr-auto">
                            <b>
                                {t(`${studentTranKey}.number_hours_remaining`)}
                            </b>
                        </div>
                        <div className="position-relative mr-3">
                            <div
                                className="bg-lightgrey center rounded-circle"
                                style={{
                                    width: "28px",
                                    height: "28px",
                                }}
                            >
                                <span className="center">
                                    <b>{Math.round(hourseRegisterExpired)}</b>
                                </span>
                            </div>
                        </div>
                    </div>

                    <p className="font-weight-bold mb-3">
                        {t(`${studentTranKey}.this_month`)}
                    </p>

                    <div className="d-flex mb-3">
                        <div className="mr-auto">
                            {t(`${studentTranKey}.number_pay`)}
                        </div>
                        <div className="position-relative mr-3">
                            <div
                                className="bg-lightgrey center rounded-circle"
                                style={{
                                    width: "28px",
                                    height: "28px",
                                }}
                            >
                                <span className="center">
                                    <b>3</b>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
                <ListTeacherOfStudent infoStudent={infoStudent} />
                <ModalPayment
                    modalIsOpen={modalPaymentIsOpen}
                    toggle={this.togglePayment}
                />

                <StudentPaymentHistoryModal
                    modalIsOpen={modalPaymentHistory}
                    toggle={this.toggleStudentPaymentHistory}
                    size="lg"
                />

                <ContractModal
                    listContract={listContract}
                    getListContract={this.getListContract}
                    modalIsOpen={modalContractIsOpen}
                    toggle={this.toggleContract}
                />
            </Col>
        );
    }
}

const mapStateToProps = state => {
    const { forSchoolReducer } = state;
    return {
        currDept: forSchoolReducer.currDept,
        infoStudent: forSchoolReducer.infoStudent,
    };
};

const tStudentUserLeft = connect(mapStateToProps)(
    translate(["common", "for_school"])(StudentUserLeft)
);
export { tStudentUserLeft as StudentUserLeft };
