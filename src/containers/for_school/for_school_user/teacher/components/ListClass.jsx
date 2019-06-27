import React, { Component } from "react";
import { translate } from "react-i18next";
import moment from "moment";

class ListClass extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { lstClass, currClass, handleChangeClass } = this.props;
        let statusClass = "",
            textClass = "";
        let renderData = lstClass.map((classData, index) => {
            let numberHourConfirm = 0;
            let sessions = classData.sessions;
            let classStatus = classData.status;
            sessions.map(session => {
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
                    numberHourConfirm += moment
                        .duration(sessionEnd.diff(sessionStart))
                        .as("hour");
                }
            });
            switch (classStatus) {
                case 1:
                    statusClass = "bg-blue";
                    textClass = "text-darkblue";
                    break;
                case 2:
                    statusClass = "bg-green";
                    textClass = "text-darkgreen";
                    break;
                case 3:
                    statusClass = "bg-orange";
                    textClass = "text-darkorange";
                    break;
                default:
                    break;
            }
            return (
                <a
                    href="javascript:;"
                    key={index}
                    onClick={() => handleChangeClass(index)}
                >
                    <div
                        className="p-2"
                        style={{
                            display: "inline-block",
                        }}
                    >
                        <div
                            className={`circle-text ${statusClass} position-relative`}
                        >
                            {currClass && currClass.id === classData.id ? (
                                <span className="active center rounded-circle" />
                            ) : null}

                            <span
                                className={`center fontSize24 ${textClass}`}
                                style={{
                                    top: "40%",
                                }}
                            >
                                +{numberHourConfirm}
                            </span>
                            {/* <img
                        className="center rounded-circle"
                        style={{
                            width: "42px",
                            top: "82%",
                            border: "3px solid white",
                        }}
                        src="https://sunlimetech.com/portfolio/boot4menu/assets/imgs/team/img_01.png"
                        alt="card image"
                    /> */}
                        </div>
                        <p className="personal-role mt-2 font-weight-bold text-center">
                            {classData.name}
                        </p>
                    </div>
                </a>
            );
        });

        return (
            <div className="list-teacher-filter">
                <h4 className="mb-3">Danh sách lớp học</h4>
                <div
                    className="slider-teacher overflow-center text-left"
                    id="style-scroll"
                >
                    {renderData}
                    {/* <a href="javascript:;">
                        <div
                            className="p-2"
                            style={{
                                display: "inline-block",
                            }}
                        >
                            <div className="circle-text bg-blue position-relative">
                                <span className="active center rounded-circle" />
                                <span
                                    className="center fontSize24 text-darkblue"
                                    style={{
                                        top: "40%",
                                    }}
                                >
                                    +16
                                </span>
                                <img
                                    className="center rounded-circle"
                                    style={{
                                        width: "42px",
                                        top: "82%",
                                        border: "3px solid white",
                                    }}
                                    src="https://sunlimetech.com/portfolio/boot4menu/assets/imgs/team/img_01.png"
                                    alt="card image"
                                />
                            </div>
                            <p className="personal-role mt-2 font-weight-bold text-center">
                                Tên giáo viên
                            </p>
                        </div>
                    </a>
                    <a href="javascript:;">
                        <div
                            className="p-2"
                            style={{
                                display: "inline-block",
                            }}
                        >
                            <div className="circle-text bg-green position-relative">
                                <span
                                    className="center fontSize24 text-darkgreen"
                                    style={{
                                        top: "40%",
                                    }}
                                >
                                    +16
                                </span>
                                <img
                                    className="center rounded-circle"
                                    style={{
                                        width: "42px",
                                        top: "85%",
                                        border: "3px solid white",
                                    }}
                                    src="https://sunlimetech.com/portfolio/boot4menu/assets/imgs/team/img_01.png"
                                    alt="card image"
                                />
                            </div>
                            <p className="personal-role mt-2 font-weight-bold text-center">
                                Tên giáo viên
                            </p>
                        </div>
                    </a>
                    <a href="javascript:;">
                        <div
                            className="p-2"
                            style={{
                                display: "inline-block",
                            }}
                        >
                            <div className="circle-text bg-orange position-relative">
                                <span
                                    className="center fontSize24 text-darkorange"
                                    style={{
                                        top: "40%",
                                    }}
                                >
                                    +16
                                </span>
                                <img
                                    className="center rounded-circle"
                                    style={{
                                        width: "42px",
                                        top: "85%",
                                        border: "3px solid white",
                                    }}
                                    src="https://sunlimetech.com/portfolio/boot4menu/assets/imgs/team/img_01.png"
                                    alt="card image"
                                />
                            </div>
                            <p className="personal-role mt-2 font-weight-bold text-center">
                                Tên giáo viên
                            </p>
                        </div>
                    </a> */}
                </div>
            </div>
        );
    }
}

const tListClass = translate(["common", "for_school"])(ListClass);
export default tListClass;
