import React, { Component } from "react";
import { Route } from "react-router-dom";
import { ModalComponent } from "../../../components/bases";
import AddEditStudentForm from "./AddEditStudentForm";

export default class AddEditStudentModal extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {
            modalIsOpen,
            toggle,
            currStudent,
            updateStudent,
            getListStudent,
        } = this.props;
        return (
            <div>
                <ModalComponent
                    color="primary"
                    class="modal-for-school modal-650"
                    title={
                        updateStudent
                            ? "Cập nhật học viên"
                            : "Thêm mới học viên"
                    }
                    header
                    toggle={toggle}
                    isOpen={modalIsOpen}
                    size="lg"
                >
                    <Route
                        render={props => (
                            <AddEditStudentForm
                                {...props}
                                currStudent={currStudent}
                                toggle={toggle}
                                onSubmit={this.showFormResult}
                                getListStudent={getListStudent}
                                updateStudent={updateStudent}
                            />
                        )}
                    />
                </ModalComponent>
            </div>
        );
    }
}
