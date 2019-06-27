import React, { Component } from "react";
import { translate } from "react-i18next";
import { ModalCustom } from "../../../components/common";

class ModalConfirmCod extends Component {
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
                title={t("buy_card.confirm_cod.header")}
                btn="Success"
                message={`${t("buy_card.confirm_cod.content")}`}
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

export default translate("common")(ModalConfirmCod);
