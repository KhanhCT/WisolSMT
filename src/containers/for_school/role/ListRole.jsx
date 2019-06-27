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
import { callApi, utilHelper } from "../../../helpers";
import AddEditRoleModal from "./AddEditRoleModal";
import { connect } from "react-redux";
import {
    LIST_RIGHT_FOR_SCHOOL,
    SCHOOL_ROLE_KEY_CHECK,
} from "../../../constants";
import { AuthorizarionSchoolComponent } from "../../../components/common";
import { Route } from "react-router-dom";

class ListRole extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listRole: [],
            currRole: null,
            modalIsOpen: false,
            confirmModalIsOpen: false,
            updateRole: false,
            limit: 10,
            page: 1,
            totalRole: 0,
        };
    }

    componentDidMount() {
        this.getListRole();
    }

    handleBack = () => {
        this.props.history.goBack();
    };

    toggle = () => {
        this.setState({ modalIsOpen: !this.state.modalIsOpen });
    };

    toggleConfirmModal = () => {
        this.setState({ confirmModalIsOpen: !this.state.confirmModalIsOpen });
    };

    getListRole = () => {
        const { limit, page } = this.state;
        const { currSchool, currDept } = this.props;
        // Call API get list Role
        callApi("for_school/role_for_schools", "GET", {
            limit: limit,
            page: page,
            school_id: currSchool.id,
            department_id: currDept.id,
        })
            .then(res => {
                let newLstRole = res.data.data.rows.map(role => {
                    role["rights"] = utilHelper.convertStringToJSON(
                        role["rights"]
                    );
                    return role;
                });

                this.setState({
                    listRole: newLstRole,
                    totalRole: res.data.data.count,
                });
            })
            .catch(error => {
                console.log(error);
            });
    };

    handleOpenDeleteRole = (e, index) => {
        this.setState(
            {
                currRole: this.state.listRole[index],
            },
            () => {
                this.setState({ confirmModalIsOpen: true });
            }
        );
    };

    handleConfirmDelete = () => {
        const { currRole, page, limit, totalRole } = this.state;
        if (currRole) {
            // Call API Delete Role
            callApi(
                `for_school/role_for_schools/${currRole.id}`,
                "DELETE",
                null
            )
                .then(res => {
                    this.toggleConfirmModal();
                    if ((page - 1) * limit + 1 == totalRole) {
                        this.setState({ page: page - 1 }, () => {
                            this.getListRole();
                        });
                    } else {
                        this.getListRole();
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    };

    handleOpenAddRole = () => {
        this.setState(
            {
                currRole: null,
            },
            () => {
                this.setState({
                    modalIsOpen: true,
                    updateRole: false,
                });
            }
        );
    };

    handleOpenEditRole = (e, index) => {
        this.setState(
            {
                currRole: this.state.listRole[index],
            },
            () => {
                this.setState({
                    modalIsOpen: true,
                    updateRole: true,
                });
            }
        );
    };

    onPageChanged = data => {
        const { currentPage } = data;
        if (currentPage)
            this.setState({ page: currentPage }, () => {
                this.getListRole();
            });
    };

    render() {
        const ROLE_RIGHT = LIST_RIGHT_FOR_SCHOOL["DEPARTMENT"]["ROLE"];
        const KEY_CHECK = SCHOOL_ROLE_KEY_CHECK["DEPARTMENT"];
        const {
            listRole,
            modalIsOpen,
            confirmModalIsOpen,
            currRole,
            updateRole,
            totalRole,
            limit,
            page,
        } = this.state;
        let renderData = null,
            renderTableListRole = null;
        if (listRole.length > 0) {
            renderData = listRole.map((item, index) => {
                return (
                    <tr key={index}>
                        <td>
                            {page > 1
                                ? index + 1 + limit * (page - 1)
                                : index + 1}
                        </td>
                        <td>{item.name}</td>
                        <td>{item.description}</td>
                        <td>
                            <ButtonToolbar>
                                <Route
                                    component={AuthorizarionSchoolComponent(
                                        ROLE_RIGHT["EDIT"],
                                        KEY_CHECK
                                    )(() => (
                                        <Button
                                            className="icon"
                                            outline
                                            onClick={e => {
                                                this.handleOpenEditRole(
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
                                        ROLE_RIGHT["DELETE"],
                                        KEY_CHECK
                                    )(() => (
                                        <Button
                                            className="icon"
                                            outline
                                            onClick={e => {
                                                this.handleOpenDeleteRole(
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
                    <td colSpan={4} style={{ textAlign: "center" }}>
                        Không có quyền nào!
                    </td>
                </tr>
            );
        }

        renderTableListRole = (
            <TableComponent responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Tên quyền</th>
                        <th>Mô tả</th>
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
                                &nbsp;&nbsp; Quản lý quyền{" "}
                            </a>
                        </h3>
                        <h3 className="page-subhead subhead">
                            Mô tả ngăn Quản lý quyền
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
                                            ROLE_RIGHT["ADD"],
                                            KEY_CHECK
                                        )(() => (
                                            <ButtonToolbar>
                                                <Button
                                                    color="success"
                                                    onClick={
                                                        this.handleOpenAddRole
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
                                    title="Xóa quyền!"
                                    message="Bạn chắc chắn có muốn xóa quyền này không?"
                                    modalIsOpen={confirmModalIsOpen}
                                    toggle={this.toggleConfirmModal}
                                    handleConfirmAction={
                                        this.handleConfirmDelete
                                    }
                                />

                                {renderTableListRole}

                                <AddEditRoleModal
                                    currRole={currRole}
                                    modalIsOpen={modalIsOpen}
                                    toggle={this.toggle}
                                    getListRole={this.getListRole}
                                    updateRole={updateRole}
                                />

                                <div className="react-paginate">
                                    <Pagination
                                        totalRecords={totalRole}
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

const tListRole = translate("common")(ListRole);
const mapStateToProp = state => {
    const { forSchoolReducer } = state;
    return {
        currSchool: forSchoolReducer.currSchool,
        currDept: forSchoolReducer.currDept,
    };
};

const wrap = connect(mapStateToProp)(tListRole);
export { wrap as ListRole };
