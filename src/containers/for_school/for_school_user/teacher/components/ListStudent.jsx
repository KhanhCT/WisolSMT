import React, { Component } from "react";
import { translate } from "react-i18next";
import { apiConfigs } from "../../../../../constants";

class ListStudent extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { currClass } = this.props;
        let defaultAvatar =
            "https://sunlimetech.com/portfolio/boot4menu/assets/imgs/team/img_01.png";
        let renderData = null;
        if (currClass) {
            const { students } = currClass;
            renderData = students.map((student, index) => {
                let studentClass = student.student_class,
                    user = student.user;
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
                                    className={`center rounded-circle ${
                                        !studentClass.active ? "locked" : ""
                                    }`}
                                />
                                <img
                                    src={
                                        user
                                            ? user.avatar
                                                ? `${
                                                      apiConfigs.BASE_IMAGE_URL
                                                  }${user.avatar}`
                                                : defaultAvatar
                                            : defaultAvatar
                                    }
                                    alt="card image"
                                />
                            </div>
                            <p className="personal-role mt-2 font-weight-bold text-center">
                                {user.fullname}
                            </p>
                        </div>
                    </a>
                );
            });
        }
        return (
            <div className="list-teacher-filter">
                <h4 className="mb-3">Danh sách học viên</h4>
                <div
                    className="slider-student overflow-center text-left"
                    id="style-scroll"
                >
                    {renderData}
                </div>
            </div>
        );
    }
}

const tListStudent = translate(["common", "for_school"])(ListStudent);
export default tListStudent;
