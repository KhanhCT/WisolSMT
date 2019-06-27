import React, { Component } from "react";
import { Route } from "react-router-dom";
import { ModalComponent } from "../../../components/bases";
import AddEditCourseForm from "./AddEditCourseForm";

export default class AddEditCourseModal extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {
            modalIsOpen,
            toggle,
            currCourse,
            updateCourse,
            getListCourse,
        } = this.props;
        return (
            <div>
                <ModalComponent
                    color="primary"
                    class="modal-for-school"
                    title={
                        updateCourse ? "Cập nhật khóa học" : "Thêm mới khóa học"
                    }
                    header
                    toggle={toggle}
                    isOpen={modalIsOpen}
                    size="lg"
                >
                    <Route
                        render={props => (
                            <AddEditCourseForm
                                {...props}
                                currCourse={currCourse}
                                toggle={toggle}
                                onSubmit={this.showFormResult}
                                getListCourse={getListCourse}
                                updateCourse={updateCourse}
                            />
                        )}
                    />
                </ModalComponent>
            </div>
        );
    }
}
