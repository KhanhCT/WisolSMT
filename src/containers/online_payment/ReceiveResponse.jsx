import React, { Component } from "react";
import StringLodash from "lodash/string";
import { callApi } from "../../helpers";
import { Jumbotron, Button } from "reactstrap";

const MAPPING_STATUS = {
    "0": "Giao dịch ở trạng thái khởi tạo",
    "1": "SUCCESS	Giao dịch thành công",
    "7":
        "REVIEW	Tài khoản thanh toán của khách hàng đã bị trừ tiền nhưng tài khoản của Merchant chưa được cộng tiền. Bộ phận quản trị thanh toán của VTC sẽ duyệt để quyết định giao dịch thành công hay thất bại",
    "-1": "FAIL	Giao dịch thất bại",
    "-9": "FAIL	Khách hàng tự hủy giao dịch",
    "-3": "FAIL	Quản trị VTC hủy giao dịch",
    "-4":
        "FAIL	Thẻ/tài khoản không đủ điều kiện giao dịch (Đang bị khóa, chưa đăng ký thanh toán online …)",
    "-5":
        "FAIL	Số dư tài khoản khách hàng (Ví VTC Pay, tài khoản ngân hàng) không đủ để thực hiện giao dịch",
    "-6": "FAIL	Lỗi giao dịch tại VTC",
    "-7":
        "FAIL	Khách hàng nhập sai thông tin thanh toán ( Sai thông tin tài khoản hoặc sai OTP)",
    "-8": "FAIL	Quá hạn mức giao dịch trong ngày",
    "-22": "FAIL	Số tiền thanh toán đơn hàng quá nhỏ",
    "-24": "FAIL	Đơn vị tiền tệ thanh toán đơn hàng không hợp lệ",
    "-25": "FAIL	Tài khoản VTC Pay nhận tiền của Merchant không tồn tại.",
    "-28":
        "FAIL	Thiếu tham số bắt buộc phải có trong một đơn hàng thanh toán online",
    "-29": "FAIL	Tham số request không hợp lệ",
    "-21":
        "CHECK	Trùng mã giao dịch, Có thể do xử lý duplicate không tốt nên mạng chậm hoặc khách hàng nhấn F5 bị, hoặc cơ chế sinh mã GD của đối tác không tốt nên sinh bị trùng, đối tác cần kiểm tra lại để biết kết quả cuối cùng của giao dịch này",
    "-23": "CHECK	WebsiteID không tồn tại",
    "-99":
        "CHECK	Lỗi chưa rõ nguyên nhân và chưa biết trạng thái giao dịch. Cần kiểm tra để biết giao dịch thành công hay thất bại",
};
export default class ReceiveResponse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paymentHistory: null,
            error: null,
        };
    }

    componentDidMount = () => {
        this.getPaymentHistoryData();
    };

    getPaymentHistoryData = () => {
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
            // Call API get payment history detail
            callApi("payment_history/get-payment-history-detail", "GET", {
                reference_number: objReq["reference_number"],
                signature: objReq["signature"],
            })
                .then(result => {
                    console.log(result);
                    this.setState({ paymentHistory: result.data.data });
                })
                .catch(error => {
                    this.setState({ error: error });
                });
        }
    };

    render() {
        const { paymentHistory, error } = this.state;
        let renderTitle = null,
            renderContent = null;
        if (paymentHistory && paymentHistory.status === 1) {
            renderTitle = "Giao dịch thành công";
            renderContent = `Vui lòng xem danh sách mã COD của bạn trong phần
                lịch sử thanh toán, và sử dụng chúng để kích hoạt
                tài khoản`;
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
