import React, { Component } from "react";
import { Container, Row, Col, Card, Input } from "reactstrap";
import Panel from "../../../../components/Panel";
import { callApi, userHelper, validationHelper } from "../../../../helpers";
import { ROUTES, apiConfigs } from "../../../../constants";
import { ListCountrySelect } from "./ListCountrySelect";
import { translate } from "react-i18next";
import $ from "jquery";

const AvaMale = process.env.PUBLIC_URL + "/img/avatar-male.svg";
const AvaFemale = process.env.PUBLIC_URL + "/img/avatar-female.svg";

class MainProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currUser: null,
            defaultValueGender: null,
            selectedCountry: null,
            file: null,
            imagePreviewUrl: null,
            loadingPreview: false,
        };
    }

    componentDidMount = () => {
        this.getUserById();
    };

    getUserById = () => {
        callApi("users/get-user-by-id", "GET", null)
            .then(res => {
                this.setState({
                    currUser: res.data.data,
                    defaultValueGender: res.data.data.gender,
                    selectedCountry: res.data.data.country,
                });
            })
            .catch(error => {
                console.log(error);
            });
    };

    setSelectedCountry = selectedCountry => {
        this.setState({ selectedCountry: selectedCountry });
    };

    handleImageChange(e) {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        this.setState({ loadingPreview: true, imagePreviewUrl: null });

        reader.onloadend = () => {
            this.setState({
                file: file,
                imagePreviewUrl: reader.result,
                loadingPreview: false,
            });
        };

        reader.readAsDataURL(file);
    }

    handleOnchangeGender = e => {
        this.setState({
            defaultValueGender: e.target.value,
        });
    };

    handleUpdateProfile = () => {
        var validator = $("#update-profile").validate({
            rules: {
                fullname: "required",
                email: {
                    required: true,
                    email: true,
                },
                phonenumber: "required",
            },
            messages: {
                fullname: "Please enter fullname",
                email: {
                    required: "Please enter email",
                    email: "Email invalidate",
                },
                phonenumber: "Please enter phone number",
            },
        });

        if (validator.form()) {
            const { currUser, selectedCountry, file } = this.state;
            let idForm = "update-profile";
            // Validate form
            validationHelper.validateForm(idForm);
            let formValues = validationHelper.getFormData(idForm);
            if (formValues) {
                let formData = new FormData();
                for (const key in formValues) {
                    formData.append(key, formValues[key]);
                }
                if (currUser && currUser.avatar) {
                    formData.append("old_avatar", currUser.avatar);
                }
                if (selectedCountry)
                    formData.append("country_id", selectedCountry.id);
                if (file) formData.append("avatar", file);

                callApi(`users/${currUser.id}`, "PUT", null, formData)
                    .then(res => {
                        userHelper.showToastMessage(
                            "UPDATE_PROFILE_SUCCESS",
                            "success"
                        );
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        }
    };

    handleChangePassword = () => {
        $.validator.addMethod("notEqualTo", function(value, element, param) {
            return this.optional(element) || value !== $(param).val();
        });

        var validator = $("#change-password").validate({
            rules: {
                old_password: "required",
                new_password: {
                    required: true,
                    notEqualTo: "#old_password",
                },
                confirm_password: {
                    required: true,
                    equalTo: "#new_password",
                },
            },
            messages: {
                old_password: {
                    required: "Please enter old password",
                },
                new_password: {
                    required: "Please enter new password",
                    notEqualTo: "New password can not be the same password",
                },
                confirm_password: {
                    required: "Please enter confirm password",
                    equalTo: "Retype password does not match new password",
                },
            },
        });

        if (validator.form()) {
            const { currUser } = this.state;
            let idForm = "change-password";
            validationHelper.validateForm(idForm);
            let formValues = validationHelper.getFormData(idForm);
            let oldPasswordHashSHA = userHelper.hasPasswordSHA(
                formValues.old_password
            );
            let newPasswordHashSHA = userHelper.hasPasswordSHA(
                formValues.new_password
            );
            formValues.old_password = oldPasswordHashSHA;
            formValues.new_password = newPasswordHashSHA;
            callApi(
                `users/change-password/${currUser.id}`,
                "PUT",
                null,
                formValues
            )
                .then(res => {
                    if (res.data.data.statusCode === "00") {
                        userHelper.showToastMessage(
                            "CHANGE_PASSWORD_SUCCESS",
                            "success"
                        );
                        localStorage.clear();
                        const { history } = this.props;
                        history.push(ROUTES.LOGIN);
                    } else {
                        if (res.data.data.statusCode === "99") {
                            userHelper.showToastMessage(
                                "OLD_PASSWORD_INCORRECT",
                                "error"
                            );
                        } else {
                            userHelper.showToastMessage(
                                "CHANGE_PASSWORD_ERROR",
                                "error"
                            );
                        }
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    };

    render() {
        const { t } = this.props;
        const {
            currUser,
            defaultValueGender,
            selectedCountry,
            imagePreviewUrl,
            loadingPreview,
        } = this.state;

        let renderImagePreview = null;
        if (loadingPreview) renderImagePreview = <div className="loader" />;

        if (currUser && !currUser.avatar && currUser.gender === 1) {
            renderImagePreview = <img src={AvaMale} alt="" />;
        } else if (currUser && !currUser.avatar && currUser.gender === 0) {
            renderImagePreview = <img src={AvaFemale} alt="" />;
        } else if (currUser && !currUser.avatar && !currUser.gender) {
            renderImagePreview = <img src={AvaMale} alt="" />;
        } else if (currUser && currUser.avatar) {
            renderImagePreview = (
                <img src={`${apiConfigs.BASE_IMAGE_URL}${currUser.avatar}`} />
            );
        }

        if (imagePreviewUrl) renderImagePreview = <img src={imagePreviewUrl} />;
        return (
            <Container>
                <Row>
                    <Col lg={4} xl={4} lg={4} md={4} xs={12}>
                        <div
                            className="panel box-shadow-1 p-3 mt-3 rounded sticky-top"
                            style={{ top: "80px" }}
                        >
                            <div className="team_post_avatar">
                                <span />
                                {renderImagePreview}
                            </div>
                            <div className="team_post_content">
                                <div className="team_post_title">
                                    <h4>{currUser ? currUser.fullname : ""}</h4>
                                </div>
                                <div className="team_post_subtile">
                                    <h5>
                                        {t("common.you_get")}:{" "}
                                        <i className="fal fa-medal text-warning" />
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col lg={8} xl={8} lg={8} md={8} xs={12}>
                        <div className="panel box-shadow-1 p-3 mt-3 rounded">
                            <h4 className="mb-3" style={{ fontWeight: "500" }}>
                                {t("account.profile.account_setting")}
                            </h4>
                            <form id="update-profile">
                                <Row>
                                    <Col lg={6} xl={6} lg={6} md={6}>
                                        <div className="form-group">
                                            <label htmlFor="fullname">
                                                {t("account.profile.fullname")}
                                            </label>
                                            <input
                                                name="fullname"
                                                type="text"
                                                className="form-control"
                                                id="fullname"
                                                defaultValue={
                                                    currUser
                                                        ? currUser.fullname
                                                        : ""
                                                }
                                            />
                                        </div>
                                    </Col>
                                    <Col lg={6} xl={6} lg={6} md={6}>
                                        <div className="form-group">
                                            <label htmlFor="phonenumber">
                                                {t("account.profile.gender")}
                                            </label>
                                            <Input
                                                type="select"
                                                name="gender"
                                                className="form-control"
                                                value={
                                                    currUser
                                                        ? defaultValueGender
                                                        : "1"
                                                }
                                                onChange={
                                                    this.handleOnchangeGender
                                                }
                                            >
                                                <option value={1}>Men</option>
                                                <option value={0}>Women</option>
                                            </Input>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={6} xl={6} lg={6} md={6}>
                                        <div className="form-group">
                                            <label htmlFor="email">
                                                {t(
                                                    "account.profile.email_address"
                                                )}
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                className="form-control"
                                                id="email"
                                                defaultValue={
                                                    currUser
                                                        ? currUser.email
                                                        : ""
                                                }
                                            />
                                        </div>
                                    </Col>
                                    <Col lg={6} xl={6} lg={6} md={6}>
                                        <div className="form-group">
                                            <label htmlFor="phonenumber">
                                                {t(
                                                    "account.profile.phone_number"
                                                )}
                                            </label>
                                            <input
                                                type="text"
                                                name="phone"
                                                className="form-control"
                                                id="phonenumber"
                                                defaultValue={
                                                    currUser
                                                        ? currUser.phone
                                                        : ""
                                                }
                                            />
                                        </div>
                                    </Col>
                                </Row>

                                <ListCountrySelect
                                    setSelectedCountry={this.setSelectedCountry}
                                    selectedCountry={selectedCountry}
                                />

                                <div className="form-group">
                                    <label htmlFor="avatar">
                                        {t("account.profile.avatar")}
                                    </label>
                                    <div className="previewComponent">
                                        <input
                                            className="fileInput"
                                            type="file"
                                            accept="image/*"
                                            onChange={e =>
                                                this.handleImageChange(e)
                                            }
                                        />
                                        <div
                                            className="img-preview"
                                            style={{
                                                width: "20%",
                                                marginTop: "10px",
                                            }}
                                        >
                                            {renderImagePreview}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={this.handleUpdateProfile}
                                    className="btn btn-primary"
                                >
                                    {t("account.profile.update_profile")}
                                </button>
                            </form>
                            <hr />
                            <h4 className="mb-3" style={{ fontWeight: "500" }}>
                                {t("account.profile.change_password")}
                            </h4>
                            <form id="change-password">
                                <div className="form-group">
                                    <label htmlFor="old_password">
                                        {t("account.profile.old_password")}
                                    </label>
                                    <input
                                        type="password"
                                        name="old_password"
                                        className="form-control"
                                        id="old_password"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="new_password">
                                        {t("account.profile.new_password")}
                                    </label>
                                    <input
                                        type="password"
                                        name="new_password"
                                        className="form-control"
                                        id="new_password"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="confirm_password">
                                        {t("account.profile.confirm_password")}
                                    </label>
                                    <input
                                        type="password"
                                        name="confirm_password"
                                        className="form-control"
                                        id="confirm_password"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={this.handleChangePassword}
                                    className="btn btn-primary"
                                >
                                    {t("account.profile.change_password")}
                                </button>
                            </form>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }
}

const tMainProfile = translate("common")(MainProfile);
export { tMainProfile as MainProfile };
