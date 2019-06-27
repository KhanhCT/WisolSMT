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
import AddEditCourseModal from "./AddEditCourseModal";
import {
    LIST_RIGHT_FOR_SCHOOL,
    SCHOOL_ROLE_KEY_CHECK,
} from "../../../constants";
import { AuthorizarionSchoolComponent } from "../../../components/common";
import { Route } from "react-router-dom";

class ListCourse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listCourse: [],
            currCourse: null,
            modalIsOpen: false,
            confirmModalIsOpen: false,
            updateCourse: false,
            limit: 10,
            page: 1,
            totalCourse: 0,
        };
    }

    componentDidMount() {
        this.getListCourse();
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

    getListCourse = () => {
        const { location } = this.props;
        const { limit, page } = this.state;
        // Call API get list Course
        callApi("for_school/courses", "GET", {
            department_id: location.state.idDepartment,
            limit: limit,
            page: page,
        })
            .then(res => {
                this.setState({
                    listCourse: res.data.data.rows,
                    totalCourse: res.data.data.count,
                });
            })
            .catch(error => {
                console.log(error);
            });
    };

    handleOpenDeleteCourse = (e, index) => {
        this.setState(
            {
                currCourse: this.state.listCourse[index],
            },
            () => {
                this.setState({ confirmModalIsOpen: true });
            }
        );
    };

    handleConfirmDelete = () => {
        const { currCourse, page, limit, totalCourse } = this.state;
        if (currCourse) {
            // Call API Delete Course
            callApi(`for_school/courses/${currCourse.id}`, "DELETE", null)
                .then(res => {
                    this.toggleConfirmModal();
                    if ((page - 1) * limit + 1 == totalCourse) {
                        this.setState({ page: page - 1 }, () => {
                            this.getListCourse();
                        });
                    } else {
                        this.getListCourse();
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    };

    handleOpenAddCourse = () => {
        this.setState(
            {
                currCourse: null,
            },
            () => {
                this.setState({
                    modalIsOpen: true,
                    updateCourse: false,
                });
            }
        );
    };

    handleOpenEditCourse = (e, index) => {
        this.setState(
            {
                currCourse: this.state.listCourse[index],
            },
            () => {
                this.setState({
                    modalIsOpen: true,
                    updateCourse: true,
                });
            }
        );
    };

    onPageChanged = data => {
        const { currentPage } = data;
        if (currentPage)
            this.setState({ page: currentPage }, () => {
                this.getListCourse();
            });
    };

    render() {
        const COURSE_RIGHT = LIST_RIGHT_FOR_SCHOOL["DEPARTMENT"]["COURSE"];
        const KEY_CHECK = SCHOOL_ROLE_KEY_CHECK["DEPARTMENT"];
        const {
            listCourse,
            modalIsOpen,
            confirmModalIsOpen,
            currCourse,
            updateCourse,
            totalCourse,
            limit,
            page,
        } = this.state;
        let renderData = null,
            renderTableListCourse = null;
        if (listCourse.length > 0) {
            renderData = listCourse.map((item, index) => {
                return (
                    <tr key={index}>
                        <td>
                            {page > 1
                                ? index + 1 + limit * (page - 1)
                                : index + 1}
                        </td>
                        <td>{item.name}</td>
                        <td>{item.total_time}h</td>
                        <td>
                            <ButtonToolbar>
                                <Route
                                    component={AuthorizarionSchoolComponent(
                                        COURSE_RIGHT["EDIT"],
                                        KEY_CHECK
                                    )(() => (
                                        <Button
                                            className="icon"
                                            outline
                                            onClick={e => {
                                                this.handleOpenEditCourse(
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
                                        COURSE_RIGHT["DELETE"],
                                        KEY_CHECK
                                    )(() => (
                                        <Button
                                            className="icon"
                                            outline
                                            onClick={e => {
                                                this.handleOpenDeleteCourse(
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
                        Không có khóa học nào!
                    </td>
                </tr>
            );
        }

        renderTableListCourse = (
            <TableComponent responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Tên khóa học</th>
                        <th>Thời gian học</th>
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
                                &nbsp;&nbsp;Quản lý khóa học
                            </a>
                        </h3>
                        <h3 className="page-subhead subhead">
                            Mô tả ngắn Quản lý khóa học
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
                                            COURSE_RIGHT["ADD"],
                                            KEY_CHECK
                                        )(() => (
                                            <ButtonToolbar>
                                                <Button
                                                    color="success"
                                                    onClick={
                                                        this.handleOpenAddCourse
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
                                    title="Xóa khóa học!"
                                    message="Bạn chắc chắn có muốn xóa khóa học này không?"
                                    modalIsOpen={confirmModalIsOpen}
                                    toggle={this.toggleConfirmModal}
                                    handleConfirmAction={
                                        this.handleConfirmDelete
                                    }
                                />

                                {renderTableListCourse}

                                <AddEditCourseModal
                                    currCourse={currCourse}
                                    modalIsOpen={modalIsOpen}
                                    toggle={this.toggle}
                                    getListCourse={this.getListCourse}
                                    updateCourse={updateCourse}
                                />

                                <div className="react-paginate">
                                    <Pagination
                                        totalRecords={totalCourse}
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

const tListCourse = translate("common")(ListCourse);
export { tListCourse as ListCourse };
