import React, { Component } from "react";
import DatePicker from "react-datepicker";

export class CustomDatePicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: null,
        };
    }

    handleDateChange = value => {
        const { setSelectedDate } = this.props;
        setSelectedDate(value);
    };

    render() {
        const {
            placeholderText,
            id,
            name,
            value,
            dateFormat,
            showTimeSelectOnly,
            showTimeSelect,
        } = this.props;
        return (
            <div className="date-picker">
                <DatePicker
                    style={{ width: "100%" }}
                    id={id}
                    name={name}
                    dateFormat={dateFormat ? dateFormat : "DD/MM/YYYY"}
                    className="form-control relative d-inline"
                    isClearable={true}
                    placeholderText={
                        placeholderText ? placeholderText : "Choose Date"
                    }
                    selected={value}
                    onChange={this.handleDateChange}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    showTimeSelect={showTimeSelect}
                    showTimeSelectOnly={showTimeSelectOnly}
                    timeIntervals={30}
                    timeCaption="Time"
                />
            </div>
        );
    }
}
