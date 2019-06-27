import React, { Component } from "react";
import { translate } from "react-i18next";

class ListTeacher extends Component {
    render() {
        return (
            <div className="list-teacher-filter">
                <h4 className="mb-3">Giáo viên giảng dạy</h4>
                <div
                    className="slider-student overflow-center text-left"
                    id="style-scroll"
                >
                    <a href="javascript:;">
                        <div
                            className="p-2"
                            style={{
                                display: "inline-block",
                            }}
                        >
                            <div className="circle-text position-relative">
                                <span className="center rounded-circle" />
                                <img
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
                            <div className="circle-text position-relative">
                                <span className="locked center rounded-circle" />
                                <img
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
                            <div className="circle-text position-relative">
                                <span className="locked center rounded-circle" />
                                <img
                                    src="https://sunlimetech.com/portfolio/boot4menu/assets/imgs/team/img_01.png"
                                    alt="card image"
                                />
                            </div>
                            <p className="personal-role mt-2 font-weight-bold text-center">
                                Tên giáo viên
                            </p>
                        </div>
                    </a>
                </div>
            </div>
        );
    }
}

const tListTeacher = translate(["common", "for_school"])(ListTeacher);
export default tListTeacher;
