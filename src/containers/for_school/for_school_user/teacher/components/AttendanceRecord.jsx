import React, { Component } from "react";
import BigCalendar from "react-big-calendar";
import localizer from "react-big-calendar/lib/localizers/globalize";
import { Button } from "reactstrap";
import Moment from "moment";
import { extendMoment } from "moment-range";
import objectLodash from "lodash/object";
import AddAttendanceRecordModal from "./AddAttendanceRecordModal";
const moment = extendMoment(Moment);

// Setup the localizer by providing the moment
BigCalendar.momentLocalizer(moment);

export default class AttendanceRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            convertSchedules: null,
            startDate: moment().startOf("week"),
            endDate: moment().endOf("week"),
            lstEvent: [],
            modalIsOpen: false,
        };
    }

    static getDerivedStateFromProps(props, state) {
        const { schedules } = props;
        if (schedules) {
            let convertSchedules = {};
            schedules.map(schedule => {
                let weekDay = schedule.weekday;
                if (!objectLodash.hasIn(convertSchedules, weekDay))
                    convertSchedules[weekDay] = [schedule];
                else convertSchedules[weekDay].push(schedule);
            });
            return {
                convertSchedules: convertSchedules,
            };
        } else {
            return {
                lstEvent: [],
            };
        }
    }

    eventStyleGetter = event => {
        let color;

        switch (event.priority) {
            case "high":
                color = "#fa697d";
                break;

            case "family":
                color = "#4ce1b6";
                break;

            case "non":
                color = "#70bbfd";
                break;
            default:
                color = "$color-additional";
                break;
        }

        const style = {
            backgroundColor: color,
            border: "none",
        };

        return {
            style: style,
        };
    };

    onSelectEvent = (event, e) => {
        this.setState(
            {
                currSchedule: event,
            },
            () => {
                this.setState({ modalIsOpen: true });
            }
        );
    };

    event = ({ event }) => {
        return (
            <span>
                <strong>{event.title}</strong>
                {event.priority && ":  " + event.priority}
            </span>
        );
    };

    onNavigate = date => {
        // console.log(date);
        // Compare current month and new month
        // If different 2 months => get new attendance record
        // const { currMonthGetData } = this.state;
        // let newMonth = moment(date).get("month");
        // if (newMonth !== currMonthGetData) {
        //     this.setState(
        //         {
        //             startDate: moment(date).startOf("month"),
        //             endDate: moment(date).endOf("month"),
        //             currMonthGetData: newMonth,
        //         },
        //         () => {
        //             this.getLstAttendanceRecord();
        //         }
        //     );
        // }
    };

    onRangeChange = value => {
        let startDate = null,
            endDate = null;
        // Case Week, day
        if (Array.isArray(value)) {
            // Week
            if (value.length > 1) {
                startDate = value[0];
                endDate = value[value.length - 1];
            } else {
                startDate = value[0];
                endDate = value[0];
            }
        }
        // Case Month, Agenda
        else {
            startDate = value["start"];
            endDate = value["end"];
        }
        this.setState({ startDate, endDate }, () => this.converData());
    };

    converData = () => {
        const { convertSchedules, startDate, endDate } = this.state;
        const range = moment.range(startDate, endDate);

        let lstEvent = [];
        for (let day of range.by("day")) {
            let dayEvent = moment(day).format("YYYY-MM-DD");
            let dayNumber = day.day();
            if (objectLodash.hasIn(convertSchedules, dayNumber)) {
                let dayScheduleArr = convertSchedules[dayNumber];
                dayScheduleArr.map(schedule => {
                    let startUtcTime = `${dayEvent} ${schedule.start_time}`,
                        endUtcTime = `${dayEvent} ${schedule.end_time}`,
                        startLocalTime = moment
                            .utc(startUtcTime)
                            .local()
                            .format("YYYY-MM-DD HH:mm:ss"),
                        endLocalTime = moment
                            .utc(endUtcTime)
                            .local()
                            .format("YYYY-MM-DD HH:mm:ss");

                    let eventStart = new Date(startLocalTime),
                        eventEnd = new Date(endLocalTime);
                    let event = {
                        id: new Date().getTime(),
                        title: `${schedule.class.name} - ${schedule.room.name}`,
                        start: eventStart,
                        end: eventEnd,
                        priority: "high",
                    };
                    lstEvent.push(event);
                });
            }
        }
        this.setState({ lstEvent: [] }, () => this.setState({ lstEvent }));
    };

    toggleModal = () => {
        this.setState({ modalIsOpen: !this.state.modalIsOpen });
    };

    render() {
        const { lstEvent, modalIsOpen } = this.state;
        const { currClass } = this.props;
        return (
            <div className="schedule-student mb-2">
                <div className="d-flex ">
                    <div className="mr-auto">
                        <h4>Attendance Records</h4>
                    </div>
                    <div className="position-relative">
                        <Button
                            color="primary"
                            size="sm"
                            onClick={() => this.setState({ modalIsOpen: true })}
                        >
                            Add Session
                        </Button>
                    </div>
                </div>

                <div className="calendar">
                    <BigCalendar
                        events={lstEvent}
                        step={60}
                        defaultView="week"
                        views={["week", "day", "agenda"]}
                        showMultiDayTimes
                        localizer={localizer}
                        onSelectEvent={this.onSelectEvent}
                        eventPropGetter={this.eventStyleGetter}
                        // resources={[
                        //     { id: 1, title: "John" },
                        //     { id: 2, title: "Linda" },
                        // ]}
                        // resourceAccessor={event => {
                        //     return 1;
                        // }}
                        // components={{
                        //     event: this.event,
                        // }}
                        defaultDate={new Date()}
                        messages={{
                            previous: <span className="lnr lnr-chevron-left" />,
                            next: <span className="lnr lnr-chevron-right" />,
                            today: <span className="lnr lnr-calendar-full" />,
                        }}
                        onNavigate={this.onNavigate}
                        onRangeChange={this.onRangeChange}
                    />
                </div>
                <AddAttendanceRecordModal
                    modalIsOpen={modalIsOpen}
                    toggle={this.toggleModal}
                    currClass={currClass}
                />
            </div>
        );
    }
}
