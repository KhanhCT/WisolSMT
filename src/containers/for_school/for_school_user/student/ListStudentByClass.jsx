import React, { Component } from "react";
import { utilHelper } from "../../../../helpers";
import { translate } from "react-i18next";
import { connect } from "react-redux";

class ListStudentByClass extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { listStudent, t } = this.props;
        let renderListStudent = null;
        const studentTranKey = `for_school:STUDENT.common`;
        if (listStudent && listStudent.length > 0) {
            renderListStudent = listStudent.map((item, index) => {
                let user = item["user"];
                let studentClass = item["classes"][0]["student_class"];
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
                                        !studentClass["active"] ? "locked" : ""
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
                        </div>
                    </a>
                );
            });
        }
        return (
            <div className="list-teacher-filter">
                <h4 className="mb-3">{t(`${studentTranKey}.list_student`)}</h4>
                <div
                    className="slider-student overflow-center text-left"
                    id="style-scroll"
                >
                    {renderListStudent}
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

const tListStudentByClass = connect(mapStateToProps)(
    translate(["common", "for_school"])(ListStudentByClass)
);
export default tListStudentByClass;
