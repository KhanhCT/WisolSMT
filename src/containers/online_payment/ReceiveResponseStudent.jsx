import React, { Component } from "react";
import StringLodash from "lodash/string";
import { callApi } from "../../helpers";
import { Jumbotron } from "reactstrap";

export default class ReceiveResponseStudent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paymentHistory: null,
            error: null,
        };
    }

    componentDidMount = () => {
        this.getStudentPaymentHistoryData();
    };

    getStudentPaymentHistoryData = () => {
        const { location } = this.props;
        const { search } = location;
        let tempSearch = StringLodash.trim(search);
        tempSearch = StringLodash.replace(tempSearch, "?", "");
        if (tempSearch) {
            let arrReq = StringLodash.split(tempSearch, "&");
            let objReq = {};
            arrReq.map(item => {
                // Example item: amount=100000;
                item = StringLodash.trim(item);
                item = StringLodash.split(item, "=");
                objReq[item[0]] = item[1];
            });
            // Call API get student payment history detail
            callApi(
                "for_school/student_payment_history/get-student-payment-history-detail",
                "GET",
                {
                    reference_number: objReq["reference_number"],
                    signature: objReq["signature"],
                }
            )
                .then(result => {
                    this.setState({ paymentHistory: result.data.data });
                })
                .catch(error => {
                    this.setState({ error: error });
                });
        }
    };

    render() {
        const { paymentHistory } = this.state;
        let renderTitle = null,
            renderContent = null;
        if (paymentHistory && paymentHistory.status === 1) {
            renderTitle = "Giao dịch thành công";
            renderContent = `Vui lòng xem danh sách lịch sử thanh toán`;
        } else {
            renderTitle = "Giao dịch thất bại";
        }

        return (
            <center>
                <Jumbotron>
                    <h4 className="display-3">{renderTitle}</h4>
                    <p className="lead">{renderContent}</p>
                </Jumbotron>
            </center>
        );
    }
}
