import React, { Component } from "react";
import { translate } from "react-i18next";
import { ModalComponent } from "../modal/Modal";

class ConfirmFinishLession extends Component {
    render() {
        const { handleFinishLession, t } = this.props;
        return (
            <ModalComponent
                color="success"
                title={t("confirm_lession_modal.title")}
                btn={t("confirm_lession_modal.confirm_btn_text")}
                message={t("confirm_lession_modal.body")}
                btnOkTitle={t("confirm_lession_modal.btn_Confirm")}
                btnCancelTitle={t("confirm_lession_modal.btn_cancel")}
                btnOnclick={handleFinishLession}
            />
        );
    }
}

let tConfirmFinishLession = translate("common")(ConfirmFinishLession);
export { tConfirmFinishLession as ConfirmFinishLession };
