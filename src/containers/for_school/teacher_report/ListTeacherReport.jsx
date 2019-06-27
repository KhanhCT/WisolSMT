import React, { Component } from "react";
import { Container, Row, Col, Card, CardBody, Button } from "reactstrap";
import { translate } from "react-i18next";
import { TableComponent } from "../../../components/bases";
import { Pagination } from "../../../components/common";
import { callApi } from "../../../helpers";
import {
    LIST_RIGHT_FOR_SCHOOL,
    SCHOOL_ROLE_KEY_CHECK,
} from "../../../constants";
import TeacherReportFilter from "./TeacherReportFilter";
import moment from "moment";
import { CSVLink } from "react-csv";

const headers = [
    { label: "Họ và tên", key: "fullname" },
    { label: "Thời gian dạy chi tiết các lớp", key: "class_data" },
    { label: "Tổng thời gian đã dạy", key: "total_hour" },
    { label: "Tổng thời gian đã được xác nhận", key: "total_hour_confirm" },
];

class ListTeacherReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listTeacherReport: [],
            limit: 10,
            page: 1,
            totalTeacherReport: 0,
        };
    }

    componentDidMount() {
        this.getLstTeacherReport();
    }

    handleBack = () => {
        this.props.history.goBack();
    };

    getLstTeacherReport = () => {
        const { location } = this.props;
        const { limit, page } = this.state;
        // Call API get list teacher report
        callApi("for_school/teachers/teacher_report", "GET", {
            department_id: location.state.idDepartment,
            limit: limit,
            page: page,
        })
            .then(res => {
                this.setState({
                    listTeacherReport: res.data.data.rows,
                    totalTeacherReport: res.data.data.count,
                });
            })
            .catch(error => {
                console.log(error);
            });
    };

    onPageChanged = data => {
        const { currentPage } = data;
        if (currentPage)
            this.setState({ page: currentPage }, () => {
                this.getLstTeacherReport();
            });
    };

    // Handle process fillter
    handleProcessFilter = formData => {
        const { location } = this.props;
        const { limit, page } = this.state;
        // Call API get list teacher report
        callApi("for_school/teachers/teacher_report", "GET", {
            ...formData,
            department_id: location.state.idDepartment,
            limit: limit,
            page: page,
        })
            .then(res => {
                this.setState({
                    listTeacherReport: res.data.data.rows,
                    totalTeacherReport: res.data.data.count,
                });
            })
            .catch(error => {
                this.setState({
                    listTeacherReport: [],
                    totalTeacherReport: 0,
                });
                console.log(error);
            });
    };

    // Calculate data for each class
    calculateClassData = currClass => {
        let totalSession = 0,
            numberSessionConfirm = 0,
            totalHour = 0,
            numberHourConfirm = 0;
        // Calculate data
        if (currClass) {
            let sessions = currClass.sessions;
            totalSession = sessions.length;
            sessions.map(session => {
                // Count total hour
                let sessionStart = moment(session.start_time),
                    sessionEnd = moment(session.end_time);
                totalHour += moment
                    .duration(sessionEnd.diff(sessionStart))
                    .as("hour");
                let students = session.students;
                let checkAllConfirm = true;
                students.map(student => {
                    let studentSession = student.student_session;
                    if (
                        !studentSession.active_attendance_record &&
                        !studentSession.truant
                    )
                        checkAllConfirm = false;
                });
                if (checkAllConfirm) {
                    numberSessionConfirm += 1;
                    let sessionStart = moment(session.start_time),
                        sessionEnd = moment(session.end_time);
                    numberHourConfirm += moment
                        .duration(sessionEnd.diff(sessionStart))
                        .as("hour");
                }
            });
        }
        return {
            total_hour: totalHour,
            number_hour_confirm: numberHourConfirm,
        };
    };

    render() {
        const STUDY_METHOD_RIGHT =
            LIST_RIGHT_FOR_SCHOOL["DEPARTMENT"]["STUDY_METHOD"];
        const KEY_CHECK = SCHOOL_ROLE_KEY_CHECK["DEPARTMENT"];
        const {
            listTeacherReport,
            totalTeacherReport,
            limit,
            page,
        } = this.state;
        let renderData = null,
            renderTableTeacherReport = null,
            exportData = [];
        if (listTeacherReport.length > 0) {
            renderData = listTeacherReport.map((item, index) => {
                let totalHourConfirm = 0,
                    totalHour = 0,
                    exportClassData = "";
                let renderClassData = item.classes.map(classItem => {
                    let currClassData = this.calculateClassData(classItem);
                    totalHourConfirm += currClassData.number_hour_confirm;
                    totalHour += currClassData.total_hour;
                    exportClassData += `\n${classItem.name} - số giờ đã dạy: ${
                        currClassData.total_hour
                    } - số giờ đã xác nhận: ${
                        currClassData.number_hour_confirm
                    }`;
                    return (
                        <li>
                            <strong>{classItem.name}</strong> <strong>-</strong>{" "}
                            số giờ đã dạy:{" "}
                            <span style={{ color: "red" }}>
                                {currClassData.total_hour}
                            </span>{" "}
                            <strong>-</strong> số giờ đã xác nhận:{" "}
                            <span style={{ color: "green" }}>
                                {currClassData.number_hour_confirm}
                            </span>
                        </li>
                    );
                });
                let exportItem = {
                    fullname: item.user.fullname,
                    class_data: exportClassData,
                    total_hour: totalHour,
                    total_hour_confirm: totalHourConfirm,
                };
                exportData.push(exportItem);
                return (
                    <tr key={index}>
                        <td>
                            {page > 1
                                ? index + 1 + limit * (page - 1)
                                : index + 1}
                        </td>
                        <td>{item.user.fullname}</td>
                        <td>
                            <ol>{renderClassData}</ol>
                        </td>
                        <td>
                            <span style={{ color: "red" }}>
                                <strong>{totalHour}</strong>
                            </span>
                        </td>
                        <td>
                            <span style={{ color: "green" }}>
                                <strong>{totalHourConfirm}</strong>
                            </span>
                        </td>
                    </tr>
                );
            });
        } else {
            renderData = (
                <tr>
                    <td colSpan={4} style={{ textAlign: "center" }}>
                        Không có dữ liệu
                    </td>
                </tr>
            );
        }

        renderTableTeacherReport = (
            <TableComponent id="teacher-report" responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Tên giáo viên</th>
                        <th>Danh sách lớp</th>
                        <th>Tổng số giờ đã dạy</th>
                        <th>Tổng số giờ đã xác nhận</th>
                    </tr>
                </thead>
                <tbody>{renderData}</tbody>
            </TableComponent>
        );

        return (
            <Container>
                <Row>
                    <Col md={12}>
                        <h3 className="page-title">
                            {" "}
                            <a className="hover-back" onClick={this.handleBack}>
                                <i className="fas fa-chevron-left" />{" "}
                                &nbsp;&nbsp;Thống kê số giờ giáo viên
                            </a>
                        </h3>
                        <h3 className="page-subhead subhead">
                            Thống kê số giờ đã dạy của giáo viên theo thời gian
                        </h3>
                    </Col>
                </Row>
                <Row>
                    <Col md={12} lg={12} xl={12}>
                        <Card>
                            <CardBody>
                                <TeacherReportFilter
                                    handleProcessFilter={
                                        this.handleProcessFilter
                                    }
                                />
                                <CSVLink
                                    data={exportData}
                                    headers={headers}
                                    filename={"thong_ke_giao_vien.csv"}
                                >
                                    <Button color="primary">
                                        Export Excel{" "}
                                        <i className="fas fa-file-excel" />
                                    </Button>
                                </CSVLink>

                                {renderTableTeacherReport}
                                <div className="react-paginate">
                                    <Pagination
                                        totalRecords={totalTeacherReport}
                                        pageLimit={limit}
                                        pageNeighbours={1}
                                        page={page}
                                        onPageChanged={this.onPageChanged}
                                    />
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }
}

const tListTeacherReport = translate("common")(ListTeacherReport);
export { tListTeacherReport as ListTeacherReport };
