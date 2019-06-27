import React, { Component } from "react";
import Select from "react-select";
import { callApi } from "../../../helpers";

export default class SelectTeacher extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    findTeachers = input => {
        const { location } = this.props;
        if (!input) {
            return Promise.resolve({ options: [] });
        }
        let findOpt = {
            q: input,
            department_id: location.state.idDepartment,
        };

        return callApi("for_school/teachers/find-teacher", "GET", findOpt)
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
        const { handleChangeTeacher, currTeacher, className } = this.props;
        return (
            <AsyncComponent
                className={`custom-react-select ${className}`}
                value={currTeacher}
                onChange={handleChangeTeacher}
                valueKey="id"
                labelKey="info"
                loadOptions={this.findTeachers}
                placeholder="Họ và tên, email, số điện thoại"
            />
        );
    }
}
