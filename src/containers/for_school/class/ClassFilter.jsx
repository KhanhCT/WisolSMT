import React, { Component, Fragment } from "react";
import {
    Container,
    Row,
    Col,
    Button,
    Form,
    FormGroup,
    Input,
    Label,
    Collapse,
} from "reactstrap";
import { CustomDatePicker } from "../../../components/common";

export default class ClassFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: null,
            start_date: null,
            end_date: null,
            collapse: false,
        };
    }

    toggle = () => {
        this.setState({ collapse: !this.state.collapse });
    };

    handleChangeInput = e => {
        this.setState({ [e.target.name]: e.target.value.trim() });
    };

    handleSetStartDate = date => {
        this.setState({ start_date: date });
    };

    handleSetEndDate = date => {
        this.setState({ end_date: date });
    };

    handleBtnFilter = () => {
        const { name, start_date, end_date } = this.state;
        let formData = {};
        if (name) formData["name"] = name;
        if (start_date)
            formData["start_date"] = start_date.format("YYYY-MM-DD");
        if (end_date) formData["end_date"] = end_date.format("YYYY-MM-DD");

        this.props.handleProcessFilter(formData);
    };

    render() {
        const { name, start_date, end_date } = this.state;
        return (
            <Fragment>
                <Button color="warning" onClick={this.toggle}>
                    <i className="fas fa-filter" /> BỘ LỌC LỚP HỌC
                </Button>
                <Collapse isOpen={this.state.collapse}>
                    <Form id="class-filter">
                        <Row>
                            <Col sm={4}>
                                <FormGroup>
                                    <Label for="name">Tên lớp học</Label>
                                    <Input
                                        type="text"
                                        name="name"
                                        id="name"
                                        placeholder="Tên lớp học"
                                        defaultValue={name}
                                        onChange={this.handleChangeInput}
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm={4}>
                                <FormGroup>
                                    <Label for="start_date">Ngày bắt đầu</Label>
                                    <CustomDatePicker
                                        value={start_date}
                                        name="start_date"
                                        showTimeSelect={false}
                                        setSelectedDate={
                                            this.handleSetStartDate
                                        }
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm={4}>
                                <FormGroup>
                                    <Label for="end_date">Ngày kết thúc</Label>
                                    <CustomDatePicker
                                        value={end_date}
                                        name="end_date"
                                        showTimeSelect={false}
                                        setSelectedDate={this.handleSetEndDate}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={2}>
                                <Button
                                    style={{ margin: 0 }}
                                    color="primary"
                                    block
                                    onClick={this.handleBtnFilter}
                                >
                                    <i className="fas fa-search" /> Tìm kiếm
                                </Button>
                            </Col>
                        </Row>
                        <br />
                    </Form>
                </Collapse>
            </Fragment>
        );
    }
}
