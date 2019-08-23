import React, { Component } from "react";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ButtonToolbar,
    Button,
} from "reactstrap";
import { translate } from "react-i18next";

class ConfirmModal extends Component {
    render() {
        const {
            t,
            handleConfirmAction,
            toggle,
            modalIsOpen,
            headerContent,
            bodyContent,
        } = this.props;
        return (
            <Modal size="sm" isOpen={modalIsOpen}>
                <ModalHeader>{headerContent}</ModalHeader>
                <ModalBody>{bodyContent}</ModalBody>
                <ModalFooter>
                    <ButtonToolbar className="form__button-toolbar">
                        <Button
                            color="primary"
                            type="button"
                            onClick={handleConfirmAction}
                        >
                            <i className="fas fa-check-circle" />{" "}
                            {t("common.confirm")}
                        </Button>
                        <Button
                            color="danger"
                            type="button"
                            onClick={() => {
                                toggle();
                            }}
                        >
                            <i className="fas fa-ban" /> {t("common.cancel")}
                        </Button>
                    </ButtonToolbar>
                </ModalFooter>
            </Modal>
        );
    }
}

const tConfirmModal = translate("common")(ConfirmModal);
export { tConfirmModal as ConfirmModal };
