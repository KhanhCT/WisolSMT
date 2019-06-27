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
import AddEditUserModal from "./AddEditUserModal";
import { connect } from "react-redux";
import {
    LIST_RIGHT_FOR_SCHOOL,
    SCHOOL_ROLE_KEY_CHECK,
} from "../../../constants";
import { AuthorizarionSchoolComponent } from "../../../components/common";
import { Route } from "react-router-dom";

class ListUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listUser: [],
            currUser: null,
            modalIsOpen: false,
            confirmModalIsOpen: false,
            updateUser: false,
            limit: 10,
            page: 1,
            totalUser: 0,
            status: null,
        };
    }

    componentDidMount() {
        this.getListUser();
    }

    toggle = () => {
        this.setState({ modalIsOpen: !this.state.modalIsOpen });
    };

    toggleConfirmModal = () => {
        this.setState({ confirmModalIsOpen: !this.state.confirmModalIsOpen });
    };

    handleBack = () => {
        this.props.history.goBack();
    };

    getListUser = () => {
        const { currDept } = this.props;
        const { limit, page } = this.state;
        // Call API get list Teacher
        callApi("for_school/users", "GET", {
            department_id: currDept.id,
            limit: limit,
            page: page,
        })
            .then(res => {
                this.setState({
                    listUser: res.data.data.rows,
                    totalUser: res.data.data.count,
                });
            })
            .catch(error => {
                console.log(error);
            });
    };

    handleOpenAddTeacher = () => {
        this.setState(
            {
                currUser: null,
            },
            () => {
                this.setState({
                    modalIsOpen: true,
                    updateUser: false,
                });
            }
        );
    };

    handleOpenEditUser = (e, index) => {
        this.setState(
            {
                currUser: this.state.listUser[index],
            },
            () => {
                this.setState({
                    modalIsOpen: true,
                    updateUser: true,
                });
            }
        );
    };

    handleOpenDeleteUser = (e, index) => {
        this.setState(
            {
                currUser: this.state.listUser[index],
            },
            () => {
                this.setState({ confirmModalIsOpen: true });
            }
        );
    };

    handleConfirmDelete = () => {
        const { currUser, page, limit, totalRole } = this.state;
        const { currSchool, currDept } = this.props;
        if (currUser) {
            // Call API Delete User
            callApi(`for_school/users`, "DELETE", null, {
                user_id: currUser.user.id,
                department_id: currDept.id,
                school_id: currSchool.id,
            })
                .then(res => {
                    this.toggleConfirmModal();
                    if ((page - 1) * limit + 1 == totalRole) {
                        this.setState({ page: page - 1 }, () => {
                            this.getListUser();
                        });
                    } else {
                        this.getListUser();
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    };

    onPageChanged = data => {
        const { currentPage } = data;
        if (currentPage)
            this.setState({ page: currentPage }, () => {
                this.getListUser();
            });
    };

    render() {
        const STAFF_RIGHT = LIST_RIGHT_FOR_SCHOOL["DEPARTMENT"]["STAFF"];
        const KEY_CHECK = SCHOOL_ROLE_KEY_CHECK["DEPARTMENT"];
        const {
            listUser,
            modalIsOpen,
            confirmModalIsOpen,
            currUser,
            updateUser,
            totalUser,
            limit,
            page,
            status,
        } = this.state;
        let renderData = null,
            renderTableListTeacher = null;
        if (listUser.length > 0) {
            renderData = listUser.map((item, index) => {
                let user = item.user;
                return (
                    <tr key={index}>
                        <td>
                            {page > 1
                                ? index + 1 + limit * (page - 1)
                                : index + 1}
                        </td>
                        <td>{user.username}</td>
                        <td>{user.fullname}</td>
                        <td>{user.phone}</td>
                        <td>{user.email}</td>
                        <td>
                            {user.user_role_for_schools.length > 0
                                ? user.user_role_for_schools[0].role_for_school[
                                      "name"
                                  ]
                                : ""}
                        </td>
                        <td>
                            <ButtonToolbar>
                                <Route
                                    component={AuthorizarionSchoolComponent(
                                        STAFF_RIGHT["EDIT"],
                                        KEY_CHECK
                                    )(() => (
                                        <Button
                                            className="icon"
                                            outline
                                            onClick={e => {
                                                this.handleOpenEditUser(
                                                    e,
                                                    index
                                                );
                                            }}
                                        >
                                            <i className="fas fa-pencil-alt" />
                                        </Button>
                                    ))}
                                />
                                <Route
                                    component={AuthorizarionSchoolComponent(
                                        STAFF_RIGHT["DELETE"],
                                        KEY_CHECK
                                    )(() => (
                                        <Button
                                            className="icon"
                                            outline
                                            onClick={e => {
                                                this.handleOpenDeleteUser(
                                                    e,
                                                    index
                                                );
                                            }}
                                        >
                                            <i className="fas fa-trash-alt" />
                                        </Button>
                                    ))}
                                />
                            </ButtonToolbar>
                        </td>
                    </tr>
                );
            });
        } else {
            renderData = (
                <tr>
                    <td colSpan={6} style={{ textAlign: "center" }}>
                        Không có tài khoản nhân viên nào!
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
                        <th>Quyền</th>
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
                                &nbsp;&nbsp;Quản lý tài khoản nhân viên
                            </a>
                        </h3>
                        <h3 className="page-subhead subhead">
                            Mô tả ngắn Quản lý nhân viên
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
                                            STAFF_RIGHT["ADD"],
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
                                    title="Xoá nhân viên!"
                                    message={`Bạn chắc chắn có muốn xoá tài khoản này khỏi cơ sở không?`}
                                    modalIsOpen={confirmModalIsOpen}
                                    toggle={this.toggleConfirmModal}
                                    handleConfirmAction={
                                        this.handleConfirmDelete
                                    }
                                />

                                {renderTableListTeacher}

                                <AddEditUserModal
                                    currUser={currUser}
                                    modalIsOpen={modalIsOpen}
                                    toggle={this.toggle}
                                    getListUser={this.getListUser}
                                    updateUser={updateUser}
                                />

                                <div className="react-paginate">
                                    <Pagination
                                        totalRecords={totalUser}
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

const tListUser = translate("common")(ListUser);
const mapStateToProp = state => {
    const { forSchoolReducer } = state;
    return {
        currSchool: forSchoolReducer.currDept,
        currDept: forSchoolReducer.currDept,
    };
};

const wrapComp = connect(mapStateToProp)(tListUser);

export { wrapComp as ListUser };
