import React, { Component } from "react";
import { Link } from "react-router-dom";
import { translate } from "react-i18next";
import { callApi } from "../../../helpers";
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    CardText,
    CardTitle,
} from "reactstrap";
import { connect } from "react-redux";
import { updateCurrentDept } from "../../../redux/actions";
import { ROUTES } from "../../../constants";

class ListDepartment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            lstDepartment: [],
        };
    }

    componentDidMount = () => {
        this.getListDepartment();
    };

    handleBack = () => {
        this.props.history.goBack();
    };

    getListDepartment = () => {
        const { currSchool, schoolUserRole } = this.props;
        let objDeptRight = schoolUserRole["departments"][currSchool.id],
            lstDeptId = Object.keys(objDeptRight);
        callApi(`for_school/departments`, "GET", {
            limit: 1000,
            school_id: currSchool.id,
            list_id: JSON.stringify(lstDeptId),
        })
            .then(res => {
                this.setState({
                    lstDepartment: res.data.data.rows,
                });
            })
            .catch(error => {
                console.log(error);
            });
    };

    handleClickDepartment = currDepartment => {
        this.props.dispatch(updateCurrentDept(currDepartment));
    };

    render() {
        const { match, location, t } = this.props;
        const { lstDepartment } = this.state;
        const departmentTranKey = `for_school:DEPARTMENT.common`;
        let renderData = null;
        if (lstDepartment.length > 0) {
            renderData = lstDepartment.map((item, index) => {
                return (
                    <Col sm={6} key={index}>
                        <Link
                            to={{
                                pathname: `${ROUTES.FOR_SCHOOL}/${
                                    match.params.school_code
                                }/${item.code}`,
                                state: { currDepartment: item },
                            }}
                            onClick={() => this.handleClickDepartment(item)}
                        >
                            <Card
                                className="box-hover pb-0"
                                style={{
                                    height: "auto",
                                }}
                            >
                                <CardBody className="p-3">
                                    <div className="flex">
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
                                                alt="Card image cap"
                                                className="rounded"
                                                style={{
                                                    width: "100px",
                                                    height: "auto",
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
                                        <div className="ml-auto">
                                            <i className="fal fa-chevron-right fa-2x mt-3 text-secondary" />
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Link>
                    </Col>
                );
            });
        } else {
            renderData = (
                <Col sm={12}>
                    <h1 className="text-center">
                        {t(`${departmentTranKey}.no_department`)}
                    </h1>
                </Col>
            );
        }

        return (
            <Container>
                <h4 className="mb-3">
                    {" "}
                    <a
                        className="hover-back text-secondary"
                        onClick={this.handleBack}
                    >
                        <i className="fal fa-long-arrow-left" /> &nbsp;&nbsp;
                        {t(`${departmentTranKey}.back`)}
                    </a>
                </h4>
                <Card>
                    <CardBody>
                        <h3>
                            {location.state.currSchool
                                ? location.state.currSchool.name
                                : ""}
                        </h3>
                        <h3 className="page-subhead subhead text-dark">
                            <i className="fal fa-map-marker-alt" />{" "}
                            <b>{t(`${departmentTranKey}.headquarters`)}:</b>{" "}
                            {location.state.currSchool
                                ? location.state.currSchool.address
                                : ""}
                            .
                        </h3>

                        <Row>{renderData}</Row>
                    </CardBody>
                </Card>
            </Container>
        );
    }
}

const tListDepartment = translate(["common", "for_school"])(ListDepartment);
const mapStateToProp = state => {
    const { forSchoolReducer } = state;
    return {
        schoolUserRole: forSchoolReducer.schoolUserRole,
        currSchool: forSchoolReducer.currSchool,
    };
};

const wrap = connect(mapStateToProp)(tListDepartment);
export { wrap as ListDepartment };
