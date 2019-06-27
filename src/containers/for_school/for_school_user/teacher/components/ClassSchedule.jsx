import React, { Component } from "react";
import BigCalendar from "react-big-calendar";
import localizer from "react-big-calendar/lib/localizers/globalize";
import Moment from "moment";
import { extendMoment } from "moment-range";
import AddSessionModal from "./AddSessionModal";
import UpdateSessionModal from "./UpdateSessionModal";
import { translate } from "react-i18next";
const moment = extendMoment(Moment);

// Setup the localizer by providing the moment
BigCalendar.momentLocalizer(moment);

class ClassSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalAddIsOpen: false,
            modalUpdateIsOpen: false,
            currRoom: null,
            currStart: null,
            currEnd: null,
            currDate: null,
            currSession: null,
        };
    }

    eventStyleGetter = event => {
        let color;

        switch (event.priority) {
            case "not-confirm-all":
                color = "#fa697d";
                break;

            case "confirm-all":
                color = "#4ce1b6";
                break;

            case "truant-all":
                color = "#4D4D4D";
                break;

            default:
                color = "#007bff";
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
        // Calculate event data
        this.setState(
            {
                currRoom: event.room,
                currDate: event.date,
                currStart: event.startTime,
                currEnd: event.endTime,
            },
            () => {
                switch (event.type) {
                    case "schedule":
                        this.setState({ modalAddIsOpen: true });
                        break;
                    case "session":
                        this.setState({
                            modalUpdateIsOpen: true,
                            currSession: event,
                        });
                        break;
                    default:
                        break;
                }
            }
        );
        // this.setState(
        //     {
        //         currSchedule: event,
        //     },
        //     () => {
        //         this.setState({ modalAddIsOpen: true });
        //     }
        // );
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
        this.props.handleSetDateEvent(startDate, endDate);
    };

    // Toggle modal add session
    toggleModalAdd = () => {
        this.setState({ modalAddIsOpen: !this.state.modalAddIsOpen });
    };

    // Toggle modal update session
    toggleModalUpdate = () => {
        this.setState({ modalUpdateIsOpen: !this.state.modalUpdateIsOpen });
    };

    // Onchange state of add session
    handleChangeDate = value => {
        this.setState({ currDate: value });
    };

    handleSetStartTime = time => {
        time = moment(time, "HH:mm").set("second", 0);
        this.setState({
            currStart: time,
        });
    };

    handleSetEndTime = time => {
        time = moment(time, "HH:mm").set("second", 0);
        this.setState({
            currEnd: time,
        });
    };

    setSelectedRoom = selectedRoom => {
        this.setState({
            currRoom: selectedRoom,
        });
    };

    render() {
        const {
            modalAddIsOpen,
            currDate,
            currEnd,
            currRoom,
            currStart,
            modalUpdateIsOpen,
            currSession,
        } = this.state;
        const { currClass, user, lstScheduleEvent, lstSession, t } = this.props;
        const teacherTranKey = `for_school:TEACHER.common`;
        return (
            <div className="schedule-student mb-2">
                <div className="d-flex mb-3">
                    <div className="mr-auto">
                        <h4>{t(`${teacherTranKey}.schedule`)}</h4>
                    </div>
                </div>

                <div className="calendar">
                    <BigCalendar
                        events={[...lstScheduleEvent, ...lstSession]}
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
                {/* Modal */}
                <AddSessionModal
                    modalIsOpen={modalAddIsOpen}
                    toggle={this.toggleModalAdd}
                    currClass={currClass}
                    user={user}
                    currDate={currDate}
                    currEnd={currEnd}
                    currRoom={currRoom}
                    currStart={currStart}
                    handleChangeDate={this.handleChangeDate}
                    handleSetStartTime={this.handleSetStartTime}
                    handleSetEndTime={this.handleSetEndTime}
                    setSelectedRoom={this.setSelectedRoom}
                    getClassSession={this.props.getClassSession}
                    getTeacherInfo={this.props.getTeacherInfo}
                    getListClass={this.props.getListClass}
                />
                <UpdateSessionModal
                    modalIsOpen={modalUpdateIsOpen}
                    toggle={this.toggleModalUpdate}
                    currSession={currSession}
                    currClass={currClass}
                    user={user}
                    getClassSession={this.props.getClassSession}
                    getTeacherInfo={this.props.getTeacherInfo}
                    getListClass={this.props.getListClass}
                />
            </div>
        );
    }
}
const tClassSchedule = translate(["common", "for_school"])(ClassSchedule);
export default tClassSchedule;
