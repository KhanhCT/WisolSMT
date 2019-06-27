import React, { Component, Fragment } from "react";
import { Container, Row, Col, Button, ButtonGroup } from "reactstrap";
import { translate } from "react-i18next";
import { apiConfigs } from "../../../constants";

class Vocabulary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displaySub: true,
            autoSlide: true,
            isFull: false,
            playMale: true,
            playFemale: true,
            selectedId: 0,
            isFlipped: false,
            clicked: false,
        };
    }

    flip = () => {
        this.setState({
            flipped: !this.state.flipped,
            clicked: true,
        });
    };

    fullScreenSlide = () => {
        this.setState({ isFull: true });
    };

    togglePlayMale = url => {
        this.audioMale = new Audio(url);
        this.setState({ playMale: !this.state.playMale });
        this.state.playMale ? this.audioMale.play() : this.audioMale.pause();
    };

    togglePlayFemale = url => {
        this.audioFemale = new Audio(url);
        this.setState({ playFemale: !this.state.playFemale });
        this.state.playFemale
            ? this.audioFemale.play()
            : this.audioFemale.pause();
    };

    render() {
        const { t, lstFlashCard } = this.props;

        let renderCustomCard = null;
        renderCustomCard = lstFlashCard.map((flashcard, index) => {
            let vocabImg = (
                    <img
                        src={`${apiConfigs.CMS_BASE_URL}/${
                            flashcard.image.directory
                        }`}
                    />
                ),
                btnToolBar = (
                    <ButtonGroup>
                        <Button color="outline-secondary">
                            <i className="fas fa-volume-down text-primary" />
                        </Button>
                        <button className="btn btn-outline-secondary border-left-0">
                            <i className="fas fa-volume-down text-danger" />
                        </button>
                    </ButtonGroup>
                ),
                vocabText = flashcard["name"],
                vocabTranslate = flashcard["translate"];
            return (
                <CardCustom
                    key={index}
                    vocabImg={vocabImg}
                    btnToolBar={btnToolBar}
                    vocabText={vocabText}
                    vocabTranslate={vocabTranslate}
                />
            );
        });

        return (
            <Container>
                <Row>
                    <Col sm={12}>
                        <div className="Cards">{renderCustomCard}</div>
                    </Col>
                </Row>
            </Container>
        );
    }
}

const tVocabulary = translate("common")(Vocabulary);
export { tVocabulary as Vocabulary };

class CardCustom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flipped: false,
            clicked: false,
        };
    }
    flip = () => {
        this.setState({
            flipped: !this.state.flipped,
            clicked: true,
        });
    };
    render() {
        var flippedCSS = this.state.flipped
            ? " Card-Back-Flip"
            : " Card-Front-Flip";
        if (!this.state.clicked) flippedCSS = "";
        return (
            <div className="Card">
                <div onClick={this.flip}>
                    <div className={"Card-Front" + flippedCSS}>
                        <center>{this.props.vocabImg}</center>
                    </div>
                    <div className={"Card-Back" + flippedCSS}>
                        <h3>{this.props.vocabText}</h3>
                        <p>{this.props.vocabTranslate}</p>
                    </div>
                </div>
                {this.props.btnToolBar}
            </div>
        );
    }
}
