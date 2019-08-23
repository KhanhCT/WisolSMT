import React, { Component } from "react";
import "rc-time-picker/assets/index.css";
import TimePicker from "rc-time-picker";

export class CustomTimePicker extends Component {
    render() {
        const { value, onChange, placeholder } = this.props;
        return (
            <TimePicker
                showSecond={false}
                value={value}
                onChange={onChange}
                format="HH:mm"
                inputReadOnly
                focusOnOpen
                minuteStep={5}
                // use12Hours
                getPopupContainer={triggerNode => triggerNode.parentNode}
                // className="form-control relative d-inline"
                placeholder={placeholder ? placeholder : "Choose Time"}
            />
        );
    }
}
