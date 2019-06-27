import React, { Component } from "react";
import PropTypes from "prop-types";
import { CardImg, CardTitle, CardSubtitle, Col } from "reactstrap";
import { apiConfigs } from "../../../constants";

const FlashcardStyle = (width, height) => {
    return {
        width,
        height,
        objectFit: "cover",
    };
};

export default class Flashcard extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {
            flashcard,
            isSelected,
            onFlashcardClick,
            from,
            to,
        } = this.props;
        let convertName = null;
        if (typeof flashcard.name === "string") {
            convertName = JSON.parse(flashcard.name);
        } else {
            convertName = flashcard.name;
        }
        return (
            <Col
                xs={6}
                md={2}
                className={`p-2 border bg-white checkStyle${
                    isSelected ? " selected" : ""
                }`}
                onClick={onFlashcardClick}
            >
                <div className={`${isSelected ? " selected" : ""}`}>
                    <CardImg
                        top
                        src={`${apiConfigs.CMS_BASE_URL}/${
                            flashcard.image.directory
                        }`}
                        alt={flashcard.image.name}
                    />
                    <div className="p-1 text-center">
                        <CardTitle>{convertName[from]}</CardTitle>
                        <CardSubtitle>{convertName[to]}</CardSubtitle>
                    </div>
                </div>
                <div className="checked">
                    <div className="icon" />
                </div>
            </Col>
        );
    }
}

Flashcard.propTypes = {
    flashcard: PropTypes.object,
    isSelected: PropTypes.bool,
};
