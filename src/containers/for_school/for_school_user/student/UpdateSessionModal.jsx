import React, { Component } from "react";
import { Button, ButtonToolbar } from "reactstrap";
import Moment from "moment";
import {
    CustomDatePicker,
    CustomTimePicker,
} from "../../../../components/common";
import { ModalComponent } from "../../../../components/bases";
import "react-toggle/style.css";
import ListRoomSelect from "./ListRoomSelect";
import { callApi } from "../../../../helpers";
import { translate } from "react-i18next";
import { connect } from "react-redux";

class UpdateSessionModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currDate: null,
            currEnd: null,
            currRoom: null,
            currStart: null,
            currSession: null,
        };
    }

    static getDerivedStateFromProps(props, state) {
        let newCurrSession = null;
        const { currSession } = props;
        if (state)
            if (currSession)
                if (
                    !state.currSession ||
                    state.currSession.id !== currSession.id
                ) {
                    newCurrSession = currSession;
                    // Calculate data
                    return {
                        currDate: newCurrSession.date,
                        currEnd: newCurrSession.endTime,
                        currRoom: newCurrSession.room,
                        currStart: newCurrSession.startTime,
                        currSession: newCurrSession,
                    };
                }
        return null;
    }

    handleUpdateSession = () => {
        const { infoStudent } = this.props;
        const { currSession } = this.state;

        let startTime = currSession.startTime;
        let endTime = currSession.endTime;
        let minute = Moment(endTime).diff(startTime, "minute");

        let sessionData = {
            student_id: infoStudent.id,
            session_id: currSession.id,
            total_minute_learn: minute,
        };

        callApi(
            `for_school/sessions/update-session-of-student/${currSession.id}`,
            "PUT",
            null,
            sessionData
        )
            .then(res => {
                this.props.getClassSession();
                this.props.countInfoLearnOfStudent();
                this.props.getInfoStudentByUser();
                this.props.toggle();
            })
            .catch(error => {
                console.log(error);
            });
    };

    render() {
        const {
            currDate,
            currStart,
            currEnd,
            currRoom,
            currSession,
        } = this.state;
        const { modalIsOpen, toggle, t } = this.props;

        return (
            <ModalComponent
                color="primary"
                class="modal-for-school modal-650"
                title={t("common.update")}
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
                            htmlFor="phone"
                            className="form__form-group-label"
                        >
                            {t("common.classroom")}
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
                            {t("common.date")}
                        </label>
                        <div className="form__form-group-field">
                            <div className="form__form-group-input-wrap">
                                <CustomDatePicker
                                    placeholderText="Ngày học"
                                    name="date"
                                    value={currDate}
                                    showTimeSelect={false}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form__form-group">
                        <label
                            htmlFor="address"
                            className="form__form-group-label"
                        >
                            {t("common.start_time")}
                        </label>
                        <div className="form__form-group-field">
                            <CustomTimePicker
                                name="start_time"
                                style={{ width: "100%" }}
                                value={currStart}
                                placeholder="Thời gian bắt đầu"
                            />
                        </div>
                    </div>

                    <div className="form__form-group">
                        <label
                            htmlFor="manager"
                            className="form__form-group-label"
                        >
                            {t("common.end_time")}
                        </label>
                        <div className="form__form-group-field">
                            <CustomTimePicker
                                name="end_time"
                                style={{ width: "100%" }}
                                value={currEnd}
                                placeholder="Thời gian kết thúc"
                            />
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
                            onClick={() => {
                                toggle();
                            }}
                        >
                            {t("common.cancel")}
                        </Button>
                    </ButtonToolbar>
                </form>
            </ModalComponent>
        );
    }
}
const mapStateToProps = state => {
    const { forSchoolReducer } = state;
    return {
        infoStudent: forSchoolReducer.infoStudent,
    };
};

const tUpdateSessionModal = connect(mapStateToProps)(
    translate(["common", "for_school"])(UpdateSessionModal)
);
export default tUpdateSessionModal;
