import React, { Component } from "react";
import { translate } from "react-i18next";
import { ModalCustom } from "../../../components/common";

class ModalConfirmCash extends Component {
    render() {
        const {
            modalIsOpen,
            toggle,
            handleConfirmAction,
            size,
            t,
        } = this.props;
        return (
            <ModalCustom
                color="success"
                title={t("buy_card.confirm_cash.header")}
                btn="Success"
                message={`${t("buy_card.confirm_cash.content")}`}
                modalIsOpen={modalIsOpen}
                toggle={toggle}
                btnOkHanlder={handleConfirmAction}
                btnOk={t("common.confirm")}
                size={size}
                cancel={true}
            />
        );
    }
}

export default translate("common")(ModalConfirmCash);
