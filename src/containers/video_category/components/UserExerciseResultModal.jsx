import React, { Component } from "react";
import { ModalComponent } from "../../../components/bases";
import UserExerciseResultForm from "./UserExerciseResultForm";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { Route } from "react-router-dom";

class UserExerciseResultModal extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { modalIsOpen, toggle, userAnswer } = this.props;
        return (
            <div>
                <ModalComponent
                    color="primary"
                    class="modal-for-school modal-650"
                    title="Kết Quả Làm Bài Tập"
                    header
                    toggle={toggle}
                    isOpen={modalIsOpen}
                    size="lg"
                >
                    <Route
                        render={props => (
                            <UserExerciseResultForm
                                {...props}
                                toggle={toggle}
                                userAnswer={userAnswer}
                            />
                        )}
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

const tUserExerciseResultModal = connect(mapStateToProps)(
    translate(["common", "for_school"])(UserExerciseResultModal)
);
export default tUserExerciseResultModal;
