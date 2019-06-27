import React, { Component } from "react";
import Select from "react-select";
import { callApi } from "../../../helpers";

export default class SelectUser extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    findUsers = input => {
        if (!input) {
            return Promise.resolve({ options: [] });
        }
        let findOpt = {
            q: input,
        };

        return callApi("users/find-users", "GET", findOpt)
            .then(res => {
                let options = res.data.data.rows;
                options = options.map(item => {
                    return {
                        ...item,
                        info: `${item.fullname} - Email: ${
                            item.email
                        } - Phone: ${item.phone}`,
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
        const { handleChangeUser, currUser } = this.props;
        return (
            <AsyncComponent
                className="custom-react-select"
                value={currUser}
                onChange={handleChangeUser}
                valueKey="id"
                labelKey="info"
                loadOptions={this.findUsers}
                placeholder="Find User"
            />
        );
    }
}
