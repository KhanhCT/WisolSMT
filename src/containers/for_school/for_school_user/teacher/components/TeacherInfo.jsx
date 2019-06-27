import React, { Component } from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import moment from "moment";

class TeacherInfo extends Component {
    render() {
        const { currDept, lstClass } = this.props;
        let numberClassOfMonth = 0,
            numberHourOfMonth = 0,
            numberHourConfirmOfMonth = 0;
        // Get start month and end month
        let startMonth = moment()
                .startOf("month")
                .add(-1, "day"),
            endMonth = moment()
                .endOf("month")
                .add(1, "day");
        // Count number class of this month
        lstClass.map(classData => {
            let startClass = moment(classData["start_date"]);
            if (startClass.isBetween(startMonth, endMonth)) {
                numberClassOfMonth += 1;
                let sessions = classData.sessions;
                sessions.map(session => {
                    // Count total hour
                    let sessionStart = moment(session.start_time),
                        sessionEnd = moment(session.end_time);
                    numberHourOfMonth += moment
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
                        let sessionStart = moment(session.start_time),
                            sessionEnd = moment(session.end_time);
                        numberHourConfirmOfMonth += moment
                            .duration(sessionEnd.diff(sessionStart))
                            .as("hour");
                    }
                });
            }
        });

        return (
            <div className="main-info">
                <p className="font-weight-bold">Cơ sở theo học:</p>
                <p className="mt-0">{currDept.name}</p>
                <p className="font-weight-bold">Địa chỉ:</p>
                <p className="mt-0">{currDept.address}</p>
                <p className="font-weight-bold mb-3">Tháng này</p>
                <div className="d-flex mb-3">
                    <div className="mr-auto">Số giờ đã dạy học</div>
                    <div className="position-relative mr-3">
                        <div
                            className="bg-lightgrey center rounded-circle"
                            style={{
                                width: "28px",
                                height: "28px",
                            }}
                        >
                            <span className="center">
                                <b>{numberHourOfMonth}</b>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="d-flex mb-3">
                    <div className="mr-auto">Số giờ học viên đã xác nhận</div>
                    <div className="position-relative mr-3">
                        <div
                            className="bg-lightgrey center rounded-circle"
                            style={{
                                width: "28px",
                                height: "28px",
                            }}
                        >
                            <span className="center">
                                <b>{numberHourConfirmOfMonth}</b>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="d-flex mb-3">
                    <div className="mr-auto">Số giờ đang chờ xác nhận</div>
                    <div className="position-relative mr-3">
                        <div
                            className="bg-lightgrey center rounded-circle"
                            style={{
                                width: "28px",
                                height: "28px",
                            }}
                        >
                            <span className="center">
                                <b>
                                    {numberHourOfMonth -
                                        numberHourConfirmOfMonth}
                                </b>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="d-flex mb-3">
                    <div className="mr-auto">Số lớp nhận mới</div>
                    <div className="position-relative mr-3">
                        <div
                            className="bg-lightgrey center rounded-circle"
                            style={{
                                width: "28px",
                                height: "28px",
                            }}
                        >
                            <span className="center">
                                <b>{numberClassOfMonth}</b>
                            </span>
                        </div>
                    </div>
                </div>
                {/* <div className="d-flex mb-3">
                    <div className="mr-auto">Đánh giá tháng này</div>
                    <div className="position-relative">
                        <div
                            className="bg-lightgrey center rounded-circle"
                            style={{
                                width: "28px",
                                height: "28px",
                            }}
                        >
                            <span className="center">
                                <b>1</b>
                            </span>
                        </div>
                    </div>
                </div> */}
            </div>
        );
    }
}

const tTeacherInfo = translate(["common", "for_school"])(TeacherInfo);
const mapStateToProps = state => {
    const { forSchoolReducer } = state;
    return {
        currDept: forSchoolReducer.currDept,
    };
};
export default connect(mapStateToProps)(tTeacherInfo);
