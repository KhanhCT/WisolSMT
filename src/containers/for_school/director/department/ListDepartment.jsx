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
} from "reactstrap";
import { TableComponent } from "../../../../components/bases";
import { ConfirmModalCustom, Pagination } from "../../../../components/common";
import { callApi } from "../../../../helpers";
import AddEditDepartmentModal from "./AddEditDepartmentModal";
import { connect } from "react-redux";
import {
    LIST_RIGHT_FOR_SCHOOL,
    SCHOOL_ROLE_KEY_CHECK,
} from "../../../../constants";
import { AuthorizarionSchoolComponent } from "../../../../components/common";
import { Route } from "react-router-dom";

class ListDepartment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listDepartment: [],
            currDepartment: null,
            modalIsOpen: false,
            confirmModalIsOpen: false,
            doUpdateDepartment: false,
            limit: 10,
            page: 1,
            totalDepartment: 0,
        };
    }

    componentDidMount() {
        const { location } = this.props;
        this.getListDepartment();
    }

    toggle = () => {
        this.setState({ modalIsOpen: !this.state.modalIsOpen });
    };

    toggleConfirmModal = () => {
        this.setState({ confirmModalIsOpen: !this.state.confirmModalIsOpen });
    };

    getListDepartment = () => {
        const { limit, page } = this.state;
        // Call API get list Department
        callApi("for_school/departments", "GET", {
            limit: limit,
            page: page,
            school_id: this.props.currSchool.id,
        })
            .then(res => {
                this.setState({
                    listDepartment: res.data.data.rows,
                    totalDepartment: res.data.data.count,
                });
            })
            .catch(error => {
                this.setState({ listDepartment: [], totalDepartment: 0 });
                console.log(error);
            });
    };

    handleOpenDeleteDepartment = (e, index) => {
        this.setState(
            {
                currDepartment: this.state.listDepartment[index],
            },
            () => {
                this.setState({ confirmModalIsOpen: true });
            }
        );
    };

    handleConfirmDelete = () => {
        const { currDepartment, page, limit, totalDepartment } = this.state;
        if (currDepartment) {
            // Call API Delete Department
            callApi(
                `for_school/departments/${currDepartment.id}`,
                "DELETE",
                null
            )
                .then(res => {
                    this.toggleConfirmModal();
                    if ((page - 1) * limit + 1 == totalDepartment) {
                        this.setState({ page: page - 1 }, () => {
                            this.getListDepartment();
                        });
                    } else {
                        this.getListDepartment();
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    };

    handleOpenAddDepartment = () => {
        this.setState(
            {
                currDepartment: null,
            },
            () => {
                this.setState({
                    modalIsOpen: true,
                    doUpdateDepartment: false,
                });
            }
        );
    };

    handleOpenEditDepartment = (e, index) => {
        this.setState(
            {
                currDepartment: this.state.listDepartment[index],
            },
            () => {
                this.setState({
                    modalIsOpen: true,
                    doUpdateDepartment: true,
                });
            }
        );
    };

    onPageChanged = data => {
        const { currentPage } = data;
        if (currentPage)
            this.setState({ page: currentPage }, () => {
                this.getListDepartment();
            });
    };

    render() {
        const DEPARTMENT_RIGHT = LIST_RIGHT_FOR_SCHOOL["SCHOOL"]["DEPARTMENT"];
        const KEY_CHECK = SCHOOL_ROLE_KEY_CHECK["SCHOOL"];
        const {
            listDepartment,
            modalIsOpen,
            confirmModalIsOpen,
            currDepartment,
            doUpdateDepartment,
            totalDepartment,
            limit,
            page,
        } = this.state;
        let renderData = null,
            renderTableListDepartment = null;
        if (listDepartment.length > 0) {
            renderData = listDepartment.map((item, index) => {
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
                                                <i className="fal fa-school" />{" "}
                                                <b>{item.name}</b>
                                            </p>
                                        </CardTitle>
                                        <CardText
                                            style={{
                                                fontWeight: "500",
                                                fontSize: "14px",
                                            }}
                                        >
                                            <i className="fal fa-phone" />{" "}
                                            {item.phone}
                                            <br />
                                            <i className="fal fa-map-marker-alt" />{" "}
                                            {item.address}
                                        </CardText>
                                    </div>
                                </div>
                                <ButtonGroup className="btn-group-hover">
                                    <Route
                                        component={AuthorizarionSchoolComponent(
                                            DEPARTMENT_RIGHT["EDIT"],
                                            KEY_CHECK
                                        )(() => (
                                            <Button
                                                className="icon"
                                                outline
                                                onClick={e => {
                                                    this.handleOpenEditDepartment(
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
                                            DEPARTMENT_RIGHT["DELETE"],
                                            KEY_CHECK
                                        )(() => (
                                            <Button
                                                className="icon"
                                                outline
                                                onClick={e => {
                                                    this.handleOpenDeleteDepartment(
                                                        e,
                                                        index
                                                    );
                                                }}
                                            >
                                                <i className="fas fa-trash-alt" />
                                            </Button>
                                        ))}
                                    />
                                </ButtonGroup>
                            </CardBody>
                        </Card>
                    </Col>
                );
            });
        } else {
            renderData = <div />;
        }

        renderTableListDepartment = (
            <TableComponent responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Tên cơ sở</th>
                        <th>Số điện thoại</th>
                        <th>Địa chỉ</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>{renderData}</tbody>
            </TableComponent>
        );

        return (
            <Container>
                <Card>
                    <CardBody>
                        <Row>
                            <Col className="mb-3" sm={6}>
                                <Route
                                    component={AuthorizarionSchoolComponent(
                                        DEPARTMENT_RIGHT["ADD"],
                                        KEY_CHECK
                                    )(() => (
                                        <a
                                            href="javascript:;"
                                            onClick={
                                                this.handleOpenAddDepartment
                                            }
                                        >
                                            <Card
                                                className="pb-0 position-relative"
                                                style={{
                                                    height: "106px",
                                                    border:
                                                        "1px dashed #d7d7d7",
                                                }}
                                            >
                                                <CardBody className="p-3">
                                                    <div className="d-flex justify-content-center">
                                                        <div className="center btn-add">
                                                            <span>
                                                                Thêm cơ sở
                                                            </span>
                                                        </div>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </a>
                                    ))}
                                />
                            </Col>
                            {renderData}
                        </Row>
                        <ConfirmModalCustom
                            title="Xóa cơ sở!"
                            message="Bạn chắc chắn có muốn xóa cơ sở này không?"
                            modalIsOpen={confirmModalIsOpen}
                            toggle={this.toggleConfirmModal}
                            handleConfirmAction={this.handleConfirmDelete}
                        />

                        <AddEditDepartmentModal
                            currDepartment={currDepartment}
                            modalIsOpen={modalIsOpen}
                            toggle={this.toggle}
                            getListDepartment={this.getListDepartment}
                            doUpdateDepartment={doUpdateDepartment}
                        />

                        <div className="react-paginate">
                            <Pagination
                                totalRecords={totalDepartment}
                                pageLimit={limit}
                                pageNeighbours={1}
                                page={page}
                                onPageChanged={this.onPageChanged}
                            />
                        </div>
                    </CardBody>
                </Card>
            </Container>
        );
    }
}

const mapStateToProps = state => {
    const { forSchoolReducer } = state;
    return {
        currSchool: forSchoolReducer.currSchool,
    };
};

export default connect(mapStateToProps)(ListDepartment);
