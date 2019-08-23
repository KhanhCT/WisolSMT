import React, { Component } from "react";
import { Input, Button, Label, Alert } from "reactstrap";
import { ModalComponent } from "../../../../components/common";
import { validationHelper, callApi, errorHelper } from "../../../../helpers";
import { connect } from "react-redux";
import { translate } from "react-i18next";

class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            success: false,
        };
    }

    handleSendBtn = () => {
        let formId = "forgot-password";
        validationHelper.validateForm(formId);
        let formData = validationHelper.getFormData(formId);
        if (formData) {
            this.setState({ loading: true });
            // Call api
            callApi("login/forgot-password", "POST", null, formData)
                .then(res => {
                    this.setState({ loading: false, success: true });
                })
                .catch(error => {
                    this.setState({ loading: false, success: false });
                    let processError = errorHelper.commonProcessError.bind(
                        this
                    );
                    processError(error, "RESET_PASSWORD");
                });
        }
    };

    render() {
        const { loading, success } = this.state;
        const { modalIsOpen, toggle, t } = this.props;
        let modalHeader = (
            <div className="text-uppercase">{t("login.remember_text")}</div>
        );
        return (
            <ModalComponent
                modalIsOpen={modalIsOpen}
                size="md"
                modalHeader={modalHeader}
                id="forgot-password-modal"
            >
                <form id="forgot-password" className="text-left">
                    <Label htmlFor="name">Email</Label>
                    <Input
                        type="text"
                        name="email"
                        placeholder="example@gmail.com"
                    />
                    <br />
                    <Button color="primary" onClick={this.handleSendBtn}>
                        {loading ? (
                            <span>
                                <i class="fas fa-cog fa-spin" />{" "}
                                {t("common.sending")}
                            </span>
                        ) : (
                            t("common.send")
                        )}
                    </Button>
                    <Button color="danger" onClick={toggle}>
                        {t("common.cancel")}
                    </Button>
                    {success ? (
                        <Alert color="success">
                            {t("login.get_password_success")}
                        </Alert>
                    ) : (
                        ""
                    )}
                </form>
            </ModalComponent>
        );
    }
}

const tForgotPassword = translate("common")(ForgotPassword);
const mapStateToProps = () => ({});

export default connect(mapStateToProps)(tForgotPassword);
