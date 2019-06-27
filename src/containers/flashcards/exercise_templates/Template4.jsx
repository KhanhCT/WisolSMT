import React, { Component } from "react";
import { Container, CardImg, Button } from "reactstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Collection from "lodash/collection";
import { apiConfigs } from "../../../constants";
import { userHelper } from "../../../helpers";
import $ from "jquery";

// fake data generator
const getItems = count =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
        id: `item-${k}`,
        content: `item ${k}`,
    }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: "auto",
    // change background colour if dragging
    backgroundColor: isDragging ? "#70bbfd" : "#f7f7f7",
    textAlign: "center",
    borderRadius: "5px",
    width: "10%",
    marginRight: "5px",

    // styles we need to apply on draggables
    ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
    display: "flex",
    padding: grid,
    overflow: "auto",
    borderRadius: "5px",
    border: isDraggingOver ? "1px dashed #70bbfd" : "1px dashed #6c757d",
});

export default class Template4 extends Component {
    constructor(props) {
        super(props);
        this.state = this.processData();
    }

    processData = () => {
        const { data, lang } = this.props;
        let quest = Collection.sample(data),
            arrCharacter = [];
        if (quest["name"][lang]) {
            arrCharacter = quest["name"][lang].split("");
            arrCharacter = Collection.shuffle(arrCharacter);
            arrCharacter = arrCharacter.map((character, index) => {
                return {
                    content: character,
                    id: `item-${index}`,
                };
            });
        }
        return { quest, arrCharacter };
    };

    onDragEnd = result => {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const arrCharacter = reorder(
            this.state.arrCharacter,
            result.source.index,
            result.destination.index
        );

        this.setState({
            arrCharacter,
        });
    };

    handleCheckAnswer = () => {
        const { arrCharacter, quest } = this.state;
        const { lang } = this.props;
        // Join text
        let resultText = arrCharacter.map(item => item.content).join("");
        if (resultText === quest["name"][lang]) {
            userHelper.playSound("correct");
            $("div.character-questions-border").addClass("bg-green");
            $("div.character-questions").addClass("animated faster tada");
        } else {
            userHelper.playSound("incorrect");
            $("div.character-questions-border").addClass("bg-red");
            $("div.character-questions").addClass("animated faster swing");
        }
        setTimeout(() => {
            $("div.character-questions-border").removeClass("bg-red bg-green");
            $("div.character-questions").removeClass(
                "animated faster tada swing"
            );
        }, 1000);
    };

    handlePlayVoice = type => {
        const { quest } = this.state;
        const { lang } = this.props;
        let audio = quest.audio;
        new Audio(userHelper.concatUrl(audio[type][lang]["directory"])).play();
    };

    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity
    render() {
        const { quest, arrCharacter } = this.state;
        const { lang } = this.props;
        let audioQuestion = quest.audio,
            renderMaleVoice = false,
            renderFemaleVoice = false;
        if (
            audioQuestion &&
            audioQuestion["male_voice"] &&
            audioQuestion["male_voice"][lang] &&
            audioQuestion["male_voice"][lang]["directory"]
        )
            renderMaleVoice = true;
        if (
            audioQuestion &&
            audioQuestion["female_voice"] &&
            audioQuestion["female_voice"][lang] &&
            audioQuestion["female_voice"][lang]["directory"]
        )
            renderFemaleVoice = true;
        return (
            <Container className="mw-960 sm-pl-1 sm-pr-1">
                <div className="text-center mt-5 mb-3">
                    <h1 className="bg-lightgrey inline-block pl-2 pr-2 sm-fontSize18">
                        Sort of the word of position for the correct
                    </h1>
                </div>
                <div className="text-center">
                    <CardImg
                        top
                        className="w-80-d box-shadow-1 rounded"
                        src={
                            quest["image"]
                                ? `${apiConfigs.CMS_BASE_URL}/${
                                      quest["image"]["directory"]
                                  }`
                                : ""
                        }
                        alt="Card image cap"
                    />
                    <div className="text-center mt-3">
                        {renderMaleVoice ? (
                            <Button
                                onClick={() =>
                                    this.handlePlayVoice("male_voice")
                                }
                                className="btn-outline-primary btnIcon"
                            >
                                <i className="fal fa-headphones-alt center" />
                            </Button>
                        ) : (
                            ""
                        )}
                        {renderFemaleVoice ? (
                            <Button
                                onClick={() =>
                                    this.handlePlayVoice("female_voice")
                                }
                                className="btn-outline-danger btnIcon"
                            >
                                <i className="fal fa-headphones-alt center" />
                            </Button>
                        ) : (
                            ""
                        )}

                        <Button
                            color="primary"
                            onClick={this.handleCheckAnswer}
                        >
                            <i className="fal fa-check-circle" /> Check
                        </Button>
                    </div>
                </div>
                <div>
                    <DragDropContext onDragEnd={this.onDragEnd}>
                        <Droppable
                            droppableId="droppable"
                            direction="horizontal"
                        >
                            {(provided, snapshot) => (
                                <div
                                    className="character-questions-border"
                                    ref={provided.innerRef}
                                    style={getListStyle(
                                        snapshot.isDraggingOver
                                    )}
                                    {...provided.droppableProps}
                                >
                                    {arrCharacter.map((item, index) => (
                                        <Draggable
                                            key={index}
                                            draggableId={item.id}
                                            index={index}
                                        >
                                            {(provided, snapshot) => (
                                                <div
                                                    className="character-questions"
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={{
                                                        ...getItemStyle(
                                                            snapshot.isDragging,
                                                            provided
                                                                .draggableProps
                                                                .style
                                                        ),
                                                        width: `${Math.floor(
                                                            100 /
                                                                this.state
                                                                    .arrCharacter
                                                                    .length
                                                        ) - 1}%`,
                                                    }}
                                                >
                                                    <strong
                                                        style={{
                                                            fontSize: "20px",
                                                        }}
                                                    >
                                                        {item.content}
                                                    </strong>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
            </Container>
        );
    }
}
