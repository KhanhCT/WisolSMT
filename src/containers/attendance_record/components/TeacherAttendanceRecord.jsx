import React, { Component } from "react";
// import { ErrorModal } from ".";
import { Col, Row, Button, ButtonToolbar, Badge } from "reactstrap";
import SelectListStudent from "./SelectListStudent";
import AddEditAttendanceRecord from "./AddEditAttendanceRecord";
import { callApi, userHelper } from "../../../helpers";
import moment from "moment";
import $ from "jquery";
import { Card, CardBody } from "reactstrap";
import { ResponsiveContainer } from "recharts";
import { translate } from "react-i18next";
import Panel from "../../../components/Panel";
import ReactTable from "react-table";
import { ConfirmModal } from "../../../components/common";

const dateFormat = "DD/MM/YYYY";
const timeFormat = "HH:mm";

class TeacherAttendanceRecode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            currStudent: null,
            currBook: null,
            lstAttendanceRecord: [],
            currAttendaceRecord: {
                title: "",
                date: null,
                start: null,
                end: null,
                teacher_comment: "",
            },
            page: 1,
            limit: 5,
            editAttendance: false,
            modalIsOpen: false,
            confirmModalIsOpen: false,
            pages: null,
        };
    }

    toggleConfirmModal = () => {
        this.setState({ confirmModalIsOpen: !this.state.confirmModalIsOpen });
    };

    handleInputChange = e => {
        const { name, value } = e.target;
        // var value = target.type === "checkbox" ? target.checked : target.value;
        this.setState({
            currAttendaceRecord: {
                ...this.state.currAttendaceRecord,
                [name]: value,
            },
        });
    };

    setDate = selectedDate => {
        this.setState({
            currAttendaceRecord: {
                ...this.state.currAttendaceRecord,
                date: selectedDate,
            },
        });
    };

    setStartTime = selectedTime => {
        if (moment(selectedTime).isAfter(this.state.currAttendaceRecord.end))
            return alert("Start time must be smaller than end time");
        else
            this.setState({
                currAttendaceRecord: {
                    ...this.state.currAttendaceRecord,
                    start: selectedTime,
                },
            });
    };

    setEndTime = selectedTime => {
        if (moment(selectedTime).isBefore(this.state.currAttendaceRecord.start))
            return alert("End time must be lager than start time");
        else
            this.setState({
                currAttendaceRecord: {
                    ...this.state.currAttendaceRecord,
                    end: selectedTime,
                },
            });
    };

    toggleAddAttendanceRecordModal = () => {
        this.setState(
            {
                currAttendaceRecord: {
                    title: "",
                    date: null,
                    start: null,
                    end: null,
                    teacher_comment: "",
                },
                editAttendance: false,
            },
            () => {
                this.setState({ modalIsOpen: !this.state.modalIsOpen });
            }
        );
    };

    toggleEditAttendanceRecordModal = e => {
        let index = parseInt($(e.target).attr("attendance-index"));
        let attendance = this.state.lstAttendanceRecord[index];
        const { start, end, date } = attendance;
        this.setState(
            {
                currAttendaceRecord: {
                    ...attendance,
                    start: moment(start),
                    end: moment(end),
                    date: moment(date),
                },
                editAttendance: true,
            },
            () => {
                this.setState({ modalIsOpen: !this.state.modalIsOpen });
            }
        );
    };

    getLstAttendanceRecord = (state, instance) => {
        // Get teacher info from local storage
        let userStorage = userHelper.getUserFromStorage();
        // Get student info
        const { currStudent, limit, page } = this.state;
        let condition = {},
            numberOfPage = 5;
        if (state) {
            const { pageSize, page } = state;
            numberOfPage = pageSize;
            this.setState({ limit: pageSize, page: page });
            condition = {
                limit: pageSize,
                page: page + 1,
            };
            for (const item of state.filtered) {
                condition[item["id"]] = item["value"];
            }
        } else {
            condition = {
                limit: limit,
                page: page + 1,
            };
            numberOfPage = limit;
        }
        if (userStorage && currStudent) {
            condition = {
                ...condition,
                teacher_id: userStorage.user_id,
                student_id: currStudent.id,
            };
            callApi("attendance_records", "GET", condition)
                .then(res => {
                    this.setState({
                        lstAttendanceRecord: res.data.data.rows,
                        pages: Math.ceil(res.data.data.count / numberOfPage),
                    });
                })
                .catch(error => {
                    console.log(error);
                    this.setState({
                        lstAttendanceRecord: [],
                        pages: null,
                    });
                });
        }
    };

    setCurrStudent = selectedStudent => {
        this.setState({ currStudent: selectedStudent }, () => {
            this.getLstAttendanceRecord();
        });
    };

    handleOpenDeleteAttendanceRecord = e => {
        let attendanceIndex = $(e.target).attr("attendance-index");
        this.setState(
            {
                currAttendaceRecord: this.state.lstAttendanceRecord[
                    attendanceIndex
                ],
            },
            () => {
                this.setState({ confirmModalIsOpen: true });
            }
        );
    };

    handleDeleteAttendanceRecord = () => {
        const { currAttendaceRecord } = this.state;
        if (currAttendaceRecord) {
            callApi(
                `attendance_records/${currAttendaceRecord.id}`,
                "DELETE",
                null,
                currAttendaceRecord
            )
                .then(res => {
                    this.getLstAttendanceRecord();
                    this.toggleConfirmModal();
                })
                .catch(error => {
                    console.log(error);
                });
        }
    };

    render() {
        const {
            lstAttendanceRecord,
            editAttendance,
            currAttendaceRecord,
            modalIsOpen,
            currBook,
            currStudent,
            pages,
            confirmModalIsOpen,
        } = this.state;
        const { t } = this.props;
        return (
            <div>
                <div className="background">
                    <h1 className="titlePage">
                        {t("common.attendance_record")}
                    </h1>
                    <div className="containerTop">
                        <div className="panel box-shadow-1 pl-3 pr-3">
                            <SelectListStudent
                                setCurrStudent={this.setCurrStudent}
                            />
                            <Button
                                className="translateX rounded"
                                color="primary"
                                onClick={this.toggleAddAttendanceRecordModal}
                            >
                                <i className="fas fa-plus-circle" />{" "}
                                {t("common.add")}
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="container mw-960 sm-pl-1 sm-pr-1 md-pl-0 md-pr-0 mt-3 mb-3">
                    <div className="panel box-shadow-1">
                        <ReactTable
                            columns={[
                                {
                                    Header: "#",
                                    id: "#",
                                    filterable: false,
                                    accessor: d => d.id,
                                    Cell: row => {
                                        return <span>{row.index + 1}</span>;
                                    },
                                },
                                {
                                    Header: `${t("common.title")}`,
                                    accessor: "title",
                                },
                                {
                                    Header: `${t("common.date")}`,
                                    accessor: "date",
                                    Cell: row => {
                                        return (
                                            <span>
                                                {moment(row.value).format(
                                                    dateFormat
                                                )}
                                            </span>
                                        );
                                    },
                                },
                                {
                                    Header: `${t("common.time")}`,
                                    id: "start",
                                    Cell: row => {
                                        return (
                                            <span>
                                                {moment(
                                                    row.original.start
                                                ).format(timeFormat)}{" "}
                                                <i className="fas fa-long-arrow-alt-right" />{" "}
                                                {moment(
                                                    row.original.end
                                                ).format(timeFormat)}
                                            </span>
                                        );
                                    },
                                },
                                {
                                    Header: `${t("common.confirm")}`,
                                    accessor: "student_confirm",
                                    Cell: row => {
                                        return row.value ? (
                                            <Badge color="success">
                                                confirmed
                                            </Badge>
                                        ) : (
                                            <Badge color="warning">
                                                unconfirmed
                                            </Badge>
                                        );
                                    },
                                },
                                {
                                    Header: `${t("common.action")}`,
                                    accessor: "student_confirm",
                                    Cell: row => {
                                        return (
                                            <ButtonToolbar>
                                                {!row.value ? (
                                                    <Button
                                                        className="icon mb-2"
                                                        color="primary"
                                                        attendance-index={
                                                            row.index
                                                        }
                                                        onClick={
                                                            this
                                                                .toggleEditAttendanceRecordModal
                                                        }
                                                    >
                                                        <i className="fas fa-edit" />
                                                    </Button>
                                                ) : (
                                                    ""
                                                )}

                                                <Button
                                                    className="icon mb-2"
                                                    color="danger"
                                                    attendance-index={row.index}
                                                    onClick={
                                                        this
                                                            .handleOpenDeleteAttendanceRecord
                                                    }
                                                >
                                                    <i className="fas fa-trash-alt" />
                                                </Button>
                                            </ButtonToolbar>
                                        );
                                    },
                                },
                            ]}
                            manual // Forces table not to paginate or sort automatically, so we can handle it server-side
                            data={lstAttendanceRecord}
                            pages={pages} // Display the total number of pages
                            onFetchData={this.getLstAttendanceRecord} // Request new data when things change
                            defaultPageSize={5}
                            className="-striped -highlight"
                        />

                        <AddEditAttendanceRecord
                            modalIsOpen={modalIsOpen}
                            toggle={this.toggleAddAttendanceRecordModal}
                            editAttendance={editAttendance}
                            currAttendaceRecord={currAttendaceRecord}
                            currStudent={currStudent}
                            currBook={currBook}
                            getLstAttendanceRecord={this.getLstAttendanceRecord}
                            handleInputChange={this.handleInputChange}
                            setDate={this.setDate}
                            setStartTime={this.setStartTime}
                            setEndTime={this.setEndTime}
                        />
                        <ConfirmModal
                            modalIsOpen={confirmModalIsOpen}
                            toggle={this.toggleConfirmModal}
                            handleConfirmAction={
                                this.handleDeleteAttendanceRecord
                            }
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default translate("common")(TeacherAttendanceRecode);
