import React, { Component } from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import { ModalComponent } from "../../../components/bases";
import AddEditClassroomForm from "./AddEditClassroomForm";

class AddEditClassroomModal extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {
            modalIsOpen,
            toggle,
            currClassroom,
            updateClassroom,
            getListClassroom,
        } = this.props;
        return (
            <div>
                <ModalComponent
                    color="primary"
                    class="modal-for-school"
                    title={
                        updateClassroom
                            ? "Cập nhật phòng học"
                            : "Thêm mới phòng học"
                    }
                    header
                    toggle={toggle}
                    isOpen={modalIsOpen}
                    size="lg"
                >
                    <Route
                        render={props => (
                            <AddEditClassroomForm
                                {...props}
                                currClassroom={currClassroom}
                                toggle={toggle}
                                onSubmit={this.showFormResult}
                                getListClassroom={getListClassroom}
                                updateClassroom={updateClassroom}
                            />
                        )}
                    />
                </ModalComponent>
            </div>
        );
    }
}

const tAddEditClassroomModal = translate("common")(AddEditClassroomModal);
const mapStateToProps = () => ({});

export default connect(mapStateToProps)(tAddEditClassroomModal);
