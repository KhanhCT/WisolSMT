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
const data = [
  {
    time: '01:00:00', value: 0,
  },
  {
    time: '02:00:00', value: 0,
  },
  {
    time: '02:00:01', value: 2,
  },
  {
    time: '02:00:02', value: 2,
  },
  {
    time: '03:00:00', value: 2,
  },
  {
    time: '04:00:00', value: 1,
  },
  {
    time: '04:00:01', value: 1,
  },
  {
    time: '04:00:02', value: 1,
  },
  {
    time: '05:00:00', value: 0,
  },
  {
    time: '05:00:01', value: 0,
  },
  {
    time: '05:00:02', value: 0,
  },
];
export class HistChart extends Component {
  constructor(props) {
    super(props);
  }

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
              <LineChart
                width={900}
                height={400}
                data={data}
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
