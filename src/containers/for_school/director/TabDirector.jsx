import React, { Component } from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { translate } from "react-i18next";
import { Route } from "react-router-dom";
import ListDepartment from "./department/ListDepartment";
import ListManager from "./manager/ListManager";
import { connect } from "react-redux";
import { ROUTES } from "../../../constants";

var arrDirectorAttribute = [
    {
        id: 1,
        name: "Departments",
        // icon: process.env.PUBLIC_URL + "/img/base_attribute/department.svg",
    },
    {
        id: 3,
        name: "Manage departments",
        // icon: process.env.PUBLIC_URL + "/img/base_attribute/manager.svg",
    },
];

class TabDirector extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        const { currSchool, match } = this.props;
        if (match.params.school_code !== currSchool.code)
            window.location.href = ROUTES.FOR_SCHOOL;
    }

    handleBack = () => {
        this.props.history.goBack();
    };

    render() {
        const { currSchool, t } = this.props;
        const departmentTranKey = `for_school:DEPARTMENT.common`;
        let renderData = null;
        if (arrDirectorAttribute.length > 0) {
            renderData = arrDirectorAttribute.map((item, index) => {
                return (
                    <Tab key={index}>
                        {/* <img
                            style={{ width: "30%", marginTop: "15px" }}
                            src={item.icon}
                            alt={item.name}
                        /> */}
                        <h4>{item["name"]}</h4>
                    </Tab>
                );
            });
        }

        return (
            <Container>
                <h4 className="mb-3">
                    {" "}
                    <a
                        className="hover-back text-secondary"
                        onClick={this.handleBack}
                    >
                        <i className="fal fa-long-arrow-left" /> &nbsp;&nbsp;Trở
                        lại
                    </a>
                </h4>

                <Card>
                    <CardBody>
                        <h3>{currSchool ? currSchool.name : ""}</h3>
                        <h3 className="page-subhead subhead text-dark">
                            <i className="fal fa-map-marker-alt" />{" "}
                            <b>Trụ sở chính:</b>{" "}
                            {currSchool ? currSchool.address : ""}.
                        </h3>
                        <Tabs>
                            <TabList className="tab-design">
                                {renderData}
                            </TabList>

                            <TabPanel>
                                <Route
                                    render={props => (
                                        <ListDepartment {...props} />
                                    )}
                                />
                            </TabPanel>
                            <TabPanel>
                                <Route
                                    render={props => <ListManager {...props} />}
                                />
                            </TabPanel>
                        </Tabs>
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

const tTabDirector = connect(mapStateToProps)(translate("common")(TabDirector));

export { tTabDirector as TabDirector };
