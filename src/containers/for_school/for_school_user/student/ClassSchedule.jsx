import React, { Component } from "react";
import BigCalendar from "react-big-calendar";
import localizer from "react-big-calendar/lib/localizers/globalize";
import Moment from "moment";
import { extendMoment } from "moment-range";
import DetailSessionModal from "./DetailSessionModal";
import UpdateSessionModal from "./UpdateSessionModal";
import { translate } from "react-i18next";
import { connect } from "react-redux";
const moment = extendMoment(Moment);

// Setup the localizer by providing the moment
BigCalendar.momentLocalizer(moment);

class ClassSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalDetailIsOpen: false,
            modalUpdateIsOpen: false,
            currRoom: null,
            currStart: null,
            currEnd: null,
            currDate: null,
            currSession: null,
        };
    }

    // Toggle modal detail session
    toggleModalDetail = () => {
        this.setState({ modalDetailIsOpen: !this.state.modalDetailIsOpen });
    };

    // Toggle modal update session
    toggleModalUpdate = () => {
        this.setState({ modalUpdateIsOpen: !this.state.modalUpdateIsOpen });
    };

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
                        this.setState({ modalDetailIsOpen: true });
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
    };

    event = ({ event }) => {
        return (
            <span>
                <strong>{event.title}</strong>
                {event.priority && ":  " + event.priority}
            </span>
        );
    };

    onNavigate = date => {};

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

    setSelectedRoom = selectedRoom => {
        this.setState({
            currRoom: selectedRoom,
        });
    };

    render() {
        const {
            modalDetailIsOpen,
            modalUpdateIsOpen,
            currDate,
            currEnd,
            currRoom,
            currStart,
            currSession,
        } = this.state;
        const {
            lstScheduleEvent,
            lstSession,
            currClass,
            infoStudent,
            t,
        } = this.props;
        const studentTranKey = `for_school:STUDENT.common`;
        return (
            <div className="schedule-student mb-2">
                <div className="d-flex mb-3">
                    <div className="mr-auto">
                        <h4>{t(`${studentTranKey}.schedule`)}</h4>
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

                <DetailSessionModal
                    modalIsOpen={modalDetailIsOpen}
                    toggle={this.toggleModalDetail}
                    currDate={currDate}
                    currEnd={currEnd}
                    currRoom={currRoom}
                    currStart={currStart}
                    setSelectedRoom={this.setSelectedRoom}
                />

                <UpdateSessionModal
                    modalIsOpen={modalUpdateIsOpen}
                    toggle={this.toggleModalUpdate}
                    currSession={currSession}
                    currClass={currClass}
                    infoStudent={infoStudent}
                    getClassSession={this.props.getClassSession}
                    countInfoLearnOfStudent={this.props.countInfoLearnOfStudent}
                    getInfoStudentByUser={this.props.getInfoStudentByUser}
                />
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

const tClassSchedule = connect(mapStateToProps)(
    translate(["common", "for_school"])(ClassSchedule)
);
export default tClassSchedule;
