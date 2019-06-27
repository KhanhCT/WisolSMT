import React, { Component } from "react";
import { translate } from "react-i18next";
import CommonViewRating from "./CommonViewRating";

class TeacherVoting extends Component {
    render() {
        let teacherRating = null,
            ratingAverage = 0;
        const { user } = this.props;
        if (user) {
            const { teacher } = user;
            teacherRating = teacher.rating;
            // Calculate rating average
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
        }
        if (!ratingAverage) ratingAverage = 0;
        if (ratingAverage > 0) ratingAverage = ratingAverage.toFixed(1);
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
            <div className="teacher-of-student">
                <div className="text-center">
                    <p className="font-weight-bold">Đánh giá của bạn</p>
                    <p className="h1 text-danger mb-0">{ratingAverage}/5</p>
                    <div className="h5">
                        <CommonViewRating
                            initialValue={Number(ratingAverage)}
                        />
                    </div>
                </div>
                <div
                    className="pl-3 pr-3 pt-3 pb-0 rounded"
                    style={{
                        border: "1px dashed #ccc",
                    }}
                >
                    <div className="d-flex">
                        <div className="mr-auto h5">
                            <CommonViewRating initialValue={5} />
                        </div>
                        <div className="position-relative">
                            <span className="h5">
                                {teacherRating ? teacherRating[5] : 0}
                            </span>
                        </div>
                    </div>
                    <div className="d-flex">
                        <div className="mr-auto h5">
                            <CommonViewRating initialValue={4} />
                        </div>
                        <div className="position-relative">
                            <span className="h5">
                                {teacherRating ? teacherRating[4] : 0}
                            </span>
                        </div>
                    </div>
                    <div className="d-flex">
                        <div className="mr-auto h5">
                            <CommonViewRating initialValue={3} />
                        </div>
                        <div className="position-relative">
                            <span className="h5">
                                {" "}
                                {teacherRating ? teacherRating[3] : 0}
                            </span>
                        </div>
                    </div>
                    <div className="d-flex">
                        <div className="mr-auto h5">
                            <CommonViewRating initialValue={2} />
                        </div>
                        <div className="position-relative">
                            <span className="h5">
                                {teacherRating ? teacherRating[2] : 0}
                            </span>
                        </div>
                    </div>
                    <div className="d-flex">
                        <div className="mr-auto h5">
                            <CommonViewRating initialValue={1} />
                        </div>
                        <div className="position-relative">
                            <span className="h5">
                                {" "}
                                {teacherRating ? teacherRating[1] : 0}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const tTeacherVoting = translate(["common", "for_school"])(TeacherVoting);
export default tTeacherVoting;
