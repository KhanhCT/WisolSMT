import React, { Component } from "react";
import { ModalComponent } from "../../../components/bases";
import AddEditSchoolForm from "./AddEditSchoolForm";

export default class AddEditSchoolModal extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { modalIsOpen, toggle, getListSchool, currSchool } = this.props;
        return (
            <div>
                <ModalComponent
                    color="primary"
                    title={
                        currSchool
                            ? "Cập nhật trường học"
                            : "Thêm mới trường học"
                    }
                    class="modal-for-school"
                    header
                    toggle={toggle}
                    isOpen={modalIsOpen}
                    size="lg"
                >
                    <AddEditSchoolForm
                        currSchool={currSchool}
                        toggle={toggle}
                        onSubmit={this.showFormResult}
                        getListSchool={getListSchool}
                    />
                </ModalComponent>
            </div>
        );
    }
}
