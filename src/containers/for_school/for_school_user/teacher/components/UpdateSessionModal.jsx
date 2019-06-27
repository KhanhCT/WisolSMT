import React, { Component } from "react";
import { Button, ButtonToolbar } from "reactstrap";
import {
    CustomDatePicker,
    CustomTimePicker,
    ConfirmModalCustom,
} from "../../../../../components/common";
import { ModalComponent } from "../../../../../components/bases";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import ListRoomSelect from "./ListRoomSelect";
import { callApi, errorHelper } from "../../../../../helpers";
import moment from "moment";
import { translate } from "react-i18next";
import { connect } from "react-redux";

class UpdateSessionModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lstIdStudentTruant: [],
            currDate: null,
            currEnd: null,
            currRoom: null,
            currStart: null,
            currSession: null,
            modalDeleteSessionIsOpen: false,
        };
    }

    static getDerivedStateFromProps(props, state) {
        let newCurrSession = null,
            lstIdStudentTruant = [];
        const { currSession } = props;
        if (currSession && state)
            if (!state.currSession || state.currSession.id !== currSession.id) {
                newCurrSession = currSession;
                const { students } = newCurrSession;
                students.map(student => {
                    let studentSession = student.student_session;
                    if (studentSession.truant)
                        lstIdStudentTruant.push(student.id);
                });
                // Calculate data
                return {
                    currDate: newCurrSession.date,
                    currEnd: newCurrSession.endTime,
                    currRoom: newCurrSession.room,
                    currStart: newCurrSession.startTime,
                    currSession: newCurrSession,
                    lstIdStudentTruant: lstIdStudentTruant,
                };
            }
        return null;
    }

    handleToggleChange = (studentId, event) => {
        let newLstStudentTruant = [...this.state.lstIdStudentTruant];
        if (newLstStudentTruant.includes(studentId)) {
            if (event.target.checked)
                newLstStudentTruant = newLstStudentTruant.filter(
                    id => id !== studentId
                );
        } else {
            if (!event.target.checked)
                newLstStudentTruant = [...newLstStudentTruant, studentId];
        }
        this.setState({ lstIdStudentTruant: newLstStudentTruant });
    };

    handleUpdateSession = () => {
        const { user, currClass } = this.props;
        const {
            lstIdStudentTruant,
            currDate,
            currStart,
            currEnd,
            currRoom,
            currSession,
        } = this.state;
        if (!currStart || !currEnd || !currDate || !currRoom)
            return alert("Start Time, End Time, Date, Room must be not null");
        else if (currStart.isAfter(currEnd))
            return alert("Start Time must be less than End Time ");
        // Add date to Time
        let convertStartTime = new Date(
                `${currDate.format("YYYY-MM-DD")} ${currStart.format(
                    "HH:mm:ss"
                )}`
            ),
            convertEndTime = new Date(
                `${currDate.format("YYYY-MM-DD")} ${currEnd.format("HH:mm:ss")}`
            );
        let sessionData = {
            date: currDate,
            start_time: convertStartTime,
            end_time: convertEndTime,
            number_break: lstIdStudentTruant.length,
            teacher_id: user.teacher.id,
            room_id: currRoom.id,
            class_id: currClass.id,
            lstIdStudentTruant: lstIdStudentTruant,
            lstIdStudent: currClass.students.map(student => student.id),
        };
        callApi(
            `for_school/sessions/${currSession.id}`,
            "PUT",
            null,
            sessionData
        )
            .then(res => {
                this.props.getClassSession();
                this.props.toggle();
            })
            .catch(error => {
                let processError = errorHelper.commonProcessError.bind(this);
                processError(error, "UPDATE_SESSION");
            });
    };

    handleDeleteSession = () => {
        const { currSession } = this.state;
        callApi(`for_school/sessions/${currSession.id}`, "DELETE", null)
            .then(res => {
                this.props.getClassSession();
                this.props.getTeacherInfo();
                this.props.getListClass();
                this.props.toggle();
            })
            .catch(error => {
                let processError = errorHelper.commonProcessError.bind(this);
                processError(error, "DELETE_SESSION");
            });
    };

    // Onchange state of edit session
    handleChangeDate = value => {
        this.setState({ currDate: value });
    };

    handleSetStartTime = time => {
        time = moment(time, "HH:mm").set("second", 0);
        this.setState({
            currStart: time,
        });
    };

    handleSetEndTime = time => {
        time = moment(time, "HH:mm").set("second", 0);
        this.setState({
            currEnd: time,
        });
    };

    setSelectedRoom = selectedRoom => {
        this.setState({
            currRoom: selectedRoom,
        });
    };

    toggleModalDeleteSession = () => {
        this.setState({
            modalDeleteSessionIsOpen: !this.state.modalDeleteSessionIsOpen,
        });
    };

    render() {
        const {
            currDate,
            currStart,
            currEnd,
            currRoom,
            currSession,
            lstIdStudentTruant,
            modalDeleteSessionIsOpen,
        } = this.state;
        const { modalIsOpen, toggle, t } = this.props;
        let renderCheckIn = null,
            renderLstStudentCheckedIn = null,
            renderLstStudentNotCheckedIn = null;
        if (currSession) {
            const { students } = currSession;
            renderCheckIn = students.map((student, index) => {
                return (
                    <li key={index}>
                        {student.user.fullname}{" "}
                        <Toggle
                            defaultChecked={
                                lstIdStudentTruant.includes(student.id)
                                    ? false
                                    : true
                            }
                            onChange={event =>
                                this.handleToggleChange(student.id, event)
                            }
                        />
                    </li>
                );
            });
            renderLstStudentCheckedIn = students.map((student, index) => {
                let studentSession = student.student_session;
                if (
                    studentSession.active_attendance_record &&
                    !studentSession.truant
                )
                    return (
                        <li key={index}>
                            <strong className="text-success">
                                {student.user.fullname}
                            </strong>
                        </li>
                    );
            });
            renderLstStudentNotCheckedIn = students.map((student, index) => {
                let studentSession = student.student_session;
                if (
                    !studentSession.active_attendance_record &&
                    !studentSession.truant
                )
                    return (
                        <li key={index}>
                            <strong className="text-danger">
                                {student.user.fullname}
                            </strong>
                        </li>
                    );
            });
        }

        const sessionTranKey = `for_school:TEACHER.session`;

        return (
            <ModalComponent
                color="primary"
                class="modal-for-school modal-650"
                title={t(`${sessionTranKey}.update_session`)}
                header
                toggle={toggle}
                isOpen={modalIsOpen}
                size="lg"
            >
                <form
                    id="add-edit-department"
                    className="form form--horizontal"
                >
                    <div className="form__form-group">
                        <label
                            htmlFor="name"
                            className="form__form-group-label"
                        >
                            {t(`${sessionTranKey}.attendance`)}
                        </label>
                        <div className="form__form-group-field">
                            <div className="form__form-group-input-wrap">
                                <ol>{renderCheckIn}</ol>
                            </div>
                        </div>
                    </div>

                    <div className="form__form-group">
                        <label
                            htmlFor="phone"
                            className="form__form-group-label"
                        >
                            {t(`${sessionTranKey}.choose_room`)}
                        </label>
                        <div className="form__form-group-field">
                            <div className="form__form-group-input-wrap">
                                <ListRoomSelect
                                    setSelectedRoom={this.setSelectedRoom}
                                    selectedRoom={currRoom}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form__form-group">
                        <label
                            htmlFor="phone"
                            className="form__form-group-label"
                        >
                            {t(`${sessionTranKey}.learning_date`)}
                        </label>
                        <div className="form__form-group-field">
                            <div className="form__form-group-input-wrap">
                                <CustomDatePicker
                                    placeholderText={t(
                                        `${sessionTranKey}.learning_date`
                                    )}
                                    name="date"
                                    value={currDate}
                                    showTimeSelect={false}
                                    setSelectedDate={this.handleChangeDate}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form__form-group">
                        <label
                            htmlFor="address"
                            className="form__form-group-label"
                        >
                            {t(`${sessionTranKey}.start_time`)}
                        </label>
                        <div className="form__form-group-field">
                            <CustomTimePicker
                                name="start_time"
                                style={{ width: "100%" }}
                                value={currStart}
                                onChange={this.handleSetStartTime}
                                placeholder={t(`${sessionTranKey}.start_time`)}
                            />
                        </div>
                    </div>

                    <div className="form__form-group">
                        <label
                            htmlFor="manager"
                            className="form__form-group-label"
                        >
                            {t(`${sessionTranKey}.end_time`)}
                        </label>
                        <div className="form__form-group-field">
                            <CustomTimePicker
                                name="end_time"
                                style={{ width: "100%" }}
                                value={currEnd}
                                onChange={this.handleSetEndTime}
                                placeholder={t(`${sessionTranKey}.end_time`)}
                            />
                        </div>
                    </div>

                    <div className="form__form-group">
                        <label
                            htmlFor="manager"
                            className="form__form-group-label"
                        >
                            {t(`${sessionTranKey}.list_student_confirm`)}
                        </label>
                        <div className="form__form-group-field">
                            <ol>{renderLstStudentCheckedIn}</ol>
                        </div>
                    </div>

                    <div className="form__form-group">
                        <label
                            htmlFor="manager"
                            className="form__form-group-label"
                        >
                            {t(`${sessionTranKey}.list_student_unconfirm`)}
                        </label>
                        <div className="form__form-group-field">
                            <ol>{renderLstStudentNotCheckedIn}</ol>
                        </div>
                    </div>

                    <ButtonToolbar style={{ margin: "10px auto 0 auto" }}>
                        {currSession &&
                        currSession.priority !== "confirm-all" ? (
                            <Button
                                color="primary"
                                onClick={this.handleUpdateSession}
                            >
                                {t("common.update")}
                            </Button>
                        ) : null}
                        <Button
                            color="danger"
                            onClick={() => {
                                this.setState({
                                    modalDeleteSessionIsOpen: true,
                                });
                            }}
                        >
                            {t("common.delete")}
                        </Button>
                        <Button
                            onClick={() => {
                                toggle();
                            }}
                        >
                            {t("common.cancel")}
                        </Button>
                    </ButtonToolbar>
                </form>
                <ConfirmModalCustom
                    title="Xoá Session!"
                    message="Bạn chắc chắn có muốn xoá thông tin buổi học này?"
                    modalIsOpen={modalDeleteSessionIsOpen}
                    toggle={this.toggleModalDeleteSession}
                    handleConfirmAction={this.handleDeleteSession}
                />
            </ModalComponent>
        );
    }
}

const tTrans = translate(["common", "for_school"])(UpdateSessionModal);
const mapStateToProps = () => ({});
export default connect(mapStateToProps)(tTrans);
