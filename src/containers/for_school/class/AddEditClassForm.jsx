import React, { PureComponent, Fragment } from "react";
import {
    Col,
    Button,
    InputGroup,
    Container,
    InputGroupAddon,
    Input,
    Card,
    CardBody,
    Form,
} from "reactstrap";
import { Route } from "react-router-dom";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import {
    callApi,
    validationHelper,
    utilHelper,
    errorHelper,
} from "../../../helpers";
import {
    CustomDatePicker,
    ConfirmModalCustom,
} from "../../../components/common";
import ListCourseSelect from "./ListCourseSelect";
import ListStudyMethodSelect from "./ListStudyMethodSelect";
import SelectTeacher from "./SelectTeacher";
import SelectStudent from "./SelectStudent";

class AddEditClassForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            currClass: null,
            start_date: null,
            end_date: null,
            lstTeacherCurrent: [],
            lstTeacherTmp: [],
            lstStudentCurrent: [],
            lstStudentTmp: [],
            lstStudentIdTmp: [],
            lstTeacherIdTmp: [],
            lstStudentChangeStatus: [],
            selectedCourse: null,
            selectedStudyMethod: null,
            teacher: null,
            student: null,
            totalStudent: 0,
            currTeacher: null,
            currStudent: null,
            confirmModalActiveTeacherIsOpen: false,
            confirmModalChangeStatusStudentIsOpen: false,
            getStateFromProp: false,
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (state) {
            if (!state.getStateFromProp) {
                if (state.currClass != props.currClass) {
                    const {
                        course,
                        start_date,
                        end_date,
                        study_method,
                    } = props.currClass;
                    return {
                        currClass: props.currClass,
                        start_date: utilHelper.isEmptyDate(start_date),
                        end_date: utilHelper.isEmptyDate(end_date),
                        selectedCourse: course,
                        selectedStudyMethod: study_method,
                        getStateFromProp: true,
                    };
                }
            }
        }

        return null;
    }

    componentDidMount = () => {
        const { updateClass } = this.props;
        if (updateClass) {
            this.getListTeacherAndStudent();
        }
    };

    getListTeacherAndStudent = () => {
        const { currClass } = this.state;
        // Call API get list teacher and student
        callApi("for_school/classes/list-teacher-and-student-by-class", "GET", {
            class_id: currClass.id,
        })
            .then(res => {
                this.setState({
                    lstTeacherCurrent: res.data.data.teacher.user,
                    lstStudentCurrent: res.data.data.student.user,
                    totalStudent: res.data.data.student.count,
                });
            })
            .catch(error => {
                console.log(error);
            });
    };

    handleSetStartDate = date => {
        this.setState({
            start_date: date,
        });
    };

    handleSetEndDate = date => {
        this.setState({
            end_date: date,
        });
    };

    setSelectedCourse = selectedCourse => {
        this.setState({ selectedCourse: null }, () => {
            this.setState({
                selectedCourse: selectedCourse,
            });
        });
    };

    setSelectedStudyMethod = selectedStudyMethod => {
        this.setState({ selectedStudyMethod: null }, () => {
            this.setState({
                selectedStudyMethod: selectedStudyMethod,
            });
        });
    };

    handleChangeTeacher = value => {
        this.setState({
            teacher: value,
        });
    };

    handleChangeStudent = value => {
        this.setState({
            student: value,
        });
    };

    handleAddStudentToClass = () => {
        const {
            student,
            lstStudentCurrent,
            lstStudentTmp,
            lstStudentIdTmp,
        } = this.state;
        let lstConcatStudent = lstStudentCurrent.concat(lstStudentTmp);
        if (student) {
            if (
                lstConcatStudent.findIndex(o => {
                    return o.id == student.user.id;
                }) == -1
            ) {
                this.setState(
                    {
                        lstStudentTmp: [...lstStudentTmp, student.user],
                        lstStudentIdTmp: [
                            ...lstStudentIdTmp,
                            {
                                student_id:
                                    student.departments[0].student_department
                                        .student_id,
                            },
                        ],
                    },
                    () => {
                        this.setState({ student: null });
                    }
                );
            } else {
                alert("Học viên đã được thêm vào lớp");
            }
        } else {
            alert("Vui lòng chọn học viên");
        }
    };

    handleAddTeacher = () => {
        const {
            teacher,
            lstTeacherCurrent,
            lstTeacherTmp,
            lstTeacherIdTmp,
        } = this.state;
        let lstConcatTeacher = lstTeacherCurrent.concat(lstTeacherTmp);
        if (teacher) {
            if (
                lstConcatTeacher.findIndex(o => {
                    return o.id == teacher.user.id;
                }) == -1
            ) {
                this.setState(
                    {
                        lstTeacherTmp: [
                            ...this.state.lstTeacherTmp,
                            teacher.user,
                        ],
                        lstTeacherIdTmp: [
                            ...lstTeacherIdTmp,
                            {
                                teacher_id:
                                    teacher.departments[0].teacher_department
                                        .teacher_id,
                            },
                        ],
                    },
                    () => {
                        this.setState({ teacher: null });
                    }
                );
            } else {
                alert("Giáo viên đã có trong danh sách");
            }
        } else {
            alert("Vui lòng chọn giáo viên");
        }
    };

    toggleConfirmModalActiveTeacher = () => {
        this.setState({
            confirmModalActiveTeacherIsOpen: !this.state
                .confirmModalActiveTeacherIsOpen,
        });
    };

    toggleConfirmModalChangeStatusStudent = () => {
        this.setState({
            confirmModalChangeStatusStudentIsOpen: !this.state
                .confirmModalChangeStatusStudentIsOpen,
        });
    };

    handleOpenModalActiveTeacher = teacher => {
        this.setState(
            {
                currTeacher: teacher,
            },
            () => {
                this.setState({ confirmModalActiveTeacherIsOpen: true });
            }
        );
    };

    handleConfirmActiveTeacher = () => {
        const { currTeacher } = this.state;
        let arrayStatusTeacherCurrent = [...this.state.lstTeacherCurrent];
        arrayStatusTeacherCurrent.map(item => {
            if (item.id != currTeacher.id) {
                item.teacher_active = false;
            } else {
                item.teacher_active = true;
            }
            return item;
        });
        this.setState(
            {
                lstTeacherCurrent: arrayStatusTeacherCurrent,
            },
            () => {
                this.toggleConfirmModalActiveTeacher();
            }
        );
    };

    handleOpenModalChangeStatusStudent = student => {
        this.setState(
            {
                currStudent: student,
            },
            () => {
                this.setState({ confirmModalChangeStatusStudentIsOpen: true });
            }
        );
    };

    handleConfirmChangeStatusStudent = () => {
        const { currStudent } = this.state;
        let arrayStatusStudentCurrent = [...this.state.lstStudentCurrent];
        let arrStudentChangeStatusTmp = [...this.state.lstStudentChangeStatus];
        if (arrStudentChangeStatusTmp.indexOf(currStudent) == -1) {
            this.setState({
                lstStudentChangeStatus: [
                    ...arrStudentChangeStatusTmp,
                    currStudent,
                ],
            });
        } else {
            arrStudentChangeStatusTmp.splice(
                arrStudentChangeStatusTmp.indexOf(currStudent),
                1
            );
            this.setState({
                lstStudentChangeStatus: arrStudentChangeStatusTmp,
            });
        }

        arrayStatusStudentCurrent.map(item => {
            if (item.id == currStudent.id) {
                item.student_active = !currStudent["student_active"];
            }
            return item;
        });

        this.setState(
            {
                lstStudentCurrent: arrayStatusStudentCurrent,
            },
            () => {
                this.toggleConfirmModalChangeStatusStudent();
            }
        );
    };

    handleDeleteTeacherTmp = (e, idx) => {
        let arrayTeacherSplice = [...this.state.lstTeacherTmp];
        let arrayTeacherIdSplice = [...this.state.lstTeacherIdTmp];
        arrayTeacherSplice.splice(idx, 1);
        arrayTeacherIdSplice.splice(idx, 1);
        this.setState({
            lstTeacherTmp: arrayTeacherSplice,
            lstTeacherIdTmp: arrayTeacherIdSplice,
        });
    };

    handleDeleteStudentTmp = (e, idx) => {
        let arrayStudentSplice = [...this.state.lstStudentTmp];
        let arrayStudentIdSplice = [...this.state.lstStudentIdTmp];
        arrayStudentSplice.splice(idx, 1);
        arrayStudentIdSplice.splice(idx, 1);
        this.setState({
            lstStudentTmp: arrayStudentSplice,
            lstStudentIdTmp: arrayStudentIdSplice,
        });
    };

    handleAddEditClass = () => {
        let idForm = "add-edit-class";
        // Validate form
        validationHelper.validateForm(idForm);
        let formValues = validationHelper.getFormData(idForm);
        if (formValues) {
            const { toggle, getListClass, updateClass, currClass } = this.props;

            const {
                start_date,
                end_date,
                selectedCourse,
                selectedStudyMethod,
                teacher,
                lstStudentIdTmp,
                lstTeacherIdTmp,
                currTeacher,
                lstStudentChangeStatus,
            } = this.state;

            let formData = {};
            for (const key in formValues) {
                formData[key] = formValues[key];
            }

            if (selectedCourse) formData["course_id"] = selectedCourse.id;
            if (selectedStudyMethod)
                formData["study_method_id"] = selectedStudyMethod.id;
            if (teacher) formData["teacher_id"] = teacher.id;
            formData["start_date"] = start_date;
            formData["end_date"] = end_date;
            formData["list_teacher_id"] = lstTeacherIdTmp;
            formData["list_student_id"] = lstStudentIdTmp;
            formData["item_teacher_active"] = currTeacher;
            formData["list_student_change_status"] = lstStudentChangeStatus;

            delete formData["course"];
            delete formData["study_method"];

            let p = null;
            if (!updateClass)
                p = callApi("for_school/classes", "POST", null, formData);
            else if (currClass)
                p = callApi(
                    `for_school/classes/${currClass.id}`,
                    "PUT",
                    null,
                    formData
                );

            // Call API add, edit Class
            p.then(res => {
                getListClass();
                toggle();
            }).catch(error => {
                let processError = errorHelper.commonProcessError.bind(this);
                processError(error, "CLASS");
            });
        }
    };

    render() {
        const { toggle, currClass, updateClass } = this.props;
        const {
            start_date,
            end_date,
            lstTeacherCurrent,
            lstTeacherTmp,
            lstStudentCurrent,
            lstStudentTmp,
            selectedCourse,
            selectedStudyMethod,
            teacher,
            student,
            totalStudent,
            confirmModalActiveTeacherIsOpen,
            confirmModalChangeStatusStudentIsOpen,
        } = this.state;

        let renderListStudentTmp = null,
            renderListStudentCurrent = null,
            renderListTeacherTmp = null,
            renderListTeacherCurrent = null;

        if (lstTeacherCurrent && lstTeacherCurrent.length > 0) {
            renderListTeacherCurrent = lstTeacherCurrent.map((item, index) => {
                return (
                    <li className="mb-2" key={index}>
                        <span className="mr-2">
                            {item.fullname} - SĐT: {item.phone}
                        </span>{" "}
                        <span
                            className={`${
                                item.teacher_active
                                    ? "icon-active-teacher"
                                    : "icon-deactive-teacher"
                            } mr-2`}
                        >
                            {!item.teacher_active ? (
                                <a
                                    onClick={() => {
                                        this.handleOpenModalActiveTeacher(item);
                                    }}
                                    href="javascript:;"
                                    rel="tooltip"
                                    title="Hoạt động"
                                >
                                    <i className="fas fa-times-circle" />
                                </a>
                            ) : (
                                <a
                                    href="javascript:;"
                                    rel="tooltip"
                                    title="Ngừng hoạt động"
                                >
                                    <i class="fas fa-check-circle" />
                                </a>
                            )}
                        </span>
                    </li>
                );
            });
        }

        if (lstTeacherTmp && lstTeacherTmp.length > 0) {
            renderListTeacherTmp = lstTeacherTmp.map((item, index) => {
                return (
                    <li className="mb-2" key={index}>
                        <span className="mr-2">
                            {item.fullname} - SĐT: {item.phone}
                        </span>{" "}
                        <span className="icon-deactive-teacher">
                            <a
                                onClick={e => {
                                    this.handleDeleteTeacherTmp(e, index);
                                }}
                                href="javascript:;"
                                rel="tooltip"
                                title="Xóa giáo viên"
                            >
                                <i className="fas fa-minus-circle" />
                            </a>
                        </span>
                    </li>
                );
            });
        }

        if (lstStudentTmp && lstStudentTmp.length > 0) {
            renderListStudentTmp = lstStudentTmp.map((item, index) => {
                return (
                    <li className="mb-2" key={index}>
                        <span className="mr-2">
                            {item.fullname} - SĐT: {item.phone}
                        </span>{" "}
                        <span className="icon-deactive-teacher">
                            <a
                                onClick={e => {
                                    this.handleDeleteStudentTmp(e, index);
                                }}
                                href="javascript:;"
                                rel="tooltip"
                                title="Xóa học viên"
                            >
                                <i className="fas fa-minus-circle" />
                            </a>
                        </span>
                    </li>
                );
            });
        }

        if (lstStudentCurrent && lstStudentCurrent.length > 0) {
            renderListStudentCurrent = lstStudentCurrent.map((item, index) => {
                return (
                    <li className="mb-2" key={index}>
                        <span className="mr-2">
                            {item.fullname} - SĐT: {item.phone}
                        </span>{" "}
                        <span
                            className={`${
                                item.student_active
                                    ? "icon-active-teacher"
                                    : "icon-deactive-teacher"
                            } mr-2`}
                        >
                            <a
                                onClick={() => {
                                    this.handleOpenModalChangeStatusStudent(
                                        item
                                    );
                                }}
                                href="javascript:;"
                                rel="tooltip"
                                title={
                                    item.student_active
                                        ? "Hoạt động"
                                        : "Ngừng hoạt động"
                                }
                            >
                                {item.student_active ? (
                                    <i class="fas fa-check-circle" />
                                ) : (
                                    <i className="fas fa-times-circle" />
                                )}
                            </a>
                        </span>
                    </li>
                );
            });
        }

        return (
            <Container>
                <Form id="add-edit-class" className="row">
                    <Col xs={12} md={12} lg={12} xl={6}>
                        <Card>
                            <CardBody>
                                <div className="card__title">
                                    <h5 className="bold-text">
                                        Thông tin lớp học
                                    </h5>
                                    <h5 className="subhead">
                                        Nhập đầy đủ thông tin lớp học
                                    </h5>
                                </div>
                                <div className="form__form-group">
                                    <label className="form__form-group-label">
                                        Khóa học *
                                    </label>
                                    <div className="form__form-group-field">
                                        <div className="form__form-group-input-wrap">
                                            <Route
                                                render={props => (
                                                    <ListCourseSelect
                                                        {...props}
                                                        name="course"
                                                        setSelectedCourse={
                                                            this
                                                                .setSelectedCourse
                                                        }
                                                        selectedCourse={
                                                            selectedCourse
                                                        }
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form__form-group">
                                    <label className="form__form-group-label">
                                        Hình thức học *
                                    </label>
                                    <div className="form__form-group-field">
                                        <div className="form__form-group-input-wrap">
                                            <Route
                                                render={props => (
                                                    <ListStudyMethodSelect
                                                        {...props}
                                                        name="study_method"
                                                        setSelectedStudyMethod={
                                                            this
                                                                .setSelectedStudyMethod
                                                        }
                                                        selectedStudyMethod={
                                                            selectedStudyMethod
                                                        }
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form__form-group">
                                    <label className="form__form-group-label">
                                        Tên lớp học *
                                    </label>
                                    <div className="form__form-group-field">
                                        <div className="form__form-group-input-wrap">
                                            <Input
                                                name="name"
                                                type="text"
                                                defaultValue={
                                                    currClass
                                                        ? currClass.name
                                                        : ""
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form__form-group">
                                    <label className="form__form-group-label">
                                        Số buổi học *
                                    </label>
                                    <div className="form__form-group-field">
                                        <div className="form__form-group-input-wrap">
                                            <Input
                                                name="number_session"
                                                type="number"
                                                defaultValue={
                                                    currClass
                                                        ? currClass.number_session
                                                        : ""
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form__form-group">
                                    <label className="form__form-group-label">
                                        Số học sinh *
                                    </label>
                                    <div className="form__form-group-field">
                                        <div className="form__form-group-input-wrap">
                                            <Input
                                                name="number_student"
                                                type="number"
                                                defaultValue={
                                                    currClass
                                                        ? currClass.number_student
                                                        : ""
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form__form-group">
                                    <label className="form__form-group-label">
                                        Thời gian bắt đầu *
                                    </label>
                                    <div className="form__form-group-field">
                                        <div className="form__form-group-input-wrap">
                                            <CustomDatePicker
                                                placeholderText="Thời gian bắt đầu"
                                                name="start_date"
                                                value={start_date}
                                                showTimeSelect={false}
                                                setSelectedDate={
                                                    this.handleSetStartDate
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form__form-group">
                                    <label className="form__form-group-label">
                                        Thời gian kết thúc *
                                    </label>
                                    <div className="form__form-group-field">
                                        <div className="form__form-group-input-wrap">
                                            <CustomDatePicker
                                                placeholderText="Thời gian kết thúc"
                                                name="end_date"
                                                value={end_date}
                                                showTimeSelect={false}
                                                setSelectedDate={
                                                    this.handleSetEndDate
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
                                                    currClass
                                                        ? currClass.description
                                                        : ""
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xs={12} md={12} lg={12} xl={6}>
                        <Card>
                            <CardBody>
                                <div className="card__title">
                                    <h5 className="bold-text">
                                        Thông tin giáo viên &amp; học viên
                                    </h5>
                                    <h5 className="subhead">
                                        Nhập giáo viên và thêm học viên vào lớp
                                        học
                                    </h5>
                                </div>

                                <div className="form__form-group">
                                    <label className="form__form-group-label">
                                        Giáo viên *
                                    </label>
                                    <div className="form__form-group-field mb-3">
                                        <div className="form__form-group-input-wrap input-append">
                                            <InputGroup>
                                                <Route
                                                    render={props => (
                                                        <SelectTeacher
                                                            {...props}
                                                            currTeacher={
                                                                teacher
                                                            }
                                                            className={
                                                                updateClass
                                                                    ? "select-student"
                                                                    : "select-student-100"
                                                            }
                                                            handleChangeTeacher={
                                                                this
                                                                    .handleChangeTeacher
                                                            }
                                                        />
                                                    )}
                                                />

                                                {updateClass ? (
                                                    <InputGroupAddon addonType="append">
                                                        <Button
                                                            type="button"
                                                            outline
                                                            style={{
                                                                padding:
                                                                    "7px 25px",
                                                                marginBottom: 0,
                                                            }}
                                                            onClick={
                                                                this
                                                                    .handleAddTeacher
                                                            }
                                                        >
                                                            <i className="fas fa-plus" />
                                                        </Button>
                                                    </InputGroupAddon>
                                                ) : (
                                                    ""
                                                )}
                                            </InputGroup>
                                        </div>
                                    </div>
                                    {updateClass ? (
                                        <Fragment>
                                            <ul className="list-teacher-edit">
                                                {renderListTeacherCurrent}
                                            </ul>

                                            <ul className="list-teacher-edit teacher-tmp">
                                                {renderListTeacherTmp}
                                            </ul>
                                        </Fragment>
                                    ) : (
                                        ""
                                    )}
                                </div>

                                <form id="add-student">
                                    <div className="form__form-group">
                                        <label className="form__form-group-label">
                                            Chọn học viên
                                        </label>
                                        <div className="form__form-group-field">
                                            <div className="form__form-group-input-wrap input-append">
                                                <InputGroup>
                                                    <Route
                                                        render={props => (
                                                            <SelectStudent
                                                                {...props}
                                                                currStudent={
                                                                    student
                                                                }
                                                                handleChangeStudent={
                                                                    this
                                                                        .handleChangeStudent
                                                                }
                                                            />
                                                        )}
                                                    />
                                                    <InputGroupAddon addonType="append">
                                                        <Button
                                                            type="button"
                                                            outline
                                                            style={{
                                                                padding:
                                                                    "7px 25px",
                                                            }}
                                                            onClick={
                                                                this
                                                                    .handleAddStudentToClass
                                                            }
                                                        >
                                                            <i className="fas fa-plus" />
                                                        </Button>
                                                    </InputGroupAddon>
                                                </InputGroup>
                                            </div>
                                        </div>

                                        {lstStudentCurrent.length > 0 ||
                                        lstStudentTmp.length > 0 ? (
                                            <div>
                                                <h4 className="mb-2">
                                                    Danh sách học viên (
                                                    {totalStudent} học viên):
                                                </h4>
                                                <ul className="list-teacher-edit">
                                                    {renderListStudentCurrent}
                                                </ul>
                                                <ul className="list-teacher-edit">
                                                    {renderListStudentTmp}
                                                </ul>
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                </form>

                                <ConfirmModalCustom
                                    title="Cập nhật trạng thái giáo viên!"
                                    message="Bạn chắc chắn có muốn giáo viên này giảng dạy lớp này không?"
                                    modalIsOpen={
                                        confirmModalActiveTeacherIsOpen
                                    }
                                    toggle={
                                        this.toggleConfirmModalActiveTeacher
                                    }
                                    handleConfirmAction={
                                        this.handleConfirmActiveTeacher
                                    }
                                />

                                <ConfirmModalCustom
                                    title="Cập nhật trạng thái học viên!"
                                    message="Bạn chắc chắn có muốn ngừng hoạt động học viên này không?"
                                    modalIsOpen={
                                        confirmModalChangeStatusStudentIsOpen
                                    }
                                    toggle={
                                        this
                                            .toggleConfirmModalChangeStatusStudent
                                    }
                                    handleConfirmAction={
                                        this.handleConfirmChangeStatusStudent
                                    }
                                />
                            </CardBody>
                        </Card>
                    </Col>
                    <Col
                        xs={12}
                        md={12}
                        lg={12}
                        xl={12}
                        className="text-center mb-3"
                    >
                        <Button
                            color="primary"
                            type="button"
                            onClick={this.handleAddEditClass}
                        >
                            {updateClass ? "Cập nhật" : "Thêm mới"}
                        </Button>
                        <Button
                            type="button"
                            onClick={() => {
                                toggle();
                            }}
                        >
                            Hủy
                        </Button>
                    </Col>
                </Form>
            </Container>
        );
    }
}

const tAddEditClassForm = translate("common")(AddEditClassForm);
const mapStateToProps = () => ({});

export default connect(mapStateToProps)(tAddEditClassForm);
