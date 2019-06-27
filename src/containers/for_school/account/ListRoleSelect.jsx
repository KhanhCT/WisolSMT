import React, { Component } from "react";
import { Input } from "reactstrap";
import { callApi } from "../../../helpers";
import { connect } from "react-redux";

class ListRoleSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listRole: [],
        };
    }

    componentDidMount = () => {
        this.getListRoleOfDept();
    };

    getListRoleOfDept = () => {
        const { currDept } = this.props;

        // Call API get List Role of department
        callApi("for_school/role_for_schools", "GET", {
            limit: 1000,
            department_id: currDept.id,
        })
            .then(res => {
                this.setState({
                    listRole: res.data.data.rows,
                });
            })
            .catch(error => {
                console.log(error);
            });
    };

    handleChangeRole = e => {
        const { listRole } = this.state;
        const { setSelectedRole } = this.props;
        let roleIndex = e.target.value;
        let selectedRole = listRole[roleIndex];
        setSelectedRole(selectedRole);
    };

    render() {
        const { listRole } = this.state;
        const { selectedRole } = this.props;
        let defautlRoleIndex = null;
        let renderListRole = null;
        if (listRole.length > 0) {
            renderListRole = listRole.map((role, index) => {
                if (selectedRole)
                    if (selectedRole.id == role.id) defautlRoleIndex = index;
                return (
                    <option key={index} value={index}>
                        {role.name}
                    </option>
                );
            });
        }
        return (
            <Input
                type="select"
                value={defautlRoleIndex}
                onChange={this.handleChangeRole}
            >
                <option value="">-Chọn-</option>
                {renderListRole}
            </Input>
        );
    }
}

const mapStateToProp = state => {
    const { forSchoolReducer } = state;
    return {
        currDept: forSchoolReducer.currDept,
    };
};

const wrap = connect(mapStateToProp)(ListRoleSelect);
export default wrap;
