import React, { Component, Fragment } from "react";
import Slider from "../../../components/range_slider/Slider";
import { translate } from "react-i18next";

class ToogleSetNumberQuestion extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { t, onChangeNumberQuestion, value } = this.props;
        return (
            <Fragment>
                <div className="card__title">
                    <h5 className="bold-text">
                        Number question:{" "}
                        <span className="red-text">{value}</span>
                    </h5>
                </div>
                <Slider
                    min={10}
                    max={50}
                    dots={true}
                    value={value}
                    step={1}
                    onChange={onChangeNumberQuestion}
                    marks={{
                        10: "10",
                        15: "15",
                        20: "20",
                        25: "25",
                        30: "30",
                        35: "35",
                        40: "40",
                        45: "45",
                        50: "50",
                    }}
                />
            </Fragment>
        );
    }
}

export default translate("common")(ToogleSetNumberQuestion);
