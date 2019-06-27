import React, { Component } from "react";
import { connect } from "react-redux";
import collectionLodash from "lodash/collection";

class WithAuthorization extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const {
            schoolUserRole,
            currSchool,
            currDept,
            allowedRight,
            keyCheck,
            WrappedComponent,
        } = this.props;
        let checkUserAllow = false;
        if (schoolUserRole) {
            if (keyCheck === "director") {
                if (schoolUserRole[keyCheck]) {
                    for (const right of schoolUserRole[keyCheck]) {
                        if (collectionLodash.includes(right, allowedRight)) {
                            checkUserAllow = true;
                            break;
                        }
                    }
                }
            } else if (keyCheck === "schools" && currSchool) {
                if (schoolUserRole[keyCheck][currSchool.id]) {
                    for (const right of schoolUserRole[keyCheck][
                        currSchool.id
                    ]) {
                        if (collectionLodash.includes(right, allowedRight)) {
                            checkUserAllow = true;
                            break;
                        }
                    }
                }
            } else if (keyCheck === "departments" && currDept) {
                if (schoolUserRole[keyCheck][currSchool.id][currDept.id]) {
                    for (const right of schoolUserRole[keyCheck][currSchool.id][
                        currDept.id
                    ]) {
                        if (collectionLodash.includes(right, allowedRight)) {
                            checkUserAllow = true;
                            break;
                        }
                    }
                }
            }
        }

        if (checkUserAllow) {
            return <WrappedComponent {...this.props} />;
        } else {
            return null;
        }
    }
}

const mapStateToProps = (state, allowedRight, keyCheck, WrappedComponent) => {
    const { forSchoolReducer } = state;
    return {
        schoolUserRole: forSchoolReducer.schoolUserRole,
        currSchool: forSchoolReducer.currSchool,
        currDept: forSchoolReducer.currDept,
        allowedRight: allowedRight,
        keyCheck: keyCheck,
        WrappedComponent: WrappedComponent,
    };
};

export const AuthorizarionSchoolComponent = (
    allowedRight,
    keyCheck
) => WrappedComponent => {
    return connect(state =>
        mapStateToProps(state, allowedRight, keyCheck, WrappedComponent)
    )(WithAuthorization);
};
