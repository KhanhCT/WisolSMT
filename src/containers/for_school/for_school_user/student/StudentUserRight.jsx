import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import BigCalendar from "react-big-calendar";
import moment from "moment";
import objectLodash from "lodash/object";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import { callApi, userHelper } from "../../../../helpers";
import ListClassSelect from "./ListClassSelect";
import ListTeacherByClass from "./ListTeacherByClass";
import ListStudentByClass from "./ListStudentByClass";
import ClassSchedule from "./ClassSchedule";

// Setup the localizer by providing the moment
BigCalendar.momentLocalizer(moment);

class StudentUserRight extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currClass: null,
            listTeacher: [],
            listStudent: [],
            objCount: {},
            modalIsOpen: false,
            classSchedules: null,
            lstSession: [],
            lstScheduleEvent: [],
            startDateEvent: moment().startOf("week"),
            endDateEvent: moment().endOf("week"),
        };
    }

    toggle = () => {
        this.setState({ modalIsOpen: !this.state.modalIsOpen });
    };

    getListTeacher = () => {
        const { currClass } = this.state;
        if (currClass) {
            // Call API get List teacher by class
            callApi("for_school/teachers/list-teacher-by-class", "GET", {
                class_id: currClass.id,
            })
                .then(res => {
                    this.setState({
                        listTeacher: res.data.data.rows,
                    });
                })
                .catch(error => {
                    console.log(error);
                });
        }
    };

    getListStudent = () => {
        const { currClass } = this.state;
        if (currClass) {
            // Call API get List student by class
            callApi("for_school/students/list-student-by-class", "GET", {
                class_id: currClass.id,
            })
                .then(res => {
                    this.setState({
                        listStudent: res.data.data.rows,
                    });
                })
                .catch(error => {
                    console.log(error);
                });
        }
    };

    countInfoLearnOfStudent = () => {
        const { currClass } = this.state;
        let userStorage = userHelper.getUserFromStorage();
        let soBuoiNghi = 0;
        let soBuoiDaHoc = 0;
        let soBuoiChoXacNhan = 0;
        if (currClass) {
            // Call API get List student by class
            callApi("for_school/students/count-info-learn-of-student", "GET", {
                class_id: currClass.id,
                student_id: userStorage["user_id"],
            })
                .then(res => {
                    let countData = res.data.data.rows;
                    countData.map(item => {
                        item.students.map(itemStudent => {
                            let studentSession = itemStudent.student_session;
                            if (studentSession["truant"]) soBuoiNghi++;
                            if (!studentSession["truant"]) soBuoiDaHoc++;
                            if (
                                !studentSession["truant"] &&
                                !studentSession["active_attendance_record"]
                            )
                                soBuoiChoXacNhan++;
                        });
                    });
                    this.setState({
                        objCount: {
                            so_buoi_nghi: soBuoiNghi,
                            so_buoi_da_hoc: soBuoiDaHoc,
                            so_buoi_cho_xac_nhan: soBuoiChoXacNhan,
                        },
                    });
                })
                .catch(error => {
                    console.log(error);
                });
        }
    };

    getClassSchedule = () => {
        const { currClass } = this.state;
        if (currClass) {
            callApi("for_school/schedules/get-by-teacher", "GET", {
                class_id: currClass.id,
            })
                .then(res => {
                    let schedules = res.data.data.rows;
                    let convertSchedules = {};
                    schedules.map(schedule => {
                        let weekDay = schedule.weekday;
                        if (!objectLodash.hasIn(convertSchedules, weekDay))
                            convertSchedules[weekDay] = [schedule];
                        else convertSchedules[weekDay].push(schedule);
                    });
                    this.setState({ classSchedules: convertSchedules }, () =>
                        this.createLstScheduleEvent()
                    );
                })
                .catch(error => {
                    this.setState({
                        classSchedules: null,
                        lstScheduleEvent: [],
                    });
                    console.log(error);
                });
        }
    };

    getClassSession = () => {
        const { currClass, startDateEvent, endDateEvent } = this.state;
        const { infoStudent } = this.props;
        if (currClass && infoStudent) {
            callApi("for_school/sessions/get-by-student", "GET", {
                student_id: infoStudent.id,
                class_id: currClass.id,
                start_date: moment(startDateEvent).format("YYYY-MM-DD"),
                end_date: moment(endDateEvent).format("YYYY-MM-DD"),
            })
                .then(res => {
                    this.createLstSessionEvent(res.data.data.rows);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    };

    setSelectedClass = selectedClass => {
        this.setState({ currClass: null }, () => {
            this.setState({ currClass: selectedClass }, () => {
                this.getListTeacher();
                this.getListStudent();
                this.countInfoLearnOfStudent();
                this.getClassSchedule();
                this.getClassSession();
            });
        });
    };

    handleSetDateEvent = (startDate, endDate) => {
        this.setState(
            { startDateEvent: startDate, endDateEvent: endDate },
            () => {
                this.getClassSession();
                this.createLstScheduleEvent();
            }
        );
    };

    createLstScheduleEvent = () => {
        const { classSchedules, startDateEvent, endDateEvent } = this.state;
        const range = moment.range(startDateEvent, endDateEvent);

        let lstEvent = [];
        for (let day of range.by("day")) {
            let dayEvent = moment(day).format("YYYY-MM-DD");
            let dayNumber = day.day();
            if (objectLodash.hasIn(classSchedules, dayNumber)) {
                let dayScheduleArr = classSchedules[dayNumber];
                dayScheduleArr.map(schedule => {
                    let startTime = `${dayEvent} ${schedule.start_time}`,
                        endTime = `${dayEvent} ${schedule.end_time}`,
                        startLocalTime = moment(startTime).format(
                            "YYYY-MM-DD HH:mm:ss"
                        ),
                        endLocalTime = moment(endTime).format(
                            "YYYY-MM-DD HH:mm:ss"
                        );

                    let eventStart = new Date(startLocalTime),
                        eventEnd = new Date(endLocalTime);
                    let event = {
                        id: new Date().getTime(),
                        title: `${schedule.class.name} - ${schedule.room.name}`,
                        start: eventStart,
                        end: eventEnd,
                        type: "schedule",
                        // For modal
                        room: schedule.room,
                        date: day,
                        startTime: moment(eventStart),
                        endTime: moment(eventEnd),
                    };
                    lstEvent.push(event);
                });
            }
        }
        this.setState({ lstScheduleEvent: [] }, () =>
            this.setState({ lstScheduleEvent: lstEvent })
        );
    };

    createLstSessionEvent = lstSessionData => {
        let lstSession = lstSessionData.map(session => {
            // Calculate priority
            let priority = "confirm-all",
                startTime = new Date(session.start_time),
                endTime = new Date(session.end_time),
                checkAllTruant = true;
            const { students } = session;
            for (const student of students) {
                let studentSession = student.student_session;
                if (!studentSession.truant) {
                    checkAllTruant = false;
                    if (!studentSession.active_attendance_record) {
                        priority = "not-confirm-all";
                        break;
                    }
                }
            }
            if (checkAllTruant) priority = "truant-all";
            return {
                id: session.id,
                title: `${session.class.name} - ${session.room.name}`,
                start: startTime,
                end: endTime,
                priority: priority,
                type: "session",
                room: session.room,
                date: moment(session.date),
                startTime: moment(startTime),
                endTime: moment(endTime),
            };
        });
        this.setState({ lstSession: lstSession });
    };

    render() {
        const {
            listTeacher,
            listStudent,
            objCount,
            lstScheduleEvent,
            currClass,
            lstSession,
        } = this.state;
        const { infoStudent, t } = this.props;
        const studentTranKey = `for_school:STUDENT.rightbar`;
        return (
            <Col sm={9} className="student-user-right">
                <hr className="mt-0" />
                <ListClassSelect setSelectedClass={this.setSelectedClass} />
                <hr />
                <Row>
                    <Col sm={11} xs={11}>
                        <p className="dots">
                            <span>
                                {t(`${studentTranKey}.confirmed_sessions`)}
                            </span>
                        </p>
                        <p className="dots">
                            <span>
                                {t(`${studentTranKey}.not_confirmed_sessions`)}
                            </span>
                        </p>
                        <p className="dots">
                            <span>{t(`${studentTranKey}.delay_sessions`)}</span>
                        </p>
                    </Col>
                    <Col sm={1} xs={1}>
                        <p>{objCount ? objCount["so_buoi_da_hoc"] : ""}</p>
                        <p>
                            {objCount ? objCount["so_buoi_cho_xac_nhan"] : ""}
                        </p>
                        <p>{objCount ? objCount["so_buoi_nghi"] : ""}</p>
                    </Col>
                </Row>
                <hr />
                <ClassSchedule
                    currClass={currClass}
                    infoStudent={infoStudent}
                    lstScheduleEvent={lstScheduleEvent}
                    lstSession={lstSession}
                    handleSetDateEvent={this.handleSetDateEvent}
                    getClassSession={this.getClassSession}
                    countInfoLearnOfStudent={this.countInfoLearnOfStudent}
                    getInfoStudentByUser={this.props.getInfoStudentByUser}
                />
                <hr />
                <ListTeacherByClass listTeacher={listTeacher} />
                <hr />
                <ListStudentByClass listStudent={listStudent} />
            </Col>
        );
    }
}

const mapStateToProps = state => {
    const { forSchoolReducer } = state;
    return {
        infoStudent: forSchoolReducer.infoStudent,
    };
};

const tStudentUserRight = connect(mapStateToProps)(
    translate(["common", "for_school"])(StudentUserRight)
);
export { tStudentUserRight as StudentUserRight };
