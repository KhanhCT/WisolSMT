import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    CardTitle,
    ButtonToolbar,
    ButtonGroup,
    Button,
} from "reactstrap";
import AddEditDepartmentModal from "../../department/AddEditDepartmentModal";
import {
    ROUTES,
    LIST_RIGHT_FOR_SCHOOL,
    SCHOOL_ROLE_KEY_CHECK,
} from "../../../../constants";
import { AuthorizarionSchoolComponent } from "../../../../components/common";
import { Route } from "react-router-dom";

export default class MainManagerUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currDepartment: null,
            updateDepartment: false,
            modalIsOpen: false,
            lstDepartmentAttribute: [],
        };
    }

    componentDidMount = () => {
        let arrDepartmentAttribute = [
            {
                id: 1,
                code: "classroom",
                name: "Phòng học",
                icon:
                    process.env.PUBLIC_URL +
                    "/img/base_attribute/classroom.svg",
            },
            {
                id: 2,
                code: "form",
                name: "Hình thức",
                icon:
                    process.env.PUBLIC_URL +
                    "/img/base_attribute/formalities.svg",
            },
            {
                id: 3,
                code: "course",
                name: "Khóa học",
                icon: process.env.PUBLIC_URL + "/img/base_attribute/course.svg",
            },
            {
                id: 4,
                code: "class",
                name: "Lớp học",
                icon: process.env.PUBLIC_URL + "/img/base_attribute/class.svg",
            },
            {
                id: 5,
                code: "teacher",
                name: "Giáo viên",
                icon:
                    process.env.PUBLIC_URL + "/img/base_attribute/teacher.svg",
            },
            {
                id: 6,
                code: "student",
                name: "Học viên",
                icon:
                    process.env.PUBLIC_URL + "/img/base_attribute/student.svg",
            },
            {
                id: 7,
                code: "schedule",
                name: "Thời khóa biểu",
                icon:
                    process.env.PUBLIC_URL + "/img/base_attribute/schedule.svg",
            },
            {
                id: 8,
                code: "role",
                name: "Quyền",
                icon: process.env.PUBLIC_URL + "/img/base_attribute/role.svg",
            },
            {
                id: 9,
                code: "notification",
                name: "Thông báo",
                icon:
                    process.env.PUBLIC_URL +
                    "/img/base_attribute/notification.svg",
            },
            {
                id: 10,
                code: "user",
                name: "Tài khoản nhân viên",
                icon: process.env.PUBLIC_URL + "/img/base_attribute/user.svg",
            },
            {
                id: 11,
                code: "report",
                name: "Thống kê số giờ giáo viên",
                icon:
                    process.env.PUBLIC_URL +
                    "/img/base_attribute/formalities.svg",
            },
        ];

        this.setState({ lstDepartmentAttribute: arrDepartmentAttribute });
    };

    toggle = () => {
        this.setState({ modalIsOpen: !this.state.modalIsOpen });
    };

    handleBack = () => {
        this.props.history.goBack();
    };

    handlOpenEditDepartment = () => {
        const { location } = this.props;
        this.setState(
            {
                currDepartment: location.state.currDepartment,
            },
            () => {
                this.setState({
                    modalIsOpen: true,
                    updateDepartment: true,
                });
            }
        );
    };

    render() {
        const { match, location } = this.props;
        const {
            modalIsOpen,
            currDepartment,
            updateDepartment,
            lstDepartmentAttribute,
        } = this.state;

        let renderData = null;
        if (lstDepartmentAttribute.length > 0) {
            const DEPARTMENT_RIGHT = LIST_RIGHT_FOR_SCHOOL["DEPARTMENT"];
            renderData = lstDepartmentAttribute.map((item, index) => {
                let allowRight = null;
                switch (item.id) {
                    case 1:
                        allowRight = DEPARTMENT_RIGHT["ROOM"]["VIEW"];
                        break;
                    case 2:
                        allowRight = DEPARTMENT_RIGHT["STUDY_METHOD"]["VIEW"];
                        break;
                    case 3:
                        allowRight = DEPARTMENT_RIGHT["COURSE"]["VIEW"];
                        break;
                    case 4:
                        allowRight = DEPARTMENT_RIGHT["CLASS"]["VIEW"];
                        break;
                    case 5:
                        allowRight = DEPARTMENT_RIGHT["TEACHER"]["VIEW"];
                        break;
                    case 6:
                        allowRight = DEPARTMENT_RIGHT["STUDENT"]["VIEW"];
                        break;
                    case 7:
                        allowRight = DEPARTMENT_RIGHT["SCHEDULE"]["VIEW"];
                        break;
                    case 8:
                        allowRight = DEPARTMENT_RIGHT["ROLE"]["VIEW"];
                        break;
                    case 10:
                        allowRight = DEPARTMENT_RIGHT["STAFF"]["VIEW"];
                        break;
                    case 11:
                        allowRight = DEPARTMENT_RIGHT["STAFF"]["VIEW"];
                        break;
                    default:
                        break;
                }
                return (
                    <Route
                        key={index}
                        component={AuthorizarionSchoolComponent(
                            allowRight,
                            SCHOOL_ROLE_KEY_CHECK["DEPARTMENT"]
                        )(() => (
                            <Col sm={3} key={index} className="col-sm-6-m">
                                <Link
                                    to={{
                                        pathname: `${ROUTES.FOR_SCHOOL}/${
                                            match.params.school_code
                                        }/${match.params.department_code}/${
                                            item.code
                                        }`,
                                        state: {
                                            idDepartment:
                                                location.state.currDepartment
                                                    .id,
                                        },
                                    }}
                                    className="border-hover"
                                >
                                    <Card
                                        style={{
                                            height: "auto",
                                            paddingBottom: "25px",
                                        }}
                                    >
                                        <CardBody className="p-3 text-center">
                                            <img
                                                style={{ width: "30%" }}
                                                src={item.icon}
                                                alt={item.name}
                                            />
                                            <CardTitle className="mt-3 card-attribute">
                                                <p className="text-info">
                                                    <strong>
                                                        {item[
                                                            "name"
                                                        ].toUpperCase()}
                                                    </strong>
                                                </p>
                                            </CardTitle>
                                        </CardBody>
                                    </Card>
                                </Link>
                            </Col>
                        ))}
                    />
                );
            });
        }

        return (
            <Container>
                <Row>
                    <Col md={8}>
                        <h3 className="page-title">
                            {" "}
                            <a className="hover-back" onClick={this.handleBack}>
                                <i className="fas fa-chevron-left" />{" "}
                                &nbsp;&nbsp;
                                {location.state.currDepartment
                                    ? location.state.currDepartment.name
                                    : ""}{" "}
                            </a>
                        </h3>
                        <h3 className="page-subhead subhead">
                            {location.state.currDepartment
                                ? location.state.currDepartment.address
                                : ""}
                        </h3>
                    </Col>
                    <Col md={4}>
                        <Route
                            component={AuthorizarionSchoolComponent(
                                LIST_RIGHT_FOR_SCHOOL["SCHOOL"]["DEPARTMENT"][
                                    "EDIT"
                                ],
                                SCHOOL_ROLE_KEY_CHECK["SCHOOL"]
                            )(() => (
                                <ButtonToolbar style={{ float: "right" }}>
                                    <ButtonGroup className="btn-group--icons">
                                        <Button
                                            onClick={
                                                this.handlOpenEditDepartment
                                            }
                                            size="lg"
                                            outline
                                        >
                                            <span
                                                style={{ fontSize: "16px" }}
                                                className="lnr lnr-pencil"
                                            />
                                        </Button>
                                    </ButtonGroup>
                                </ButtonToolbar>
                            ))}
                        />
                    </Col>

                    <AddEditDepartmentModal
                        currDepartment={currDepartment}
                        modalIsOpen={modalIsOpen}
                        toggle={this.toggle}
                        updateDepartment={updateDepartment}
                    />
                    {renderData}
                </Row>
            </Container>
        );
    }
}
