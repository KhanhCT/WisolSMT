import React, { PureComponent } from "react";
import { Col, Button, ButtonToolbar, Container, Row, Input } from "reactstrap";
import { Route } from "react-router-dom";
import moment from "moment";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import {
    CustomTimePicker,
    ConfirmModalCustom,
} from "../../../components/common";
import {
    validationHelper,
    callApi,
    errorHelper,
    utilHelper,
} from "../../../helpers";
import { ListCourseSelect } from "./ListCourseSelect";
import ListClassSelect from "./ListClassSelect";
import { ListRoomSelect } from "./ListRoomSelect";
import {
    LIST_RIGHT_FOR_SCHOOL,
    SCHOOL_ROLE_KEY_CHECK,
} from "../../../constants";
import { AuthorizarionSchoolComponent } from "../../../components/common";

class AddEditScheduleForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            confirmModalIsOpen: false,
            currSchedule: null,
            listClass: [],
            selectedClass: null,
            selectedCourse: null,
            selectedRoom: null,
            start_time: null,
            end_time: null,
            getStateFromProp: false,
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (state) {
            if (!state.getStateFromProp) {
                if (
                    props.currSchedule &&
                    props.currSchedule != state.currSchedule
                ) {
                    return {
                        currSchedule: props.currSchedule,
                        selectedCourse: props.currSchedule.class.course,
                        selectedRoom: props.currSchedule.room,
                        start_time: moment(
                            props.currSchedule.start_time,
                            "HH:mm:ss"
                        ),
                        end_time: moment(
                            props.currSchedule.end_time,
                            "HH:mm:ss"
                        ),
                        getStateFromProp: true,
                    };
                }
            }
        }

        return null;
    }

    componentDidMount = () => {
        const { currSchedule } = this.state;
        const { updateSchedule } = this.props;
        if (updateSchedule) {
            this.getListClass(currSchedule.class.course.id);
            this.setState({ selectedClass: currSchedule.class });
        }
    };

    setSelectedCourse = selectedCourse => {
        this.setState(
            {
                selectedCourse: selectedCourse,
            },
            () => {
                if (this.state.selectedCourse) {
                    this.getListClass(this.state.selectedCourse.id);
                } else {
                    this.setState({ listClass: [] });
                }
            }
        );
    };

    setSelectedClass = selectedClass => {
        this.setState({
            selectedClass: this.state.listClass[selectedClass],
        });
    };

    setSelectedRoom = selectedRoom => {
        this.setState({
            selectedRoom: selectedRoom,
        });
    };

    handleSetStartTime = date => {
        date = moment(date, "HH:mm").set("second", 0);
        this.setState({
            start_time: date,
        });
    };

    handleSetEndTime = date => {
        date = moment(date, "HH:mm").set("second", 0);
        this.setState({
            end_time: date,
        });
    };

    getListClass = courseId => {
        // Call API get List Class
        callApi("for_school/classes/get-list-class-by-course-id", "GET", {
            course_id: courseId,
        })
            .then(res => {
                this.setState({
                    listClass: res.data.data.rows,
                });
            })
            .catch(error => {
                console.log(error);
            });
    };

    toggleConfirmModal = () => {
        this.setState({ confirmModalIsOpen: !this.state.confirmModalIsOpen });
    };

    handleOpenDeleteSchedule = () => {
        this.setState({ confirmModalIsOpen: true });
    };

    handleConfirmDelete = () => {
        const { currSchedule } = this.state;
        const { toggle, getListSchedule } = this.props;
        if (currSchedule) {
            // Call API Delete schedule
            callApi(`for_school/schedules/${currSchedule.id}`, "DELETE", null)
                .then(res => {
                    this.toggleConfirmModal();
                    toggle();
                    getListSchedule();
                })
                .catch(error => {
                    console.log(error);
                });
        }
    };

    handleAddEditSchool = () => {
        let idForm = "add-edit-schedule";
        // Validate form
        validationHelper.validateForm(idForm);
        let formValues = validationHelper.getFormData(idForm);
        if (formValues) {
            const { toggle, getListSchedule, updateSchedule } = this.props;
            const {
                currSchedule,
                selectedClass,
                selectedRoom,
                start_time,
                end_time,
            } = this.state;

            // Check startTime and endTime
            if (!start_time || !end_time)
                return alert("Start Time or End Time must not be empty");
            if (start_time.isAfter(end_time))
                return alert("Start Time must be less than End Time ");

            let formData = {};
            for (const key in formValues) {
                formData[key] = formValues[key];
            }

            for (const key of ["class", "course", "room"]) {
                delete formData[key];
            }

            if (selectedClass) formData["class_id"] = selectedClass["id"];
            if (selectedRoom) formData["room_id"] = selectedRoom["id"];
            formData["start_time"] = start_time.format("HH:mm:ss");
            formData["end_time"] = end_time.format("HH:mm:ss");

            let p = null;
            if (!updateSchedule) {
                p = callApi("for_school/schedules", "POST", null, formData);
            } else
                p = callApi(
                    `for_school/schedules/${currSchedule.id}`,
                    "PUT",
                    null,
                    formData
                );

            // Call API add, edit school
            p.then(res => {
                toggle();
                getListSchedule();
            }).catch(error => {
                let processError = errorHelper.commonProcessError.bind(this);
                processError(error, "SCHEDULE");
            });
        }
    };

    render() {
        const SCHEDULE_RIGHT = LIST_RIGHT_FOR_SCHOOL["DEPARTMENT"]["SCHEDULE"];
        const KEY_CHECK = SCHOOL_ROLE_KEY_CHECK["DEPARTMENT"];

        const { toggle, updateSchedule } = this.props;
        const { currSchedule } = this.state;

        const {
            confirmModalIsOpen,
            selectedCourse,
            selectedRoom,
            selectedClass,
            listClass,
            start_time,
            end_time,
        } = this.state;

        return (
            <Container>
                <Row>
                    <Col md={12} lg={12} xl={12}>
                        <form
                            id="add-edit-schedule"
                            className="form form--horizontal"
                        >
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
                                                        this.setSelectedCourse
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
                                    Lớp học *
                                </label>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-input-wrap">
                                        <Route
                                            render={props => (
                                                <ListClassSelect
                                                    {...props}
                                                    name="class"
                                                    setSelectedClass={
                                                        this.setSelectedClass
                                                    }
                                                    listClass={listClass}
                                                    selectedClass={
                                                        selectedClass
                                                    }
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form__form-group">
                                <label className="form__form-group-label">
                                    Phòng học *
                                </label>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-input-wrap">
                                        <Route
                                            render={props => (
                                                <ListRoomSelect
                                                    {...props}
                                                    name="room"
                                                    setSelectedRoom={
                                                        this.setSelectedRoom
                                                    }
                                                    selectedRoom={selectedRoom}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form__form-group">
                                <label
                                    htmlFor="weekday"
                                    className="form__form-group-label"
                                >
                                    Thứ *
                                </label>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-input-wrap">
                                        <Input
                                            defaultValue={
                                                currSchedule
                                                    ? currSchedule.weekday
                                                    : ""
                                            }
                                            name="weekday"
                                            type="select"
                                        >
                                            <option value="">-Chọn thứ-</option>
                                            <option value="1">Thứ hai</option>
                                            <option value="2">Thứ ba</option>
                                            <option value="3">Thứ tư</option>
                                            <option value="4">Thứ năm</option>
                                            <option value="5">Thứ sáu</option>
                                            <option value="6">Thứ bảy</option>
                                            <option value="0">Chủ nhật</option>
                                        </Input>
                                    </div>
                                </div>
                            </div>

                            <div className="form__form-group">
                                <label className="form__form-group-label">
                                    Thời gian bắt đầu *
                                </label>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-input-wrap">
                                        <CustomTimePicker
                                            style={{ width: "100%" }}
                                            value={start_time}
                                            onChange={this.handleSetStartTime}
                                            placeholder="Thời gian bắt đầu"
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
                                        <CustomTimePicker
                                            className="form-control"
                                            value={end_time}
                                            onChange={this.handleSetEndTime}
                                            placeholder="Thời gian kết thúc"
                                        />
                                    </div>
                                </div>
                            </div>

                            <ButtonToolbar
                                style={{ margin: "10px auto 0 auto" }}
                            >
                                <Route
                                    component={AuthorizarionSchoolComponent(
                                        SCHEDULE_RIGHT["EDIT"],
                                        KEY_CHECK
                                    )(() => (
                                        <Button
                                            color="primary"
                                            type="button"
                                            onClick={this.handleAddEditSchool}
                                        >
                                            {updateSchedule
                                                ? "Cập nhật"
                                                : "Thêm mới"}
                                        </Button>
                                    ))}
                                />

                                {updateSchedule ? (
                                    <Route
                                        component={AuthorizarionSchoolComponent(
                                            SCHEDULE_RIGHT["DELETE"],
                                            KEY_CHECK
                                        )(() => (
                                            <Button
                                                color="danger"
                                                type="button"
                                                onClick={
                                                    this
                                                        .handleOpenDeleteSchedule
                                                }
                                            >
                                                Xóa
                                            </Button>
                                        ))}
                                    />
                                ) : (
                                    ""
                                )}
                                <Button
                                    type="button"
                                    onClick={() => {
                                        toggle();
                                    }}
                                >
                                    Hủy
                                </Button>
                            </ButtonToolbar>

                            <ConfirmModalCustom
                                title="Xóa thời khóa biểu!"
                                message="Bạn chắc chắn có muốn xóa thời khóa biểu này không?"
                                modalIsOpen={confirmModalIsOpen}
                                toggle={this.toggleConfirmModal}
                                handleConfirmAction={this.handleConfirmDelete}
                            />
                        </form>
                    </Col>
                </Row>
            </Container>
        );
    }
}

const tAddEditScheduleForm = translate("common")(AddEditScheduleForm);
const mapStateToProps = () => ({});

export default connect(mapStateToProps)(tAddEditScheduleForm);
