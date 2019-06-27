import React, { Component } from "react";
import { Route } from "react-router-dom";
import { ModalComponent } from "../../../../components/bases";
import AddEditManagerForm from "./AddEditManagerForm";

export default class AddEditTeacherModal extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {
            modalIsOpen,
            toggle,
            currManager,
            currDepartmentId,
            doUpdateManager,
            getListManager
        } = this.props;
        return (
            <div>
                <ModalComponent
                    color="primary"
                    class="modal-for-school modal-650"
                    title={
                        doUpdateManager
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
                            <AddEditManagerForm
                                {...props}
                                currTeacher={currManager}
                                currDepartmentId={currDepartmentId}
                                toggle={toggle}
                                onSubmit={this.showFormResult}
                                getListManager={getListManager}
                                doUpdateManager={doUpdateManager}
                            />
                        )}
                    />
                </ModalComponent>
            </div>
        );
    }
}
