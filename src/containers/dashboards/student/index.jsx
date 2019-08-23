import React, { PureComponent } from "react";
import { Col, Container, Row } from "reactstrap";
import { translate } from "react-i18next";
import NotificationSystem from "rc-notification";
import { BasicNotification } from "../../../components/Notification";
import UserOnlineAnalytics from "./components/UserOnlineAnalytics";
import UserLearningLevel from "./components/UserLearningLevel";
import StudentAttendanceRecord from "../../attendance_record/components/StudentAttendanceRecord";
import MakeRequest from "../../online_payment/MakeRequest";

// let notification = null;

// const showNotification = () => {
//     notification.notice({
//         content: (
//             <BasicNotification
//                 title="👋 Welcome to the Hanaspeak Software!"
//                 message="You have successfully registered in the Hanaspeak software. Now you can start to explore your Book, Flashcard and Video. Enjoy!"
//             />
//         ),
//         duration: 5,
//         closable: true,
//         style: { top: 0, left: "calc(100vw - 100%)" },
//         className: "right-up",
//     });
// };

class StudentDashboard extends PureComponent {
    // componentDidMount() {
    //     NotificationSystem.newInstance({}, n => (notification = n));
    //     setTimeout(() => showNotification(), 700);
    // }

    // componentWillUnmount() {
    //     if (notification) notification.destroy();
    // }

    render() {
        const { t } = this.props;

        return (
            <Container>
                <div className="text-center">
                    <h1
                        className="mb-2 mt-4 sm-fontSize22"
                        style={{ fontWeight: "500" }}
                    >
                        {t("common.dashboard")}
                    </h1>
                </div>
                <UserOnlineAnalytics />
                <div className="container mw-960 sm-pl-1 sm-pr-1 pl-0 pr-0 dashboard">
                    <UserLearningLevel />
                    {/* <Row className="ml-0 mr-0 pt-3 pb-3">
                        <StudentAttendanceRecord />
                    </Row> */}
                    <br />
                </div>
            </Container>
        );
    }
}

export default translate("common")(StudentDashboard);
