import React, { Component } from "react";
import { Route } from "react-router-dom";
import { ModalComponent } from "../../../components/bases";
import AddEditUserForm from "./AddEditUserForm";

export default class AddEditUserModal extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {
            modalIsOpen,
            toggle,
            currUser,
            updateUser,
            getListUser,
        } = this.props;
        return (
            <div>
                <ModalComponent
                    color="primary"
                    class="modal-for-school modal-650"
                    title={
                        updateUser ? "Cập nhật nhân viên" : "Thêm mới nhân viên"
                    }
                    header
                    toggle={toggle}
                    isOpen={modalIsOpen}
                    size="lg"
                >
                    <Route
                        render={props => (
                            <AddEditUserForm
                                {...props}
                                currUser={currUser}
                                toggle={toggle}
                                onSubmit={this.showFormResult}
                                getListUser={getListUser}
                                updateUser={updateUser}
                            />
                        )}
                    />
                </ModalComponent>
            </div>
        );
    }
}
