import React, { Component } from "react";
import { ModalComponent } from "../../../components/bases";
import AddEditRoleForm from "./AddEditRoleForm";

export default class AddEditRoleModal extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {
            modalIsOpen,
            toggle,
            getListRole,
            currRole,
            updateRole,
        } = this.props;
        return (
            <div>
                <ModalComponent
                    color="primary"
                    title={updateRole ? "Cập nhật quyền" : "Thêm mới quyền"}
                    class="modal-for-school modal-650"
                    header
                    toggle={toggle}
                    isOpen={modalIsOpen}
                    size="lg"
                >
                    <AddEditRoleForm
                        currRole={currRole}
                        toggle={toggle}
                        onSubmit={this.showFormResult}
                        getListRole={getListRole}
                        updateRole={updateRole}
                    />
                </ModalComponent>
            </div>
        );
    }
}
