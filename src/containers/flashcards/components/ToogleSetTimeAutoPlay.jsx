import React, { Component } from "react";
import { Card, CardBody, Col, Collapse } from "reactstrap";
import Slider from "../../../components/range_slider/Slider";
import { translate } from "react-i18next";

class ToogleSetTimeAutoPlay extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { t, collapse, onChangeAutoPlayTime, value } = this.props;
        return (
            <Collapse isOpen={collapse}>
                <Card>
                    <CardBody>
                        <div className="card__title">
                            <h5 className="bold-text">
                                Change auto play timer
                            </h5>
                            <h5 className="subhead">
                                UNIT: <span className="red-text">Second</span>
                            </h5>
                        </div>
                        <Slider
                            min={0}
                            max={10}
                            dots={true}
                            value={value}
                            step={0.5}
                            onChange={onChangeAutoPlayTime}
                            marks={{
                                0: "0",
                                1: "1",
                                2: "2",
                                3: "3",
                                4: "4",
                                5: "5",
                                6: "6",
                                7: "7",
                                8: "8",
                                9: "9",
                                10: "10",
                            }}
                        />
                    </CardBody>
                </Card>
                {/* </Col> */}
            </Collapse>
        );
    }
}

export default translate("common")(ToogleSetTimeAutoPlay);
