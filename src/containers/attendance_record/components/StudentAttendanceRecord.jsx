import React, { Component, Fragment } from "react";
import BigCalendar from "react-big-calendar";
import localizer from "react-big-calendar/lib/localizers/globalize";
import moment from "moment";
import { callApi, userHelper } from "../../../helpers";
import ModalStudentConfirm from "./ModalStudentConfirm";
import EventLabels from "./EventLabels";
import Panel from "../../../components/Panel";
import { Card, CardBody } from "reactstrap";
import { ResponsiveContainer } from "recharts";
import { translate } from "react-i18next";

// Setup the localizer by providing the moment
BigCalendar.momentLocalizer(moment);

class StudentAttendanceRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            lstAttendanceRecord: [],
            currAttendanceRecord: null,
            openConfirmModal: false,
            startDate: moment().startOf("month"),
            endDate: moment().endOf("month"),
            currMonthGetData: moment().get("month"),
        };
    }

    componentDidMount = () => {
        this.getLstAttendanceRecord();
    };

    toggleConfirmModal = () => {
        this.setState({ openConfirmModal: !this.state.openConfirmModal });
    };

    getLstAttendanceRecord = () => {
        // Get student info from local storage
        let userStorage = userHelper.getUserFromStorage();
        if (userStorage) {
            const { startDate, endDate } = this.state;
            callApi("attendance_records", "GET", {
                student_id: userStorage.user_id,
                start: startDate.format("YYYY-MM-DD"),
                end: endDate.format("YYYY-MM-DD"),
            })
                .then(res => {
                    let lstData = res.data.data.rows;
                    lstData = lstData.map(item => {
                        item["start"] = new Date(item["start"]);
                        item["end"] = new Date(item["end"]);
                        return item;
                    });
                    this.setState({ lstAttendanceRecord: lstData });
                })
                .catch(error => {
                    console.log(error);
                });
        }
    };

    onSelectEvent = (event, e) => {
        this.setState(
            {
                currAttendanceRecord: event,
            },
            () => {
                this.setState({ openConfirmModal: true });
            }
        );
    };

    onNavigate = date => {
        // Compare current month and new month
        // If different 2 months => get new attendance record
        const { currMonthGetData } = this.state;
        let newMonth = moment(date).get("month");
        if (newMonth !== currMonthGetData) {
            this.setState(
                {
                    startDate: moment(date).startOf("month"),
                    endDate: moment(date).endOf("month"),
                    currMonthGetData: newMonth,
                },
                () => {
                    this.getLstAttendanceRecord();
                }
            );
        }
    };

    eventPropGetter = (event, start, end, isSelected) => {
        let newStyle = {};
        if (event.student_confirm) {
            newStyle.backgroundColor = "#4ce1b6";
        } else {
            newStyle.backgroundColor = "#fa697d";
        }

        return {
            className: "",
            style: newStyle,
        };
    };

    render() {
        const {
            lstAttendanceRecord,
            openConfirmModal,
            currAttendanceRecord,
        } = this.state;
        const { t } = this.props;
        return (
            <Fragment>
                <div className="col-md-9 col-lg-9 col-xl-9 md-pl-0 md-pr-0 sm-pl-1 sm-pr-1">
                    <div className="panel box-shadow-1 pb-0">
                        <div className="panel__body p-0-m card-body pb-0">
                            <ResponsiveContainer>
                                <Card>
                                    <CardBody className="p-0">
                                        <div
                                            className={`calendar${
                                                this.props.small
                                                    ? " calendar--small"
                                                    : ""
                                            }`}
                                        >
                                            <BigCalendar
                                                events={lstAttendanceRecord}
                                                step={60}
                                                views={["month", "week", "day"]}
                                                showMultiDayTimes
                                                localizer={localizer}
                                                onSelectEvent={
                                                    this.onSelectEvent
                                                }
                                                onNavigate={this.onNavigate}
                                                eventPropGetter={
                                                    this.eventPropGetter
                                                }
                                                messages={{
                                                    previous: (
                                                        <span className="lnr lnr-chevron-left" />
                                                    ),
                                                    next: (
                                                        <span className="lnr lnr-chevron-right" />
                                                    ),
                                                    today: (
                                                        <span className="lnr lnr-calendar-full" />
                                                    ),
                                                }}
                                            />
                                        </div>
                                    </CardBody>
                                </Card>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
                <EventLabels />
                <ModalStudentConfirm
                    isOpen={openConfirmModal}
                    toggle={this.toggleConfirmModal}
                    size="md"
                    currAttendanceRecord={currAttendanceRecord}
                    getLstAttendanceRecord={this.getLstAttendanceRecord}
                />
            </Fragment>
        );
    }
}

export default translate("common")(StudentAttendanceRecord);
