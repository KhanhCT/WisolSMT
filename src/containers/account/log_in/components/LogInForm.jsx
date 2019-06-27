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
import ForgotPassword from "./ForgotPassword";

class LogInForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showPassword: false,
      captchaValue: null,
      numberLoginClick: 0,
      showCaptcha: false,
      forgotModal: false,
    };
  }

  openForgotModal = () => {
    this.setState({ forgotModal: true });
  };

  toggleForgotModal = () => {
    this.setState({ forgotModal: !this.state.forgotModal });
  };

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

  handleLogin = e => {
    e.preventDefault();
    const { captchaValue, numberLoginClick } = this.state;
    let idForm = "login_form";
    validationHelper.validateForm(idForm);
    let formData = validationHelper.getFormData(idForm);
    if (formData) {
      if (!captchaValue && numberLoginClick >= 2)
        return alert("Please Click Captcha Input!");
      // Call API
      callApi("login", "POST", null, formData)
        .then(res => {
          let tokenStorage = {
            message: "Enjoy your token",
            token: res.data.Data,
          };
          userHelper.storeUserToken(tokenStorage);
          const { history } = this.props;
          history.push(ROUTES.MAIN_PAGE);
        })
        .catch(error => {
          if (error.response)
            this.setState({
              numberLoginClick: this.state.numberLoginClick + 1,
            });
          if (this.state.numberLoginClick == 2)
            this.setState({ showCaptcha: true });
          if (this.state.numberLoginClick > 4) {
            this.loginCaptcha.reset();
            this.setState({
              numberLoginClick: 2,
              captchaValue: null,
            });
          }
          let processError = errorHelper.commonProcessError.bind(this);
          processError(error, "LOGIN");
        });
    }
  };

  render() {
    const { showCaptcha, forgotModal } = this.state;
    const { handleSubmit, t } = this.props;

    return (
      <form id="login_form" className="form" onSubmit={handleSubmit}>
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
              <i className="fal fa-user text-secondary" />
            </div>
            <Input
              style={{ borderRadius: "0px 5px 5px 0px" }}
              name="username"
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
              style={{ borderRadius: "5px 0px 0px 5px" }}
            >
              <i className="fal fa-key text-secondary" />
            </div>
            <Input
              style={{ borderRadius: "0px" }}
              name="password"
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
              ref={captcha => (this.loginCaptcha = captcha)}
              sitekey={GOOGLE_RE_CAPTCHA_SITE_KEY}
              onChange={this.onChange}
              onExpired={this.onExpired}
              theme="dark"
            />
          </div>
        ) : null}

        <div className="account__btns mt-3">
          <Link
            className="btn btn-primary account__btn"
            to="/"
            onClick={this.handleLogin}
          >
            {t("common.sign_in")}
          </Link>
          <Link
            className="btn btn-outline-primary account__btn"
            to={ROUTES.SIGNUP}
          >
            {t("common.sign_up")}
          </Link>
        </div>
        <ForgotPassword
          modalIsOpen={forgotModal}
          toggle={this.toggleForgotModal}
        />
      </form>
    );
  }
}

const tMainProfile = translate("common")(LogInForm);
const mapStateToProps = () => ({});

export default connect(mapStateToProps)(tMainProfile);
