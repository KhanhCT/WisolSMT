import React, { PureComponent } from "react";
import { Col, Button, ButtonToolbar, Container, Row, Input } from "reactstrap";
import { Route } from "react-router-dom";
// import DeleteProjectModal from "./DeleteProjectModal";
import { validationHelper, callApi, utilHelper } from "../../../helpers";
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
                updateDepartment,
                currDepartment,
                getListDepartment,
            } = this.props;

            let formData = {};
            for (const key in formValues) {
                formData[key] = formValues[key];
            }

            formData["code"] = utilHelper.convertVietnamese(formData["name"]);

            let p = null;
            if (!updateDepartment)
                p = callApi("departments", "POST", null, formData);
            else if (currDepartment)
                p = callApi(
                    `departments/${currDepartment.id}`,
                    "PUT",
                    null,
                    formData
                );

            // Call API add, edit project
            p.then(res => {
                toggle();
                if (!updateDepartment) {
                    getListDepartment();
                } else {
                    this.props.history.goBack();
                }
            }).catch(error => {
                console.log(error);
            });
        }
    };

    render() {
        const { toggle, currDepartment, updateDepartment, t } = this.props;
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
                                    {t(`${departmentTranKey}.phone`)}
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
                                    htmlFor="address"
                                    className="form__form-group-label"
                                >
                                    {t(`${departmentTranKey}.address`)}
                                </label>
                                <div className="form__form-group-field">
                                    <Input
                                        defaultValue={
                                            currDepartment
                                                ? currDepartment.address
                                                : ""
                                        }
                                        name="address"
                                        type="text"
                                    />
                                </div>
                            </div>

                            <div className="form__form-group">
                                <label
                                    htmlFor="manager"
                                    className="form__form-group-label"
                                >
                                    {t(`${departmentTranKey}.manager`)}
                                </label>
                                <div className="form__form-group-field">
                                    <Input
                                        type="select"
                                        name="manager"
                                        defaultValue={
                                            currDepartment
                                                ? currDepartment.manager
                                                : ""
                                        }
                                    >
                                        <option value="">
                                            ---{" "}
                                            {t(`${departmentTranKey}.select`)}{" "}
                                            ---
                                        </option>
                                        <option value={1}>
                                            {t(
                                                `${departmentTranKey}.manager_1`
                                            )}
                                        </option>
                                        <option value={2}>
                                            {t(
                                                `${departmentTranKey}.manager_2`
                                            )}
                                        </option>
                                    </Input>
                                </div>
                            </div>

                            <ButtonToolbar
                                style={{ margin: "10px auto 0 auto" }}
                            >
                                {/* {updateDepartment ? (
                                    <Route
                                        render={props => (
                                            <DeleteDepartmentModal
                                                {...props}
                                                title="Xóa cơ sở!"
                                                message="Bạn chắc chắn có muốn xóa cơ sở này không?"
                                                idBase={currDepartment.id}
                                            />
                                        )}
                                    />
                                ) : (
                                    ""
                                )} */}

                                <Button
                                    color="primary"
                                    type="button"
                                    onClick={this.handleAddEditDepartment}
                                >
                                    {updateDepartment
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
        infoStudent: forSchoolReducer.infoStudent,
    };
};

const tAddEditDepartmentForm = connect(mapStateToProps)(
    translate(["common", "for_school"])(AddEditDepartmentForm)
);
export default tAddEditDepartmentForm;
