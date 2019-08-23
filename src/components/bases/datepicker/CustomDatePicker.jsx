import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export class CustomDatePicker extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleDateChange = value => {
        const { setSelectedDate } = this.props;
        setSelectedDate(value);
    };

    render() {
        const { placeholderText, id, name, value, showTimeSelect } = this.props;
        return (
            <div className="date-picker">
                <DatePicker
                    style={{ width: "100%" }}
                    id={id}
                    name={name}
                    dateFormat="DD/MM/YYYY"
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
                />
            </div>
        );
    }
}
