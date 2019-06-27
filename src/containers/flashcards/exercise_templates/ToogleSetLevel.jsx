import React, { Component, Fragment } from "react";
import Slider from "../../../components/range_slider/Slider";
import { translate } from "react-i18next";

export default class ToogleSetLevel extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { t, onChangeLevel, level } = this.props;
        return (
            <Fragment>
                <div className="card__title">
                    <h5 className="bold-text">
                        Level: <span className="red-text">{level["name"]}</span>
                    </h5>
                </div>
                <Slider
                    min={1}
                    max={4}
                    dots={true}
                    value={level["value"]}
                    step={1}
                    onChange={onChangeLevel}
                    marks={{
                        1: "Easy",
                        2: "Normal",
                        3: "Hard",
                        4: "Super Hard",
                    }}
                />
            </Fragment>
        );
    }
}
