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
import AddEditFormModal from "./AddEditFormModal";
import {
    LIST_RIGHT_FOR_SCHOOL,
    SCHOOL_ROLE_KEY_CHECK,
} from "../../../constants";
import { AuthorizarionSchoolComponent } from "../../../components/common";
import { Route } from "react-router-dom";

class ListForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listForm: [],
            currForm: null,
            modalIsOpen: false,
            confirmModalIsOpen: false,
            updateForm: false,
            limit: 10,
            page: 1,
            totalForm: 0,
        };
    }

    componentDidMount() {
        this.getListForm();
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

    getListForm = () => {
        const { location } = this.props;
        const { limit, page } = this.state;
        // Call API get list agent
        callApi("for_school/study_methods", "GET", {
            department_id: location.state.idDepartment,
            limit: limit,
            page: page,
        })
            .then(res => {
                let newLstForm = res.data.data.rows.map(form => {
                    form["price"] = utilHelper.convertStringToJSON(
                        form["price"]
                    );
                    return form;
                });
                this.setState({
                    listForm: newLstForm,
                    totalForm: res.data.data.count,
                });
            })
            .catch(error => {
                console.log(error);
            });
    };

    handleOpenDeleteForm = (e, index) => {
        this.setState(
            {
                currForm: this.state.listForm[index],
            },
            () => {
                this.setState({ confirmModalIsOpen: true });
            }
        );
    };

    handleConfirmDelete = () => {
        const { currForm, page, limit, totalForm } = this.state;
        if (currForm) {
            // Call API Delete Form
            callApi(`for_school/study_methods/${currForm.id}`, "DELETE", null)
                .then(res => {
                    this.toggleConfirmModal();
                    if ((page - 1) * limit + 1 == totalForm) {
                        this.setState({ page: page - 1 }, () => {
                            this.getListForm();
                        });
                    } else {
                        this.getListForm();
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    };

    handleOpenAddForm = () => {
        this.setState(
            {
                currForm: null,
            },
            () => {
                this.setState({
                    modalIsOpen: true,
                    updateForm: false,
                });
            }
        );
    };

    handleOpenEditForm = (e, index) => {
        this.setState(
            {
                currForm: this.state.listForm[index],
            },
            () => {
                this.setState({
                    modalIsOpen: true,
                    updateForm: true,
                });
            }
        );
    };

    onPageChanged = data => {
        const { currentPage } = data;
        if (currentPage)
            this.setState({ page: currentPage }, () => {
                this.getListForm();
            });
    };

    render() {
        const STUDY_METHOD_RIGHT =
            LIST_RIGHT_FOR_SCHOOL["DEPARTMENT"]["STUDY_METHOD"];
        const KEY_CHECK = SCHOOL_ROLE_KEY_CHECK["DEPARTMENT"];
        const {
            listForm,
            modalIsOpen,
            confirmModalIsOpen,
            currForm,
            updateForm,
            totalForm,
            limit,
            page,
        } = this.state;
        let renderData = null,
            renderTableListForm = null;
        if (listForm.length > 0) {
            renderData = listForm.map((item, index) => {
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
                                        STUDY_METHOD_RIGHT["EDIT"],
                                        KEY_CHECK
                                    )(() => (
                                        <Button
                                            className="icon"
                                            outline
                                            onClick={e => {
                                                this.handleOpenEditForm(
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
                                        STUDY_METHOD_RIGHT["DELETE"],
                                        KEY_CHECK
                                    )(() => (
                                        <Button
                                            className="icon"
                                            outline
                                            onClick={e => {
                                                this.handleOpenDeleteForm(
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
                        Không có hình thức nào!
                    </td>
                </tr>
            );
        }

        renderTableListForm = (
            <TableComponent responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Tên hình thức</th>
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
                                &nbsp;&nbsp;Quản lý hình thức
                            </a>
                        </h3>
                        <h3 className="page-subhead subhead">
                            Mô tả ngắn Quản lý hình thức
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
                                            STUDY_METHOD_RIGHT["ADD"],
                                            KEY_CHECK
                                        )(() => (
                                            <ButtonToolbar>
                                                <Button
                                                    color="success"
                                                    onClick={
                                                        this.handleOpenAddForm
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
                                    title="Xóa hình thức!"
                                    message="Bạn chắc chắn có muốn xóa hình thức này không?"
                                    modalIsOpen={confirmModalIsOpen}
                                    toggle={this.toggleConfirmModal}
                                    handleConfirmAction={
                                        this.handleConfirmDelete
                                    }
                                />

                                {renderTableListForm}

                                <AddEditFormModal
                                    currForm={currForm}
                                    modalIsOpen={modalIsOpen}
                                    toggle={this.toggle}
                                    getListForm={this.getListForm}
                                    updateForm={updateForm}
                                />

                                <div className="react-paginate">
                                    <Pagination
                                        totalRecords={totalForm}
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

const tListForm = translate("common")(ListForm);
export { tListForm as ListForm };
