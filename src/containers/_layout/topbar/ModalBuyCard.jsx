import React, { Component } from "react";
import { connect } from "react-redux";
import { ModalCustom } from "../../../components/common";
import { Row, Col, Button } from "reactstrap";
import { translate } from "react-i18next";
import {
  utilHelper,
  validationHelper,
  callApi,
  errorHelper,
  userHelper,
} from "../../../helpers";
import ModalBuyCardLeftContent from "./ModalBuyCardLeftContent";
import ModalConfirmCod from "./ModalConfirmCod";
import ModalConfirmCash from "./ModalConfirmCash";
import CodOrderHistory from "./CodOrderHistory";
import PaymentHistoryModal from "./PaymentHistoryModal";
import { SHA256 } from "crypto-js";
import { COMPANY_PAYMENT_INFO, CARDS_INFO } from "../../../constants";

class ModalBuyCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numberCard: 1,
      orderBtnVisible: true,
      cardChoosed: "gold",
      cashType: "VND",
      fullname: "",
      phone: "",
      address: "",
      payMethodIndex: 0,
      btnVisible: true,
      modalConfirmCod: false,
      modalConfirmCash: false,
      modalCodOrderHistory: false,
      modalUserPaymentHistory: false,
      codOrderData: [],
      userPaymentHistory: [],
    };
  }

  componentDidMount = () => {
    // this.getCodOrderHistory();
    // this.getUserPaymentHistory();
  };

  onChooseCard = value => {
    this.setState({ cardChoosed: value });
  };

  onChangeInput = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onChooseCashType = value => {
    this.setState({ cashType: value });
  };

  onSelectTab = index => {
    let btnVisible = false;
    if ([0, 2].includes(index)) btnVisible = true;
    this.setState({ payMethodIndex: index, btnVisible: btnVisible });
  };

  handleCodOrderOnClick = () => {
    let formId = "payment-info";
    validationHelper.validateForm(formId);
    let formData = validationHelper.getFormData(formId);
    if (formData) {
      this.setState({ modalConfirmCod: true });
    }
  };

  handleConfirmCod = () => {
    // Call API update data to DB
    const {
      fullname,
      address,
      phone,
      numberCard,
      cardChoosed,
      cashType,
    } = this.state;
    let amount = CARDS_INFO[cardChoosed]["realPrice"][cashType] * numberCard;
    if (cashType === "VND") amount = utilHelper.numberWithCommasVND(amount);
    callApi("cod_buy_card", "POST", null, {
      fullname: fullname,
      phone: phone,
      address: address,
      card_type: cardChoosed,
      number_card: numberCard,
      cash_type: cashType,
      amount: amount,
    })
      .then(res => {
        this.setState({
          numberCard: 1,
          fullname: "",
          phone: "",
          address: "",
        });
        this.getCodOrderHistory();
        this.toggleModalCod();
        userHelper.showToastMessage("COD_BUY_CARD_ORDER_SUCCESS", "success");
      })
      .catch(error => {
        let processError = errorHelper.commonProcessError.bind(this);
        processError(error, "COD_BUY_CARD");
      });
  };

  handlePayBtn = () => {
    this.setState({ modalConfirmCash: true });
  };

  handleConfirmPay = () => {
    const { numberCard, cardChoosed, cashType } = this.state;
    // Make signature
    let referenceNumber = new Date().getTime(); // An unique id for each transaction
    let amount = CARDS_INFO[cardChoosed]["realPrice"][cashType] * numberCard;
    // Make request post data to DB
    callApi("payment_history", "POST", null, {
      card_type: cardChoosed,
      number_card: numberCard,
      cash_type: cashType,
      amount: amount,
      reference_number: referenceNumber,
      website_id: COMPANY_PAYMENT_INFO["website_id"],
    })
      .then(result => {
        let plainText = `${amount}|${cashType}|${
          COMPANY_PAYMENT_INFO["receiver_account"]
        }|${referenceNumber}|${COMPANY_PAYMENT_INFO["transaction_type"]}|${
          COMPANY_PAYMENT_INFO["url_return"]
        }|${COMPANY_PAYMENT_INFO["website_id"]}|${
          COMPANY_PAYMENT_INFO["security_code"]
        }`;
        let signature = SHA256(plainText)
          .toString()
          .toUpperCase();
        let uri = `website_id=${
          COMPANY_PAYMENT_INFO["website_id"]
        }&amount=${amount}&receiver_account=${
          COMPANY_PAYMENT_INFO["receiver_account"]
        }&reference_number=${referenceNumber}&currency=${cashType}&transaction_type=${
          COMPANY_PAYMENT_INFO["transaction_type"]
        }&url_return=${
          COMPANY_PAYMENT_INFO["url_return"]
        }&signature=${signature}`;
        window.location.href = `${
          COMPANY_PAYMENT_INFO["url_redirect"]
        }?${encodeURI(uri)}`;
      })
      .catch(error => {});
  };

  toggleModalCod = () => {
    this.setState({ modalConfirmCod: !this.state.modalConfirmCod });
  };

  toggleModalCash = () => {
    this.setState({ modalConfirmCash: !this.state.modalConfirmCash });
  };

  toggleCodOrderHistory = () => {
    this.setState({
      modalCodOrderHistory: !this.state.modalCodOrderHistory,
    });
  };

  toggleUserPaymentHistory = () => {
    this.setState({
      modalUserPaymentHistory: !this.state.userPaymentHistory,
    });
  };

  getCodOrderHistory = () => {
    callApi("cod_buy_card", "GET", null)
      .then(result => {
        this.setState({ codOrderData: result.data.data });
      })
      .catch(error => {});
  };

  getUserPaymentHistory = () => {
    callApi("payment_history/get-user-payment-history", "GET", null)
      .then(result => {
        let newLstUserPaymentHistory = result.data.data.map(paymentHistory => {
          if (
            paymentHistory.list_cod_id &&
            typeof paymentHistory.list_cod_id === "string"
          )
            paymentHistory.list_cod_id = JSON.parse(paymentHistory.list_cod_id);
          return paymentHistory;
        });
        this.setState({ userPaymentHistory: newLstUserPaymentHistory });
      })
      .catch(error => {});
  };

  render() {
    const {
      cardChoosed,
      numberCard,
      cashType,
      fullname,
      phone,
      address,
      payMethodIndex,
      btnVisible,
      modalConfirmCod,
      modalConfirmCash,
      modalCodOrderHistory,
      modalUserPaymentHistory,
      codOrderData,
      userPaymentHistory,
    } = this.state;
    const { toggle, modalIsOpen, t } = this.props;
    let renderBtnHistory = null;
    if (payMethodIndex === 0)
      renderBtnHistory = (
        <Button
          className="btn btn-info btn-sm"
          onClick={() => {
            this.setState({
              modalCodOrderHistory: true,
            });
          }}
        >
          {t("pay.order_history")}
        </Button>
      );
    if (payMethodIndex === 2)
      renderBtnHistory = (
        <Button
          className="btn btn-info btn-sm"
          onClick={() => {
            this.setState({
              modalUserPaymentHistory: true,
            });
          }}
        >
          {t("common.history")}
        </Button>
      );
    return (
      <ModalCustom
        color="secondary"
        title={t("common.buy_topup_card")}
        btn="Default"
        modalIsOpen={modalIsOpen}
        btnOkHanlder={toggle}
        toggleHeader={false}
        toggle={toggle}
        size="lg"
      >
        <div className="">
          <div
            className="bg-white box-shadow-1 rounded p-3"
            style={{ textAlign: "justify" }}
          >
            <div className="bg-warning p-2 rounded mb-3 text-center">
              {t("pay.warning_1")}
            </div>
            <Row>
              <Col md="7" sm="12">
                <ModalBuyCardLeftContent
                  onChooseCard={this.onChooseCard}
                  cardChoosed={cardChoosed}
                  onChangeInput={this.onChangeInput}
                  numberCard={numberCard}
                  onSelectTab={this.onSelectTab}
                  payMethodIndex={payMethodIndex}
                  fullname={fullname}
                  phone={phone}
                  address={address}
                />
              </Col>
              <Col md="5" sm="12">
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
                          <h4 className="mb-3">{t("common.bill")}</h4>
                        </th>
                      </tr>
                      <tr>
                        <td>{t("pay.gold_member")}</td>
                        <td className="text-right font-weight-bold">
                          {cardChoosed
                            ? utilHelper.numberWithCommasVND(
                                CARDS_INFO[cardChoosed]["price"][cashType]
                              )
                            : ""}{" "}
                          {cashType}
                        </td>
                      </tr>
                      <tr>
                        <td>{t("common.quantity")}</td>
                        <td className="text-right font-weight-bold">
                          x {numberCard}
                        </td>
                      </tr>
                      <tr>
                        <td>{t("common.promotion")}</td>
                        <td className="text-right font-weight-bold">
                          -{" "}
                          {cardChoosed
                            ? utilHelper.numberWithCommasVND(
                                CARDS_INFO[cardChoosed]["discount"][cashType]
                              )
                            : ""}{" "}
                          {cashType}
                        </td>
                      </tr>
                      <tr>
                        <td>{t("pay.fee")}</td>
                        <td className="text-right font-weight-bold">
                          {t("common.free")}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="2">
                          <hr />
                        </td>
                      </tr>
                      <tr>
                        <td>{t("common.amount")}</td>
                        <td className="text-right font-weight-bold text-danger">
                          {cardChoosed
                            ? utilHelper.numberWithCommasVND(
                                CARDS_INFO[cardChoosed]["realPrice"][cashType] *
                                  numberCard
                              )
                            : ""}{" "}
                          {cashType}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="text-right mt-3">
                  {renderBtnHistory}
                  {btnVisible ? (
                    <Button
                      className="btn btn-warning btn-sm"
                      onClick={
                        payMethodIndex === 0
                          ? this.handleCodOrderOnClick
                          : this.handlePayBtn
                      }
                    >
                      {payMethodIndex === 0 ? t("pay.order") : t("pay.payment")}
                    </Button>
                  ) : (
                    ""
                  )}
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <ModalConfirmCod
          modalIsOpen={modalConfirmCod}
          toggle={this.toggleModalCod}
          handleConfirmAction={this.handleConfirmCod}
          size="sm"
        />
        <ModalConfirmCash
          modalIsOpen={modalConfirmCash}
          toggle={this.toggleModalCash}
          handleConfirmAction={this.handleConfirmPay}
          size="sm"
        />
        <CodOrderHistory
          modalIsOpen={modalCodOrderHistory}
          toggle={this.toggleCodOrderHistory}
          size="lg"
          codOrderData={codOrderData}
        />
        <PaymentHistoryModal
          modalIsOpen={modalUserPaymentHistory}
          toggle={this.toggleUserPaymentHistory}
          size="lg"
          paymentHistoryData={userPaymentHistory}
        />
      </ModalCustom>
    );
  }
}

const tTranslate = translate("common")(ModalBuyCard);
const mapStateToProps = () => ({});

export default connect(mapStateToProps)(tTranslate);
