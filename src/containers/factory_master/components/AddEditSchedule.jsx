import React, { Component } from "react";
import { ModalCustom, CustomDatePicker } from "../../../components/common";
import { Container, Row, Col, Label, FormGroup, Input } from "reactstrap";
import {
  SelectFactory,
  SelectLine,
  SelectShift,
} from "../../model_register/components/search_components";
import { Dropdown } from "primereact/dropdown";
import { userHelper, callApi } from "../../../helpers";
import { View } from "primereact/inputtext";
import { ConsoleIcon } from "mdi-react";

export default class AddEditSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      factory: null,
      line: null,
      shift: null,
      frHour: null,
      frMinute: null,
      toHour: null,
      toMinite: null,
      description: "",
      id: null,
      type: null,
      isEditted: false,
    };
    this.state.types = [];
    this.state.minutes = [];
    this.state.hours = [];
    this.state.types.push(
      {
        value: 1,
        label: "Rest Time",
      },
      {
        value: 2,
        label: "Work Time",
      }
    );
    for (let i = 0; i <= 24; i++) {
      this.state.hours.push({
        value: i,
        label: ("0" + i).slice(-2),
      });
    }
    for (let i = 0; i < 60; i++) {
      this.state.minutes.push({
        value: i,
        label: ("0" + i).slice(-2),
      });
    }
    this.handleTextChanged = this.handleTextChanged.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    let prevSchedule = prevProps.factorySchedule,
      newSchedule = this.props.factorySchedule;
    if (
      (!prevSchedule && newSchedule) ||
      (prevSchedule &&
        newSchedule &&
        prevSchedule.startTime != newSchedule.startTime &&
        prevSchedule.description != newSchedule.description &&
        prevSchedule.type != newSchedule.type &&
        prevSchedule.stopTime != newSchedule.stopTime &&
        newSchedule.type != prevProps.type)
    ) {
      let _frHour = Math.floor(newSchedule.startTime / 60),
        _frMinute = newSchedule.startTime % 60,
        _toHour = Math.floor(newSchedule.stopTime / 60),
        _toMinute = newSchedule.stopTime % 60;
      // if(_frHour == 24 && _frMinute == 0){
      //   _frHour = _frMinute = 0;
      // }
      // if(_toHour == 24 && _toMinute ==0){
      //   _toHour = _toMinute = 0;
      // }
      this.setState({
        factory: newSchedule.factory,
        line: newSchedule.line,
        shift: newSchedule.shift,
        frHour: _frHour,
        frMinute: _frMinute,
        toHour: _toHour,
        toMinite: _toMinute,
        type: newSchedule.type,
        description: newSchedule.description,
        id: newSchedule.ID,
      });
    }
  }

  createSchedule = props => {
    const {
      factory,
      line,
      shift,
      frHour,
      frMinute,
      toHour,
      toMinite,
      type,
      description,
      id,
    } = this.state;
    const { factorySchedule } = this.props;
    let startTime = 0,
      stopTime = 0;
    if (
      frHour == null ||
      frMinute == null ||
      toHour == null ||
      toMinite == null
    ) {
      return;
    }
    if (frHour == 24) {
      startTime = 1440;
    } else {
      startTime = frHour * 60 + frMinute;
    }
    if (toHour == 24) {
      stopTime = 1440;
    } else {
      stopTime = toHour * 60 + toMinite;
    }
    // Failed
    if (startTime > stopTime) {
      return;
    }
    var des = "";
    if (type == 1) {
      des = "Rest Time";
    } else {
      des = "Core Time";
    }
    //create New
    if (factorySchedule == null) {
      callApi(
        `schedule`,
        "POST",
        {},
        {
          FactoryID: factory.FactoryID,
          LineID: line.LineID,
          ShiftID: shift.ShiftID,
          Type: type,
          Description: des,
          StartTime: startTime,
          StopTime: stopTime,
          Disabled: false,
        }
      )
        .then(res => {
          if (res.status == 200) {
            this.props.toggle();
            this.props.getListFactorySchedule();
            this.setState({
              frHour: null,
              frMinute: null,
              toHour: null,
              toMinite: null,
              description: "",
            });
            userHelper.showToastMessage("SUCCESS", "success");
          }
        })
        .catch(err => {
          userHelper.showErrorMessage("Failed");
        });
    } else {
      callApi(
        `schedule`,
        "PUT",
        {},
        {
          ID: id,
          FactoryID: factory.FactoryID,
          LineID: line.LineID,
          ShiftID: shift.ShiftID,
          Type: type,
          Description: des,
          StartTime: startTime,
          StopTime: stopTime,
          Disabled: false,
        }
      )
        .then(res => {
          console.log(res);
          if (res.status == 200) {
            this.props.toggle();
            this.props.getListFactorySchedule();
            this.setState({
              frHour: null,
              frMinute: null,
              toHour: null,
              toMinite: null,
              description: "",
            });
            userHelper.showToastMessage("SUCCESS", "success");
          }
        })
        .catch(err => {
          userHelper.showErrorMessage("Failed");
        });
    }
  };

  handleSetDate = date => {
    this.setState({
      date: date,
    });
  };

  handleChangeFactory = value => {
    this.setState({ factory: value });
  };

  handleChangeLine = value => {
    this.setState({ line: value });
  };
  handleChangeShift = value => {
    this.setState({ shift: value });
  };
  handleTextChanged(event) {
    this.setState({ description: event.target.value });
  }

  render() {
    const {
      factory,
      line,
      shift,
      frHour,
      frMinute,
      toHour,
      toMinite,
      type,
      description,
    } = this.state;
    const { modalIsOpen, toggle, factorySchedule } = this.props;
    return (
      <ModalCustom
        color="secondary"
        title="Factory Schedule"
        btn="Default"
        modalIsOpen={modalIsOpen}
        cancel={true}
        btnOk={factorySchedule ? "Edit" : "New"}
        btnOkHanlder={this.createSchedule}
        toggleHeader={true}
        toggle={toggle}
        size="lg"
      >
        <Container>
          <Row>
            <Col sm="4">
              <Label for="factory">
                <strong>Factory</strong>
              </Label>
              <SelectFactory
                factory={factory}
                handleChangeFactory={this.handleChangeFactory}
              />
            </Col>
            <Col sm={3} hidden>
              <Label>Line</Label>
              <SelectLine
                factory={factory}
                line={line}
                handleChangeLine={this.handleChangeLine}
              />
            </Col>
            <Col sm="4">
              <Label>
                <strong>Shift</strong>
              </Label>
              <SelectShift
                factory={factory}
                shift={shift}
                handleChangeShift={this.handleChangeShift}
              />
            </Col>
            <Col sm="4">
              <Label> Type</Label>
              <div>
                <Dropdown
                  value={type}
                  options={this.state.types}
                  onChange={e => {
                    this.setState({ type: e.value });
                  }}
                  placeholder="Type"
                />
              </div>
            </Col>
          </Row>
          <br />
          <Row>
            <Col sm="6">
              <Label for="start_time">
                <strong>Start Time</strong>
              </Label>
              <div>
                <Dropdown
                  value={frHour}
                  options={this.state.hours}
                  onChange={e => {
                    this.setState({ frHour: e.value });
                  }}
                  placeholder="HH"
                />
                <Dropdown
                  value={frMinute}
                  options={this.state.minutes}
                  onChange={e => {
                    this.setState({ frMinute: e.value });
                  }}
                  placeholder="MM"
                />
              </div>
            </Col>
            <Col sm="6">
              <Label for="stop_time">
                <strong>Stop Time</strong>
              </Label>
              <div>
                <Dropdown
                  value={toHour}
                  options={this.state.hours}
                  onChange={e => {
                    this.setState({ toHour: e.value });
                  }}
                  placeholder="HH"
                />
                <Dropdown
                  value={toMinite}
                  options={this.state.minutes}
                  onChange={e => {
                    this.setState({ toMinite: e.value });
                  }}
                  placeholder="MM"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </ModalCustom>
    );
  }
}
