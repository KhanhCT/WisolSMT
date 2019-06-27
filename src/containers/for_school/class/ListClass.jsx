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
import { connect } from "react-redux";
import { TableComponent } from "../../../components/bases";
import { ConfirmModalCustom, Pagination } from "../../../components/common";
import { callApi } from "../../../helpers";
import AddEditClassModal from "./AddEditClassModal";
import {
    LIST_RIGHT_FOR_SCHOOL,
    SCHOOL_ROLE_KEY_CHECK,
} from "../../../constants";
import { AuthorizarionSchoolComponent } from "../../../components/common";
import { Route } from "react-router-dom";
import ClassFilter from "./ClassFilter";
import moment from "moment";

class ListClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listClass: [],
            currClass: null,
            modalIsOpen: false,
            confirmModalIsOpen: false,
            updateClass: false,
            limit: 10,
            page: 1,
            totalClass: 0,
        };
    }

    componentDidMount() {
        this.getListClass();
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

    getListClass = () => {
        const { currDept } = this.props;
        const { limit, page } = this.state;
        // Call API get list Class
        callApi("for_school/classes", "GET", {
            limit: limit,
            page: page,
            department_id: currDept.id,
        })
            .then(res => {
                this.setState({
                    listClass: res.data.data.rows,
                    totalClass: res.data.data.count,
                });
            })
            .catch(error => {
                this.setState({
                    listClass: [],
                    totalClass: 0,
                });
                console.log(error);
            });
    };

    handleOpenDeleteClass = (e, index) => {
        this.setState(
            {
                currClass: this.state.listClass[index],
            },
            () => {
                this.setState({ confirmModalIsOpen: true });
            }
        );
    };

    handleConfirmDelete = () => {
        const { currClass, page, limit, totalClass } = this.state;
        if (currClass) {
            // Call API Delete Class
            callApi(`for_school/classes/${currClass.id}`, "DELETE", null)
                .then(res => {
                    this.toggleConfirmModal();
                    if ((page - 1) * limit + 1 == totalClass) {
                        this.setState({ page: page - 1 }, () => {
                            this.getListClass();
                        });
                    } else {
                        this.getListClass();
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    };

    handleOpenAddClass = () => {
        this.setState(
            {
                currClass: null,
            },
            () => {
                this.setState({
                    modalIsOpen: true,
                    updateClass: false,
                });
            }
        );
    };

    handleOpenEditClass = (e, index) => {
        this.setState(
            {
                currClass: this.state.listClass[index],
            },
            () => {
                this.setState({
                    modalIsOpen: true,
                    updateClass: true,
                });
            }
        );
    };

    onPageChanged = data => {
        const { currentPage } = data;
        if (currentPage)
            this.setState({ page: currentPage }, () => {
                this.getListClass();
            });
    };

    // Handle process filter
    handleProcessFilter = formData => {
        const { currDept } = this.props;
        const { limit, page } = this.state;
        // Call API get list Class
        callApi("for_school/classes", "GET", {
            ...formData,
            limit: limit,
            page: page,
            department_id: currDept.id,
        })
            .then(res => {
                this.setState({
                    listClass: res.data.data.rows,
                    totalClass: res.data.data.count,
                });
            })
            .catch(error => {
                this.setState({
                    listClass: [],
                    totalClass: 0,
                });
                console.log(error);
            });
    };

    render() {
        const CLASS_RIGHT = LIST_RIGHT_FOR_SCHOOL["DEPARTMENT"]["CLASS"];
        const KEY_CHECK = SCHOOL_ROLE_KEY_CHECK["DEPARTMENT"];
        const {
            listClass,
            modalIsOpen,
            confirmModalIsOpen,
            currClass,
            updateClass,
            totalClass,
            limit,
            page,
        } = this.state;
        let renderData = null,
            renderTableListClass = null;
        if (listClass.length > 0) {
            renderData = listClass.map((item, index) => {
                return (
                    <tr key={index}>
                        <td>
                            {page > 1
                                ? index + 1 + limit * (page - 1)
                                : index + 1}
                        </td>
                        <td>{item.name}</td>
                        <td>{item.number_session}</td>
                        <td>{item.number_student}</td>
                        <td>
                            {item.start_date
                                ? moment(item.start_date).format("DD/MM/YYYY")
                                : ""}
                        </td>
                        <td>
                            {item.end_date
                                ? moment(item.end_date).format("DD/MM/YYYY")
                                : ""}
                        </td>
                        <td>
                            <ButtonToolbar>
                                <Route
                                    component={AuthorizarionSchoolComponent(
                                        CLASS_RIGHT["EDIT"],
                                        KEY_CHECK
                                    )(() => (
                                        <Button
                                            className="icon"
                                            outline
                                            onClick={e => {
                                                this.handleOpenEditClass(
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
                                        CLASS_RIGHT["DELETE"],
                                        KEY_CHECK
                                    )(() => (
                                        <Button
                                            className="icon"
                                            outline
                                            onClick={e => {
                                                this.handleOpenDeleteClass(
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
                    <td colSpan={7} style={{ textAlign: "center" }}>
                        Không có lớp học nào!
                    </td>
                </tr>
            );
        }

        renderTableListClass = (
            <TableComponent responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Tên lớp</th>
                        <th>Số buổi học</th>
                        <th>Số học sinh</th>
                        <th>Thời gian bắt đầu</th>
                        <th>Thời gian kết thúc</th>
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
                                &nbsp;&nbsp;Quản lý lớp học
                            </a>
                        </h3>
                        <h3 className="page-subhead subhead">
                            Mô tả ngắn Quản lý lớp học
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
                                            CLASS_RIGHT["ADD"],
                                            KEY_CHECK
                                        )(() => (
                                            <ButtonToolbar>
                                                <Button
                                                    color="success"
                                                    onClick={
                                                        this.handleOpenAddClass
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
                                    title="Xóa lớp học!"
                                    message="Bạn chắc chắn có muốn xóa lớp học này không?"
                                    modalIsOpen={confirmModalIsOpen}
                                    toggle={this.toggleConfirmModal}
                                    handleConfirmAction={
                                        this.handleConfirmDelete
                                    }
                                />

                                <ClassFilter
                                    handleProcessFilter={
                                        this.handleProcessFilter
                                    }
                                />

                                {renderTableListClass}

                                <AddEditClassModal
                                    currClass={currClass}
                                    modalIsOpen={modalIsOpen}
                                    toggle={this.toggle}
                                    getListClass={this.getListClass}
                                    updateClass={updateClass}
                                />

                                <div className="react-paginate">
                                    <Pagination
                                        totalRecords={totalClass}
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

const tListClass = translate("common")(ListClass);
const mapStateToProp = state => {
    const { forSchoolReducer } = state;
    return {
        currDept: forSchoolReducer.currDept,
    };
};
const wrapComp = connect(mapStateToProp)(tListClass);
export { wrapComp as ListClass };
