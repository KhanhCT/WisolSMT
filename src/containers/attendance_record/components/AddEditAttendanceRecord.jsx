import React, { Component } from "react";
import {
    Form,
    FormGroup,
    Input,
    Label,
    Button,
    ButtonToolbar,
    Col,
    Row,
} from "reactstrap";
import { ModalComponent } from "../../../components/common";
import { callApi, userHelper } from "../../../helpers";
import { CustomDatePicker, CustomTimePicker } from "../../../components/common";
import SelectListBook from "./SelectListBook";
import moment from "moment";
import { translate } from "react-i18next";

class AddEditAttendanceRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currBook: null,
        };
    }

    toggleModal = () => {
        this.props.toggle();
    };

    setCurrBook = selectedBook => {
        this.setState({ currBook: selectedBook });
    };

    handleAddAttendanceRecord = () => {
        const {
            t,
            currStudent,
            currBook,
            editAttendance,
            getLstAttendanceRecord,
            currAttendaceRecord,
        } = this.props;

        const { date, start, end, title } = currAttendaceRecord;
        if (!currStudent || !currBook || !start || !end || !title || !date)
            return alert(`${t("common.alert_enter_information")}`);
        // Get teacher info from storage
        let userStorage = userHelper.getUserFromStorage();
        if (userStorage) {
            let formData = currAttendaceRecord;
            formData["teacher_id"] = userStorage["user_id"];
            formData["student_id"] = currStudent.id;
            formData["book_id"] = currBook.id;
            formData["start"] = `${moment(date).format("YYYY-MM-DD")} ${moment(
                start
            ).format("HH:mm")}`;
            formData["end"] = `${moment(date).format("YYYY-MM-DD")} ${moment(
                end
            ).format("HH:mm")}`;
            let p = null;
            if (!editAttendance)
                p = callApi("attendance_records", "POST", null, formData);
            else
                p = callApi(
                    `attendance_records/${currAttendaceRecord.id}`,
                    "PUT",
                    null,
                    formData
                );
            if (p) {
                p.then(res => {
                    getLstAttendanceRecord();
                    this.toggleModal();
                }).catch(error => {
                    this.toggleModal();
                    console.log(error);
                });
            }
        }
    };

    render() {
        const {
            t,
            toggle,
            modalIsOpen,
            editAttendance,
            currAttendaceRecord,
        } = this.props;
        const {
            title,
            start,
            end,
            date,
            teacher_comment,
        } = currAttendaceRecord;
        let modalFooter = (
                <ButtonToolbar>
                    <Button
                        outline
                        style={{
                            marginTop: "27px",
                        }}
                        color={editAttendance ? "warning" : "primary"}
                        onClick={this.handleAddAttendanceRecord}
                    >
                        {editAttendance
                            ? `${t("common.update")}`
                            : `${t("common.add")}`}
                    </Button>
                    <Button
                        outline
                        style={{
                            marginTop: "27px",
                        }}
                        color="danger"
                        onClick={this.toggleModal}
                    >
                        {t("common.cancel")}
                    </Button>
                </ButtonToolbar>
            ),
            modalHeader = <strong>{t("common.attendance_record")}</strong>;
        return (
            <div>
                <ModalComponent
                    modalIsOpen={modalIsOpen}
                    toggle={toggle}
                    modalHeader={modalHeader}
                    modalFooter={modalFooter}
                >
                    <Form>
                        <FormGroup>
                            {/* <Label for="title">Select Book</Label> */}
                            <SelectListBook setCurrBook={this.setCurrBook} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="title">{t("common.title")}</Label>
                            <Input
                                type="text"
                                name="title"
                                id="title"
                                placeholder="Learn Alphabelt"
                                value={title}
                                onChange={this.props.handleInputChange}
                            />
                        </FormGroup>
                        <Row>
                            <Col lg={4} xl={4} lg={4} md={4}>
                                <FormGroup>
                                    <Label>{t("common.date")}</Label>
                                    <CustomDatePicker
                                        value={date}
                                        setSelectedDate={this.props.setDate}
                                        showTimeSelect={false}
                                    />
                                </FormGroup>
                            </Col>
                            <Col lg={4} xl={4} lg={4} md={4}>
                                <FormGroup>
                                    <Label>{t("common.start_time")}</Label>
                                    <CustomTimePicker
                                        className="form-control"
                                        value={start}
                                        onChange={this.props.setStartTime}
                                        placeholder="Choose Start Time"
                                    />
                                </FormGroup>
                            </Col>
                            <Col lg={4} xl={4} lg={4} md={4}>
                                <FormGroup>
                                    <Label>{t("common.end_time")}</Label>
                                    <CustomTimePicker
                                        className="form-control"
                                        value={end}
                                        onChange={this.props.setEndTime}
                                        placeholder="Choose End Time"
                                    />
                                </FormGroup>
                            </Col>
                        </Row>

                        <FormGroup>
                            <Label for="teacher_comment">
                                {t("common.comment")}
                            </Label>
                            <Input
                                type="textarea"
                                name="teacher_comment"
                                id="teacher_comment"
                                placeholder="Type comment"
                                value={teacher_comment}
                                onChange={this.props.handleInputChange}
                            />
                        </FormGroup>
                    </Form>
                </ModalComponent>
            </div>
        );
    }
}

const tTranslate = translate("common")(AddEditAttendanceRecord);
export default tTranslate;
