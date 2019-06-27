import React, { Component } from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import moment from "moment";
import { ModalCustom } from "../../../../components/common";
import { TableComponent } from "../../../../components/common";
import { utilHelper, callApi } from "../../../../helpers";

class StudentPaymentHistoryModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            studentPaymentHistory: [],
            infoStudent: null,
        };
    }

    static getDerivedStateFromProps(props, state) {
        const { infoStudent } = props;
        if (infoStudent)
            if (state && infoStudent != state.infoStudent) {
                callApi(
                    `for_school/student_payment_history/get-student-payment-history/${
                        infoStudent.id
                    }`,
                    "GET",
                    null
                )
                    .then(result => {
                        return {
                            studentPaymentHistory: result.data.data,
                            infoStudent: infoStudent,
                        };
                    })
                    .catch(error => {
                        return null;
                    });
            }
        return null;
    }

    // componentDidMount = () => {
    //     this.getStudentPaymentHistory();
    // };

    getStudentPaymentHistory = () => {
        const { infoStudent } = this.props;
        callApi(
            `for_school/student_payment_history/get-student-payment-history/${
                infoStudent.id
            }`,
            "GET",
            null
        )
            .then(result => {
                this.setState({ studentPaymentHistory: result.data.data });
            })
            .catch(error => {});
    };

    render() {
        const { studentPaymentHistory } = this.state;
        const { modalIsOpen, toggle, t } = this.props;
        let renderData = null;

        if (studentPaymentHistory.length > 0) {
            renderData = studentPaymentHistory.map((paymentHistory, index) => {
                let renderStatus = null;
                if (paymentHistory && paymentHistory.status === 1)
                    renderStatus = (
                        <span className="text-success">{`${t(
                            "common.success"
                        )}`}</span>
                    );
                else
                    renderStatus = (
                        <span className="text-danger">{`${t(
                            "common.failure"
                        )}`}</span>
                    );
                return (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{paymentHistory.number_hours}h</td>
                        <td>{paymentHistory.cash_type}</td>
                        <td>
                            {paymentHistory.cash_type === "VND"
                                ? utilHelper.numberWithCommasVND(
                                      paymentHistory.amount
                                  )
                                : paymentHistory.amount}{" "}
                            {paymentHistory.cash_type}
                        </td>
                        <td>{paymentHistory.payment_type}</td>
                        <td>{renderStatus}</td>
                        <td>
                            {moment(paymentHistory.updated_at).format(
                                "DD/MM/YYYY HH:mm:ss"
                            )}
                        </td>
                    </tr>
                );
            });
        } else {
            renderData = (
                <tr>
                    <td colSpan="7" className="text-center">
                        {t("common.no_transactions_yet")}
                    </td>
                </tr>
            );
        }

        return (
            <ModalCustom
                color="secondary"
                title="Lịch sử thanh toán"
                btn="Default"
                modalIsOpen={modalIsOpen}
                btnOkHanlder={toggle}
                toggleHeader={true}
                toggle={toggle}
                size="lg"
            >
                <TableComponent
                    responsive
                    hover
                    striped
                    className="table--bordered "
                >
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>{t("common.quantity")}</th>
                            <th>{t("common.currency")}</th>
                            <th>{t("common.amount")}</th>
                            <th>{t("common.bank")}</th>
                            <th>{t("common.status")}</th>
                            <th>{t("common.date")}</th>
                        </tr>
                    </thead>
                    <tbody>{renderData}</tbody>
                </TableComponent>
            </ModalCustom>
        );
    }
}

const mapStateToProps = state => {
    const { forSchoolReducer } = state;
    return {
        infoStudent: forSchoolReducer.infoStudent,
    };
};

const tStudentPaymentHistoryModal = connect(mapStateToProps)(
    translate("common")(StudentPaymentHistoryModal)
);
export { tStudentPaymentHistoryModal as StudentPaymentHistoryModal };
