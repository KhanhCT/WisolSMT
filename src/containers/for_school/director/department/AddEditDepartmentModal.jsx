import React, { Component } from "react";
import { ModalCustom } from "../../../../components/common";
import { ModalComponent } from "../../../../components/bases";
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
            doUpdateDepartment,
            t,
        } = this.props;
        return (
            <div>
                <ModalComponent
                    color="primary"
                    class="modal-for-school modal-650"
                    title={
                        doUpdateDepartment
                            ? `${t("common.update")}`
                            : `${t("common.add_new")}`
                    }
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
                        doUpdateDepartment={doUpdateDepartment}
                    />
                </ModalComponent>
            </div>
        );
    }
}
const mapStateToProps = state => {
    const { forSchoolReducer } = state;
    return {
        currSchool: forSchoolReducer.currSchool,
    };
};

const tAddEditDepartmentModal = connect(mapStateToProps)(
    translate(["common", "for_school"])(AddEditDepartmentModal)
);
export default tAddEditDepartmentModal;
