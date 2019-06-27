import React, { Component } from "react";
import { Route } from "react-router-dom";
import { ModalComponent } from "../../../components/bases";
import AddEditTeacherForm from "./AddEditTeacherForm";

export default class AddEditTeacherModal extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {
            modalIsOpen,
            toggle,
            currTeacher,
            updateTeacher,
            getListTeacher,
        } = this.props;
        return (
            <div>
                <ModalComponent
                    color="primary"
                    class="modal-for-school modal-650"
                    title={
                        updateTeacher
                            ? "Cập nhật giáo viên"
                            : "Thêm mới giáo viên"
                    }
                    header
                    toggle={toggle}
                    isOpen={modalIsOpen}
                    size="lg"
                >
                    <Route
                        render={props => (
                            <AddEditTeacherForm
                                {...props}
                                currTeacher={currTeacher}
                                toggle={toggle}
                                onSubmit={this.showFormResult}
                                getListTeacher={getListTeacher}
                                updateTeacher={updateTeacher}
                            />
                        )}
                    />
                </ModalComponent>
            </div>
        );
    }
}
