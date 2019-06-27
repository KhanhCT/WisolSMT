import React, { Component } from "react";
import { Button, ButtonToolbar } from "reactstrap";
import {
    CustomDatePicker,
    CustomTimePicker,
} from "../../../../components/common";
import { ModalComponent } from "../../../../components/bases";
import "react-toggle/style.css";
import ListRoomSelect from "./ListRoomSelect";
import { translate } from "react-i18next";
import { connect } from "react-redux";

class DetailSessionModal extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {
            modalIsOpen,
            toggle,
            currDate,
            currStart,
            currEnd,
            currRoom,
            t,
        } = this.props;

        return (
            <div>
                <ModalComponent
                    color="primary"
                    class="modal-for-school modal-650"
                    title={t("common.detail")}
                    header
                    toggle={toggle}
                    isOpen={modalIsOpen}
                    size="lg"
                >
                    <form
                        id="add-edit-department"
                        className="form form--horizontal"
                    >
                        <div className="form__form-group">
                            <label
                                htmlFor="phone"
                                className="form__form-group-label"
                            >
                                {t("common.classroom")}
                            </label>
                            <div className="form__form-group-field">
                                <div className="form__form-group-input-wrap">
                                    <ListRoomSelect
                                        setSelectedRoom={
                                            this.props.setSelectedRoom
                                        }
                                        selectedRoom={currRoom}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form__form-group">
                            <label
                                htmlFor="phone"
                                className="form__form-group-label"
                            >
                                {t("common.date")}
                            </label>
                            <div className="form__form-group-field">
                                <div className="form__form-group-input-wrap">
                                    <CustomDatePicker
                                        placeholderText="Ngày học"
                                        name="date"
                                        value={currDate}
                                        showTimeSelect={false}
                                        setSelectedDate={
                                            this.props.handleChangeDate
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form__form-group">
                            <label
                                htmlFor="address"
                                className="form__form-group-label"
                            >
                                {t("common.start_time")}
                            </label>
                            <div className="form__form-group-field">
                                <CustomTimePicker
                                    name="start_time"
                                    style={{ width: "100%" }}
                                    value={currStart}
                                    onChange={this.props.handleSetStartTime}
                                    placeholder="Thời gian bắt đầu"
                                />
                            </div>
                        </div>

                        <div className="form__form-group">
                            <label
                                htmlFor="manager"
                                className="form__form-group-label"
                            >
                                {t("common.end_time")}
                            </label>
                            <div className="form__form-group-field">
                                <CustomTimePicker
                                    name="end_time"
                                    style={{ width: "100%" }}
                                    value={currEnd}
                                    onChange={this.props.handleSetEndTime}
                                    placeholder="Thời gian kết thúc"
                                />
                            </div>
                        </div>

                        <ButtonToolbar style={{ margin: "10px auto 0 auto" }}>
                            <Button
                                type="button"
                                onClick={() => {
                                    toggle();
                                }}
                            >
                                {t("common.cancel")}
                            </Button>
                        </ButtonToolbar>
                    </form>
                </ModalComponent>
            </div>
        );
    }
}
const mapStateToProps = state => {
    const { forSchoolReducer } = state;
    return {
        infoStudent: forSchoolReducer.infoStudent,
    };
};

const tDetailSessionModal = connect(mapStateToProps)(
    translate("common")(DetailSessionModal)
);
export default tDetailSessionModal;
