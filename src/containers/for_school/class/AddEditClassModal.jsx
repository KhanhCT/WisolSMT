import React, { Component } from "react";
import { Route } from "react-router-dom";
import { ModalComponent } from "../../../components/bases";
import AddEditClassForm from "./AddEditClassForm";

export default class AddEditClassModal extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {
            modalIsOpen,
            toggle,
            currClass,
            updateClass,
            getListClass,
        } = this.props;
        return (
            <div>
                <ModalComponent
                    color="primary"
                    class="modal-for-school modal-850 modal-class"
                    title={
                        updateClass ? "Cập nhật lớp học" : "Thêm mới lớp học"
                    }
                    header
                    toggle={toggle}
                    isOpen={modalIsOpen}
                    size="lg"
                >
                    <Route
                        render={props => (
                            <AddEditClassForm
                                {...props}
                                currClass={currClass}
                                toggle={toggle}
                                onSubmit={this.showFormResult}
                                getListClass={getListClass}
                                updateClass={updateClass}
                            />
                        )}
                    />
                </ModalComponent>
            </div>
        );
    }
}
