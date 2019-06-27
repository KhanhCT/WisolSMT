import React, { PureComponent } from "react";
import { Col, Button, ButtonToolbar, Container, Row, Input } from "reactstrap";
import CheckboxTree from "react-checkbox-tree";
import {
    validationHelper,
    callApi,
    utilHelper,
    errorHelper,
} from "../../../helpers";
import { RIGHT_PERMISSION_OF_DEPARTMENT } from "../../../constants";
import { connect } from "react-redux";

class AddEditRoleForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            currRole: {
                name: null,
                description: null,
                rights: [],
            },
            expanded: utilHelper.getRightIds(RIGHT_PERMISSION_OF_DEPARTMENT),
            getStateFromProp: false,
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (state) {
            if (!state.getStateFromProp) {
                if (props.currRole) {
                    return {
                        currRole: props.currRole,
                        getStateFromProp: true,
                    };
                }
            }
        }

        return null;
    }

    handleAddEditRole = () => {
        let idForm = "add-edit-role";
        // Validate form
        validationHelper.validateForm(idForm);
        let formValues = validationHelper.getFormData(idForm);
        if (formValues) {
            const {
                toggle,
                updateRole,
                getListRole,
                currSchool,
                currDept,
            } = this.props;
            const { currRole } = this.state;
            const { rights } = currRole;

            let formData = {};
            for (const key in formValues) {
                formData[key] = formValues[key];
            }
            // Add school_id
            formData["school_id"] = currSchool.id;
            formData["department_id"] = currDept.id;

            if (rights.length > 0) {
                formData["rights"] = rights;

                let p = null;
                if (!updateRole)
                    p = callApi(
                        "for_school/role_for_schools",
                        "POST",
                        null,
                        formData
                    );
                else if (currRole)
                    p = callApi(
                        `for_school/role_for_schools/${currRole.id}`,
                        "PUT",
                        null,
                        formData
                    );

                // Call API add, edit role
                p.then(res => {
                    getListRole();
                    toggle();
                }).catch(error => {
                    let processError = errorHelper.commonProcessError.bind(
                        this
                    );
                    processError(error, "ROLE_FOR_SCHOOL");
                });
            } else {
                alert("Vui lòng chọn ít nhất 1 quyền");
            }
        }
    };

    render() {
        const { toggle, updateRole } = this.props;
        const { expanded, currRole } = this.state;

        return (
            <Container>
                <Row>
                    <Col md={12} lg={12} xl={12}>
                        <form
                            id="add-edit-role"
                            className="form form--horizontal"
                        >
                            <div className="form__form-group">
                                <label className="form__form-group-label">
                                    Tên quyền *
                                </label>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-input-wrap">
                                        <Input
                                            defaultValue={
                                                currRole ? currRole.name : ""
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
                                    Chức năng *
                                </label>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-input-wrap">
                                        <CheckboxTree
                                            nodes={
                                                RIGHT_PERMISSION_OF_DEPARTMENT
                                            }
                                            checked={
                                                currRole ? currRole.rights : []
                                            }
                                            expanded={expanded}
                                            onCheck={checked => {
                                                this.setState({
                                                    currRole: {
                                                        ...this.state.currRole,
                                                        rights: checked,
                                                    },
                                                });
                                            }}
                                            onExpand={expanded => {
                                                this.setState({ expanded });
                                            }}
                                            icons={{
                                                check: (
                                                    <span className="far fa-check-square" />
                                                ),
                                                uncheck: (
                                                    <span className="far fa-square" />
                                                ),
                                                halfCheck: (
                                                    <span className="far fa-square" />
                                                ),
                                                expandClose: (
                                                    <span className="fas fa-chevron-right" />
                                                ),
                                                expandOpen: (
                                                    <span className="fas fa-chevron-down" />
                                                ),
                                                expandAll: (
                                                    <span className="fas fa-plus-square" />
                                                ),
                                                collapseAll: (
                                                    <span className="fas fa-minus-square" />
                                                ),
                                                parentClose: (
                                                    <span className="fas fa-folder" />
                                                ),
                                                parentOpen: (
                                                    <span className="fas fa-folder-open" />
                                                ),
                                                leaf: (
                                                    <span className="fas fa-file" />
                                                ),
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form__form-group">
                                <label className="form__form-group-label">
                                    Mô tả
                                </label>
                                <div className="form__form-group-field">
                                    <Input
                                        defaultValue={
                                            currRole ? currRole.description : ""
                                        }
                                        name="description"
                                        type="textarea"
                                    />
                                </div>
                            </div>

                            <ButtonToolbar
                                style={{ margin: "10px auto 0 auto" }}
                            >
                                <Button
                                    color="primary"
                                    type="button"
                                    onClick={this.handleAddEditRole}
                                >
                                    {updateRole ? "Cập nhật" : "Thêm mới"}
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

const mapStateToProps = state => {
    const { forSchoolReducer } = state;
    return {
        currSchool: forSchoolReducer.currSchool,
        currDept: forSchoolReducer.currDept,
    };
};
export default connect(mapStateToProps)(AddEditRoleForm);
