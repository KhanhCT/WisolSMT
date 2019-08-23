import React, { Component } from "react";
import { Button } from "primereact/button";
import Panel from "../../../components/Panel";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Container, Row, Col, Label } from "reactstrap";
import moment from "moment";
// import ArrayLodash from "lodash/array";

export class StatusLineChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
    this.intervalFunc = null;
  }

  handleBtnClick = btnType => {
    let value = null,
      color = null;
    switch (btnType) {
      case "yellow":
        value = 0;
        color = "#8884d8";
        break;
      case "green":
        value = 2;
        color = "#82ca9d";
        break;
      case "red":
        value = 1;
        color = "#82ca9d";
        break;
    }
    if (this.intervalFunc) clearInterval(this.intervalFunc);
    this.intervalFunc = setInterval(() => {
      let newestData = {
        time: moment().format("HH:mm:ss"),
      };
      newestData["value"] = value;
      this.setState({ data: [...this.state.data, newestData] }, () => {});
    }, 1000 * 2);
  };

  render() {
    return (
      <Container>
        <Panel
          title="Status Line Chart"
          titleFontsize="30px"
          className="p-0-m"
          titleClassName="m-3-m"
          collapseClassName="t-3-m"
        >
          <Row>
            <Col sm={12}>
              <Button
                type="button"
                icon="pi pi-pencil"
                className="p-button-warning"
                label="YELLOW"
                style={{ margin: ".10em" }}
                onClick={() => this.handleBtnClick("yellow")}
              />
              <Button
                type="button"
                icon="pi pi-pencil"
                className="p-button-danger"
                label="RED"
                style={{ margin: ".10em" }}
                onClick={() => this.handleBtnClick("red")}
              />
              <Button
                type="button"
                icon="pi pi-pencil"
                className="p-button-success"
                label="GREEN"
                style={{ margin: ".10em" }}
                onClick={() => this.handleBtnClick("green")}
              />
            </Col>
          </Row>
          <br />
          <Row>
            <Col sm={12}>
              <LineChart
                width={900}
                height={400}
                data={this.state.data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis type="number" ticks={[0, 1, 2]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  strokeWidth={5}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </Col>
          </Row>
          <Row>
          <Col sm={2}>
            <Label  style={{ fontSize: "15px", color:'red' }}>0: RED</Label>
          </Col>
          <Col sm={2}>
            <Label style={{ fontSize: "15px", color:'yellow' }}>1: YELLOW</Label>
          </Col>
          <Col sm={2}>
            <Label style={{ fontSize: "15px", color:'green' }}>2: GREEN</Label>
          </Col>
          </Row>
        </Panel>
      </Container>
    );
  }
}
