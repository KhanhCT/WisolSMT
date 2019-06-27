import React, { Component, Fragment } from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { SHA256 } from "crypto-js";
import { Button } from "reactstrap";
import { callApi, utilHelper, validationHelper } from "../../../../../helpers";
import { STUDENT_PAYMENT_INFO } from "../../../../../constants";
import ModalConfirmCash from "./ModalConfirmCash";

class ModalPaymentRightContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            studentPaymentHistory: [],
            cashType: "VND",
            payMethodIndex: 0,
            modalConfirmCash: false,
        };
    }

    onChooseCashType = value => {
        this.setState({ cashType: value });
    };

    onSelectTab = index => {
        this.setState({ payMethodIndex: index });
    };

    handlePayBtn = () => {
        let idForm = "payment-info";
        // Validate form
        validationHelper.validateForm(idForm);
        let formValues = validationHelper.getFormData(idForm);
        if (formValues) {
            this.setState({ modalConfirmCash: true });
        }
    };

    toggleModalCash = () => {
        this.setState({ modalConfirmCash: !this.state.modalConfirmCash });
    };

    handleConfirmPay = () => {
        const { cashType } = this.state;
        const {
            currDept,
            infoStudent,
            selectedStudyMethod,
            numberHoursPayment,
            listStudentPayment,
        } = this.props;
        // Make signature
        let referenceNumber = new Date().getTime(); // An unique id for each transaction
        let amount = 0;

        if (cashType === "VND") {
            amount =
                parseInt(selectedStudyMethod.price["vnd"]) *
                parseInt(numberHoursPayment) *
                listStudentPayment.length;
        } else {
            amount =
                parseFloat(selectedStudyMethod.price["usd"]) *
                parseInt(numberHoursPayment) *
                listStudentPayment.length;
        }

        // Make request post data to DB
        callApi("for_school/student_payment_history", "POST", null, {
            number_hours: parseInt(numberHoursPayment),
            cash_type: cashType,
            amount: amount,
            reference_number: referenceNumber,
            website_id: STUDENT_PAYMENT_INFO["website_id"],
            list_student_id: listStudentPayment.map(student => student.id),
            study_method_id: selectedStudyMethod["id"],
            student_id: infoStudent["id"],
            department_id: currDept["id"],
        })
            .then(result => {
                let plainText = `${amount}|${cashType}|${
                    currDept["money_receiving_account"]
                }|${referenceNumber}|${
                    STUDENT_PAYMENT_INFO["transaction_type"]
                }|${STUDENT_PAYMENT_INFO["url_return"]}|${
                    STUDENT_PAYMENT_INFO["website_id"]
                }|${STUDENT_PAYMENT_INFO["security_code"]}`;
                let signature = SHA256(plainText)
                    .toString()
                    .toUpperCase();
                let uri = `website_id=${
                    STUDENT_PAYMENT_INFO["website_id"]
                }&amount=${amount}&receiver_account=${
                    currDept["money_receiving_account"]
                }&reference_number=${referenceNumber}&currency=${cashType}&transaction_type=${
                    STUDENT_PAYMENT_INFO["transaction_type"]
                }&url_return=${
                    STUDENT_PAYMENT_INFO["url_return"]
                }&signature=${signature}`;
                window.location.href = `${
                    STUDENT_PAYMENT_INFO["url_redirect"]
                }?${encodeURI(uri)}`;
            })
            .catch(error => {});
    };

    render() {
        const { cashType, modalConfirmCash } = this.state;
        const {
            selectedStudyMethod,
            numberHoursPayment,
            listStudentPayment,
        } = this.props;
        let numberHours = 0;
        let numberStudent = 0;
        if (numberHoursPayment) {
            numberHours = numberHoursPayment;
        }
        if (listStudentPayment) {
            numberStudent = listStudentPayment.length;
        }
        return (
            <Fragment>
                <div
                    className="p-3 rounded"
                    style={{
                        border: "1px dashed #dee2e6",
                    }}
                >
                    <div className="img_check">
                        <div
                            className={`img_check_list rounded ${
                                cashType === "VND" ? "active" : ""
                            }`}
                            onClick={() => this.onChooseCashType("VND")}
                        >
                            <label className="bg-danger rounded-circle mt-2">
                                <div className="center text-warning">VND</div>
                            </label>
                            <span>
                                <i className="fas fa-check-circle" />
                            </span>
                        </div>
                        <div
                            className={`img_check_list rounded ${
                                cashType === "USD" ? "active" : ""
                            }`}
                            onClick={() => this.onChooseCashType("USD")}
                        >
                            <label className="bg-secondary rounded-circle mt-2">
                                <div className="center text-white">USD</div>
                            </label>
                            <span>
                                <i className="fas fa-check-circle" />
                            </span>
                        </div>
                    </div>
                    <table className="w-100">
                        <tbody>
                            <tr>
                                <th colSpan="2">
                                    <h4 className="mb-3">Hóa đơn</h4>
                                </th>
                            </tr>
                            <tr>
                                <th colSpan="2">
                                    <h5 className="mb-3">
                                        {selectedStudyMethod
                                            ? selectedStudyMethod.name
                                            : ""}
                                    </h5>
                                </th>
                            </tr>
                            <tr>
                                <td>Số lượng người</td>
                                <td className="text-right font-weight-bold">
                                    x{numberStudent}
                                </td>
                            </tr>
                            <tr>
                                <td>Số giờ học</td>
                                <td className="text-right font-weight-bold">
                                    {numberHours}h
                                </td>
                            </tr>
                            <tr>
                                <td>Học phí trên giờ</td>
                                <td className="text-right font-weight-bold">
                                    {selectedStudyMethod
                                        ? cashType === "VND"
                                            ? utilHelper.numberWithCommasVND(
                                                  selectedStudyMethod.price[
                                                      "vnd"
                                                  ]
                                              )
                                            : selectedStudyMethod.price["usd"]
                                        : ""}{" "}
                                    {cashType}
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="2">
                                    <hr />
                                </td>
                            </tr>
                            <tr>
                                <td>Thành tiền</td>
                                <td className="text-right font-weight-bold text-danger">
                                    {selectedStudyMethod
                                        ? cashType === "VND"
                                            ? utilHelper.numberWithCommasVND(
                                                  parseInt(
                                                      selectedStudyMethod.price[
                                                          "vnd"
                                                      ]
                                                  ) *
                                                      numberHours *
                                                      numberStudent
                                              )
                                            : parseFloat(
                                                  selectedStudyMethod.price[
                                                      "usd"
                                                  ]
                                              ) *
                                              numberHours *
                                              numberStudent
                                        : ""}{" "}
                                    {cashType}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="text-right mt-3">
                    <Button
                        className="btn btn-warning btn-sm"
                        onClick={this.handlePayBtn}
                    >
                        Thanh toán
                    </Button>
                </div>
                <ModalConfirmCash
                    modalIsOpen={modalConfirmCash}
                    toggle={this.toggleModalCash}
                    handleConfirmAction={this.handleConfirmPay}
                    size="sm"
                />
            </Fragment>
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

const tModalPaymentRightContent = connect(mapStateToProps)(
    translate("common")(ModalPaymentRightContent)
);
export { tModalPaymentRightContent as ModalPaymentRightContent };
