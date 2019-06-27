import React, { Component } from "react";
import { ModalCustom } from "../../../components/common";
import { translate } from "react-i18next";

class ConfirmFinish extends Component {
    render() {
        const {
            modalIsOpen,
            toggleModalIsOpen,
            handleConfirmAction,
            t,
            size,
        } = this.props;
        return (
            <ModalCustom
                color="success"
                title={t("examination.confirm_finish.header")}
                btn="Success"
                message={`${t("examination.confirm_finish.content")}`}
                modalIsOpen={modalIsOpen}
                toggle={toggleModalIsOpen}
                btnOkHanlder={handleConfirmAction}
                btnOk={t("common.confirm")}
                size={size}
                cancel={true}
            />
        );
    }
}

export default translate("common")(ConfirmFinish);
