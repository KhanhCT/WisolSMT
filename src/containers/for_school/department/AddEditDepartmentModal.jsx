import React, { Component } from "react";
import { ModalComponent } from "../../../components/bases";
import AddEditDepartmentForm from "./AddEditDepartmentForm";
import { translate } from "react-i18next";
import { connect } from "react-redux";

class AddEditDepartmentModal extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {
            modalIsOpen,
            toggle,
            getListDepartment,
            currDepartment,
            updateDepartment,
            t,
        } = this.props;
        return (
            <div>
                <ModalComponent
                    color="primary"
                    title={
                        updateDepartment
                            ? `${t("common.update")}`
                            : `${t("common.add_new")}`
                    }
                    class="modal-for-school"
                    header
                    toggle={toggle}
                    isOpen={modalIsOpen}
                    size="lg"
                >
                    <AddEditDepartmentForm
                        currDepartment={currDepartment}
                        toggle={toggle}
                        onSubmit={this.showFormResult}
                        getListDepartment={getListDepartment}
                        updateDepartment={updateDepartment}
                    />
                </ModalComponent>
            </div>
        );
    }
}
const mapStateToProps = state => {
    const { forSchoolReducer } = state;
    return {
        infoStudent: forSchoolReducer.infoStudent,
    };
};

const tAddEditDepartmentModal = connect(mapStateToProps)(
    translate("common")(AddEditDepartmentModal)
);
export default tAddEditDepartmentModal;
