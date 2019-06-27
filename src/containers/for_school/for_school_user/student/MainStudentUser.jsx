import React, { Component } from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { callApi, userHelper } from "../../../../helpers";
import { updateInfoStudent } from "../../../../redux/actions";
import { StudentUserLeft } from "./StudentUserLeft";
import { StudentUserRight } from "./StudentUserRight";

class MainStudentUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            infoStudent: {},
        };
    }

    componentDidMount = () => {
        this.getInfoStudentByUser();
    };

    handleBack = () => {
        this.props.history.goBack();
    };

    getInfoStudentByUser = () => {
        let userStorage = userHelper.getUserFromStorage();
        // Call API get info student by user
        callApi("for_school/students/find-info-student-by-user", "GET", {
            user_id: userStorage["user_id"],
        })
            .then(res => {
                this.setState({
                    infoStudent: res.data.data,
                });
                this.props.dispatch(updateInfoStudent(res.data.data));
            })
            .catch(error => {
                console.log(error);
            });
    };

    render() {
        const { currDept, t } = this.props;
        const { infoStudent } = this.state;
        const studentTranKey = `for_school:STUDENT.common`;
        let hourseRegisterExpired =
            (parseInt(infoStudent.total_minute_registered) -
                parseInt(infoStudent.total_minute_learned)) /
            60;

        let renderNote = null;
        if (Math.round(hourseRegisterExpired) < 10) {
            renderNote = (
                <h4 className="note-student text-center mb-4 p-3">
                    {t(`${studentTranKey}.note_content_1`)}{" "}
                    {Math.round(hourseRegisterExpired)}{" "}
                    {t(`${studentTranKey}.hours`)},{" "}
                    {t(`${studentTranKey}.note_content_2`)}
                </h4>
            );
        }

        return (
            <Container className="responsive">
                <h4 className="mb-3">
                    {" "}
                    <a
                        className="hover-back text-secondary"
                        onClick={this.handleBack}
                    >
                        <i className="fal fa-long-arrow-left" /> &nbsp;&nbsp;{" "}
                        {t(`${studentTranKey}.back`)}
                    </a>
                </h4>
                <Card className="responsive">
                    <CardBody>
                        {/* <h3>{currDept.name}</h3>
                        <h3 className="page-subhead subhead text-dark">
                            <i className="fal fa-map-marker-alt" />{" "}
                            <b>Trụ sở chính:</b> {currDept.address}.
                        </h3> */}
                        {renderNote}

                        <Row className="ml-0 mr-0">
                            <StudentUserLeft />
                            <StudentUserRight
                                getInfoStudentByUser={this.getInfoStudentByUser}
                            />
                        </Row>
                    </CardBody>
                </Card>
            </Container>
        );
    }
}

const mapStateToProps = state => {
    const { forSchoolReducer } = state;
    return {
        currDept: forSchoolReducer.currDept,
    };
};

const tMainStudentUser = connect(mapStateToProps)(
    translate("common")(MainStudentUser)
);
export { tMainStudentUser as MainStudentUser };
