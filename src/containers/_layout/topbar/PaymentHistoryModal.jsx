import React, { Component } from "react";
import { translate } from "react-i18next";
import { ModalCustom } from "../../../components/common";
import { TableComponent } from "../../../components/common";
import moment from "moment";
import { callApi } from "../../../helpers";
import ListCodModal from "./ListCodModal";

class PaymentHistoryModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lstCod: [],
      modalIsOpen: false,
    };
  }

  getLstCodData = lstCodId => {
    callApi("cods", "GET", { list_id: JSON.stringify(lstCodId) })
      .then(result => {
        this.setState({ lstCod: result.data.data, modalIsOpen: true });
      })
      .catch(error => {});
  };

  showLstCod = index => {
    let paymentHistory = this.props.paymentHistoryData[index];
    this.getLstCodData(paymentHistory.list_cod_id);
  };

  toggle = () => {
    this.setState({ modalIsOpen: !this.state.modalIsOpen });
  };

  render() {
    const { modalIsOpen, toggle, paymentHistoryData, t } = this.props;
    let renderData = paymentHistoryData.map((paymentHistory, index) => {
      let renderStatus = null;
      if (paymentHistory && paymentHistory.status === 1)
        renderStatus = `${t("common.success")}`;
      else renderStatus = `${t("common.failure")}`;
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{paymentHistory.card_type}</td>
          <td>{paymentHistory.number_card}</td>
          <td>{paymentHistory.cash_type}</td>
          <td>{paymentHistory.amount}</td>
          <td>{paymentHistory.payment_type}</td>
          <td>{renderStatus}</td>
          <td>
            {paymentHistory.status === 1 ? (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  this.showLstCod(index);
                }}
              >
                {t("common.show")}
              </button>
            ) : null}
          </td>
          <td>
            {moment(paymentHistory.updated_at).format("DD/MM/YYYY HH:mm:ss")}
          </td>
        </tr>
      );
    });
    return (
      <ModalCustom
        color="secondary"
        title={t("pay.payment_history")}
        btn="Default"
        modalIsOpen={modalIsOpen}
        btnOkHanlder={toggle}
        toggleHeader={true}
        toggle={toggle}
        size="lg"
      >
        <TableComponent responsive hover striped className="table--bordered ">
          <thead>
            <tr>
              <th>#</th>
              <th>{t("common.type")}</th>
              <th>{t("common.quantity")}</th>
              <th>{t("common.currency")}</th>
              <th>{t("common.amount")}</th>
              <th>{t("common.bank")}</th>
              <th>{t("common.status")}</th>
              <th>{t("pay.list_code")}</th>
              <th>{t("common.date")}</th>
            </tr>
          </thead>
          <tbody>{renderData}</tbody>
        </TableComponent>
        <ListCodModal
          modalIsOpen={this.state.modalIsOpen}
          toggle={this.toggle}
          lstCod={this.state.lstCod}
        />
      </ModalCustom>
    );
  }
}

export default translate("common")(PaymentHistoryModal);
