import React, { Component, Fragment } from "react";
import { Row, Col, Container } from "reactstrap";
import StudentAttendanceRecord from "./StudentAttendanceRecord";
import TeacherAttendanceRecord from "./TeacherAttendanceRecord";
import { AuthorizationTab } from "../../../components/common";
import { ROLES, LIST_ROLES } from "../../../constants";

export class MainAttendanceRecord extends Component {
    render() {
        // Define list role for student and teacher
        const STUDENT = AuthorizationTab(LIST_ROLES.STUDENT)(
            StudentAttendanceRecord
        );
        const TEACHER = AuthorizationTab(LIST_ROLES.TEACHER)(
            TeacherAttendanceRecord
        );
        return (
            <div>
                <TEACHER />

                <Container className="dashboard mw-960 mb-3">
                    <Row>
                        <STUDENT />
                    </Row>
                </Container>
            </div>
        );
    }
}
