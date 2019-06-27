import React, { Component } from "react";
import { ModalCustom } from "../../../components/common";
import { translate } from "react-i18next";

class ConfirmBack extends Component {
    render() {
        const {
            modalIsOpen,
            toggleModalIsOpen,
            handleConfirmAction,
            numberCurrentQuestion,
            t,
            size,
        } = this.props;
        return (
            <ModalCustom
                color="warning"
                title={t("exerise.confirm_back.header")}
                btn="Warning"
                message={`${t(
                    "exerise.confirm_back.content1"
                )} ${numberCurrentQuestion}. ${t(
                    "exerise.confirm_back.content2"
                )}`}
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

export default translate("common")(ConfirmBack);
