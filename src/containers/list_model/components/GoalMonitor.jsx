import React, { Component } from "react";
import { Container, Row, Col, Label, Button } from "reactstrap";
import { TableComponent } from "../../../components/bases";
import Panel from "../../../components/Panel";
import { CustomDatePicker } from "../../../components/common";
import FileSaver from "file-saver"
import {
  SelectFactory,
  SelectShift,
  SelectLine,
} from "../../plan_master/components/search_components";
import { callApi } from "../../../helpers";
import moment from "moment";
import Clock from "react-live-clock";

const LIST_SHIFT = {
  "DAY": {
    ShiftID: 1,
    ShiftName: "DAY"
  },
  "NIGHT": {
    ShiftID: 2,
    ShiftName: "NIGHT"
  }
}

export class GoalMonitor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      factory: null,
      line: null,
      shift: null,
      fromDate: moment(),
      toDate: moment(),
      listStatus: [
        {
          ID: "02",
          Name: "Model",
        },
        {
          ID: "03",
          Name: "Day Target",
        },
        {
          ID: "04",
          Name: "Now Target",
        },
        {
          ID: "05",
          Name: "Now Result",
        },
        {
          ID: "06",
          Name: "GOAL(%)",
        },
        {
          ID: "07",
          Name: "CycleTime",
        },
      ],
      listGoal: [],
    };
  }

  componentDidMount = () => {
    setInterval(() => this.getListGoal(), 1000 * 60);
  };

  getListGoal = () => {
    let currDate = moment();
    let newShift = null;
    // change shift
    if (currDate.hours() == 8 && currDate.minutes() <= 10) newShift = LIST_SHIFT["DAY"];
    else if (currDate.hours() == 20 && currDate.minutes() <= 10) newShift = LIST_SHIFT["NIGHT"];
    if (newShift) {
      this.setState({
        shift: newShift,
        fromDate: currDate,
        toDate: currDate,
      }, () => {
        this.getData()
      })
    } else this.getData();
  };

  getData = () => {
    const { factory, shift, line, fromDate, toDate } = this.state;
    if (factory && shift && line && fromDate && toDate) {
      let fromDateStr = fromDate.format("YYYY-MM-DD"),
        toDateStr = toDate.format("YYYY-MM-DD");
      callApi(
        `productionplan/goal/${fromDateStr}/${toDateStr}/${factory.FactoryID}/${
        line.LineID
        }/${shift.ShiftID}`,
        "GET",
        {}
      )
        .then(res => {
          if (res.status == 200) {
            this.setState({
              listGoal: res.data.Data ? res.data.Data : [],
            });
          }
        })
        .catch(error => {
          console.log(error);
          this.setState({ listGoal: [] });
        });
    } else {
      this.setState({ listGoal: [] });
    }
  }

  handleSetFromDate = date => {
    this.setState({
      fromDate: date,
    });
  };
  handleSetToDate = date => {
    this.setState({
      toDate: date,
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

  downloadReport = () => {
    const { factory, shift, line, fromDate, toDate } = this.state;
    if (factory && shift && fromDate && line && toDate) {
      let _fromDate = fromDate.format("YYYY-MM-DD"),
        _toDate = toDate.format("YYYY-MM-DD");
      callApi(
        `productionplan/report/${_fromDate}/${_toDate}/${factory.FactoryID}/${line.LineID}/${shift.ShiftID}`,
        "GET",
        {
        }, {}, "blob"
      )
        .then(res => {

          var blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          FileSaver.saveAs(blob, 'LFEM_PLAN_RESULT_REPORT.xlsx');
        })
        .catch(error => {
        });
    }
  }

  render() {
    const {
      fromDate,
      toDate,
      factory,
      shift,
      line,
      listStatus,
      listGoal,
    } = this.state;
    let renderRowHeaders = listGoal.map((goal, index) => {
      return (
        <th key={index} style={{ textAlign: "center", fontSize: "18px" }}>
          {goal["01"]}
        </th>
      );
    });
    let renderRowDatas = null;
    if (listStatus.length > 0 && listGoal.length > 0)
      renderRowDatas = listStatus.map(status => {
        let rowLineData = listGoal.map((goal, index) => {
          let bgColor = "";
          if (status.ID === "06") {
            let strPercent = parseFloat(goal[status.ID].split("%")[0]);
            bgColor = strPercent < 70 ? "yellow" : "white";
          }
          return (
            <td
              key={index}
              style={{
                textAlign: "center",
                fontSize: "18px",
                backgroundColor: bgColor,
              }}
            >
              <strong style={{ textAlign: "center", fontSize: "18px" }}>
                {goal[status.ID]}
              </strong>
            </td>
          );
        });
        return (
          <tr key={status.ID} style={{ fontSize: "18px" }}>
            <td style={{ fontSize: "18px" }}>{status.Name}</td>
            {rowLineData}
          </tr>
        );
      });
    return (
      <Container>
        <Panel
          title="LFEM Plan/Result"
          titleFontsize="30px"
          className="p-0-m"
          titleClassName="m-3-m"
          collapseClassName="t-3-m"
        >
          <Row>
            <Col sm={3}>
              <Label style={{ fontSize: "18px" }}>From Date</Label>
              <CustomDatePicker
                placeholderText="From Date"
                name="from_date"
                value={fromDate}
                showTimeSelect={false}
                setSelectedDate={this.handleSetFromDate}
              />
            </Col>
            <Col sm={3}>
              <Label style={{ fontSize: "18px" }}>To Date</Label>
              <CustomDatePicker
                placeholderText="To Date"
                name="to_date"
                value={toDate}
                showTimeSelect={false}
                setSelectedDate={this.handleSetToDate}
              />
            </Col>
            <Col sm={3}>
              <Label style={{ fontSize: "18px" }}>Factory</Label>
              <SelectFactory
                factory={factory}
                handleChangeFactory={this.handleChangeFactory}
              />
            </Col>
            <Col sm={3} hidden>
              <Label style={{ fontSize: "18px" }}>Line</Label>
              <SelectLine
                factory={factory}
                line={line}
                handleChangeLine={this.handleChangeLine}
              />
            </Col>
            <Col sm={3}>
              <Label style={{ fontSize: "18px" }}>Shift</Label>
              <SelectShift
                factory={factory}
                shift={shift}
                handleChangeShift={this.handleChangeShift}
              />
            </Col>
          </Row>
          <Row>
            <Col sm={3}>
              <Button
                color="primary"
                style={{ marginTop: "10px", fontSize: "18px" }}
                onClick={this.getListGoal}
              >
                Mornitor
              </Button>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <span>
                <strong style={{ fontSize: "18px" }}>
                  Date: {moment().format("YYYY.MM.DD")}
                </strong>
              </span>
              <span style={{ marginLeft: "15px" }}>
                <strong style={{ fontSize: "18px" }}>
                  Time:{" "}
                  <Clock
                    format={"HH:mm"}
                    ticking={true}
                    timezone={"Asia/Bangkok"}
                  />
                </strong>
              </span>
            </Col>
          </Row>
          <TableComponent
            id="production-monitoring-table"
            className="table--bordered table--head-accent table-monitoring"
            responsive={true}
          >
            <tbody>
              <tr>
                <th style={{ fontSize: "18px" }}>Machine</th>
                {renderRowHeaders}
              </tr>
              {renderRowDatas}
            </tbody>
          </TableComponent>
          <Row>
            <Col sm={3}>
              <Button
                color="primary"
                style={{ marginTop: "10px", fontSize: "18px" }}
                onClick={this.downloadReport}
              >
                Report
              </Button>
            </Col>
          </Row>
        </Panel>
      </Container>
    );
  }
}
