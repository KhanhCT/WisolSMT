import React, { Component } from "react";
import { Button } from "reactstrap";

const urlParam =
    "website_id=90193&amount=15000&receiver_account=0963465816&reference_number=20181206091356&currency=VND&transaction_type=sale&url_return=http://localhost:3000/receiver_response&signature=ED8EC053A7D2EEBC5C4B57CB67ABB3408922CBA5B46D142E04A9129A9A1C3295";

export default class MakeRequest extends Component {
    makeReq = () => {
        window.location.href = `http://alpha1.vtcpay.vn/portalgateway/checkout.html?${encodeURI(
            urlParam
        )}`;
    };
    render() {
        return <Button onClick={this.makeReq}>Make request</Button>;
    }
}
