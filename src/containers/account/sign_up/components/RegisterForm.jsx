import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import { Input } from "reactstrap";
import {
    callApi,
    userHelper,
    validationHelper,
    errorHelper,
} from "../../../../helpers";
import { ROUTES, GOOGLE_RE_CAPTCHA_SITE_KEY } from "../../../../constants";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import ReCAPTCHA from "react-google-recaptcha";

class RegisterForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showPassword: false,
            captchaValue: null,
            numberSignUpClick: 0,
            showCaptcha: false,
        };
    }
    showPassword = e => {
        e.preventDefault();
        this.setState({
            showPassword: !this.state.showPassword,
        });
    };

    onChange = value => {
        this.setState({ captchaValue: value });
    };

    onExpired = () => {
        this.setState({ captchaValue: null });
    };

    onErrored = () => {
        alert("Verify captcha error, please check network connection");
    };

    handleSignUp = e => {
        e.preventDefault();
        const { captchaValue, numberSignUpClick } = this.state;
        let idForm = "register_form";
        validationHelper.validateForm(idForm);
        let formData = validationHelper.getFormData(idForm);
        if (formData) {
            if (!captchaValue && numberSignUpClick >= 2)
                return alert("Please Click Captcha Input!");
            // Call API
            callApi("account", "POST", null, formData)
                .then(res => {
                    const { history } = this.props;
                    history.push(ROUTES.MAIN_PAGE);
                    userHelper.showToastMessage(
                        "REGISTER_ACCOUNT_SUCCESS",
                        "success"
                    );
                })
                .catch(error => {
                    if (error.response)
                        this.setState({
                            numberSignUpClick: this.state.numberSignUpClick + 1,
                        });
                    if (this.state.numberSignUpClick == 2)
                        this.setState({ showCaptcha: true });
                    if (this.state.numberSignUpClick > 4) {
                        this.signUpCaptcha.reset();
                        this.setState({
                            numberSignUpClick: 2,
                            captchaValue: null,
                        });
                    }
                    let processError = errorHelper.commonProcessError.bind(
                        this
                    );
                    processError(error, "SIGNUP");
                });
        }
    };

    render() {
        const { showCaptcha } = this.state;
        const { handleSubmit, t } = this.props;

        return (
            <form id="register_form" className="form" onSubmit={handleSubmit}>
                <div className="form__form-group">
                    <label className="form__form-group-label">
                        {t("common.fullname")}
                    </label>
                    <div className="form__form-group-field">
                        <div
                            className="form__form-group-icon"
                            style={{
                                padding: "4px 6px 6px 7px",
                                borderRadius: "5px 0px 0px 5px",
                            }}
                        >
                            <i className="fal fa-user text-secondary" />
                        </div>
                        <Input
                            style={{ borderRadius: "0px 5px 5px 0px" }}
                            name="Fullname"
                            type="text"
                            placeholder={t("common.fullname")}
                        />
                    </div>
                </div>
                <div className="form__form-group">
                    <label className="form__form-group-label">UserName</label>
                    <div className="form__form-group-field">
                        <div
                            className="form__form-group-icon"
                            style={{
                                padding: "4px 6px 6px 7px",
                                borderRadius: "5px 0px 0px 5px",
                            }}
                        >
                            <i className="fal fa-at text-secondary" />
                        </div>
                        <Input
                            style={{ borderRadius: "0px 5px 5px 0px" }}
                            name="Username"
                            type="text"
                            placeholder="UserName"
                        />
                    </div>
                </div>
                <div className="form__form-group">
                    <label className="form__form-group-label">
                        {t("common.password")}
                    </label>
                    <div className="form__form-group-field">
                        <div
                            className="form__form-group-icon"
                            style={{
                                padding: "4px 6px 6px 7px",
                                borderRadius: "5px 0px 0px 5px",
                            }}
                        >
                            <i className="fal fa-key text-secondary" />
                        </div>
                        <Input
                            style={{ borderRadius: "0px" }}
                            name="Password"
                            type={this.state.showPassword ? "text" : "password"}
                            placeholder={t("common.password")}
                        />
                        <button
                            style={{ borderRadius: "0px 5px 5px 0px" }}
                            className={`form__form-group-button${
                                this.state.showPassword ? " active" : ""
                            }`}
                            onClick={e => this.showPassword(e)}
                        >
                            <i className="fal fa-eye text-secondary" />
                        </button>
                    </div>
                </div>
                {showCaptcha ? (
                    <div className="form__form-group">
                        <ReCAPTCHA
                            ref={captcha => (this.signUpCaptcha = captcha)}
                            sitekey={GOOGLE_RE_CAPTCHA_SITE_KEY}
                            onChange={this.onChange}
                            onExpired={this.onExpired}
                            theme="dark"
                        />
                    </div>
                ) : null}

                <div className="account__btns">
                    <Link
                        className="btn btn-primary account__btn"
                        to={ROUTES.LANDING_PAGE}
                        onClick={this.handleSignUp}
                    >
                        {t("common.sign_up")}
                    </Link>
                </div>
            </form>
        );
    }
}

const tMainProfile = translate("common")(RegisterForm);
const mapStateToProps = () => ({});

export default connect(mapStateToProps)(tMainProfile);
