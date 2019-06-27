import React, { Component } from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import ListClass from "./components/ListClass";
// import ListTeacher from "./components/ListTeacher";
import ListStudent from "./components/ListStudent";
import TeacherVoting from "./components/TeacherVoting";
import ClassSchedule from "./components/ClassSchedule";
import TeacherDetail from "./components/TeacherDetail";
import TeacherInfo from "./components/TeacherInfo";
import TeacherClassInfo from "./components/TeacherClassInfo";
// import AttendanceRecord from "./components/AttendanceRecord";
import { callApi } from "../../../../helpers";
import Moment from "moment";
import { extendMoment } from "moment-range";
import objectLodash from "lodash/object";

const moment = extendMoment(Moment);

export default class MainTeacherUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            lstClass: [],
            currClass: null,
            classSchedules: null,
            lstSession: [],
            lstScheduleEvent: [],
            startDateEvent: moment().startOf("week"),
            endDateEvent: moment().endOf("week"),
        };
    }

    componentDidMount = () => {
        this.getTeacherInfo();
    };

    handleBack = () => {
        this.props.history.goBack();
    };

    // Get user info
    getTeacherInfo = () => {
        callApi("for_school/teachers/detail", "GET", null)
            .then(res => {
                // Convert rating to object if type is string
                let userData = res.data.data;
                if (typeof userData.teacher.rating === "string")
                    userData.teacher.rating = JSON.parse(
                        userData.teacher.rating
                    );
                this.setState({ user: userData }, () => this.getListClass());
            })
            .catch(error => {
                console.log(error);
            });
    };

    // Get list class of teacher
    getListClass = () => {
        callApi("for_school/teachers/list-class", "GET", null)
            .then(res => {
                this.setState({ currClass: null }, () => {
                    this.setState(
                        {
                            lstClass: res.data.data.rows,
                            currClass: res.data.data.rows[0],
                        },
                        () => {
                            this.getClassSession();
                            this.getClassSchedule();
                        }
                    );
                });
            })
            .catch(error => {
                console.log(error);
            });
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
        const { user, currClass, startDateEvent, endDateEvent } = this.state;
        callApi("for_school/sessions", "GET", {
            teacher_id: user.teacher.id,
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
    };

    handleChangeClass = index => {
        this.setState({ currClass: null }, () => {
            this.setState({ currClass: this.state.lstClass[index] }, () => {
                this.getClassSchedule();
                this.getClassSession();
            });
        });
    };

    handleSetDateEvent = (startDate, endDate) => {
        this.setState(
            { startDateEvent: startDate, endDateEvent: endDate },
            () => {
                this.createLstScheduleEvent();
                this.getClassSession();
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
                students: session.students,
            };
        });
        this.setState({ lstSession: lstSession });
    };

    render() {
        const {
            user,
            lstClass,
            currClass,
            lstScheduleEvent,
            lstSession,
        } = this.state;
        const { location } = this.props;
        return (
            <Container className="responsive">
                <h4 className="mb-3">
                    {" "}
                    <a
                        className="hover-back text-secondary"
                        onClick={this.handleBack}
                    >
                        <i className="fal fa-long-arrow-left" /> &nbsp;&nbsp;Trở
                        lại
                    </a>
                </h4>
                <Card className="responsive">
                    <CardBody>
                        <Row className="ml-0 mr-0">
                            <Col sm={3} className="student-user-left p-2">
                                <TeacherDetail user={user} />
                                <hr />
                                <TeacherInfo lstClass={lstClass} />
                                <hr />
                                <TeacherVoting user={user} />
                            </Col>
                            <Col sm={9} className="student-user-right">
                                <hr className="mt-0" />
                                <ListClass
                                    lstClass={lstClass}
                                    currClass={currClass}
                                    handleChangeClass={this.handleChangeClass}
                                />
                                <hr />
                                <TeacherClassInfo currClass={currClass} />
                                <hr />
                                <ClassSchedule
                                    currClass={currClass}
                                    user={user}
                                    lstScheduleEvent={lstScheduleEvent}
                                    lstSession={lstSession}
                                    handleSetDateEvent={this.handleSetDateEvent}
                                    getClassSession={this.getClassSession}
                                    getTeacherInfo={this.getTeacherInfo}
                                    getListClass={this.getListClass}
                                />
                                {/* <hr />
                                    <AttendanceRecord currClass={currClass} /> */}
                                {/* <hr /> */}
                                {/* <ListTeacher /> */}
                                <hr />
                                <ListStudent currClass={currClass} />
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Container>
        );
    }
}
