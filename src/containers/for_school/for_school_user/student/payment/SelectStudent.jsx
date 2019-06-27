import React, { Component } from "react";
import Select from "react-select";
import { connect } from "react-redux";
import { callApi } from "../../../../../helpers";

class SelectStudent extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    findStudents = input => {
        const { currDept } = this.props;
        if (!input) {
            return Promise.resolve({ options: [] });
        }
        let findOpt = {
            q: input,
            department_id: currDept.id,
        };

        return callApi("for_school/students/find-student", "GET", findOpt)
            .then(res => {
                let options = res.data.data.rows;
                options = options.map(item => {
                    return {
                        ...item,
                        info: `${item.user.fullname} - Email: ${
                            item.user.email
                        } - Phone: ${item.user.phone}`,
                    };
                });
                return { options: options };
            })
            .catch(error => {
                return Promise.resolve({ options: [] });
            });
    };

    render() {
        const AsyncComponent = this.state.creatable
            ? Select.AsyncCreatable
            : Select.Async;
        const { handleChangeStudent, currStudent } = this.props;
        return (
            <AsyncComponent
                className="custom-react-select select-student"
                placeholder="Chọn học viên cần thanh toán..."
                value={currStudent}
                onChange={handleChangeStudent}
                valueKey="id"
                labelKey="info"
                loadOptions={this.findStudents}
                placeholder="Họ và tên, email, SĐT học viên cần thanh toán..."
            />
        );
    }
}

const mapStateToProps = state => {
    const { forSchoolReducer } = state;
    return {
        currDept: forSchoolReducer.currDept,
    };
};
export default connect(mapStateToProps)(SelectStudent);
