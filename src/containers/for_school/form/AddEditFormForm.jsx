import React, { PureComponent } from "react";
import { Col, Button, ButtonToolbar, Container, Row, Input } from "reactstrap";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import { callApi, validationHelper, errorHelper } from "../../../helpers";

class AddEditFormForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            currForm: null,
            getStateFromProp: false,
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (state) {
            if (!state.getStateFromProp) {
                if (state.currForm != props.currForm) {
                    return {
                        currForm: props.currForm,
                        getStateFromProp: true,
                    };
                }
            }
        }

        return null;
    }

    handleAddEditForm = () => {
        let idForm = "add-edit-form";
        // Validate form
        validationHelper.validateForm(idForm);
        let formValues = validationHelper.getFormData(idForm);
        if (formValues) {
            const {
                toggle,
                getListForm,
                updateForm,
                currForm,
                location,
            } = this.props;

            let formData = {};
            for (const key in formValues) {
                formData[key] = formValues[key];
            }

            delete formData["amount_vnd"];
            delete formData["amount_usd"];

            formData["price"] = {
                usd: formValues["amount_usd"],
                vnd: formValues["amount_vnd"],
            };
            formData["department_id"] = location.state.idDepartment;

            let p = null;
            if (!updateForm)
                p = callApi("for_school/study_methods", "POST", null, formData);
            else if (currForm)
                p = callApi(
                    `for_school/study_methods/${currForm.id}`,
                    "PUT",
                    null,
                    formData
                );

            // Call API add, edit Form
            p.then(res => {
                getListForm();
                toggle();
            }).catch(error => {
                let processError = errorHelper.commonProcessError.bind(this);
                processError(error, "STUDY_METHOD");
            });
        }
    };

    render() {
        const { toggle, updateForm } = this.props;
        const { currForm } = this.state;

        return (
            <Container>
                <Row>
                    <Col md={12} lg={12} xl={12}>
                        <form
                            id="add-edit-form"
                            className="form form--horizontal"
                        >
                            <div className="form__form-group">
                                <label className="form__form-group-label">
                                    Tên hình thức *
                                </label>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-input-wrap">
                                        <Input
                                            name="name"
                                            type="text"
                                            defaultValue={
                                                currForm ? currForm.name : ""
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form__form-group">
                                <label className="form__form-group-label">
                                    Giá tiền (VNĐ) *
                                </label>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-input-wrap">
                                        <Input
                                            name="amount_vnd"
                                            type="text"
                                            defaultValue={
                                                currForm
                                                    ? currForm.price["vnd"]
                                                    : ""
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form__form-group">
                                <label className="form__form-group-label">
                                    Giá tiền (USD) *
                                </label>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-input-wrap">
                                        <Input
                                            name="amount_usd"
                                            type="text"
                                            defaultValue={
                                                currForm
                                                    ? currForm.price["usd"]
                                                    : ""
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form__form-group">
                                <label className="form__form-group-label">
                                    Mô tả
                                </label>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-input-wrap">
                                        <Input
                                            name="description"
                                            type="textarea"
                                            defaultValue={
                                                currForm
                                                    ? currForm.description
                                                    : ""
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <ButtonToolbar className="form__button-toolbar">
                                <Button
                                    color="primary"
                                    type="button"
                                    onClick={this.handleAddEditForm}
                                >
                                    {updateForm ? "Cập nhật" : "Thêm mới"}
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

const tAddEditFormForm = translate("common")(AddEditFormForm);
const mapStateToProps = () => ({});

export default connect(mapStateToProps)(tAddEditFormForm);
