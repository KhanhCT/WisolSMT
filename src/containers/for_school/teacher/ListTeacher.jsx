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
import AddEditTeacherModal from "./AddEditTeacherModal";
import UploadContractModal from "./UploadContractModal";
import {
    LIST_RIGHT_FOR_SCHOOL,
    SCHOOL_ROLE_KEY_CHECK,
} from "../../../constants";
import { AuthorizarionSchoolComponent } from "../../../components/common";
import { Route } from "react-router-dom";
import TeacherFilter from "./TeacherFilter";

class ListTeacher extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listTeacher: [],
            listContract: [],
            currTeacher: null,
            modalIsOpen: false,
            modalContractIsOpen: false,
            confirmModalIsOpen: false,
            updateTeacher: false,
            limit: 10,
            page: 1,
            totalTeacher: 0,
            status: null,
        };
    }

    componentDidMount() {
        this.getListTeacher();
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

    getListTeacher = () => {
        const { location } = this.props;
        const { limit, page } = this.state;
        // Call API get list Teacher
        callApi("for_school/teachers", "GET", {
            department_id: location.state.idDepartment,
            limit: limit,
            page: page,
        })
            .then(res => {
                this.setState({
                    listTeacher: res.data.data.rows,
                    totalTeacher: res.data.data.count,
                });
            })
            .catch(error => {
                console.log(error);
            });
    };

    getListContract = id => {
        // Call API get list contract
        callApi("for_school/contracts", "GET", {
            teacher_id: id,
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

    handleOpenChangeStatusTeacher = (e, index) => {
        this.setState(
            {
                currTeacher: this.state.listTeacher[index],
            },
            () => {
                this.setState({
                    confirmModalIsOpen: true,
                    status: this.state.currTeacher.departments[0][
                        "teacher_department"
                    ].status,
                });
            }
        );
    };

    handleConfirmChangeStatus = () => {
        const { currTeacher } = this.state;
        if (currTeacher) {
            // Call API change status Teacher
            callApi(
                `for_school/teachers/change-status/${
                    currTeacher.departments[0]["teacher_department"].id
                }`,
                "PUT",
                null,
                {
                    status:
                        currTeacher.departments[0]["teacher_department"].status,
                }
            )
                .then(res => {
                    this.toggleConfirmModal();
                    this.getListTeacher();
                })
                .catch(error => {
                    console.log(error);
                });
        }
    };

    handleOpenAddTeacher = () => {
        this.setState(
            {
                currTeacher: null,
            },
            () => {
                this.setState({
                    modalIsOpen: true,
                    updateTeacher: false,
                });
            }
        );
    };

    handleOpenUploadContract = index => {
        this.setState(
            {
                currTeacher: this.state.listTeacher[index],
            },
            () => {
                this.getListContract(this.state.currTeacher.id);
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
                this.getListTeacher();
            });
    };

    // Handle Filter Teacher
    handleProcessFilter = formData => {
        const { location } = this.props;
        const { limit, page } = this.state;
        // Call API get list Teacher
        callApi("for_school/teachers", "GET", {
            ...formData,
            department_id: location.state.idDepartment,
            limit: limit,
            page: page,
        })
            .then(res => {
                this.setState({
                    listTeacher: res.data.data.rows,
                    totalTeacher: res.data.data.count,
                });
            })
            .catch(error => {
                console.log(error);
            });
    };

    render() {
        const TEACHER_RIGHT = LIST_RIGHT_FOR_SCHOOL["DEPARTMENT"]["TEACHER"];
        const KEY_CHECK = SCHOOL_ROLE_KEY_CHECK["DEPARTMENT"];
        const {
            listTeacher,
            listContract,
            modalIsOpen,
            modalContractIsOpen,
            confirmModalIsOpen,
            currTeacher,
            updateTeacher,
            totalTeacher,
            limit,
            page,
            status,
        } = this.state;
        let renderData = null,
            renderTableListTeacher = null;
        if (listTeacher.length > 0) {
            renderData = listTeacher.map((item, index) => {
                return (
                    <tr key={index}>
                        <td>
                            {page > 1
                                ? index + 1 + limit * (page - 1)
                                : index + 1}
                        </td>
                        <td>{item.user.username}</td>
                        <td>{item.user.fullname}</td>
                        <td>{item.user.phone}</td>
                        <td>{item.user.email}</td>
                        <td>
                            <Route
                                component={AuthorizarionSchoolComponent(
                                    TEACHER_RIGHT["EDIT"],
                                    KEY_CHECK
                                )(() => (
                                    <ButtonToolbar>
                                        <Button
                                            className="icon"
                                            outline
                                            onClick={e => {
                                                this.handleOpenChangeStatusTeacher(
                                                    e,
                                                    index
                                                );
                                            }}
                                        >
                                            {item.departments[0][
                                                "teacher_department"
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
                                        <Button
                                            className="icon"
                                            outline
                                            onClick={() => {
                                                this.handleOpenUploadContract(
                                                    index
                                                );
                                            }}
                                        >
                                            <i className="fas fa-upload" />
                                        </Button>
                                    </ButtonToolbar>
                                ))}
                            />
                        </td>
                    </tr>
                );
            });
        } else {
            renderData = (
                <tr>
                    <td colSpan={6} style={{ textAlign: "center" }}>
                        Không có giáo viên nào!
                    </td>
                </tr>
            );
        }

        renderTableListTeacher = (
            <TableComponent responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Tài khoản</th>
                        <th>Họ và tên</th>
                        <th>Số điện thoại</th>
                        <th>Email</th>
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
                                &nbsp;&nbsp;Quản lý giáo viên
                            </a>
                        </h3>
                        <h3 className="page-subhead subhead">
                            Mô tả ngắn Quản lý giáo viên
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
                                            TEACHER_RIGHT["ADD"],
                                            KEY_CHECK
                                        )(() => (
                                            <ButtonToolbar>
                                                <Button
                                                    color="success"
                                                    onClick={
                                                        this
                                                            .handleOpenAddTeacher
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

                                <TeacherFilter
                                    handleProcessFilter={
                                        this.handleProcessFilter
                                    }
                                />

                                {renderTableListTeacher}

                                <AddEditTeacherModal
                                    currTeacher={currTeacher}
                                    modalIsOpen={modalIsOpen}
                                    toggle={this.toggle}
                                    getListTeacher={this.getListTeacher}
                                    updateTeacher={updateTeacher}
                                />

                                <UploadContractModal
                                    currTeacher={currTeacher}
                                    listContract={listContract}
                                    getListContract={this.getListContract}
                                    modalIsOpen={modalContractIsOpen}
                                    toggle={this.toggleContract}
                                />

                                <div className="react-paginate">
                                    <Pagination
                                        totalRecords={totalTeacher}
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

const tListTeacher = translate("common")(ListTeacher);
export { tListTeacher as ListTeacher };
