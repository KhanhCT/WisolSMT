import React, { PureComponent } from "react";
import { Card, CardBody, Col } from "reactstrap";
import { translate } from "react-i18next";

class EventLabels extends PureComponent {
    render() {
        const { t } = this.props;
        return (
            <Col md={12} lg={12} xl={3} className="p-0-m">
                <Card className="card--not-full-height">
                    <CardBody className="bg-transparent">
                        <div className="card__title">
                            <h5 className="bold-text">
                                {t("attendance_record.event_label")}
                            </h5>
                            {/*<h5 className='subhead'>Use default progress with class <span className='red-text'>progress-bar</span></h5>*/}
                        </div>
                        <p>
                            <span className="calendar-label calendar-label--red" />{" "}
                            {t("attendance_record.green_label")}
                        </p>
                        <p>
                            <span className="calendar-label calendar-label--green" />{" "}
                            {t("attendance_record.red_label")}
                        </p>
                        {/* <p>
                            <span className="calendar-label calendar-label--blue" />{" "}
                            Non-priority events
                        </p> */}
                    </CardBody>
                </Card>
            </Col>
        );
    }
}

export default translate("common")(EventLabels);
