import React, { Component } from "react";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormGroup,
    Row,
    Col,
    Label,
    Input,
    Badge,
    Tooltip,
} from "reactstrap";
import moment from "moment";
import { callApi, userHelper } from "../../../helpers";

const dateTimeFormat = "DD/MM/YYYY HH:mm";

export default class ModalStudentConfirm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            attendanceRecord: null,
            student_comment: "",
            student_confirm: false,
            tooltipOpen: false,
        };
    }

    toggle = () => {
        this.setState({
            tooltipOpen: !this.state.tooltipOpen,
        });
    };

    static getDerivedStateFromProps(props, state) {
        const { currAttendanceRecord } = props;
        const { attendanceRecord } = state;
        if (currAttendanceRecord != attendanceRecord)
            return {
                attendanceRecord: currAttendanceRecord,
                student_confirm: currAttendanceRecord.student_confirm,
                student_comment: currAttendanceRecord.student_comment,
            };
        return null;
    }

    handleInputChange = e => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    handleUpdateBtn = e => {
        const {
            student_comment,
            student_confirm,
            attendanceRecord,
        } = this.state;
        let updateData = {
            ...attendanceRecord,
            student_confirm,
            student_comment,
        };
        callApi(
            `attendance_records/${attendanceRecord.id}`,
            "PUT",
            null,
            updateData
        )
            .then(res => {
                this.toggleModal();
                this.props.getLstAttendanceRecord();
            })
            .catch(error => {
                console.log(error);
            });
    };

    toggleModal = () => {
        const { toggle } = this.props;
        this.setState(
            {
                attendanceRecord: null,
                student_comment: "",
                student_confirm: false,
                tooltipOpen: false,
            },
            () => {
                toggle();
            }
        );
    };

    render() {
        const {
            attendanceRecord,
            student_comment,
            student_confirm,
        } = this.state;

        const { isOpen, toggle, size } = this.props;
        return (
            <Modal isOpen={isOpen} toggle={toggle} size={size}>
                <ModalHeader toggle={toggle}>
                    <strong>Attendance Record Information</strong>
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Col>
                            <FormGroup row>
                                <Label sm={3}>Title</Label>
                                <Col sm={7}>
                                    <Input
                                        type="text"
                                        readOnly
                                        value={
                                            attendanceRecord
                                                ? attendanceRecord["title"]
                                                : ""
                                        }
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup row>
                                <Label sm={3}>Start</Label>
                                <Col sm={7}>
                                    <Input
                                        type="text"
                                        readOnly
                                        value={
                                            attendanceRecord
                                                ? moment(
                                                      attendanceRecord["start"]
                                                  ).format(dateTimeFormat)
                                                : ""
                                        }
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup row>
                                <Label sm={3}>End</Label>
                                <Col sm={7}>
                                    <Input
                                        type="text"
                                        readOnly
                                        value={
                                            attendanceRecord
                                                ? moment(
                                                      attendanceRecord["end"]
                                                  ).format(dateTimeFormat)
                                                : ""
                                        }
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup row>
                                <Label sm={3}>Teacher Comment</Label>
                                <Col sm={7}>
                                    <Input
                                        type="textarea"
                                        readOnly
                                        value={
                                            attendanceRecord
                                                ? attendanceRecord[
                                                      "teacher_comment"
                                                  ]
                                                : ""
                                        }
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup row>
                                <Label sm={3} for="student_comment">
                                    Student Comment
                                </Label>
                                <Col sm={7}>
                                    <Input
                                        type="textarea"
                                        name="student_comment"
                                        id="student_comment"
                                        value={student_comment}
                                        onChange={this.handleInputChange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup row>
                                <Label sm={3} for="student_comment">
                                    Student Confirm
                                </Label>
                                <Col sm={7}>
                                    {attendanceRecord ? (
                                        attendanceRecord.student_confirm ? (
                                            <Badge color="success">
                                                CONFIRMED
                                            </Badge>
                                        ) : (
                                            <Button
                                                id="btn-confirm"
                                                onClick={() => {
                                                    this.setState({
                                                        student_confirm: true,
                                                    });
                                                }}
                                                outline
                                                color={
                                                    !student_confirm
                                                        ? "danger"
                                                        : "success"
                                                }
                                            >
                                                {!student_confirm ? (
                                                    "UNCONFIRMED"
                                                ) : (
                                                    <strong>CONFIRM</strong>
                                                )}
                                                {!student_confirm ? (
                                                    <Tooltip
                                                        placement="right"
                                                        isOpen={
                                                            this.state
                                                                .tooltipOpen
                                                        }
                                                        target="btn-confirm"
                                                        toggle={this.toggle}
                                                    >
                                                        Click button to confirm
                                                        this attendance record!
                                                    </Tooltip>
                                                ) : (
                                                    ""
                                                )}
                                            </Button>
                                        )
                                    ) : (
                                        ""
                                    )}
                                </Col>
                            </FormGroup>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button
                        outline
                        color="primary"
                        onClick={this.handleUpdateBtn}
                    >
                        Update
                    </Button>
                    <Button
                        outline
                        color="secondary"
                        onClick={this.toggleModal}
                    >
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}
