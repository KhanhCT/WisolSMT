import React, { Component } from "react";
import { Route } from "react-router-dom";
import { Link } from "react-router-dom";
import { callApi } from "../../../helpers";
import {
    ROUTES,
    LIST_RIGHT_FOR_SCHOOL,
    SCHOOL_ROLE_KEY_CHECK,
} from "../../../constants";
import { ConfirmModalCustom } from "../../../components/common";
import AddEditSchoolModal from "./AddEditSchoolModal";
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    CardText,
    CardTitle,
    ButtonToolbar,
    Button,
    ButtonGroup,
} from "reactstrap";
import { connect } from "react-redux";
import {
    updateCurrentSchool,
    updateForSchoolUserRole,
} from "../../../redux/actions";
import { AuthorizarionSchoolComponent } from "../../../components/common";

class ListSchool extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currSchool: null,
            modalIsOpen: false,
            lstSchool: [],
            confirmModalIsOpen: false,
            schoolToDelete: null,
        };
    }

    componentDidMount = () => {
        this.getListSchoolRoleOfUser();
    };

    getListSchoolRoleOfUser = () => {
        callApi("users/user_for_school_role", "GET", null)
            .then(result => {
                // Store role to redux
                let data = result.data.data;
                this.props.dispatch(updateForSchoolUserRole(data));
                let listSchoolId = data["list_school_id"];
                // Get list school
                this.getListSchool(listSchoolId);
            })
            .catch(error => {
                console.log(error);
            });
    };

    getListSchool = listSchoolId => {
        callApi("for_school/schools", "GET", {
            limit: 1000,
            list_id: JSON.stringify(listSchoolId),
        })
            .then(res => {
                this.setState({
                    lstSchool: res.data.data.rows,
                });
            })
            .catch(error => {
                console.log(error);
            });
    };

    toggleAddEditSchoolModeltSchoolModel = () => {
        this.setState({ modalIsOpen: !this.state.modalIsOpen });
    };

    handleOpenAddSchool = () => {
        // const { dispatch } = this.props;
        // dispatch(updateCurrentSchool(null));
        this.setState(
            {
                currSchool: null,
            },
            () => {
                this.setState({
                    modalIsOpen: true,
                });
            }
        );
    };

    handleClickSchool = index => {
        const { dispatch } = this.props;
        dispatch(updateCurrentSchool(this.state.lstSchool[index]));
    };

    handlOpenEditSchool = (e, index) => {
        e.preventDefault();
        this.setState({
            modalIsOpen: true,
            updateSchool: true,
            currSchool: this.state.lstSchool[index],
        });
    };

    handlDeleteSchool = () => {
        const { schoolToDelete } = this.state;
        if (schoolToDelete) {
            callApi(`for_school/schools/${schoolToDelete.id}`, "DELETE")
                .then(res => {
                    this.toggleConfirmModal();
                    this.getListSchool();
                })
                .catch(error => {
                    this.toggleConfirmModal();
                    console.log(error);
                });
        }
    };

    handleOpenConfirmModel = (e, index) => {
        e.preventDefault();
        this.setState({
            confirmModalIsOpen: true,
            schoolToDelete: this.state.lstSchool[index],
        });
    };

    toggleConfirmModal = () => {
        this.setState(
            {
                schoolToDelete: null,
            },
            () => {
                this.setState({
                    confirmModalIsOpen: !this.state.confirmModalIsOpen,
                });
            }
        );
    };

    render() {
        const {
            currSchool,
            modalIsOpen,
            lstSchool,
            updateSchool,
            confirmModalIsOpen,
        } = this.state;

        const RIGHT_ADMIN_SCHOOL = LIST_RIGHT_FOR_SCHOOL["ADMIN"]["SCHOOL"];

        const RIGHT_ADD_SCHOOL = AuthorizarionSchoolComponent(
            RIGHT_ADMIN_SCHOOL["ADD"],
            SCHOOL_ROLE_KEY_CHECK["DIRECTOR"]
        );
        const RIGHT_EDIT_SCHOOL = AuthorizarionSchoolComponent(
            RIGHT_ADMIN_SCHOOL["EDIT"],
            SCHOOL_ROLE_KEY_CHECK["DIRECTOR"]
        );
        const RIGHT_DELETE_SCHOOL = AuthorizarionSchoolComponent(
            RIGHT_ADMIN_SCHOOL["DELETE"],
            SCHOOL_ROLE_KEY_CHECK["DIRECTOR"]
        );
        const btnCreateSchool = () => (
            <Col className="mb-3" sm={6}>
                <a href="javascript:;" onClick={this.handleOpenAddSchool}>
                    <Card
                        className="pb-0 position-relative"
                        style={{
                            height: "84px",
                            border: "1px dashed #d7d7d7",
                        }}
                    >
                        <CardBody className="p-3">
                            <div className="d-flex justify-content-center">
                                <div className="center btn-add">
                                    <span>Thêm trường</span>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </a>
            </Col>
        );
        let renderData = null;
        if (lstSchool.length > 0) {
            renderData = lstSchool.map((item, index) => {
                let btnEditScholl = () => (
                        <Button
                            color="primary"
                            onClick={e => {
                                this.handlOpenEditSchool(e, index);
                            }}
                            size="lg"
                        >
                            <span
                                style={{
                                    fontSize: "16px",
                                }}
                                className="lnr lnr-pencil"
                            />
                        </Button>
                    ),
                    btnDeleteSchool = () => (
                        <Button
                            color="danger"
                            onClick={e => {
                                this.handleOpenConfirmModel(e, index);
                            }}
                            size="lg"
                        >
                            <span
                                style={{ fontSize: "16px" }}
                                className="lnr lnr-trash"
                            />
                        </Button>
                    );
                return (
                    <Col className="mb-3" sm={6} key={index}>
                        <Link
                            to={{
                                pathname: `${ROUTES.FOR_SCHOOL}/${item.code}`,
                                state: { currSchool: item },
                            }}
                            onClick={() => {
                                this.handleClickSchool(index);
                            }}
                        >
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
                                                className="rounded-circle"
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
                                                    <b>{item["name"]}</b>
                                                </p>
                                            </CardTitle>
                                            <CardText
                                                style={{
                                                    fontWeight: "500",
                                                    fontSize: "14px",
                                                }}
                                            >
                                                <i className="fal fa-map-marker-alt" />{" "}
                                                {item.address}
                                            </CardText>
                                        </div>
                                    </div>
                                    <ButtonGroup className="btn-group-hover">
                                        <Route
                                            component={RIGHT_EDIT_SCHOOL(
                                                btnEditScholl
                                            )}
                                        />
                                        <Route
                                            component={RIGHT_DELETE_SCHOOL(
                                                btnDeleteSchool
                                            )}
                                        />
                                    </ButtonGroup>
                                </CardBody>
                            </Card>
                        </Link>
                    </Col>
                );
            });
        } else {
            renderData = (
                <Col sm={12}>
                    <h1 style={{ textAlign: "center" }}>
                        Không có trường học nào!
                    </h1>
                </Col>
            );
        }

        return (
            <Container>
                <Card>
                    <CardBody>
                        <AddEditSchoolModal
                            currSchool={currSchool}
                            modalIsOpen={modalIsOpen}
                            toggle={this.toggleAddEditSchoolModeltSchoolModel}
                            getListSchool={this.getListSchoolRoleOfUser}
                            updateSchool={updateSchool}
                        />

                        <ConfirmModalCustom
                            title="Cập nhật tình trạng!"
                            message="Bạn chắc chắn có muốn xoá thông tin trường học này không?"
                            modalIsOpen={confirmModalIsOpen}
                            toggle={this.toggleConfirmModal}
                            handleConfirmAction={this.handlDeleteSchool}
                        />
                        <Row>
                            <Route
                                component={RIGHT_ADD_SCHOOL(btnCreateSchool)}
                            />
                            {renderData}
                        </Row>
                    </CardBody>
                </Card>
            </Container>
        );
    }
}

const mapStateToProp = state => {
    const { forSchoolReducer } = state;
    return {
        schoolUserRole: forSchoolReducer.schoolUserRole,
    };
};

const wrapListSchool = connect(mapStateToProp)(ListSchool);
export { wrapListSchool as ListSchool };
