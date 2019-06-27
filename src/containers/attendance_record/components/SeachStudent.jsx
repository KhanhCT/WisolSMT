import React, { Component } from "react";
import Select from "react-select";
import "react-select/dist/react-select.css";
import { callApi } from "../../../helpers";

export default class SearchStudent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedUser: null,
        };
    }

    handleChangeSelectedUser = value => {
        const { setSelectedUser } = this.props;
        this.setState({ selectedUser: value });
        setSelectedUser(value);
    };

    findUsers = input => {
        if (!input) {
            return Promise.resolve({ options: [] });
        }

        return callApi("users/find-users", "GET", { q: input })
            .then(res => {
                let options = res.data.data.rows;
                options = options.map((item, index) => {
                    return {
                        ...item,
                        info: `${item.username} - Email: ${item.email} - SĐT: ${
                            item.phone
                        }`,
                    };
                });
                return { options: options };
            })
            .catch(error => {
                return Promise.resolve({ options: [] });
            });
    };

    render() {
        const { selectedUser } = this.state;
        const AsyncComponent = this.state.creatable
            ? Select.AsyncCreatable
            : Select.Async;

        return (
            <div className="section">
                <AsyncComponent
                    value={selectedUser}
                    onChange={this.handleChangeSelectedUser}
                    valueKey="id"
                    labelKey="info"
                    loadOptions={this.findUsers}
                    placeholder="Find student by fullname or email or phone"
                />
            </div>
        );
    }
}
