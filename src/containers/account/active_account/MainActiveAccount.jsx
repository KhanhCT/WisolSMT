import React, { Component } from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import {
    validationHelper,
    callApi,
    userHelper,
    errorHelper,
} from "../../../helpers";
import { GOOGLE_RE_CAPTCHA_SITE_KEY, ROUTES } from "../../../constants";
import ReCAPTCHA from "react-google-recaptcha";

class MainActiveAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            captchaValue: null,
            numberActiveClick: 0,
            showCaptcha: false,
        };
    }

    onChange = value => {
        this.setState({ captchaValue: value });
    };

    onExpired = () => {
        this.setState({ captchaValue: null });
    };

    handleSubmitCod = () => {
        const { captchaValue, numberActiveClick } = this.state;
        let idForm = "active-acount";
        validationHelper.validateForm(idForm);
        let formData = validationHelper.getFormData(idForm);
        if (formData) {
            if (!captchaValue && numberActiveClick >= 2)
                return alert("Please Click Captcha Input!");
            // Call API
            callApi("users/verify_account_cod", "POST", null, formData)
                .then(res => {
                    localStorage.clear();
                    userHelper.showToastMessage(
                        "ACTIVE_ACCOUNT_SUCCESS",
                        "success"
                    );
                    setTimeout(() => {
                        const { history } = this.props;
                        history.push(ROUTES.LOGIN);
                    }, 1000);
                })
                .catch(error => {
                    if (error.response)
                        this.setState({
                            numberActiveClick: this.state.numberActiveClick + 1,
                        });
                    if (this.state.numberActiveClick == 2)
                        this.setState({ showCaptcha: true });
                    if (this.state.numberActiveClick > 4) {
                        this.activeAccountCaptcha.reset();
                        this.setState({
                            numberActiveClick: 2,
                            captchaValue: null,
                        });
                    }
                    let processError = errorHelper.commonProcessError.bind(
                        this
                    );
                    processError(error, "ACTIVE_ACCOUNT");
                });
        }
    };

    render() {
        const { showCaptcha } = this.state;
        const { t } = this.props;
        return (
            <div className="d-flex">
                <div className="account__wrapper">
                    <div className="account__card box-shadow-1">
                        <div className="text-center position-relative">
                            <h3 className="bg-lightgrey inline-block pl-2 pr-2 mb-2 sm-fontSize16">
                                Nhập thông tin trên thẻ
                            </h3>
                            <hr style={{ borderStyle: "dashed" }} />
                            Mặt sau của thẻ cào có chứa mã kích hoạt.
                            <div className="guide_icon">
                                <span>?</span>
                                <div className="guide_info">
                                    <img
                                        className="img-thumbnail w-100"
                                        src="images/hd_nap_the.jpg"
                                        style={{
                                            height: "auto",
                                            borderRadius: "16px",
                                        }}
                                    />
                                </div>
                            </div>
                            <br />
                            Bạn hãy cào thẻ và nhập mã kích hoạt vào form bên
                            dưới.
                            <hr style={{ borderStyle: "dashed" }} />
                        </div>
                        <form id="active-acount">
                            <div className="input-group">
                                <input
                                    name="user_cod"
                                    type="text"
                                    className="form-control"
                                    id="user_cod"
                                    placeholder="xxxx-xxxx-xxxx-xxxx"
                                />
                                <div className="input-group-append">
                                    <button
                                        type="button"
                                        className="btn btn-primary mb-0 text-uppercase"
                                        style={{ padding: "7.8px 25px" }}
                                        onClick={this.handleSubmitCod}
                                    >
                                        {t("common.active")}
                                    </button>
                                </div>
                            </div>
                            <label
                                for="user_cod"
                                generated="true"
                                class="error"
                            />
                            {showCaptcha ? (
                                <ReCAPTCHA
                                    ref={captcha =>
                                        (this.activeAccountCaptcha = captcha)
                                    }
                                    sitekey={GOOGLE_RE_CAPTCHA_SITE_KEY}
                                    onChange={this.onChange}
                                    onExpired={this.onExpired}
                                    theme="dark"
                                />
                            ) : (
                                ""
                            )}
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

const tMainActiveAccount = translate("common")(MainActiveAccount);
const mapStateToProp = () => ({});

export default connect(mapStateToProp)(tMainActiveAccount);
