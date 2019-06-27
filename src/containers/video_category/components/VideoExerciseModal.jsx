import React, { Component } from "react";
import { ModalComponent } from "../../../components/bases";
import VideoExerciseForm from "./VideoExerciseForm";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { Route } from "react-router-dom";

class VideoExerciseModal extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {
            modalIsOpen,
            toggle,
            updateUserAnswer,
            userAnswer,
        } = this.props;
        return (
            <div>
                <ModalComponent
                    color="primary"
                    class="modal-for-school modal-650"
                    title="Bài tập Video"
                    header
                    toggle={toggle}
                    isOpen={modalIsOpen}
                    size="lg"
                >
                    <Route
                        render={props => (
                            <VideoExerciseForm
                                {...props}
                                toggle={toggle}
                                updateUserAnswer={updateUserAnswer}
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

const tVideoExerciseModal = connect(mapStateToProps)(
    translate(["common", "for_school"])(VideoExerciseModal)
);
export default tVideoExerciseModal;
