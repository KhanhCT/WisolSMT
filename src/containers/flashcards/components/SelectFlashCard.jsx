import React, { Component } from "react";
import Select from "react-select";
import { FormGroup, Label, Row, Col } from "reactstrap";
import { callApi } from "../../../helpers";

export default class SelectFlashCard extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    findKeyword = input => {
        if (!input) {
            return Promise.resolve({ options: [] });
        }
        let findOpt = {
            q: input,
            flashcard_category_id: null,
        };
        const { currentCategory } = this.props;
        if (currentCategory) {
            findOpt.flashcard_category_id = currentCategory.id;
        }
        return callApi("flash_cards/find-keyword", "GET", findOpt)
            .then(res => {
                let options = res.data.data;
                return { options: options };
            })
            .catch(error => {
                return Promise.resolve({ options: [] });
            });
    };

    render() {
        const AsyncComponent = this.state.creatable
            ? Select.AsyncCreatable
            : Select.Async;
        const { handleChangeKeyword, currentFlashCard } = this.props;

        return (
            <Row>
                <Col sm={12}>
                    <FormGroup>
                        <Label for="find-keyword">Find keyword</Label>
                        <AsyncComponent
                            className="custom-react-select"
                            value={currentFlashCard}
                            onChange={handleChangeKeyword}
                            valueKey="id"
                            labelKey="name"
                            loadOptions={this.findKeyword}
                            placeholder="Find keyword"
                        />
                    </FormGroup>
                </Col>
            </Row>
        );
    }
}
