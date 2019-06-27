import React, { Component } from "react";
import { ButtonToolbar, Button, Modal } from "reactstrap";

export class ConfirmModalCustom extends Component {
    render() {
        const {
            handleConfirmAction,
            toggle,
            modalIsOpen,
            title,
            message,
        } = this.props;
        return (
            <div>
                <Modal
                    isOpen={modalIsOpen}
                    fade={false}
                    toggle={toggle}
                    className="modal-dialog--danger modal-dialog--colored w-350"
                >
                    <div className="modal__header">
                        <span
                            className="lnr lnr-cross modal__close-btn"
                            onClick={toggle}
                        />
                        <span className="lnr lnr-cross-circle modal__title-icon" />
                        <h4 className="bold-text  modal__title">{title}</h4>
                    </div>
                    <div className="modal__body">{message}</div>
                    <ButtonToolbar className="modal__footer">
                        <Button onClick={toggle}>Hủy</Button>{" "}
                        <Button
                            outline
                            color="danger"
                            onClick={handleConfirmAction}
                        >
                            Đồng ý
                        </Button>
                    </ButtonToolbar>
                </Modal>
            </div>
        );
    }
}
