import React, { Component } from "react";
import { callApi, utilHelper, userHelper } from "../../../../helpers";
import { translate } from "react-i18next";
import { connect } from "react-redux";

class ListClassSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listClass: [],
            activeClass: 0,
        };
    }
    componentDidMount = () => {
        this.getListClass();
    };

    getListClass = () => {
        const { setSelectedClass } = this.props;
        let userStorage = userHelper.getUserFromStorage();
        // Call API get List class
        callApi("for_school/student_classes", "GET", {
            user_id: userStorage["user_id"],
        })
            .then(res => {
                this.setState({
                    listClass: res.data.data.rows,
                });
                setSelectedClass(res.data.data.rows[0]);
            })
            .catch(error => {
                console.log(error);
            });
    };

    handleChangeClass = index => {
        const { setSelectedClass } = this.props;
        let selectedClass = this.state.listClass[index];
        this.setState({ activeClass: index });
        setSelectedClass(selectedClass);
    };

    render() {
        const { listClass, activeClass } = this.state;
        const { t } = this.props;
        const studentTranKey = `for_school:STUDENT.common`;
        let renderListClass = null;
        if (listClass.length > 0) {
            renderListClass = listClass.map((item, index) => {
                let user = item["teachers"][0]["user"];
                let numberSessionConfirm = 0;
                let sessions = item.sessions;
                sessions.map(session => {
                    let students = session.students;
                    students.map(student => {
                        let studentSession = student.student_session;
                        if (!studentSession.truant) numberSessionConfirm++;
                    });
                });

                return (
                    <a
                        href="javascript:;"
                        key={index}
                        onClick={() => {
                            this.handleChangeClass(index);
                        }}
                    >
                        <div
                            className="p-2"
                            style={{
                                display: "inline-block",
                            }}
                        >
                            <div
                                className={`circle-text ${(() => {
                                    switch (item.status) {
                                        case 1:
                                            return "bg-blue";
                                        case 2:
                                            return "bg-green";
                                        case 3:
                                            return "bg-orange";
                                        default:
                                            "";
                                    }
                                })()} position-relative`}
                            >
                                <span
                                    className={`${
                                        activeClass == index ? "active" : ""
                                    } center rounded-circle`}
                                />
                                <span
                                    className={`center fontSize24 ${(() => {
                                        switch (item.status) {
                                            case 1:
                                                return "text-darkblue";
                                            case 2:
                                                return "text-darkgreen";
                                            case 3:
                                                return "text-darkorange";
                                            default:
                                                "";
                                        }
                                    })()}`}
                                    style={{
                                        top: "40%",
                                    }}
                                >
                                    +{numberSessionConfirm}
                                </span>
                                <img
                                    className="center rounded-circle"
                                    style={{
                                        width: "42px",
                                        top: "82%",
                                        border: "3px solid white",
                                    }}
                                    src={utilHelper.getAvatarUser(
                                        user["avatar"],
                                        user["gender"]
                                    )}
                                    alt={user["fullname"]}
                                />
                            </div>
                            <p className="personal-role mt-2 font-weight-bold text-center">
                                {item.name}
                            </p>
                        </div>
                    </a>
                );
            });
        }
        return (
            <div className="list-teacher-filter">
                <h4 className="mb-3">{t(`${studentTranKey}.list_class`)}</h4>
                <div
                    className="slider-teacher overflow-center text-left"
                    id="style-scroll"
                >
                    {renderListClass}
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

const tListClassSelect = connect(mapStateToProps)(
    translate(["common", "for_school"])(ListClassSelect)
);
export default tListClassSelect;
