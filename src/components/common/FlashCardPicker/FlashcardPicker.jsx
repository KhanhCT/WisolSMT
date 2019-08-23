import React, { Component } from "react";
import PropTypes from "prop-types";
import Flashcard from "./Flashcard";
import { Row } from "reactstrap";

export class FlashcardPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleFlashcardClick = flashcard => {
        const { onPick, lstFlashcardChoosed } = this.props;
        let newLstFlashcardChoosed = { ...lstFlashcardChoosed };
        if (newLstFlashcardChoosed[flashcard.id])
            delete newLstFlashcardChoosed[flashcard.id];
        else newLstFlashcardChoosed[flashcard.id] = flashcard;

        onPick(newLstFlashcardChoosed);
    };

    render() {
        const {
            lstFlashcardCategory,
            lstFlashcardChoosed,
            from,
            to,
        } = this.props;
        return (
            <Row className="border">
                {Object.keys(lstFlashcardCategory).map(flashcardId => {
                    let flashcard = lstFlashcardCategory[flashcardId];
                    return (
                        <Flashcard
                            from={from}
                            to={to}
                            flashcard={flashcard}
                            isSelected={
                                lstFlashcardChoosed[flashcardId] ? true : false
                            }
                            onFlashcardClick={() =>
                                this.handleFlashcardClick(flashcard)
                            }
                            key={flashcardId}
                        />
                    );
                })}
                <div className="clear" />
            </Row>
        );
    }
}

FlashcardPicker.propTypes = {
    lstFlashcardCategory: PropTypes.object,
    lstFlashcardChoosed: PropTypes.object,
    multiple: PropTypes.bool,
    onPick: PropTypes.func,
};
