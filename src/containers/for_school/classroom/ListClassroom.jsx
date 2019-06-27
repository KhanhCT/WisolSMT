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
import AddEditClassroomModal from "./AddEditClassroomModal";
import {
    LIST_RIGHT_FOR_SCHOOL,
    SCHOOL_ROLE_KEY_CHECK,
} from "../../../constants";
import { AuthorizarionSchoolComponent } from "../../../components/common";
import { Route } from "react-router-dom";

class ListClassroom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listClassroom: [],
            currClassroom: null,
            modalIsOpen: false,
            confirmModalIsOpen: false,
            updateClassroom: false,
            limit: 10,
            page: 1,
            totalClassroom: 0,
        };
    }

    componentDidMount() {
        this.getListClassroom();
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

    getListClassroom = () => {
        const { location } = this.props;
        const { limit, page } = this.state;
        // Call API get list room
        callApi("for_school/rooms", "GET", {
            department_id: location.state.idDepartment,
            limit: limit,
            page: page,
        })
            .then(res => {
                this.setState({
                    listClassroom: res.data.data.rows,
                    totalClassroom: res.data.data.count,
                });
            })
            .catch(error => {
                console.log(error);
            });
    };

    handleOpenDeleteClassroom = (e, index) => {
        this.setState(
            {
                currClassroom: this.state.listClassroom[index],
            },
            () => {
                this.setState({ confirmModalIsOpen: true });
            }
        );
    };

    handleConfirmDelete = () => {
        const { currClassroom, page, limit, totalClassroom } = this.state;
        if (currClassroom) {
            // Call API Delete Classroom
            callApi(`for_school/rooms/${currClassroom.id}`, "DELETE", null)
                .then(res => {
                    this.toggleConfirmModal();
                    if ((page - 1) * limit + 1 == totalClassroom) {
                        this.setState({ page: page - 1 }, () => {
                            this.getListClassroom();
                        });
                    } else {
                        this.getListClassroom();
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    };

    handleOpenAddClassroom = () => {
        this.setState(
            {
                currClassroom: null,
            },
            () => {
                this.setState({
                    modalIsOpen: true,
                    updateClassroom: false,
                });
            }
        );
    };

    handleOpenEditClassroom = (e, index) => {
        this.setState(
            {
                currClassroom: this.state.listClassroom[index],
            },
            () => {
                this.setState({
                    modalIsOpen: true,
                    updateClassroom: true,
                });
            }
        );
    };

    onPageChanged = data => {
        const { currentPage } = data;
        if (currentPage)
            this.setState({ page: currentPage }, () => {
                this.getListClassroom();
            });
    };

    render() {
        const ROOM_RIGHT = LIST_RIGHT_FOR_SCHOOL["DEPARTMENT"]["ROOM"];
        const KEY_CHECK = SCHOOL_ROLE_KEY_CHECK["DEPARTMENT"];
        const {
            listClassroom,
            modalIsOpen,
            confirmModalIsOpen,
            currClassroom,
            updateClassroom,
            totalClassroom,
            limit,
            page,
        } = this.state;
        let renderData = null,
            renderTableListClassroom = null;
        if (listClassroom.length > 0) {
            renderData = listClassroom.map((item, index) => {
                return (
                    <tr key={index}>
                        <td>
                            {page > 1
                                ? index + 1 + limit * (page - 1)
                                : index + 1}
                        </td>
                        <td>{item.name}</td>
                        <td>{item.capacity}</td>
                        <td>
                            <ButtonToolbar>
                                <Route
                                    component={AuthorizarionSchoolComponent(
                                        ROOM_RIGHT["EDIT"],
                                        KEY_CHECK
                                    )(() => (
                                        <Button
                                            className="icon"
                                            outline
                                            onClick={e => {
                                                this.handleOpenEditClassroom(
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
                                        ROOM_RIGHT["DELETE"],
                                        KEY_CHECK
                                    )(() => (
                                        <Button
                                            className="icon"
                                            outline
                                            onClick={e => {
                                                this.handleOpenDeleteClassroom(
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
                        Không có phòng học nào!
                    </td>
                </tr>
            );
        }

        renderTableListClassroom = (
            <TableComponent responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Tên phòng</th>
                        <th>Sức chứa</th>
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
                                &nbsp;&nbsp;Quản lý phòng học
                            </a>
                        </h3>
                        <h3 className="page-subhead subhead">
                            Mô tả ngắn Quản lý phòng học
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
                                            ROOM_RIGHT["ADD"],
                                            KEY_CHECK
                                        )(() => (
                                            <ButtonToolbar>
                                                <Button
                                                    color="success"
                                                    onClick={
                                                        this
                                                            .handleOpenAddClassroom
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
                                    title="Xóa phòng học!"
                                    message="Bạn chắc chắn có muốn xóa phòng học này không?"
                                    modalIsOpen={confirmModalIsOpen}
                                    toggle={this.toggleConfirmModal}
                                    handleConfirmAction={
                                        this.handleConfirmDelete
                                    }
                                />

                                {renderTableListClassroom}

                                <AddEditClassroomModal
                                    currClassroom={currClassroom}
                                    modalIsOpen={modalIsOpen}
                                    toggle={this.toggle}
                                    getListClassroom={this.getListClassroom}
                                    updateClassroom={updateClassroom}
                                />

                                <div className="react-paginate">
                                    <Pagination
                                        totalRecords={totalClassroom}
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

const tListClassroom = translate("common")(ListClassroom);
export { tListClassroom as ListClassroom };
