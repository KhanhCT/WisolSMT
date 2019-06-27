import React, { Component } from "react";
import { Route } from "react-router-dom";
import { ModalComponent } from "../../../components/bases";
import AddEditFormForm from "./AddEditFormForm";

export default class AddEditFormModal extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {
            modalIsOpen,
            toggle,
            currForm,
            updateForm,
            getListForm,
        } = this.props;
        return (
            <div>
                <ModalComponent
                    color="primary"
                    class="modal-for-school"
                    title={
                        updateForm ? "Cập nhật hình thức" : "Thêm mới hình thức"
                    }
                    header
                    toggle={toggle}
                    isOpen={modalIsOpen}
                    size="lg"
                >
                    <Route
                        render={props => (
                            <AddEditFormForm
                                {...props}
                                currForm={currForm}
                                toggle={toggle}
                                onSubmit={this.showFormResult}
                                getListForm={getListForm}
                                updateForm={updateForm}
                            />
                        )}
                    />
                </ModalComponent>
            </div>
        );
    }
}
