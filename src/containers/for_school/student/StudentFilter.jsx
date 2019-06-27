import React, { Component, Fragment } from "react";
import {
    Row,
    Col,
    Button,
    Form,
    FormGroup,
    Input,
    Label,
    Collapse,
} from "reactstrap";

export default class StudentFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullname: null,
            email: null,
            phone: null,
            collapse: false,
        };
    }

    toggle = () => {
        this.setState({ collapse: !this.state.collapse });
    };

    handleChangeInput = e => {
        this.setState({ [e.target.name]: e.target.value.trim() });
    };

    handleBtnFilter = () => {
        const { fullname, email, phone } = this.state;
        let formData = {};
        if (fullname) formData["fullname"] = fullname;
        if (email) formData["email"] = email;
        if (phone) formData["phone"] = phone;
        this.props.handleProcessFilter(formData);
    };

    render() {
        const { fullname, email, phone } = this.state;
        return (
            <Fragment>
                <Button color="warning" onClick={this.toggle}>
                    <i className="fas fa-filter" /> BỘ LỌC HỌC VIÊN
                </Button>
                <Collapse isOpen={this.state.collapse}>
                    <Form id="student-filter">
                        <Row>
                            <Col sm={4}>
                                <FormGroup>
                                    <Label for="fullname">Họ và tên</Label>
                                    <Input
                                        type="text"
                                        name="fullname"
                                        id="fullname"
                                        placeholder="Họ và tên"
                                        defaultValue={fullname}
                                        onChange={this.handleChangeInput}
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm={4}>
                                <FormGroup>
                                    <Label for="email">Email</Label>
                                    <Input
                                        type="text"
                                        name="email"
                                        id="email"
                                        placeholder="Email"
                                        defaultValue={email}
                                        onChange={this.handleChangeInput}
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm={4}>
                                <FormGroup>
                                    <Label for="contract_number">
                                        Số điện thoại
                                    </Label>
                                    <Input
                                        type="text"
                                        name="phone"
                                        id="phone"
                                        placeholder="Số điện thoại"
                                        defaultValue={phone}
                                        onChange={this.handleChangeInput}
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
