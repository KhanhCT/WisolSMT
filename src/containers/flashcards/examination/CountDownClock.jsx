import React, { Component } from "react";
import ReactCountdownClock from "react-countdown-clock";

export default class CountDownClock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            numberSecondPerQuestion: 0,
            numberQuestion: 0,
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (
            state.numberSecondPerQuestion !== props.numberSecondPerQuestion ||
            state.numberQuestion !== props.numberQuestion
        )
            return {
                numberQuestion: props.numberQuestion,
                // numberSecondPerQuestion: 1,
                numberSecondPerQuestion: props.numberSecondPerQuestion,
            };
        return null;
    }

    render() {
        const { numberSecondPerQuestion, numberQuestion } = this.state;
        return (
            <div>
                <ReactCountdownClock
                    seconds={numberSecondPerQuestion * numberQuestion}
                    color="#4ce1b6"
                    alpha={0.9}
                    size={100}
                    weight={10}
                    fontSize="25px"
                    onComplete={this.props.onCompleteCountDown}
                    showMilliseconds={true}
                />
            </div>
        );
    }
}
