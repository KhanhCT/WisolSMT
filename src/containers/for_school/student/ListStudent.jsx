import React, { Component } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    ButtonToolbar,
    Button,
} from "reactstrap";
import { translate } from "react-i18next";
import { TableComponent } from "../../../components/bases";
import { ConfirmModalCustom, Pagination } from "../../../components/common";
import { callApi } from "../../../helpers";
import AddEditStudentModal from "./AddEditStudentModal";
import UploadContractModal from "./UploadContractModal";
import {
    LIST_RIGHT_FOR_SCHOOL,
    SCHOOL_ROLE_KEY_CHECK,
} from "../../../constants";
import { AuthorizarionSchoolComponent } from "../../../components/common";
import { Route } from "react-router-dom";
import StudentFilter from "./StudentFilter";
import { roundHour } from "./AddEditStudentForm";

class ListStudent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listStudent: [],
            listContract: [],
            currStudent: null,
            modalIsOpen: false,
            modalContractIsOpen: false,
            confirmModalIsOpen: false,
            updateStudent: false,
            limit: 10,
            page: 1,
            totalStudent: 0,
            status: null,
        };
    }

    componentDidMount() {
        this.getListStudent();
    }

    toggle = () => {
        this.setState({ modalIsOpen: !this.state.modalIsOpen });
    };

    toggleContract = () => {
        this.setState({ modalContractIsOpen: !this.state.modalContractIsOpen });
    };

    toggleConfirmModal = () => {
        this.setState({ confirmModalIsOpen: !this.state.confirmModalIsOpen });
    };

    handleBack = () => {
        this.props.history.goBack();
    };

    getListStudent = () => {
        const { location } = this.props;
        const { limit, page } = this.state;
        // Call API get list Teacher
        callApi("for_school/students", "GET", {
            department_id: location.state.idDepartment,
            limit: limit,
            page: page,
        })
            .then(res => {
                this.setState({
                    listStudent: res.data.data.rows,
                    totalStudent: res.data.data.count,
                });
            })
            .catch(error => {
                console.log(error);
            });
    };

    handleOpenChangeStatusStudent = (e, index) => {
        this.setState(
            {
                currStudent: this.state.listStudent[index],
            },
            () => {
                this.setState({
                    confirmModalIsOpen: true,
                    status: this.state.currStudent.departments[0][
                        "student_department"
                    ].status,
                });
            }
        );
    };

    handleConfirmChangeStatus = () => {
        const { currStudent } = this.state;
        if (currStudent) {
            // Call API change status Student
            callApi(
                `for_school/students/change-status/${
                    currStudent.departments[0]["student_department"].id
                }`,
                "PUT",
                null,
                {
                    status:
                        currStudent.departments[0]["student_department"].status,
                }
            )
                .then(res => {
                    this.toggleConfirmModal();
                    this.getListStudent();
                })
                .catch(error => {
                    console.log(error);
                });
        }
    };

    getListContract = id => {
        // Call API get list contract
        callApi("for_school/contracts", "GET", {
            student_id: id,
        })
            .then(res => {
                this.setState({
                    listContract: res.data.data.rows,
                });
            })
            .catch(error => {
                console.log(error);
            });
    };

    handleOpenAddStudent = () => {
        this.setState(
            {
                currStudent: null,
            },
            () => {
                this.setState({
                    modalIsOpen: true,
                    updateStudent: false,
                });
            }
        );
    };

    handleEditStudent = index => {
        this.setState(
            {
                currStudent: this.state.listStudent[index],
            },
            () => {
                this.setState({
                    modalIsOpen: true,
                    updateStudent: true,
                });
            }
        );
    };

    handleOpenUploadContract = index => {
        this.setState(
            {
                currStudent: this.state.listStudent[index],
            },
            () => {
                this.getListContract(this.state.currStudent.id);
                this.setState({
                    modalContractIsOpen: true,
                });
            }
        );
    };

    onPageChanged = data => {
        const { currentPage } = data;
        if (currentPage)
            this.setState({ page: currentPage }, () => {
                this.getListStudent();
            });
    };

    // Handle Filter Student
    handleProcessFilter = formData => {
        const { location } = this.props;
        const { limit, page } = this.state;
        // Call API get list student
        callApi("for_school/students", "GET", {
            ...formData,
            department_id: location.state.idDepartment,
            limit: limit,
            page: page,
        })
            .then(res => {
                this.setState({
                    listStudent: res.data.data.rows,
                    totalStudent: res.data.data.count,
                });
            })
            .catch(error => {
                console.log(error);
            });
    };

    render() {
        const STUDENT_RIGHT = LIST_RIGHT_FOR_SCHOOL["DEPARTMENT"]["STUDENT"];
        const KEY_CHECK = SCHOOL_ROLE_KEY_CHECK["DEPARTMENT"];
        const {
            listStudent,
            listContract,
            modalIsOpen,
            modalContractIsOpen,
            confirmModalIsOpen,
            currStudent,
            updateStudent,
            totalStudent,
            limit,
            page,
            status,
        } = this.state;
        let renderData = null,
            renderTableListStudent = null;
        if (listStudent.length > 0) {
            renderData = listStudent.map((item, index) => {
                let hourseRegisterExpired =
                    parseInt(item.total_minute_registered) -
                    parseInt(item.total_minute_learned);
                return (
                    <tr key={index}>
                        <td>
                            {page > 1
                                ? index + 1 + limit * (page - 1)
                                : index + 1}
                        </td>
                        <td>{item.user ? item.user.username : ""}</td>
                        <td>{item.user ? item.user.fullname : ""}</td>
                        <td>{item.user ? item.user.phone : ""}</td>
                        <td>{item.user ? item.user.email : ""}</td>
                        <td>{roundHour(item.total_minute_registered)}</td>
                        <td>{roundHour(hourseRegisterExpired)}</td>
                        <td>
                            <ButtonToolbar>
                                <Route
                                    component={AuthorizarionSchoolComponent(
                                        STUDENT_RIGHT["EDIT"],
                                        KEY_CHECK
                                    )(() => (
                                        <Button
                                            className="icon"
                                            outline
                                            onClick={() => {
                                                this.handleEditStudent(index);
                                            }}
                                        >
                                            <i className="fas fa-user-edit" />
                                        </Button>
                                    ))}
                                />
                                <Route
                                    component={AuthorizarionSchoolComponent(
                                        STUDENT_RIGHT["DELETE"],
                                        KEY_CHECK
                                    )(() => (
                                        <Button
                                            className="icon"
                                            outline
                                            onClick={e => {
                                                this.handleOpenChangeStatusStudent(
                                                    e,
                                                    index
                                                );
                                            }}
                                        >
                                            {item.departments[0][
                                                "student_department"
                                            ].status ? (
                                                <i
                                                    className="fas fa-check"
                                                    style={{ color: "green" }}
                                                />
                                            ) : (
                                                <i
                                                    className="fas fa-times"
                                                    style={{ color: "red" }}
                                                />
                                            )}
                                        </Button>
                                    ))}
                                />
                                <Button
                                    className="icon"
                                    outline
                                    onClick={() => {
                                        this.handleOpenUploadContract(index);
                                    }}
                                >
                                    <i className="fas fa-upload" />
                                </Button>
                            </ButtonToolbar>
                        </td>
                    </tr>
                );
            });
        } else {
            renderData = (
                <tr>
                    <td colSpan={8} style={{ textAlign: "center" }}>
                        Không có học viên nào!
                    </td>
                </tr>
            );
        }

        renderTableListStudent = (
            <TableComponent responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Tài khoản</th>
                        <th>Họ và tên</th>
                        <th>Số điện thoại</th>
                        <th>Email</th>
                        <th>Số giờ đăng ký</th>
                        <th>Số giờ còn lại</th>
                        <th>Hành động</th>
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
                                &nbsp;&nbsp;Quản lý học viên
                            </a>
                        </h3>
                        <h3 className="page-subhead subhead">
                            Mô tả ngắn Quản lý học viên
                        </h3>
                    </Col>
                </Row>
                <Row>
                    <Col md={12} lg={12} xl={12}>
                        <Card>
                            <CardBody>
                                <div className="card__title">
                                    <Route
                                        component={AuthorizarionSchoolComponent(
                                            STUDENT_RIGHT["ADD"],
                                            KEY_CHECK
                                        )(() => (
                                            <ButtonToolbar>
                                                <Button
                                                    color="success"
                                                    onClick={
                                                        this
                                                            .handleOpenAddStudent
                                                    }
                                                >
                                                    <i className="fas fa-plus" />{" "}
                                                    Thêm mới
                                                </Button>
                                            </ButtonToolbar>
                                        ))}
                                    />
                                </div>

                                <ConfirmModalCustom
                                    title="Cập nhật tình trạng!"
                                    message={`Bạn chắc chắn có muốn ${
                                        status ? "ngừng hoạt động" : "hoạt động"
                                    } tài khoản này không?`}
                                    modalIsOpen={confirmModalIsOpen}
                                    toggle={this.toggleConfirmModal}
                                    handleConfirmAction={
                                        this.handleConfirmChangeStatus
                                    }
                                />

                                <StudentFilter
                                    handleProcessFilter={
                                        this.handleProcessFilter
                                    }
                                />

                                {renderTableListStudent}

                                <AddEditStudentModal
                                    currStudent={currStudent}
                                    modalIsOpen={modalIsOpen}
                                    toggle={this.toggle}
                                    getListStudent={this.getListStudent}
                                    updateStudent={updateStudent}
                                />

                                <UploadContractModal
                                    currStudent={currStudent}
                                    listContract={listContract}
                                    getListContract={this.getListContract}
                                    modalIsOpen={modalContractIsOpen}
                                    toggle={this.toggleContract}
                                />

                                <div className="react-paginate">
                                    <Pagination
                                        totalRecords={totalStudent}
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

const tListStudent = translate("common")(ListStudent);
export { tListStudent as ListStudent };
