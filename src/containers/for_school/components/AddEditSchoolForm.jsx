import React, { PureComponent } from "react";
import { Col, Button, ButtonToolbar, Container, Row, Input } from "reactstrap";
import { validationHelper, callApi, utilHelper } from "../../../helpers";
import { connect } from "react-redux";

class AddEditSchoolForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleAddEditSchool = () => {
        let idForm = "add-edit-school";
        // Validate form
        validationHelper.validateForm(idForm);
        let formValues = validationHelper.getFormData(idForm);
        if (formValues) {
            const { toggle, currSchool, getListSchool } = this.props;

            let formData = {};
            for (const key in formValues) {
                formData[key] = formValues[key];
            }

            formData["code"] = utilHelper.convertVietnamese(formData["name"]);

            let p = null;
            if (!currSchool)
                p = callApi("for_school/schools", "POST", null, formData);
            else
                p = callApi(
                    `for_school/schools/${currSchool.id}`,
                    "PUT",
                    null,
                    formData
                );

            // Call API add, edit school
            p.then(res => {
                toggle();
                getListSchool();
            }).catch(error => {
                console.log(error);
            });
        }
    };

    render() {
        const { toggle, currSchool } = this.props;
        return (
            <Container>
                <Row>
                    <Col md={12} lg={12} xl={12}>
                        <form
                            id="add-edit-school"
                            className="form form--horizontal"
                        >
                            <div className="form__form-group">
                                <label
                                    htmlFor="name"
                                    className="form__form-group-label"
                                >
                                    Tên trường
                                </label>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-input-wrap">
                                        <Input
                                            defaultValue={
                                                currSchool
                                                    ? currSchool.name
                                                    : ""
                                            }
                                            name="name"
                                            type="text"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form__form-group">
                                <label
                                    htmlFor="phone"
                                    className="form__form-group-label"
                                >
                                    Số điện thoại
                                </label>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-input-wrap">
                                        <Input
                                            defaultValue={
                                                currSchool
                                                    ? currSchool.phone
                                                    : ""
                                            }
                                            name="phone"
                                            type="text"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form__form-group">
                                <label
                                    htmlFor="address"
                                    className="form__form-group-label"
                                >
                                    Địa chỉ
                                </label>
                                <div className="form__form-group-field">
                                    <Input
                                        defaultValue={
                                            currSchool ? currSchool.address : ""
                                        }
                                        name="address"
                                        type="text"
                                    />
                                </div>
                            </div>

                            <div className="form__form-group">
                                <label className="form__form-group-label">
                                    Mô tả
                                </label>
                                <div className="form__form-group-field">
                                    <Input
                                        type="textarea"
                                        name="description"
                                        defaultValue={
                                            currSchool
                                                ? currSchool.description
                                                : ""
                                        }
                                    />
                                </div>
                            </div>

                            <ButtonToolbar
                                style={{ margin: "10px auto 0 auto" }}
                            >
                                <Button
                                    color="primary"
                                    type="button"
                                    onClick={this.handleAddEditSchool}
                                >
                                    {currSchool ? "Cập nhật" : "Thêm mới"}
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => {
                                        toggle();
                                    }}
                                >
                                    Hủy
                                </Button>
                            </ButtonToolbar>
                        </form>
                    </Col>
                </Row>
            </Container>
        );
    }
}

const mapStateToProp = () => ({});

export default connect(mapStateToProp)(AddEditSchoolForm);
