import React, { Component } from "react";
import { ModalCustom, CustomDatePicker } from "../../../components/common";
import { Container, Row, Col, Label } from "reactstrap";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";

import {
  SelectFactory,
  SelectLine,
  SelectShift,
  SelectProduct,
  SelectWorkPlace,
} from "./search_components";
import moment from "moment";
import { callApi, userHelper } from "../../../helpers";

export default class AddProductionPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: moment(),
      factory: null,
      line: null,
      shift: null,
      workPlace: null,
      product: null,
      products: [],
      plans: [],
    };
    callApi("product", "GET", {})
      .then(res => {
        if (res.status == 200) {
          this.setState({ products: res.data.Data });
        }
      })
      .catch(err => {
        userHelper.showErrorMessage("Not found any plan");
      });
  }

  componentDidUpdate(prevProps, prevState) {
    let prevProductionPlan = prevProps.productionPlan,
      newProductionPlan = this.props.productionPlan;
    if (
      (!prevProductionPlan && newProductionPlan) ||
      (prevProductionPlan &&
        newProductionPlan &&
        prevProductionPlan.FactoryID != newProductionPlan.FactoryID &&
        prevProductionPlan.LineID != newProductionPlan.LineID &&
        prevProductionPlan.ShiftID != newProductionPlan.ShiftID)
    ) {
      this.setState(
        {
          date: moment(newProductionPlan.WorkingDate),
          factory: newProductionPlan.factory,
          line: newProductionPlan.line,
          shift: newProductionPlan.shift,
          product: newProductionPlan.product,
          workPlace: newProductionPlan.workplace,
        },
        () => console.log(this.state)
      );
    }
  }

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

  handleChangeWorkPlace = value => {
    this.setState({ workPlace: value });
  };

  handleChangeProduct = value => {
    this.setState({ product: value });
  };

  addProductionPlan = () => {
    const { plans } = this.state;
    const { productionPlan } = this.props;

    console.log(plans);
    if (!productionPlan)
      callApi("productionplans", "POST", {}, plans)
        .then(res => {
          if (res.status == 200) {
            this.setState({ plans: [] });
            this.props.toggle();
            this.props.getListProductionPlan();
            userHelper.showToastMessage("SUCCESS", "success");
          }
        })
        .catch(error => {
          userHelper.showErrorMessage("Failed to add a new plan");
          this.setState({ listProductionPlan: [] });
        });
  };
  findPlans = () => {
    const { date, factory, line, shift, products } = this.state;
    let plans = [];
    for (let i = 1; i <= line.WorkPlaceQty; i++) {
      let _plan = {
        WorkingDate: moment(date).format("YYYY-MM-DD"),
        FactoryID: factory.FactoryID,
        LineID: line.LineID,
        ShiftID: shift.ShiftID,
        WorkPlaceID: i,
        WorkPlaceCode: "111",
        ProductID: products[0].ProductID,
        ProductName: products[0].ProductName,
        Product: products[0],
        OrderedQty: 0,
        GoodProdQty: 0,
        NGProdQty: 0,
        StartTime: moment().format("YYYY-MM-DD HH:mm:ss"),
        StopTime: moment().format("YYYY-MM-DD HH:mm:ss"),
        Disabled: false,
      };
      plans.push(_plan);
    }
    this.setState({ plans: plans });
  };
  onEditorValueChange(product, props) {
    let updatedPlans = [...props.value];
    updatedPlans[props.rowIndex][props.field] = product.ProductName;
    updatedPlans[props.rowIndex]["ProductID"] = product.ProductID;
    updatedPlans[props.rowIndex]["Product"] = product;
    this.setState({ plans: updatedPlans });
  }
  productEditor = props => {
    return (
      <SelectProduct
        product={this.state.plans[props.rowIndex]["Product"]}
        handleChangeProduct={value => {
          this.onEditorValueChange(value, props);
        }}
      />
    );
  };

  render() {
    const { date, factory, line, shift, products, plans } = this.state;
    const { modalIsOpen, toggle, productionPlan, codOrderData, t } = this.props;
    return (
      <ModalCustom
        color="primary"
        // title={t("pay.order_history")}
        title="Production Plan"
        btn="Default"
        modalIsOpen={modalIsOpen}
        cancel={true}
        btnOk={productionPlan ? "Update" : "Add"}
        btnOkHanlder={this.addProductionPlan}
        toggleHeader={false}
        toggle={toggle}
        size="lg"
        disabled={plans.length == 0}
      >
        <Container>
          <Row>
            <Col sm="4">
              <Label for="date">
                <strong>Working Date</strong>
              </Label>
              <CustomDatePicker
                placeholderText="Date"
                name="date"
                value={date}
                showTimeSelect={false}
                setSelectedDate={this.handleSetDate}
              />
            </Col>
            <Col sm="4">
              <Label for="factory">
                <strong>Factory</strong>
              </Label>
              <SelectFactory
                factory={factory}
                handleChangeFactory={this.handleChangeFactory}
              />
            </Col>
            <Col sm="3" hidden>
              <Label>
                <strong>Line</strong>
              </Label>
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
          </Row>
          <Row>
            <Col sm="12">
              <Button
                type="button"
                className="p-button-primary"
                label="Add"
                style={{ margin: "10px 10px" }}
                onClick={this.findPlans}
                disabled={products.length == 0}
              />
            </Col>
            {/* <Col sm="6">
              <Label>
                <strong>Work Place</strong>
              </Label>
              <SelectWorkPlace
                line={line}
                workPlace={workPlace}
                handleChangeWorkPlace={this.handleChangeWorkPlace}
              />
            </Col>
            <Col sm="6">
              <Label>
                <strong>Product</strong>
              </Label>
              <SelectProduct
                product={product}
                handleChangeProduct={this.handleChangeProduct}
              />
            </Col> */}
          </Row>
          <div className="content-section implementation">
            <DataTable
              value={this.state.plans}
              paginator={true}
              editable={true}
              rows={30}
            >
              <Column
                field="WorkPlaceID"
                header="Position"
                style={{ height: "1.5em" }}
              />
              <Column
                field="WorkPlaceCode"
                header="Machine"
                style={{ height: "3.5em" }}
              />
              <Column
                field="ProductName"
                header="Model"
                editor={this.productEditor}
                style={{ height: "5.5em" }}
              />
            </DataTable>
          </div>
        </Container>
      </ModalCustom>
    );
  }
}
