import React, { PureComponent } from "react";
import { Col, Button, ButtonToolbar, Container, Row, Input } from "reactstrap";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import { callApi, validationHelper, errorHelper } from "../../../helpers";

class AddEditCourseForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            currCourse: null,
            getStateFromProp: false,
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (state) {
            if (!state.getStateFromProp) {
                if (state.currCourse != props.currCourse) {
                    return {
                        currCourse: props.currCourse,
                        getStateFromProp: true,
                    };
                }
            }
        }

        return null;
    }

    handleAddEditCourse = () => {
        let idForm = "add-edit-course";
        // Validate form
        validationHelper.validateForm(idForm);
        let formValues = validationHelper.getFormData(idForm);
        if (formValues) {
            const {
                toggle,
                getListCourse,
                updateCourse,
                currCourse,
                location,
            } = this.props;

            let formData = {};
            for (const key in formValues) {
                formData[key] = formValues[key];
            }

            formData["department_id"] = location.state.idDepartment;

            let p = null;
            if (!updateCourse)
                p = callApi("for_school/courses", "POST", null, formData);
            else if (currCourse)
                p = callApi(
                    `for_school/courses/${currCourse.id}`,
                    "PUT",
                    null,
                    formData
                );

            // Call API add, edit Course
            p.then(res => {
                getListCourse();
                toggle();
            }).catch(error => {
                let processError = errorHelper.commonProcessError.bind(this);
                processError(error, "COURSE");
            });
        }
    };

    render() {
        const { toggle, updateCourse } = this.props;
        const { currCourse } = this.state;
        return (
            <Container>
                <Row>
                    <Col md={12} lg={12} xl={12}>
                        <form
                            id="add-edit-course"
                            className="form form--horizontal"
                        >
                            <div className="form__form-group">
                                <label className="form__form-group-label">
                                    Tên khóa học *
                                </label>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-input-wrap">
                                        <Input
                                            name="name"
                                            type="text"
                                            defaultValue={
                                                currCourse
                                                    ? currCourse.name
                                                    : ""
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form__form-group">
                                <label className="form__form-group-label">
                                    Thời gian học *
                                </label>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-input-wrap">
                                        <Input
                                            name="total_time"
                                            type="number"
                                            defaultValue={
                                                currCourse
                                                    ? currCourse.total_time
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
                                                currCourse
                                                    ? currCourse.description
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
                                    onClick={this.handleAddEditCourse}
                                >
                                    {updateCourse ? "Cập nhật" : "Thêm mới"}
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

const tAddEditCourseForm = translate("common")(AddEditCourseForm);
const mapStateToProps = () => ({});

export default connect(mapStateToProps)(tAddEditCourseForm);
