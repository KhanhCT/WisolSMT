import React, { Component } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import Panel from "../../../components/Panel";
import { Row, Col, Label } from "reactstrap";
import NewWorkplace from "./NewWorkplace";
import { userHelper, callApi } from "../../../helpers";
import {
  SelectFactory,
  SelectProduct,
  SelectLine,
} from "../../common/components";

export class WorkplaceMaster extends Component {
  constructor() {
    super();
    this.state = {
      factory: null,
      line: null,
      product: null,
      workplaces: [],
      modalIsOpen: null,
      updateData: false,
      isEdit: false,
    };
    this.cycleTimeEditor = this.cycleTimeEditor.bind(this);
    this.requiredValidator = this.requiredValidator.bind(this);
    this.wokrPlaceCodeEditor = this.wokrPlaceCodeEditor.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    const { updateData, product, line, factory } = this.state;
    if (product && line && factory && updateData) this.findWorkPlaces();
  }

  toggle = () => {
    this.setState({ modalIsOpen: !this.state.modalIsOpen });
  };

  editRowData = (rowData, column) => {
    this.setState({ modalIsOpen: true });
  };
  wokrPlaceCodeEditor(props) {
    return this.inputTextEditor(props, "WorkPlaceCode");
  }
  cycleTimeEditor(props) {
    return this.inputNumberEditor(props, "CycleTime");
  }
  requiredValidator(props) {
    let value = props.rowData[props.field];
    return value && value.length > 0;
  }
  inputTextEditor(props, field) {
    return (
      <InputText
        type="text"
        value={props.rowData.year}
        onChange={e => this.onEditorValueChange(props, e.target.value)}
      />
    );
  }
  inputNumberEditor(props, field) {
    return (
      <InputText
        type="number"
        value={props.rowData.year}
        onChange={e => this.onEditorValueChange(props, e.target.value)}
      />
    );
  }

  onEditorValueChange(props, value) {
    let updatedWorkPlaces = [...props.value];
    if (props.field == "CycleTime") {
      updatedWorkPlaces[props.rowIndex][props.field] = parseFloat(value);
    } else {
      updatedWorkPlaces[props.rowIndex][props.field] = value;
    }
    this.setState({ workplaces: updatedWorkPlaces });
  }

  actionTemplate = (rowData, column) => {
    return (
      <div>
        <Button
          type="button"
          icon="pi pi-pencil"
          className="p-button-warning"
          onClick={() => this.editWorkPlaces(rowData, column)}
          style={{ marginRight: ".5em" }}
        />
        <Button
          type="button"
          icon="pi pi-trash"
          className="p-button-danger"
          onClick={() => this.deleteItem(rowData, column)}
          style={{ marginRight: ".5em" }}
        />
      </div>
    );
  };

  deleteItem(row, column) {
    let _workplaces = this.state.workplaces;
    callApi(
      `workplace/${row.FactoryID}/${row.LineID}/${row.WorkPlaceID}/${
        row.ProductID
      }`,
      "DELETE",
      {}
    )
      .then(res => {
        if (res.status == 200) {
          this.findWorkPlaces();
          userHelper.showToastMessage("SUCCESS", "success");
        }
      })
      .catch(err => {
        userHelper.showErrorMessage("Failed");
      });
  }

  editWorkPlaces = (row, column) => {
    let _workplaces = this.state.workplaces;
    _workplaces.forEach(function(e, index, obj) {
      if (
        e.FactoryID == row.FactoryID &&
        e.LineID == row.LineID &&
        e.ProductID == row.ProductID &&
        e.WorkPlaceID == row.WorkPlaceID
      ) {
        _workplaces.CycleTime = row.CycleTime;
        _workplaces.WorkPlaceCode = row.WorkPlaceCode;
        // Delete object
        callApi(
          `workplace`,
          "PUT",
          {},
          {
            WorkPlaceID: row.WorkPlaceID,
            FactoryID: row.FactoryID,
            LineID: row.LineID,
            ProductID: row.ProductID,
            WorkPlaceCode: row.WorkPlaceCode,
            CycleTime: parseFloat(row.CycleTime),
            Disabled: false,
          }
        )
          .then(res => {
            if (res.status == 200) {
              userHelper.showToastMessage("SUCCESS", "success");
            }
          })
          .catch(err => {
            userHelper.showErrorMessage("Failed");
          });
      }
    });
  };

  saveWorkPlaces = () => {
    const { workplaces } = this.state;
    callApi(`workplaces`, "POST", {}, workplaces)
      .then(res => {
        if (res.status == 200) {
          this.findWorkPlaces();
          userHelper.showToastMessage("SUCCESS", "success");
        }
      })
      .catch(err => {
        userHelper.showErrorMessage("Failed");
      });
  };
  addNewWorkPlace = () => {
    this.setState({ isEdit: false });
    this.setState({ modalIsOpen: true });
  }
  updateNewWorkPlace = () => {
    this.setState({ isEdit: true });
    this.setState({ modalIsOpen: true });
  }
  findWorkPlaces = () => {
    const { factory, line, product } = this.state;
    if (factory && product && line) {
      callApi(
        `workplace/${factory.FactoryID}/${line.LineID}/${product.ProductID}`,
        "GET",
        {}
      )
        .then(res => {
          if (res.status == 200) {
            this.setState({
              workplaces: [],
            });
            if (res.data.Data == null) {
              let arrWorkPlace = [];
              for (let i = 1; i <= line.WorkPlaceQty; i++) {
                let _wPlace = {
                  WorkPlaceID: i,
                  FactoryID: factory.FactoryID,
                  LineID: line.LineID,
                  ProductID: product.ProductID,
                  ProductName: product.ProductName,
                  WorkPlaceCode: "N/A",
                  CycleTime: 0.0,
                  Disabled: false,
                };
                arrWorkPlace.push(_wPlace);
              }
              this.setState({ workplaces: arrWorkPlace });
            } else {
              let msg = res.data.Data;
              for (let i = 0; i < msg.length; i++) {
                msg[i].ProductName = product.ProductName;
              }
              this.setState({ workplaces: msg });
            }
            this.setState({ updateData: false });
          } else {
          }
        })
        .catch(error => {
          this.setState({ workplaces: [], updateData: false });
        });
    }
  };

  handleSetWorkPlace = value => {
    this.setState({
      workplace: value,
    });
  };

  handleChangeFactory = value => {
    this.setState({ factory: value, updateData: true });
  };

  handleChangeLine = value => {
    this.setState({ line: value, updateData: true });
  };

  handleChangeProduct = value => {
    this.setState({ product: value, updateData: true });
  };
  render() {
    const { factory, line, product, isEdit, modalIsOpen } = this.state;
    return (
      <Panel
        title="Line Master"
        titleFontsize="30px"
        className="p-0-m"
        titleClassName="m-3-m"
        collapseClassName="t-3-m"
      >
        <Row>
          <Col sm={6}>
            <Label>Factory</Label>
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
          <Col sm={6}>
            <Label>Model</Label>
            <SelectProduct
              product={product}
              handleChangeProduct={this.handleChangeProduct}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <Button
              type="button"
              label="Add"
              className="p-button-success"
              style={{ margin: "10px" }}
              onClick={() => this.addNewWorkPlace()}
            />
            <Button
              type="button"
              label="Enable"
              className="p-button-success"
              style={{ margin: "10px" }}
              onClick={() => this.updateNewWorkPlace()}
            />

            <Button
              type="button"
              label="Save"
              className="p-button-warning"
              style={{ margin: "10px" }}
              onClick={() => this.saveWorkPlaces()}
            />
          </Col>
        </Row>
        <div className="content-section implementation">
          <DataTable
            value={this.state.workplaces}
            paginator={true}
            editable={true}
            rows={10}
          >
            <Column
              field="ProductName"
              header="Model"
              style={{ height: "3.5em" }}
            />
            {/* <Column
              field="WorkPlaceID"
              header="Position"
              style={{ height: "3.5em" }}
            /> */}
            <Column
              field="WorkPlaceCode"
              header="Machine"
              editor={this.wokrPlaceCodeEditor}
              editorValidator={this.requiredValidator}
              style={{ height: "3.5em" }}
            />
            <Column
              field="CycleTime"
              header="CycleTime"
              editor={this.cycleTimeEditor}
              style={{ height: "3.5em" }}
            />
            <Column
              header="Action"
              body={this.actionTemplate}
              style={{ textAlign: "center", width: "8em" }}
            />
          </DataTable>
        </div>
        <NewWorkplace
          modalIsOpen={modalIsOpen}
          toggle={this.toggle}
          findWorkPlaces={this.findWorkPlaces}
          isEdit = {isEdit}
        />
      </Panel>
    );
  }
}
