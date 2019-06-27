import React, { Component } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    CardTitle,
    CardText,
    ButtonGroup,
    ButtonToolbar,
    Button,
    Input,
} from "reactstrap";
import { translate } from "react-i18next";
import { TableComponent } from "../../../../components/bases";
import { ConfirmModalCustom, Pagination } from "../../../../components/common";
import { callApi } from "../../../../helpers";
import AddEditManagerModal from "./AddEditManagerModal";
import { connect } from "react-redux";
import {
    LIST_RIGHT_FOR_SCHOOL,
    SCHOOL_ROLE_KEY_CHECK,
} from "../../../../constants";
import { AuthorizarionSchoolComponent } from "../../../../components/common";
import { Route } from "react-router-dom";

class ListManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listDepartment: [],
            listManager: [],
            currManager: null,
            currDepartmentId: null,
            modalIsOpen: false,
            confirmModalIsOpen: false,
            doUpdateManager: false,
            limit: 10,
            page: 1,
            totalManager: 0,
            showListManagerTable: false,
        };
    }

    componentDidMount() {
        this.getListDepartment();
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

    getListManager = () => {
        const { limit, page, currDepartmentId } = this.state;
        // Call API get list Manger
        callApi("for_school/managers", "GET", {
            department_id: currDepartmentId,
            limit: limit,
            page: page,
        })
            .then(res => {
                this.setState({
                    listManager: res.data.data.rows,
                    totalManager: res.data.data.count,
                });
            })
            .catch(error => {
                console.log(error);
            });
    };

    handleOpenChangeStatusManager = (e, index) => {
        this.setState(
            {
                currManager: this.state.listManager[index],
            },
            () => {
                this.setState({ confirmModalIsOpen: true });
            }
        );
    };

    handleConfirmChangeStatus = () => {
        const { currManager, currDepartmentId } = this.state;
        if (currManager) {
            // Call API change status Manager
            callApi("for_school/managers/change-status", "PUT", null, {
                department_id: currDepartmentId,
                manager_id: currManager.id,
                status: !currManager.departments[0].manager_department.status,
            })
                .then(res => {
                    this.toggleConfirmModal();
                    this.getListManager();
                })
                .catch(error => {
                    this.toggleConfirmModal();
                    console.log(error);
                });
        }
    };

    handleOpenAddManager = () => {
        this.setState({
            modalIsOpen: true,
            doUpdateManager: false,
        });
    };

    onPageChanged = data => {
        const { currentPage } = data;
        if (currentPage)
            this.setState({ page: currentPage }, () => {
                this.getListManager();
            });
    };

    getListDepartment() {
        const { limit, page } = this.state;
        callApi("for_school/departments", "GET", {
            limit: limit,
            page: page,
            school_id: this.props.currSchool.id,
        })
            .then(res => {
                this.setState({
                    listDepartment: res.data.data.rows,
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    handleOnChangeDepartment = e => {
        const departmentID = parseInt(e.target.value, 10);
        if (departmentID !== 0) {
            this.setState(
                {
                    showListManagerTable: true,
                    currDepartmentId: departmentID,
                },
                () => {
                    this.getListManager();
                }
            );
        } else {
            this.setState({ showListManagerTable: false });
        }
    };

    render() {
        const MANAGER_RIGHT =
            LIST_RIGHT_FOR_SCHOOL["SCHOOL"]["DEPARTMENT_MANAGER"];
        const KEY_CHECK = SCHOOL_ROLE_KEY_CHECK["SCHOOL"];
        const {
            listManager,
            modalIsOpen,
            confirmModalIsOpen,
            currManager,
            currDepartmentId,
            doUpdateManager,
            totalManager,
            listDepartment,
            limit,
            page,
            showListManagerTable,
        } = this.state;
        let renderData = null,
            renderTableListManager = null,
            renderButtonAddManager = null;
        if (listManager.length > 0) {
            renderData = listManager.map((item, index) => {
                return (
                    <Col className="mb-3" sm={6} key={index}>
                        <Card
                            className="box-hover pb-0 position-relative"
                            style={{
                                height: "auto",
                            }}
                        >
                            <CardBody className="p-3">
                                <div className="d-flex">
                                    <div className="mr-3">
                                        {/* {item.cover_image ? (
                                        <img
                                            src={`${apiConfigs.BASE_IMAGE_URL}${
                                                item.cover_image
                                            }`}
                                            alt={item.name}
                                        />
                                    ) : ( */}
                                        <img
                                            src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180"
                                            alt="card cap"
                                            className="rounded-circle mt-2"
                                            style={{
                                                width: "48px",
                                                height: "48px",
                                            }}
                                        />
                                        {/* )} */}
                                    </div>
                                    <div>
                                        <CardTitle>
                                            <p className="text-dark">
                                                <i className="fal fa-user" />{" "}
                                                <b>{item.user.fullname}</b> (
                                                {item.user.username})
                                            </p>
                                        </CardTitle>
                                        <CardText
                                            style={{
                                                fontWeight: "500",
                                                fontSize: "14px",
                                            }}
                                        >
                                            <i className="fal fa-phone" />{" "}
                                            {item.user.phone}
                                            <br />
                                            <i className="fal fa-envelope" />{" "}
                                            {item.user.email}
                                        </CardText>
                                    </div>
                                </div>
                                <Route
                                    component={AuthorizarionSchoolComponent(
                                        MANAGER_RIGHT["EDIT"],
                                        KEY_CHECK
                                    )(() => (
                                        <ButtonGroup className="btn-group-hover">
                                            <Button
                                                className="icon rounded-circle"
                                                outline
                                                onClick={e => {
                                                    this.handleOpenChangeStatusManager(
                                                        e,
                                                        index
                                                    );
                                                }}
                                            >
                                                {item.departments[0]
                                                    .manager_department
                                                    .status ? (
                                                    <i className="fas fa-lock-alt text-danger" />
                                                ) : (
                                                    <i className="fas fa-lock-open-alt text-warning" />
                                                )}
                                            </Button>
                                        </ButtonGroup>
                                    ))}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                );
            });
        } else {
            renderData = <div />;
        }

        renderTableListManager = <Row>{renderData}</Row>;

        renderButtonAddManager = (
            <Col className="mb-3" sm={6}>
                <Route
                    component={AuthorizarionSchoolComponent(
                        MANAGER_RIGHT["ADD"],
                        KEY_CHECK
                    )(() => (
                        <a
                            href="javascript:;"
                            onClick={this.handleOpenAddManager}
                        >
                            <Card
                                className="pb-0 position-relative"
                                style={{
                                    height: "106px",
                                    border: "1px dashed #d7d7d7",
                                }}
                            >
                                <CardBody className="p-3">
                                    <div className="d-flex justify-content-center">
                                        <div className="center btn-add">
                                            <span>Thêm quản lý</span>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </a>
                    ))}
                />
            </Col>
        );

        return (
            <Container>
                <Row>
                    <Col md={12} lg={12} xl={12}>
                        <Card>
                            <CardBody>
                                <div className="card__title">
                                    <strong>Chọn cơ sở</strong>
                                    <Input
                                        type="select"
                                        onChange={this.handleOnChangeDepartment}
                                    >
                                        <option value="0">Không có</option>
                                        {listDepartment.map(department => {
                                            return (
                                                <option
                                                    key={department.id.toString()}
                                                    value={department.id}
                                                >
                                                    {department.name}
                                                </option>
                                            );
                                        })}
                                    </Input>
                                </div>
                                <ConfirmModalCustom
                                    title="Cập nhật tình trạng!"
                                    message="Bạn chắc chắn có muốn thay đổi trạng thái hoạt động của tài khoản này không?"
                                    modalIsOpen={confirmModalIsOpen}
                                    toggle={this.toggleConfirmModal}
                                    handleConfirmAction={
                                        this.handleConfirmChangeStatus
                                    }
                                />

                                {/* {showListManagerTable
                                    ? renderTableListManager
                                    : ""} */}
                                <Row>
                                    {" "}
                                    {showListManagerTable
                                        ? renderButtonAddManager
                                        : ""}
                                    {renderData}
                                </Row>
                                <AddEditManagerModal
                                    currManager={currManager}
                                    currDepartmentId={currDepartmentId}
                                    modalIsOpen={modalIsOpen}
                                    toggle={this.toggle}
                                    getListManager={this.getListManager}
                                    doUpdateManager={doUpdateManager}
                                />
                                <div className="react-paginate">
                                    <Pagination
                                        totalRecords={totalManager}
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

const tListManager = translate("common")(ListManager);
const mapStateToProps = state => {
    const { forSchoolReducer } = state;
    return {
        currSchool: forSchoolReducer.currSchool,
    };
};
export default connect(mapStateToProps)(tListManager);
