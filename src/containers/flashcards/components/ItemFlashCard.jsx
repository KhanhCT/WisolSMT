import React, { Component } from "react";
import { apiConfigs } from "../../../constants";

export default class ItemFlashCard extends Component {
    render() {
        const { selectedId, flashcardIndex, onActive, flashcard } = this.props;

        return (
            <li
                className={
                    selectedId == flashcardIndex ? "active contact" : "contact"
                }
                onClick={onActive}
            >
                <div className="wrap">
                    {flashcard.image !== null ? (
                        <img
                            src={`${apiConfigs.BASE_IMAGE_URL}${
                                flashcard.image.directory
                            }`}
                            alt={flashcard.name}
                        />
                    ) : (
                        <img
                            src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=300&h=300"
                            alt={flashcard.name}
                        />
                    )}
                    <div className="meta">
                        <p className="name">{flashcard.name}</p>
                        <p className="preview">{flashcard.translate}</p>
                    </div>
                </div>
            </li>
        );
    }
}
