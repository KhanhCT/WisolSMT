import React, { Component } from "react";
import { Link } from "react-router-dom";
// import { ErrorModal } from "../../Components";
import { callApi, errorHelper, userHelper } from "../../../helpers";
import { errorConstants, ROUTES } from "../../../constants";
import { Container, Row, Col } from "reactstrap";

export class MainOnlineSoftware extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: null,
            error: null,
        };
    }

    componentDidMount = () => {
        this.getUserInfo();
    };

    getUserInfo = () => {
        // Get user from storage
        let userStorage = userHelper.getUserFromStorage();
        if (userStorage) {
            callApi("users/online-software-info", "GET", {
                user_id: userStorage.user_id,
            })
                .then(res => {
                    this.setState({ userInfo: res.data.data, error: null });
                })
                .catch(error => {
                    let errorData = error.response.data;
                    let processError = errorHelper.commonProcessError.bind(
                        this
                    );
                    processError(
                        errorData,
                        errorConstants.USER_INFO_ONLINE_SOFTWARE
                    );
                });
        }
    };
    render() {
        const { error, userInfo } = this.state;
        let numberMedal = 0,
            currUserLevel = null,
            currUserPercent = 0;
        if (userInfo) {
            numberMedal = userInfo.number_medal;
            if (userInfo.books.length > 0) {
                let activeUserBook = userInfo.books[0];
                let totalUserBookMinute =
                        activeUserBook.user_book.total_user_minutes,
                    totalActiveBookMinute =
                        activeUserBook.user_book.total_minutes;
                currUserLevel = activeUserBook.language_level["name"];
                currUserPercent = Math.round(
                    (totalUserBookMinute * 100) / totalActiveBookMinute
                );
            }
        }
        return (
            <Container>
                <div className="container mt-5 mb-5">
                    <div className="row mt-5">
                        <div className="col-lg-8 col-md-8 col-sm-8 col-12">
                            {this.props.children}
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-4 col-12">
                            <div className="sticky-top">
                                {/* <ErrorModal error={error} /> */}
                                <div className="border-destop">
                                    <img
                                        className=""
                                        width="100%"
                                        height="auto"
                                        src="/images/huong-a1.jpg"
                                    />
                                    <div className="pl-5 pt-2 pb-2">
                                        <span>
                                            Your level:{" "}
                                            <strong className="text-danger">
                                                {currUserLevel}
                                            </strong>
                                        </span>
                                    </div>
                                    <div className="pl-5 pt-2 pb-2">
                                        <span>
                                            Your medal:{" "}
                                            <strong className="text-success">
                                                {numberMedal}
                                            </strong>
                                        </span>
                                        <img
                                            className=""
                                            width="32px"
                                            height="auto"
                                            src="/images/perfect_score.png"
                                        />
                                    </div>
                                    <h6 className="text-center">
                                        Your Learning Progress (
                                        <strong className="text-danger">
                                            Attendance record
                                        </strong>
                                        ){" "}
                                    </h6>
                                    <div
                                        className="progress m-0"
                                        style={{ height: "16px" }}
                                    >
                                        <div
                                            className="progress-bar progress-bar-striped progress-bar-animated bg-info"
                                            role="progressbar"
                                            aria-valuemin="0"
                                            aria-valuemax={100}
                                            style={{
                                                width: `${currUserPercent}%`,
                                            }}
                                        >
                                            <label
                                                style={{
                                                    marginBottom: "0px",
                                                    fontSize: "11px",
                                                }}
                                            >
                                                {currUserPercent}%
                                            </label>
                                        </div>
                                    </div>
                                    <div className="p-2" />
                                    <center>
                                        <Link
                                            className="btn btn-outline-primary btn-lg"
                                            to={ROUTES.VIDEOS}
                                        >
                                            <span>
                                                VIEW VIDEO
                                                <span />
                                            </span>
                                        </Link>
                                    </center>
                                    <div className="p-2" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        );
    }
}
