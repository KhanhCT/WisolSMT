import React, { PureComponent, Fragment } from "react";
import {
    Col,
    Button,
    ButtonToolbar,
    Container,
    Row,
    FormGroup,
    CustomInput,
    Label,
    Input,
    Form,
} from "reactstrap";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import {
    callApi,
    validationHelper,
    userHelper,
    errorHelper,
} from "../../../helpers";
import SelectUser from "./SelectUser";

class AddEditStudentForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            type: "1",
            user: null,
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (props.updateStudent)
            return {
                type: "2",
            };
    }

    handleChangeTypeUserStudent = e => {
        this.setState({ type: e.target.value });
    };

    handleChangeUser = value => {
        this.setState({
            user: value,
        });
    };

    handleAddEditStudent = () => {
        let idForm = "add-edit-student";
        // Validate form
        validationHelper.validateForm(idForm);
        let formValues = validationHelper.getFormData(idForm);
        if (formValues) {
            const {
                toggle,
                getListStudent,
                currDept,
                currSchool,
                currStudent,
                updateStudent,
            } = this.props;

            const { type, user } = this.state;
            let formData = {};
            formData["department_id"] = currDept["id"];
            formData["school_id"] = currSchool["id"];
            formData["start_date"] = new Date();
            formData["type"] = type;

            if (type === "1") {
                if (!user) return alert("Vui lòng chọn tài khoản");
                formData["user_id"] = user.id;
            } else {
                delete formValues["customRadio"];
                for (const key in formValues) {
                    formData[key] = formValues[key];
                }
                formData["password"] = userHelper.hasPasswordSHA("123456789");
                formData["active"] = 1;
            }

            // Convert minute to hour
            if (formData["total_minute_registered"])
                formData["total_minute_registered"] =
                    parseFloat(formData["total_minute_registered"]) * 60;
            if (formData["total_minute_learned"])
                formData["total_minute_learned"] =
                    parseFloat(formData["total_minute_learned"]) * 60;

            let p = null;
            if (!updateStudent)
                p = callApi("for_school/students", "POST", null, formData);
            else {
                // Edit student, add user_id
                formData["user_id"] = currStudent.user.id;
                formData[""];
                p = callApi(
                    `for_school/students/update/${currStudent.id}`,
                    "PUT",
                    null,
                    formData
                );
            }

            if (p) {
                p.then(res => {
                    getListStudent();
                    toggle();
                }).catch(error => {
                    let processError = errorHelper.commonProcessError.bind(
                        this
                    );
                    processError(error, "STUDENT");
                });
            }
        }
    };

    render() {
        const { toggle, currStudent, updateStudent } = this.props;
        const { type, user } = this.state;

        return (
            <Container>
                <Row>
                    <Col md={12} lg={12} xl={12}>
                        <Form id="add-edit-student">
                            {!updateStudent ? (
                                <FormGroup>
                                    <Label>Hình thức tài khoản</Label>
                                    <div
                                        onChange={
                                            this.handleChangeTypeUserStudent
                                        }
                                    >
                                        <CustomInput
                                            type="radio"
                                            id="typeRadio1"
                                            value="1"
                                            defaultChecked
                                            name="customRadio"
                                            label="Đã có tài khoản Lingo"
                                        />
                                        <CustomInput
                                            type="radio"
                                            id="typeRadio2"
                                            value="2"
                                            name="customRadio"
                                            label="Chưa có tài khoản Lingo"
                                        />
                                    </div>
                                </FormGroup>
                            ) : null}

                            {type === "1" ? (
                                <Fragment>
                                    <h4 className="mb-3">
                                        Chọn tài khoản đã có từ hệ thống Lingo
                                    </h4>
                                    <FormGroup>
                                        <Label>Chọn tài khoản *</Label>
                                        <SelectUser
                                            currStudent={user}
                                            handleChangeUser={
                                                this.handleChangeUser
                                            }
                                        />
                                    </FormGroup>
                                </Fragment>
                            ) : (
                                <Fragment>
                                    <h4 className="mb-3">
                                        Nhập thông tin học viên
                                    </h4>
                                    <FormGroup>
                                        <Label for="username">
                                            Tài khoản *
                                        </Label>
                                        <Input
                                            type="text"
                                            name="username"
                                            id="username"
                                            placeholder="Tài khoản"
                                            defaultValue={
                                                currStudent
                                                    ? currStudent.user.username
                                                    : ""
                                            }
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="fullname">
                                            Họ và tên *
                                        </Label>
                                        <Input
                                            type="text"
                                            name="fullname"
                                            id="fullname"
                                            placeholder="Họ và tên"
                                            defaultValue={
                                                currStudent
                                                    ? currStudent.user.fullname
                                                    : ""
                                            }
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="phone">
                                            Số điện thoại *
                                        </Label>
                                        <Input
                                            type="text"
                                            name="phone"
                                            id="phone"
                                            placeholder="Số điện thoại"
                                            defaultValue={
                                                currStudent
                                                    ? currStudent.user.phone
                                                    : ""
                                            }
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="email">Email *</Label>
                                        <Input
                                            type="email"
                                            name="email"
                                            id="email"
                                            placeholder="Email"
                                            defaultValue={
                                                currStudent
                                                    ? currStudent.user.email
                                                    : ""
                                            }
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="total_minute_registered">
                                            Số giờ đăng ký
                                        </Label>
                                        <Input
                                            type="number"
                                            name="total_minute_registered"
                                            id="total_minute_registered"
                                            placeholder="Số giờ đăng ký"
                                            defaultValue={
                                                currStudent
                                                    ? roundHour(
                                                          currStudent.total_minute_registered
                                                      )
                                                    : ""
                                            }
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="total_minute_learned">
                                            Số giờ đã học
                                        </Label>
                                        <Input
                                            type="number"
                                            name="total_minute_learned"
                                            id="total_minute_learned"
                                            placeholder="Số giờ đã học"
                                            defaultValue={
                                                currStudent
                                                    ? roundHour(
                                                          currStudent.total_minute_learned
                                                      )
                                                    : ""
                                            }
                                        />
                                    </FormGroup>
                                </Fragment>
                            )}

                            <ButtonToolbar className="form__button-toolbar">
                                <Button
                                    color="primary"
                                    type="button"
                                    onClick={this.handleAddEditStudent}
                                >
                                    {updateStudent ? "Cập nhật" : "Thêm mới"}
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
                        </Form>
                    </Col>
                </Row>
            </Container>
        );
    }
}

const tAddEditStudentForm = translate("common")(AddEditStudentForm);
const mapStateToProp = state => {
    const { forSchoolReducer } = state;
    return {
        currSchool: forSchoolReducer.currSchool,
        currDept: forSchoolReducer.currDept,
    };
};

export default connect(mapStateToProp)(tAddEditStudentForm);

export function roundHour(minute) {
    let hour = minute / 60;
    if (minute % 60 === 0) return hour;
    return hour.toFixed(1);
}
