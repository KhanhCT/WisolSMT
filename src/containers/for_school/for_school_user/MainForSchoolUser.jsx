import React, { Component, Fragment } from "react";
import { Route } from "react-router-dom";
import MainManagerUser from "./manager/MainManagerUser";
import MainTeacherUser from "./teacher/MainTeacherUser";
import { MainStudentUser } from "./student/MainStudentUser";
import { UnauthorizeComponent } from "../../../components/common";
import { connect } from "react-redux";
import stringLodash from "lodash/string";
import arrayLodash from "lodash/array";

class MainForSchoolUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mainRight: null,
        };
    }

    componentDidMount = () => {
        this.processMainRight();
    };

    processMainRight = () => {
        const { schoolUserRole, currSchool, currDept } = this.props;
        let lstUserRightOfDept =
            schoolUserRole["departments"][currSchool.id][currDept.id];
        let arrMainRight = lstUserRightOfDept.map(
            item => stringLodash.split(item, "_")[0]
        );
        arrMainRight = arrayLodash.uniq(arrMainRight);
        if (arrMainRight.length > 0)
            this.setState({ mainRight: arrMainRight[0] });
    };

    renderSwitch = () => {
        const { mainRight } = this.state;
        /** Switch main right of school
         * case "300" => Manager
         * case "400" => Teacher
         * case "500" => Student
         */

        switch (mainRight) {
            case "300":
                return (
                    <Route render={props => <MainManagerUser {...props} />} />
                );
            case "400":
                return (
                    <Route render={props => <MainTeacherUser {...props} />} />
                );
            case "500":
                return (
                    <Route render={props => <MainStudentUser {...props} />} />
                );
            default:
                return (
                    <Route
                        render={props => <UnauthorizeComponent {...props} />}
                    />
                );
        }
    };

    render() {
        return <Fragment>{this.renderSwitch()}</Fragment>;
    }
}

const mapStateToProp = state => {
    const { forSchoolReducer } = state;
    return {
        schoolUserRole: forSchoolReducer.schoolUserRole,
        currSchool: forSchoolReducer.currSchool,
        currDept: forSchoolReducer.currDept,
    };
};

const wrap = connect(mapStateToProp)(MainForSchoolUser);
export { wrap as MainForSchoolUser };
