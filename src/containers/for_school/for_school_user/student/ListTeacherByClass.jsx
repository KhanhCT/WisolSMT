import React, { Component } from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { utilHelper, callApi } from "../../../../helpers";
import ModalDetailTeacher from "./ModalDetailTeacher";

class ListTeacherByClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalDetailTeacherIsOpen: false,
            currTeacher: null,
            currRating: null,
            isRating: false,
        };
    }

    getRatingDetail = () => {
        const { infoStudent } = this.props;
        const { currTeacher } = this.state;
        // Call API get rating detail
        callApi("for_school/ratings/detail", "GET", {
            teacher_id: currTeacher["id"],
            student_id: infoStudent["id"],
        })
            .then(res => {
                let currRatingTmp = res.data.data;
                if (currRatingTmp) {
                    currRatingTmp.question = utilHelper.convertStringToJSON(
                        currRatingTmp.question
                    );
                    this.setState({
                        currRating: currRatingTmp,
                        isRating: true,
                    });
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    toggleDetailTeacher = () => {
        this.setState({
            modalDetailTeacherIsOpen: !this.state.modalDetailTeacherIsOpen,
        });
    };

    handleOpenModalDetailTeacher = teacher => {
        this.setState(
            {
                modalDetailTeacherIsOpen: true,
            },
            () => {
                this.setState(
                    {
                        currTeacher: teacher,
                    },
                    () => {
                        this.getRatingDetail();
                    }
                );
            }
        );
    };

    render() {
        const { listTeacher, t } = this.props;
        const studentTranKey = `for_school:STUDENT.common`;
        const {
            modalDetailTeacherIsOpen,
            currTeacher,
            currRating,
            isRating,
        } = this.state;
        let renderListTeacher = null;
        if (listTeacher && listTeacher.length > 0) {
            renderListTeacher = listTeacher.map((item, index) => {
                let user = item["user"];
                let classTeacher = item["classes"][0]["class_teacher"];
                return (
                    <a
                        href="javascript:;"
                        key={index}
                        onClick={() => {
                            this.handleOpenModalDetailTeacher(item);
                        }}
                    >
                        <div
                            className="p-2"
                            style={{
                                display: "inline-block",
                            }}
                        >
                            <div className="circle-text position-relative">
                                <span
                                    className={`${
                                        !classTeacher["active"] ? "locked" : ""
                                    } center rounded-circle`}
                                />
                                <img
                                    src={utilHelper.getAvatarUser(
                                        user["avatar"],
                                        user["gender"]
                                    )}
                                    alt={user.fullname}
                                    className="rounded-circle"
                                />
                            </div>
                            <p className="personal-role mt-2 font-weight-bold text-center text-capitalize">
                                {user.fullname}
                            </p>
                        </div>
                    </a>
                );
            });
        }
        return (
            <div className="list-teacher-filter">
                <h4 className="mb-3">
                    {t(`${studentTranKey}.teacher_teaching`)}
                </h4>
                <div
                    className="slider-student overflow-center text-left"
                    id="style-scroll"
                >
                    {renderListTeacher}
                    <ModalDetailTeacher
                        modalIsOpen={modalDetailTeacherIsOpen}
                        toggle={this.toggleDetailTeacher}
                        currTeacher={currTeacher}
                        currRating={currRating}
                        isRating={isRating}
                    />
                </div>
            </div>
        );
    }
}

const tTrans = translate(["common", "for_school"])(ListTeacherByClass);
const mapStateToProps = state => {
    const { forSchoolReducer } = state;
    return {
        infoStudent: forSchoolReducer.infoStudent,
    };
};

export default connect(mapStateToProps)(tTrans);
