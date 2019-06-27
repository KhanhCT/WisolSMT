import React, { Component } from "react";
import { ModalComponent } from "../../../components/bases";
import AddEditScheduleForm from "./AddEditScheduleForm";

export default class AddEditScheduleModal extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {
            modalIsOpen,
            toggle,
            getListSchedule,
            currSchedule,
            updateSchedule,
        } = this.props;
        return (
            <div>
                <ModalComponent
                    color="primary"
                    title={
                        updateSchedule
                            ? "Cập nhật thời khóa biểu"
                            : "Thêm mới thời khóa biểu"
                    }
                    class="modal-for-school"
                    header
                    toggle={toggle}
                    isOpen={modalIsOpen}
                    size="lg"
                >
                    <AddEditScheduleForm
                        currSchedule={currSchedule}
                        updateSchedule={updateSchedule}
                        toggle={toggle}
                        onSubmit={this.showFormResult}
                        getListSchedule={getListSchedule}
                    />
                </ModalComponent>
            </div>
        );
    }
}
