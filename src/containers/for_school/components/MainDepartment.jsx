import React, { Component, Fragment } from "react";
import { Route } from "react-router-dom";
import { TabDirector } from "../director";
import { ListDepartment } from "../department";
import { connect } from "react-redux";

class MainDepartment extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        /** Switch for school right of user */
        const { schoolUserRole } = this.props;
        let renderMainDepartment = null;
        if (schoolUserRole) {
            if (Object.keys(schoolUserRole["schools"]).length > 0) {
                renderMainDepartment = (
                    <Route render={props => <TabDirector {...props} />} />
                );
            } else
                renderMainDepartment = (
                    <Route render={props => <ListDepartment {...props} />} />
                );
        }
        return <Fragment>{renderMainDepartment}</Fragment>;
    }
}

const mapStateToProp = state => {
    const { forSchoolReducer } = state;
    return {
        schoolUserRole: forSchoolReducer.schoolUserRole,
    };
};

const wrapMainDepartment = connect(mapStateToProp)(MainDepartment);
export { wrapMainDepartment as MainDepartment };
