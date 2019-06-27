import React, { Component } from "react";
import { translate } from "react-i18next";
import { Row, Col } from "reactstrap";
import moment from "moment";

class TeacherClassInfo extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { currClass, t } = this.props;
        const teacherTranKey = `for_school:TEACHER.tabbar`;
        let totalSession = 0,
            numberSessionConfirm = 0,
            totalHour = 0,
            numberHourConfirm = 0;
        // Calculate data
        if (currClass) {
            let sessions = currClass.sessions;
            totalSession = sessions.length;
            sessions.map(session => {
                // Count total hour
                let sessionStart = moment(session.start_time),
                    sessionEnd = moment(session.end_time);
                totalHour += moment
                    .duration(sessionEnd.diff(sessionStart))
                    .as("hour");
                let students = session.students;
                let checkAllConfirm = true;
                students.map(student => {
                    let studentSession = student.student_session;
                    if (
                        !studentSession.active_attendance_record &&
                        !studentSession.truant
                    )
                        checkAllConfirm = false;
                });
                if (checkAllConfirm) {
                    numberSessionConfirm += 1;
                    let sessionStart = moment(session.start_time),
                        sessionEnd = moment(session.end_time);
                    numberHourConfirm += moment
                        .duration(sessionEnd.diff(sessionStart))
                        .as("hour");
                }
            });
        }

        return (
            <Row>
                <Col sm={6}>
                    <Row>
                        <Col sm={10} xs={10}>
                            <p className="dots">
                                <span>
                                    {t(
                                        `${teacherTranKey}.total_number_sessions`
                                    )}
                                </span>
                            </p>
                            <p className="dots">
                                <span>
                                    {t(
                                        `${teacherTranKey}.confirmed_number_sessions`
                                    )}
                                </span>
                            </p>
                            <p className="dots">
                                <span>
                                    {t(
                                        `${teacherTranKey}.not_confirmed_number_sessions`
                                    )}
                                </span>
                            </p>
                        </Col>
                        <Col sm={2} xs={2}>
                            <p>{totalSession}</p>
                            <p>{numberSessionConfirm}</p>
                            <p>{totalSession - numberSessionConfirm}</p>
                        </Col>
                    </Row>
                </Col>
                <Col sm={6}>
                    <Row>
                        <Col sm={10} xs={10}>
                            <p className="dots">
                                <span>
                                    {t(`${teacherTranKey}.total_number_hours`)}
                                </span>
                            </p>
                            <p className="dots">
                                <span>
                                    {t(
                                        `${teacherTranKey}.confirmed_number_hours`
                                    )}
                                </span>
                            </p>
                            <p className="dots">
                                <span>
                                    {t(
                                        `${teacherTranKey}.not_confirmed_number_hours`
                                    )}
                                </span>
                            </p>
                        </Col>
                        <Col sm={2} xs={2}>
                            <p>{totalHour}</p>
                            <p>{numberHourConfirm}</p>
                            <p>{totalHour - numberHourConfirm}</p>
                        </Col>
                    </Row>
                </Col>
            </Row>
        );
    }
}

const tTeacherClassInfo = translate(["common", "for_school"])(TeacherClassInfo);
export default tTeacherClassInfo;
