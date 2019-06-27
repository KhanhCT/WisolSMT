import React, { PureComponent } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

export class ModalComponent extends PureComponent {
    render() {
        const {
            toggle,
            modalIsOpen,
            modalHeader,
            modalFooter,
            size,
            id,
        } = this.props;

        return (
            <Modal id={id} size={size ? size : "lg"} isOpen={modalIsOpen}>
                <ModalHeader>{modalHeader}</ModalHeader>
                <ModalBody>{this.props.children}</ModalBody>
                <ModalFooter>{modalFooter}</ModalFooter>
            </Modal>
        );
    }
}
