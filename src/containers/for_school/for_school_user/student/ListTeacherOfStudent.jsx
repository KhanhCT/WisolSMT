import React, { Component } from "react";
import { callApi, utilHelper, userHelper } from "../../../../helpers";
import CommonViewRating from "./CommonViewRating";
import { translate } from "react-i18next";
import { connect } from "react-redux";

class ListTeacherOfStudent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listTeacherOfStudent: [],
        };
    }

    componentDidUpdate = () => {
        if (this.state.listTeacherOfStudent.length === 0)
            this.getListTeacherOfStudent();
    };

    getListTeacherOfStudent = () => {
        const { infoStudent } = this.props;
        if (infoStudent)
            // Call API get List student by class
            callApi("for_school/teachers/list-teacher-of-student", "GET", {
                student_id: infoStudent.id,
            })
                .then(res => {
                    this.setState({
                        listTeacherOfStudent: res.data.data,
                    });
                })
                .catch(error => {
                    console.log(error);
                });
    };

    render() {
        const { listTeacherOfStudent } = this.state;
        const { t } = this.props;
        const studentTranKey = `for_school:STUDENT.common`;
        let renderListTeacherOfStudent = null;
        if (listTeacherOfStudent.length > 0) {
            renderListTeacherOfStudent = listTeacherOfStudent.map(
                (item, index) => {
                    let user = item["user"];
                    let classTeacher = item["classes"][0]["class_teacher"];
                    let teacherRating = item["rating"],
                        ratingAverage = 0;
                    if (typeof teacherRating === "string")
                        teacherRating = JSON.parse(teacherRating);

                    if (teacherRating) {
                        try {
                            ratingAverage =
                                (teacherRating[1] * 1 +
                                    teacherRating[2] * 2 +
                                    teacherRating[3] * 3 +
                                    teacherRating[4] * 4 +
                                    teacherRating[5] * 5) /
                                (teacherRating[1] +
                                    teacherRating[2] +
                                    teacherRating[3] +
                                    teacherRating[4] +
                                    teacherRating[5]);
                        } catch (error) {
                            ratingAverage = 0;
                        }
                    }

                    if (!ratingAverage) ratingAverage = 0;
                    if (ratingAverage > 0)
                        ratingAverage = ratingAverage.toFixed(1);
                    switch (ratingAverage) {
                        case "1.0":
                            ratingAverage = 1;
                            break;
                        case "2.0":
                            ratingAverage = 2;
                            break;
                        case "3.0":
                            ratingAverage = 3;
                            break;
                        case "4.0":
                            ratingAverage = 4;
                            break;
                        case "5.0":
                            ratingAverage = 5;
                            break;
                        default:
                            break;
                    }
                    return (
                        <a href="javascript:;" key={index}>
                            <div
                                className="p-2"
                                style={{
                                    display: "inline-block",
                                }}
                            >
                                <div className="circle-text position-relative">
                                    <span
                                        className={`${
                                            !classTeacher["active"]
                                                ? "locked"
                                                : ""
                                        } center rounded-circle`}
                                    />
                                    <img
                                        src={utilHelper.getAvatarUser(
                                            user["avatar"],
                                            user["gender"]
                                        )}
                                        alt={user["fullname"]}
                                        className="rounded-circle"
                                    />
                                </div>
                                <p className="personal-role mt-2 font-weight-bold text-center text-capitalize">
                                    {user["fullname"]}
                                </p>
                                <p className="mt-0 text-center">
                                    <CommonViewRating
                                        initialValue={Number(ratingAverage)}
                                    />
                                </p>
                            </div>
                        </a>
                    );
                }
            );
        }
        return (
            <div className="teacher-of-student">
                <div className="d-flex mb-3">
                    <div className="mr-auto">
                        <span className="font-weight-bold">
                            {t(`${studentTranKey}.list_teacher`)}
                        </span>
                    </div>
                    {/* <div className="position-relative">
                        <a href="javascript:;">Xem thêm</a>
                    </div> */}
                </div>
                <div className="slick-slider-teacher">
                    <div
                        className="slider-student overflow-center text-left"
                        id="style-scroll"
                    >
                        {renderListTeacherOfStudent}
                    </div>
                </div>
            </div>
        );
    }
}
const mapStateToProps = state => {
    const { forSchoolReducer } = state;
    return {
        infoStudent: forSchoolReducer.infoStudent,
    };
};

const tListTeacherOfStudent = connect(mapStateToProps)(
    translate(["common", "for_school"])(ListTeacherOfStudent)
);
export default tListTeacherOfStudent;
