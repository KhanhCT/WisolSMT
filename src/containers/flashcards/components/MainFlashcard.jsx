import React, { Component, Fragment } from "react";
import { ChooseFlashCard } from "./ChooseFlashCard";
import { FlashCardList } from "./FlashCardList";
import { FlashcardIntro } from "./FlashcardIntro";
import { Route } from "react-router-dom";
import { MainExercise } from "../exercise_templates";
import { MainExamination } from "../examination";

export class MainFlashcard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: true,
            lstFlashCard: {},
            from: "vi",
            to: "en",
            startLearning: false,
            startExcerise: false,
            lstCategoryIdChoosed: [],
            startExamination: false,
        };
    }

    setEdit = () => {
        this.setState({ edit: !this.state.edit });
    };

    resetStateToIntro = () => {
        this.setState({
            startLearning: false,
            startExamination: false,
            startExcerise: false,
        });
    };

    resetStateToLearning = () => {
        this.setState({
            startLearning: true,
            startExamination: false,
            startExcerise: false,
        });
    };

    setStartExerise = value => {
        this.setState({
            startExcerise: value,
        });
    };

    setStartExamination = value => {
        this.setState({
            startExamination: value,
        });
    };

    setLstFlashcard = choosedLstFlashcard => {
        this.setState({ lstFlashCard: choosedLstFlashcard });
    };

    setFrom = from => {
        this.setState({ from: from });
    };

    setTo = to => {
        this.setState({ to: to });
    };

    setStartLearning = value => {
        this.setState({ startLearning: value });
    };

    setLstCategoryIdChoosed = value => {
        this.setState({ lstCategoryIdChoosed: value });
    };

    render() {
        const {
            edit,
            lstFlashCard,
            from,
            to,
            startLearning,
            startExcerise,
            lstCategoryIdChoosed,
            startExamination,
        } = this.state;

        let renderMainFlashcard = null;
        if (!startLearning)
            renderMainFlashcard = (
                <FlashcardIntro
                    setStartLearning={this.setStartLearning}
                    setFrom={this.setFrom}
                    setTo={this.setTo}
                    from={from}
                    to={to}
                />
            );
        else {
            if (edit)
                renderMainFlashcard = (
                    <Route
                        render={props => (
                            <ChooseFlashCard
                                {...props}
                                setEdit={this.setEdit}
                                setLstFlashcard={this.setLstFlashcard}
                                setFrom={this.setFrom}
                                setTo={this.setTo}
                                lstFlashCard={lstFlashCard}
                                from={from}
                                to={to}
                                setLstCategoryIdChoosed={
                                    this.setLstCategoryIdChoosed
                                }
                                lstCategoryIdChoosed={lstCategoryIdChoosed}
                                resetStateToIntro={this.resetStateToIntro}
                            />
                        )}
                    />
                );
            else {
                if (startExcerise)
                    renderMainFlashcard = (
                        <MainExercise
                            data={lstFlashCard}
                            resetStateToLearning={this.resetStateToLearning}
                            lang={from}
                        />
                    );
                else if (startExamination)
                    renderMainFlashcard = (
                        <MainExamination
                            resetStateToLearning={this.resetStateToLearning}
                            data={lstFlashCard}
                            lang={from}
                        />
                    );
                else
                    renderMainFlashcard = (
                        <FlashCardList
                            setEdit={this.setEdit}
                            setStartExerise={this.setStartExerise}
                            setStartExamination={this.setStartExamination}
                            lstFlashCard={lstFlashCard}
                            from={from}
                            to={to}
                        />
                    );
            }
        }
        return <Fragment>{renderMainFlashcard}</Fragment>;
    }
}
