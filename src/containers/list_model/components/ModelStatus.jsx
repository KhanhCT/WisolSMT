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
} from "../../model_register/components/search_components";
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

export class ModelStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      factory: null,
      line: null,
      shift: null,
      fromDate: moment(),
      toDate: moment(),
      listStatus: [],
      listProductionLineStatus: [],
    };
  }

  componentDidMount = () => {
    this.getListStatus();
    setInterval(() => this.getListProductionLineStatus(), 1000 * 60);
  };

  // Get list production line status
  getListStatus = () => {
    callApi("productionline/status", "GET", {})
      .then(res => {
        if (res.status == 200)
          this.setState({
            listStatus: res.data.Data ? res.data.Data : [],
          });
      })
      .catch(error => {
        console.log(error);
        this.setState({ listStatus: [] });
      });
  };
  downloadReport = () => {
    const { factory, shift, line, fromDate, toDate } = this.state;
    if (factory && shift && fromDate && toDate) {
      let from = fromDate.format("YYYY-MM-DD"),
        to = toDate.format("YYYY-MM-DD");
      callApi(
        `productiondtl/report/${factory.FactoryID}/${shift.ShiftID}/${
        line.LineID
        }/${from}/${to}`,
        "GET",
        {}, {}, "blob"
      )
        .then(res => {
          var blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          FileSaver.saveAs(blob, 'LFEM_MONITORING_SYSTEM_REPORT.xlsx');
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
  // Get list production line status
  getListProductionLineStatus = () => {
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
    if (factory && shift && fromDate && toDate) {
      let from = fromDate.format("YYYY-MM-DD"),
        to = toDate.format("YYYY-MM-DD");
      callApi(
        `productiondtl/line/${factory.FactoryID}/${shift.ShiftID}/${
        line.LineID
        }/${from}/${to}`,
        "GET",
        {}
      )
        .then(res => {
          if (res.status == 200)
            this.setState({
              listProductionLineStatus: res.data.Data ? res.data.Data : [],
            });
        })
        .catch(error => {
          console.log(error);
          this.setState({ listProductionLineStatus: [] });
        });
    } else this.setState({ listProductionLineStatus: [] });
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

  render() {
    const {
      fromDate,
      toDate,
      factory,
      shift,
      line,
      listStatus,
      listProductionLineStatus,
    } = this.state;
    let renderRowHeaders = listProductionLineStatus.map(line => {
      return (
        <th
          key={line.id}
          style={{ fontSize: "18px", textAlign: "center", width: 50 }}
        >
          {line.name}
        </th>
      );
    });
    let renderRowDatas = null;
    if (listStatus.length > 0 && listProductionLineStatus.length > 0)
      renderRowDatas = listStatus.map(status => {
        let rowLineData = listProductionLineStatus.map(line => {
          let bgColor = "";
          if (status.ID === line["active_status"]) bgColor = status.Color;
          return (
            <td
              key={line.id}
              style={{
                backgroundColor: bgColor,
                color: "#000000",
                textAlign: "center",
              }}
            >
              <strong style={{ fontSize: "18px" }}>
                {line.body[status.ID] ? line.body[status.ID] : 0}
              </strong>
            </td>
          );
        });
        return (
          <tr key={status.ID}>
            <td style={{ backgroundColor: status.Color }}>
              <strong style={{ color: "#000000", fontSize: "18px" }}>
                {status.Name}
              </strong>
            </td>
            {rowLineData}
          </tr>
        );
      });
    return (
      <Container>
        <Panel
          title="LFEM MOTNITORING SYSTEM"
          titleFontsize="30px"
          style={{ fontSize: "30px" }}
          className="p-0-m"
          titleClassName="m-3-m"
          collapseClassName="t-3-m"
        >
          <Row>
            <Col sm={3}>
              <Label style={{ fontSize: "18px" }}>Factory</Label>
              <SelectFactory
                factory={factory}
                handleChangeFactory={this.handleChangeFactory}
              />
            </Col>
            <Col sm={2} hidden>
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
          </Row>
          <Row>
            <Col sm={3}>
              <Button
                color="primary"
                style={{ marginTop: "10px", fontSize: "18px" }}
                onClick={this.getListProductionLineStatus}
              >
                Search
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
