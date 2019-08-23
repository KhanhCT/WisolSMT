import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Modal } from "reactstrap";

export class ModalComponent extends PureComponent {
    static propTypes = {
        title: PropTypes.string,
        message: PropTypes.string,
        color: PropTypes.string.isRequired,
        colored: PropTypes.bool,
        header: PropTypes.bool,
        class: PropTypes.string,
        // btn: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { isOpen, toggle, size } = this.props;
        let Icon;

        switch (this.props.color) {
            case "primary":
                Icon = <span className="lnr lnr-pushpin modal__title-icon" />;
                break;
            case "success":
                Icon = <span className="lnr lnr-thumbs-up modal__title-icon" />;
                break;
            case "warning":
                Icon = <span className="lnr lnr-flag modal__title-icon" />;
                break;
            case "danger":
                Icon = (
                    <span className="lnr lnr-cross-circle modal__title-icon" />
                );
                break;
            default:
                break;
        }

        return (
            <div>
                <Modal
                    size={size}
                    isOpen={isOpen}
                    fade={false}
                    // toggle={toggle}
                    className={`modal-dialog--${this.props.color} ${
                        this.props.class
                    } ${this.props.colored ? "modal-dialog--colored" : ""} ${
                        this.props.header ? "modal-dialog--header" : ""
                    }`}
                >
                    <div className="modal__header">
                        <span
                            className="lnr lnr-cross modal__close-btn"
                            onClick={toggle}
                        />
                        {this.props.header ? "" : Icon}
                        <h4 className="bold-text  modal__title">
                            {this.props.title}
                        </h4>
                    </div>
                    <div className="modal__body">{this.props.children}</div>
                </Modal>
            </div>
        );
    }
}
