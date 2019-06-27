import React, { PureComponent } from "react";
import { Col, Button, ButtonToolbar, Container, Row, Input } from "reactstrap";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import { callApi, validationHelper, errorHelper } from "../../../helpers";

class AddEditClassroomForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            currClassroom: null,
            getStateFromProp: false,
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (state) {
            if (!state.getStateFromProp) {
                if (state.currClassroom != props.currClassroom) {
                    return {
                        currClassroom: props.currClassroom,
                        getStateFromProp: true,
                    };
                }
            }
        }

        return null;
    }

    handleAddEditClassroom = () => {
        let idForm = "add-edit-classroom";
        // Validate form
        validationHelper.validateForm(idForm);
        let formValues = validationHelper.getFormData(idForm);
        if (formValues) {
            const {
                toggle,
                getListClassroom,
                updateClassroom,
                currClassroom,
                location,
            } = this.props;

            let formData = {};
            for (const key in formValues) {
                formData[key] = formValues[key];
            }

            formData["department_id"] = location.state.idDepartment;

            let p = null;
            if (!updateClassroom)
                p = callApi("for_school/rooms", "POST", null, formData);
            else if (currClassroom)
                p = callApi(
                    `for_school/rooms/${currClassroom.id}`,
                    "PUT",
                    null,
                    formData
                );

            // Call API add, edit Classroom
            p.then(res => {
                getListClassroom();
                toggle();
            }).catch(error => {
                let processError = errorHelper.commonProcessError.bind(this);
                processError(error, "ROOM");
            });
        }
    };

    render() {
        const { toggle, updateClassroom } = this.props;
        const { currClassroom } = this.state;

        return (
            <Container>
                <Row>
                    <Col md={12} lg={12} xl={12}>
                        <form
                            id="add-edit-classroom"
                            className="form form--horizontal"
                        >
                            <div className="form__form-group">
                                <label className="form__form-group-label">
                                    Tên phòng *
                                </label>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-input-wrap">
                                        <Input
                                            name="name"
                                            type="text"
                                            defaultValue={
                                                currClassroom
                                                    ? currClassroom.name
                                                    : ""
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form__form-group">
                                <label className="form__form-group-label">
                                    Sức chứa *
                                </label>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-input-wrap">
                                        <Input
                                            name="capacity"
                                            type="text"
                                            defaultValue={
                                                currClassroom
                                                    ? currClassroom.capacity
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
                                    onClick={this.handleAddEditClassroom}
                                >
                                    {updateClassroom ? "Cập nhật" : "Thêm mới"}
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

const tAddEditClassroomForm = translate("common")(AddEditClassroomForm);
const mapStateToProps = () => ({});

export default connect(mapStateToProps)(tAddEditClassroomForm);
