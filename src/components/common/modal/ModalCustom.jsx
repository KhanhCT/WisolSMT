import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Button, ButtonToolbar, Modal } from "reactstrap";

export class ModalCustom extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    message: PropTypes.string,
    color: PropTypes.string.isRequired,
    colored: PropTypes.bool,
    header: PropTypes.bool,
    btn: PropTypes.string.isRequired,
  };

  render() {
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
        Icon = <span className="lnr lnr-cross-circle modal__title-icon" />;
        break;
      default:
        break;
    }

    return (
      <Modal
        size={this.props.size}
        isOpen={this.props.modalIsOpen}
        toggle={this.props.toggleHeader ? this.props.toggle : null}
        className={`modal-dialog--${this.props.color} ${
          this.props.colored ? "modal-dialog--colored" : ""
        } ${this.props.header ? "modal-dialog--header" : ""}`}
      >
        <div className="modal__header">
          <span
            className="lnr lnr-cross modal__close-btn"
            onClick={this.props.toggle}
          />
          {this.props.header ? "" : Icon}
          <h4 className="bold-text  modal__title">{this.props.title}</h4>
        </div>
        <div className="modal__body">
          {this.props.message ? this.props.message : this.props.children}
        </div>
        <ButtonToolbar className="modal__footer">
          {this.props.cancel ? (
            <Button onClick={this.props.toggle}>Cancel</Button>
          ) : (
            ""
          )}{" "}
          <Button
            outline={this.props.colored}
            color={this.props.color}
            onClick={this.props.btnOkHanlder}
            disabled={this.props.disabled}
          >
            {this.props.btnOk ? this.props.btnOk : "Cancel"}
          </Button>
        </ButtonToolbar>
      </Modal>
    );
  }
}
