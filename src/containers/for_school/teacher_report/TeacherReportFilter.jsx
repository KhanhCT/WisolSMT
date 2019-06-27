import React, { Component, Fragment } from "react";
import { Row, Col, Button, Form, FormGroup, Label, Collapse } from "reactstrap";
import { CustomDatePicker } from "../../../components/common";
import moment from "moment";

export default class TeacherReportFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            start_date: null,
            end_date: null,
            collapse: false,
        };
    }

    toggle = () => {
        this.setState({ collapse: !this.state.collapse });
    };

    handleSetStartDate = date => {
        this.setState({
            start_date: date,
        });
    };

    handleSetEndDate = date => {
        this.setState({
            end_date: date,
        });
    };

    handleBtnFilter = () => {
        const { start_date, end_date } = this.state;
        if (start_date && end_date && start_date.isAfter(end_date))
            return alert("start_date must be smaller than end_date");
        let formData = {};
        if (start_date)
            formData["start_date"] = start_date.format("YYYY-MM-DD");
        if (end_date) formData["end_date"] = end_date.format("YYYY-MM-DD");
        this.props.handleProcessFilter(formData);
    };

    render() {
        const { start_date, end_date } = this.state;
        return (
            <Fragment>
                <Button color="warning" onClick={this.toggle}>
                    <i className="fas fa-filter" /> LỌC KHOẢNG THỜI GIAN
                </Button>
                <Collapse isOpen={this.state.collapse}>
                    <Form id="teacher-filter">
                        <Row>
                            <Col sm={4}>
                                <FormGroup>
                                    <Label for="fullname">Ngày bắt đầu</Label>
                                    <CustomDatePicker
                                        placeholderText="Thời gian bắt đầu"
                                        name="start_date"
                                        value={start_date}
                                        showTimeSelect={false}
                                        setSelectedDate={
                                            this.handleSetStartDate
                                        }
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm={4}>
                                <FormGroup>
                                    <Label for="email">Ngày kết thúc</Label>
                                    <CustomDatePicker
                                        placeholderText="Thời gian kết thúc"
                                        name="end_date"
                                        value={end_date}
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
