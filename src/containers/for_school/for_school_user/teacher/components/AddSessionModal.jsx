import React, { Component } from "react";
import { Button, ButtonToolbar } from "reactstrap";
import {
    CustomDatePicker,
    CustomTimePicker,
} from "../../../../../components/common";
import { ModalComponent } from "../../../../../components/bases";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import ListRoomSelect from "./ListRoomSelect";
import { callApi, errorHelper } from "../../../../../helpers";
import { translate } from "react-i18next";
import { connect } from "react-redux";

class AddSessionModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lstIdStudentTruant: [],
        };
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

    handleAddAttendanceRecord = () => {
        const {
            currDate,
            currStart,
            currEnd,
            currRoom,
            user,
            currClass,
        } = this.props;
        const { lstIdStudentTruant } = this.state;
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
        callApi("for_school/sessions", "POST", null, sessionData)
            .then(res => {
                this.props.getClassSession();
                this.props.getTeacherInfo();
                this.props.getListClass();
                this.props.toggle();
            })
            .catch(error => {
                let processError = errorHelper.commonProcessError.bind(this);
                processError(error, "ADD_SESSION");
            });
    };

    render() {
        const {
            modalIsOpen,
            toggle,
            currClass,
            currDate,
            currStart,
            currEnd,
            currRoom,
            t,
        } = this.props;
        let renderCheckIn = null;
        if (currClass) {
            const { students } = currClass;
            renderCheckIn = students.map((student, index) => {
                return (
                    <li key={index}>
                        {student.user.fullname}{" "}
                        <Toggle
                            defaultChecked={true}
                            onChange={event =>
                                this.handleToggleChange(student.id, event)
                            }
                        />
                    </li>
                );
            });
        }

        const sessionTranKey = `for_school:TEACHER.session`;

        return (
            <div>
                <ModalComponent
                    color="primary"
                    class="modal-for-school modal-650"
                    title={t(`${sessionTranKey}.add_session`)}
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
                                        setSelectedRoom={
                                            this.props.setSelectedRoom
                                        }
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
                                        setSelectedDate={
                                            this.props.handleChangeDate
                                        }
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
                                    onChange={this.props.handleSetStartTime}
                                    placeholder={t(
                                        `${sessionTranKey}.start_time`
                                    )}
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
                                    onChange={this.props.handleSetEndTime}
                                    placeholder={t(
                                        `${sessionTranKey}.end_time`
                                    )}
                                />
                            </div>
                        </div>

                        <ButtonToolbar style={{ margin: "10px auto 0 auto" }}>
                            <Button
                                color="primary"
                                type="button"
                                onClick={this.handleAddAttendanceRecord}
                            >
                                {t("common.add")}
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
                </ModalComponent>
            </div>
        );
    }
}

const tTrans = translate(["common", "for_school"])(AddSessionModal);
const mapStateToProps = () => ({});
export default connect(mapStateToProps)(tTrans);
