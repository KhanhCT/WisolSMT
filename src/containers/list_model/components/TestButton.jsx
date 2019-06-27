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
import { Container, Row, Col } from "reactstrap";
import { ROUTES, GOOGLE_RE_CAPTCHA_SITE_KEY } from "../../../constants";
import moment from "moment";
// import ArrayLodash from "lodash/array";

export class TestButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
    this.intervalFunc = null;
  }
  handleBtnClick = btnType => {
    const { history } = this.props;
    history.push(ROUTES.STATUS_LINE_CHART);
  }

  handleBtnClick1 = btnType => {
    const { history } = this.props;
    history.push(ROUTES.HIST_CHART);
  }
  render() {
    return (
      <Container>
        <Panel
          title="Current Status Chart"
          titleFontsize="30px"
          className="p-0-m"
          titleClassName="m-3-m"
          collapseClassName="t-3-m"
        >
         <Row>
            <Col sm={12}>
              <Button
                type="button"
                className="p-button-warning"
                label="M1"
                style={{ margin: ".30em",width:100, height: 100 }}
                onClick={() => this.handleBtnClick("yellow")}
              />
              <Button
                type="button"
                className="p-button-danger"
                label="M2"
                style={{ margin: ".30em",width:100, height: 100 }}
                onClick={() => this.handleBtnClick("red")}
              />
              <Button
                type="button"
                className="p-button-success"
                label="M3"
                style={{ margin: ".30em",width:100, height: 100 }}
                onClick={() => this.handleBtnClick("green")}
              />
              <Button
                type="button"
                className="p-button-success"
                label="M4"
                style={{ margin: ".30em",width:100, height: 100 }}
                onClick={() => this.handleBtnClick("green")}
              />
              <Button
                type="button"
                className="p-button-success"
                label="M5"
                style={{ margin: ".30em",width:100, height: 100 }}
                onClick={() => this.handleBtnClick("green")}
              />
              <Button
                type="button"
                className="p-button-success"
                label="M6"
                style={{ margin: ".30em",width:100, height: 100 }}
                onClick={() => this.handleBtnClick("green")}
              />
              <Button
                type="button"
                className="p-button-success"
                label="M7"
                style={{ margin: ".30em",width:100, height: 100 }}
                onClick={() => this.handleBtnClick("green")}
              />
              <Button
                type="button"
                className="p-button-success"
                label="M8"
                style={{ margin: ".30em",width:100, height: 100 }}
                onClick={() => this.handleBtnClick("green")}
              />
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <Button
                type="button"
                className="p-button-warning"
                label="M9"
                style={{ margin: ".30em",width:100, height: 100 }}
                onClick={() => this.handleBtnClick("yellow")}
              />
              <Button
                type="button"
                className="p-button-danger"
                label="M10"
                style={{ margin: ".30em",width:100, height: 100 }}
                onClick={() => this.handleBtnClick("red")}
              />
              <Button
                type="button"
                className="p-button-success"
                label="M11"
                style={{ margin: ".30em",width:100, height: 100 }}
                onClick={() => this.handleBtnClick("green")}
              />
              <Button
                type="button"
                className="p-button-warning"
                label="M12"
                style={{ margin: ".30em",width:100, height: 100 }}
                onClick={() => this.handleBtnClick("green")}
              />
              <Button
                type="button"
                className="p-button-success"
                label="M13"
                style={{ margin: ".30em",width:100, height: 100 }}
                onClick={() => this.handleBtnClick("green")}
              />
              <Button
                type="button"
                className="p-button-success"
                label="M14"
                style={{ margin: ".30em",width:100, height: 100 }}
                onClick={() => this.handleBtnClick("green")}
              />
              <Button
                type="button"
                className="p-button-warning"
                label="M15"
                style={{ margin: ".30em",width:100, height: 100 }}
                onClick={() => this.handleBtnClick("green")}
              />
              <Button
                type="button"
                className="p-button-danger"
                label="M16"
                style={{ margin: ".30em",width:100, height: 100 }}
                onClick={() => this.handleBtnClick("green")}
              />
            </Col>
          </Row>
        </Panel>
        <Panel
          title="History"
          titleFontsize="30px"
          className="p-0-m"
          titleClassName="m-3-m"
          collapseClassName="t-3-m"
        >
         <Row>
            <Col sm={12}>
              <Button
                type="button"
                className="p-button-warning"
                label="M1"
                style={{ margin: ".30em",width:100, height: 100 }}
                onClick={() => this.handleBtnClick1("yellow")}
              />
              <Button
                type="button"
                className="p-button-danger"
                label="M2"
                style={{ margin: ".30em",width:100, height: 100 }}
                onClick={() => this.handleBtnClick1("red")}
              />
              <Button
                type="button"
                className="p-button-success"
                label="M3"
                style={{ margin: ".30em",width:100, height: 100 }}
                onClick={() => this.handleBtnClick1("green")}
              />
              <Button
                type="button"
                className="p-button-success"
                label="M4"
                style={{ margin: ".30em",width:100, height: 100 }}
                onClick={() => this.handleBtnClick1("green")}
              />
              <Button
                type="button"
                className="p-button-success"
                label="M5"
                style={{ margin: ".30em",width:100, height: 100 }}
                onClick={() => this.handleBtnClick1("green")}
              />
              <Button
                type="button"
                className="p-button-success"
                label="M6"
                style={{ margin: ".30em",width:100, height: 100 }}
                onClick={() => this.handleBtnClick1("green")}
              />
              <Button
                type="button"
                className="p-button-success"
                label="M7"
                style={{ margin: ".30em",width:100, height: 100 }}
                onClick={() => this.handleBtnClick1("green")}
              />
              <Button
                type="button"
                className="p-button-success"
                label="M8"
                style={{ margin: ".30em",width:100, height: 100 }}
                onClick={() => this.handleBtnClick1("green")}
              />
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <Button
                type="button"
                className="p-button-warning"
                label="M9"
                style={{ margin: ".30em",width:100, height: 100 }}
                onClick={() => this.handleBtnClick1("yellow")}
              />
              <Button
                type="button"
                className="p-button-danger"
                label="M10"
                style={{ margin: ".30em",width:100, height: 100 }}
                onClick={() => this.handleBtnClick1("red")}
              />
              <Button
                type="button"
                className="p-button-success"
                label="M11"
                style={{ margin: ".30em",width:100, height: 100 }}
                onClick={() => this.handleBtnClick1("green")}
              />
              <Button
                type="button"
                className="p-button-warning"
                label="M12"
                style={{ margin: ".30em",width:100, height: 100 }}
                onClick={() => this.handleBtnClick1("green")}
              />
              <Button
                type="button"
                className="p-button-success"
                label="M13"
                style={{ margin: ".30em",width:100, height: 100 }}
                onClick={() => this.handleBtnClick1("green")}
              />
              <Button
                type="button"
                className="p-button-success"
                label="M14"
                style={{ margin: ".30em",width:100, height: 100 }}
                onClick={() => this.handleBtnClick1("green")}
              />
              <Button
                type="button"
                className="p-button-warning"
                label="M15"
                style={{ margin: ".30em",width:100, height: 100 }}
                onClick={() => this.handleBtnClick1("green")}
              />
              <Button
                type="button"
                className="p-button-danger"
                label="M16"
                style={{ margin: ".30em",width:100, height: 100 }}
                onClick={() => this.handleBtnClick1("green")}
              />
            </Col>
          </Row>
        </Panel>
      </Container>
    );
  }
}
