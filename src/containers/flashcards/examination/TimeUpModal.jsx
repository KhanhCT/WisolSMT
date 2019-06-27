import React, { PureComponent } from "react";
import { ModalCustom } from "../../../components/common";
import { translate } from "react-i18next";

class TimeUpModal extends PureComponent {
    render() {
        const { t, modalIsOpen, btnOkHanlder, size } = this.props;
        return (
            <ModalCustom
                color="danger"
                title="Time Up!"
                colored
                btn="Danger"
                message="Your timer is up, we will finish it"
                modalIsOpen={modalIsOpen}
                btnOkHanlder={btnOkHanlder}
                size={size}
            />
        );
    }
}

export default translate("common")(TimeUpModal);
