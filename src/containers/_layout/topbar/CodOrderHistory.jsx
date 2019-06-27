import React, { Component } from "react";
import { translate } from "react-i18next";
import { ModalCustom } from "../../../components/common";
import { TableComponent } from "../../../components/common";
import moment from "moment";

class CodOrderHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { modalIsOpen, toggle, codOrderData, t } = this.props;
        let renderData = codOrderData.map((codOrder, index) => {
            let renderStatus = null;
            switch (codOrder.status) {
                case 0:
                    renderStatus = `${t("pay.order_success")}`;
                    break;
                case 1:
                    renderStatus = `${t("pay.waiting_delivery")}`;
                    break;
                case 2:
                    renderStatus = `${t("pay.successful_delivery")}`;
                    break;
            }
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{codOrder.fullname}</td>
                    <td>{codOrder.phone}</td>
                    <td>{codOrder.address}</td>
                    <td>{codOrder.card_type}</td>
                    <td>{codOrder.number_card}</td>
                    <td>{`${codOrder.amount} ${codOrder.cash_type}`}</td>
                    <td>{renderStatus}</td>
                    <td>
                        {moment(codOrder.created_at).format(
                            "DD/MM/YYYY HH:mm:ss"
                        )}
                    </td>
                </tr>
            );
        });
        return (
            <ModalCustom
                color="secondary"
                title={t("pay.order_history")}
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
                            <th>{t("common.fullname")}</th>
                            <th>{t("common.phone")}</th>
                            <th>{t("common.address")}</th>
                            <th>{t("common.type")}</th>
                            <th>{t("common.quantity")}</th>
                            <th>{t("common.amount")}</th>
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

export default translate("common")(CodOrderHistory);
