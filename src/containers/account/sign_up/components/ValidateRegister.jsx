import React, { Component, Fragment } from "react";
import { HashLoader } from "react-spinners";
import { callApi, userHelper, errorHelper } from "../../../../helpers";
import { ROUTES, GOOGLE_RE_CAPTCHA_SITE_KEY } from "../../../../constants";
import { connect } from "react-redux";
import ReCAPTCHA from "react-google-recaptcha";
import { Button } from "reactstrap";

class ValidateRegister extends Component {
    constructor(props) {
        super(props);
        this.state = {
            processing: false,
            showCaptcha: true,
            captchaValue: null,
        };
    }

    processRegisterToken = () => {
        const { location, history } = this.props;
        let registerToken = location.search.split("?register_token=")[1];
        // Validate token expire
        if (!userHelper.validateExpireToken(registerToken)) {
            userHelper.showErrorMessage("Register token has expired!");
            history.replace(ROUTES.MAIN_PAGE);
            return false;
        }
        // Call api validate token
        callApi("signup/validate_register", "POST", null, {
            register_token: registerToken,
        })
            .then(res => {
                this.setState({ processing: true, showCaptcha: false });
                userHelper.storeUserToken(res.data.data);
                userHelper.showToastMessage("VERIRY_EMAIL_SUCCESS", "success");
                setTimeout(() => {
                    history.push(ROUTES.MAIN_PAGE);
                }, 2000);
            })
            .catch(error => {
                this.setState({ processing: true, showCaptcha: false });
                let processError = errorHelper.commonProcessError.bind(this);
                processError(error, "VALIDATE_REGISTER");
                if (error.response && error.response.data) {
                    switch (error.response.data.code) {
                        case 409:
                            setTimeout(() => {
                                history.replace(ROUTES.LOGIN);
                            }, 2000);
                            break;
                        case 401:
                            setTimeout(() => {
                                history.replace(ROUTES.SIGNUP);
                            }, 2000);
                            break;
                        case 422:
                            setTimeout(() => {
                                history.replace(ROUTES.SIGNUP);
                            }, 2000);
                            break;
                        case 500:
                            setTimeout(() => {
                                history.replace(ROUTES.SIGNUP);
                            }, 2000);
                            break;
                        default:
                            setTimeout(() => {
                                history.replace(ROUTES.SIGNUP);
                            }, 2000);
                            break;
                    }
                }
            });
    };

    handleSubmitBtn = () => {
        if (!this.state.captchaValue)
            return alert("Please Click Captcha Input!");
        this.processRegisterToken();
    };

    onChange = value => {
        this.setState({ captchaValue: value });
    };

    onExpired = () => {
        this.setState({ captchaValue: null });
    };

    render() {
        const { showCaptcha } = this.state;
        let displayCaptcha = (
            <div
                className="sweet-loading"
                style={{
                    position: "fixed",
                    top: "15%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}
            >
                <ReCAPTCHA
                    ref={captcha => (this.validateRegisterCaptcha = captcha)}
                    sitekey={GOOGLE_RE_CAPTCHA_SITE_KEY}
                    onChange={this.onChange}
                    onExpired={this.onExpired}
                    theme="dark"
                />
                <Button
                    color="primary"
                    onClick={this.handleSubmitBtn}
                    style={{
                        marginTop: "5px",
                    }}
                >
                    <i className="fas fa-check-circle fa-lg" /> Validate Account
                </Button>
            </div>
        );
        let displayProcessing = (
            <div
                className="sweet-loading"
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}
            >
                <HashLoader
                    sizeUnit={"px"}
                    size={100}
                    color={"#007bff"}
                    loading={this.state.processing}
                />
            </div>
        );
        return (
            <Fragment>
                {showCaptcha ? displayCaptcha : displayProcessing}
            </Fragment>
        );
    }
}

const mapStateToProp = () => ({});

ValidateRegister = connect(mapStateToProp)(ValidateRegister);
export default ValidateRegister;
