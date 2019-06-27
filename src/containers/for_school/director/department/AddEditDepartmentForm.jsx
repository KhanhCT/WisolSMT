import React, { PureComponent } from "react";
import { Col, Button, ButtonToolbar, Container, Row, Input } from "reactstrap";
import { validationHelper, callApi, utilHelper } from "../../../../helpers";
import { translate } from "react-i18next";
import { connect } from "react-redux";

class AddEditDepartmentForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleAddEditDepartment = () => {
        let idForm = "add-edit-department";
        // Validate form
        validationHelper.validateForm(idForm);
        let formValues = validationHelper.getFormData(idForm);
        if (formValues) {
            const {
                toggle,
                doUpdateDepartment,
                currDepartment,
                currSchool,
                getListDepartment,
            } = this.props;

            let formData = {};
            for (const key in formValues) {
                formData[key] = formValues[key];
            }

            formData["code"] = utilHelper.convertVietnamese(formData["name"]);
            formData["school_id"] = currSchool.id;

            let p = null;
            if (!doUpdateDepartment)
                p = callApi("for_school/departments", "POST", null, formData);
            else if (currDepartment)
                p = callApi(
                    `for_school/departments/${currDepartment.id}`,
                    "PUT",
                    null,
                    formData
                );

            // Refresh the department list
            p.then(res => {
                toggle();
                getListDepartment();
            }).catch(error => {
                console.log(error);
            });
        }
    };

    render() {
        const { toggle, currDepartment, doUpdateDepartment, t } = this.props;
        const departmentTranKey = `for_school:DEPARTMENT.common`;
        return (
            <Container>
                <Row>
                    <Col md={12} lg={12} xl={12}>
                        <form
                            id="add-edit-department"
                            className="form form--horizontal"
                        >
                            <div className="form__form-group">
                                <label
                                    htmlFor="name"
                                    className="form__form-group-label"
                                >
                                    {t(`${departmentTranKey}.name_department`)}
                                </label>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-input-wrap">
                                        <Input
                                            defaultValue={
                                                currDepartment
                                                    ? currDepartment.name
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
                                    {t("common.phone")}
                                </label>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-input-wrap">
                                        <Input
                                            defaultValue={
                                                currDepartment
                                                    ? currDepartment.phone
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
                                    htmlFor="money_receiving_account"
                                    className="form__form-group-label"
                                >
                                    Tài khoản hứng tiền
                                </label>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-input-wrap">
                                        <Input
                                            defaultValue={
                                                currDepartment
                                                    ? currDepartment.money_receiving_account
                                                    : ""
                                            }
                                            name="money_receiving_account"
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
                                    {t("common.address")}
                                </label>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-input-wrap">
                                        <Input
                                            defaultValue={
                                                currDepartment
                                                    ? currDepartment.address
                                                    : ""
                                            }
                                            name="address"
                                            type="textarea"
                                        />
                                    </div>
                                </div>
                            </div>

                            <ButtonToolbar
                                style={{ margin: "10px auto 0 auto" }}
                            >
                                <Button
                                    color="primary"
                                    type="button"
                                    onClick={this.handleAddEditDepartment}
                                >
                                    {doUpdateDepartment
                                        ? `${t("common.update")}`
                                        : `${t("common.add_new")}`}
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => {
                                        toggle();
                                    }}
                                >
                                    {t("common.cancel")}
                                </Button>
                            </ButtonToolbar>
                        </form>
                    </Col>
                </Row>
            </Container>
        );
    }
}

const mapStateToProps = state => {
    const { forSchoolReducer } = state;
    return {
        currSchool: forSchoolReducer.currSchool,
    };
};

const tAddEditDepartmentForm = connect(mapStateToProps)(
    translate(["common", "for_school"])(AddEditDepartmentForm)
);
export default tAddEditDepartmentForm;
