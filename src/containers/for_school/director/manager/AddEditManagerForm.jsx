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
import {
    callApi,
    validationHelper,
    userHelper,
    errorHelper,
} from "../../../../helpers";
import SelectUser from "./SelectUser";
import { connect } from "react-redux";

class AddEditManagerForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            type: "1",
            user: null,
        };
    }

    handleChangeTypeUserTeacher = e => {
        this.setState({ type: e.target.value });
    };

    handleChangeUser = value => {
        this.setState({
            user: value,
        });
    };

    handleAddEditManager = () => {
        let idForm = "add-edit-manager";
        // Validate form
        validationHelper.validateForm(idForm);
        let formValues = validationHelper.getFormData(idForm);
        if (formValues) {
            const { type, user } = this.state;
            const {
                currDepartmentId,
                toggle,
                getListManager,
                currSchool,
            } = this.props;

            let formData = { department_id: currDepartmentId };

            if (type === "1") {
                if (!user) return alert("Vui lòng chọn tài khoản");
                formData["user_id"] = user.id;
                formData["type"] = type;
            } else {
                delete formValues["customRadio"];
                for (const key in formValues) {
                    formData[key] = formValues[key];
                }
                formData["password"] = userHelper.hasPasswordSHA("123456789");
                formData["active"] = 1;
            }
            formData["school_id"] = currSchool.id;
            callApi("for_school/managers", "POST", null, formData)
                .then(res => {
                    getListManager();
                    toggle();
                })
                .catch(error => {
                    let processError = errorHelper.commonProcessError.bind(
                        this
                    );
                    processError(error, "SIGNUP");
                });
        }
    };

    render() {
        const { toggle } = this.props;
        const { type, user } = this.state;

        return (
            <Container>
                <Row>
                    <Col md={12} lg={12} xl={12}>
                        <Form id="add-edit-manager">
                            <FormGroup>
                                <Label>Hình thức tài khoản</Label>
                                <div
                                    onChange={this.handleChangeTypeUserTeacher}
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

                            {type === "1" ? (
                                <Fragment>
                                    <h4 className="mb-3">
                                        Chọn tài khoản đã có từ hệ thống Lingo
                                    </h4>
                                    <FormGroup>
                                        <Label>Chọn tài khoản *</Label>
                                        <SelectUser
                                            currUser={user}
                                            handleChangeUser={
                                                this.handleChangeUser
                                            }
                                        />
                                    </FormGroup>
                                </Fragment>
                            ) : (
                                <Fragment>
                                    <h4 className="mb-3">
                                        Nhập thông tin quản lý
                                    </h4>
                                    <FormGroup>
                                        <Label for="fullname">
                                            Họ và tên *
                                        </Label>
                                        <Input
                                            type="text"
                                            name="fullname"
                                            id="fullname"
                                            placeholder="Họ và tên"
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
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="email">Email *</Label>
                                        <Input
                                            type="email"
                                            name="email"
                                            id="email"
                                            placeholder="Email"
                                        />
                                    </FormGroup>
                                </Fragment>
                            )}

                            <ButtonToolbar className="form__button-toolbar">
                                <Button
                                    color="primary"
                                    type="button"
                                    onClick={this.handleAddEditManager}
                                >
                                    Thêm mới
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

const mapStateToProp = state => {
    const { forSchoolReducer } = state;
    return {
        currSchool: forSchoolReducer.currSchool,
    };
};
export default connect(mapStateToProp)(AddEditManagerForm);
