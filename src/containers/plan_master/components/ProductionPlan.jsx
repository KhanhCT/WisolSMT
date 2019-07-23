import React, { Component } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Panel from "../../../components/Panel";
import { Button } from "primereact/button";
import NewProdPlan from "./NewProdPlan";
import { userHelper, callApi } from "../../../helpers";
import moment from "moment";
import { SelectProduct } from "../../common";

export class ProductionPlan extends Component {
  constructor() {
    super();
    this.state = {
      listProductionPlan: [],
      productionPlan: null,
      modalIsOpen: false,
    };
    this.getListProductionPlan();
  }

  getListProductionPlan = () => {
    callApi("productionplan", "GET", {})
      .then(res => {
        if (res.status == 200)
          if (res.data.Data) {
            res.data.Data.map(productionPlan => {
              productionPlan.WorkingDate = moment(
                productionPlan.WorkingDate
              ).format("DD/MM/YYYY");
              productionPlan.Product = {
                ProductID: productionPlan.ProductID,
                ProductName: productionPlan.ProductName,
              };
              return productionPlan;
            });
            this.setState({ listProductionPlan: res.data.Data });
          }
      })
      .catch(error => {
        console.log(error);
        this.setState({ listProductionPlan: [] });
      });
  };

  toggle = () => {
    this.setState({ modalIsOpen: !this.state.modalIsOpen });
  };

  addProductionPlan = () => {
    this.setState(
      {
        productionPlan: null,
      },
      () => {
        this.setState({ modalIsOpen: true });
      }
    );
  };

  editRowData = (rowData, column) => {
    let editProductionPlan = {
      WorkingDate: moment(rowData.WorkingDate, "DD/MM/YYYY"),
      factory: {
        FactoryID: rowData.FactoryID,
        FactoryName: rowData.FactoryName,
      },
      line: {
        FactoryID: rowData.FactoryID,
        LineID: rowData.LineID,
        LineCode: rowData.LineCode,
      },
      shift: {
        FactoryID: rowData.FactoryID,
        ShiftID: rowData.ShiftID,
        ShiftName: rowData.ShiftName,
      },
      workplace: { id: rowData.WorkPlaceID, value: rowData.WorkPlaceID },
      product: {
        ProductID: rowData.ProductID,
        ProductName: rowData.ProductName,
      },
    };
    this.setState({ productionPlan: editProductionPlan }, () => {
      this.setState({ modalIsOpen: true });
    });
  };

  actionTemplate = (rowData, column) => {
    return (
      <div>
        <Button
          type="button"
          icon="pi pi-pencil"
          className="p-button-warning"
          onClick={() => this.editPlan(rowData, column)}
        />
        <Button
          type="button"
          icon="pi pi-trash"
          className="p-button-danger"
          onClick={() => this.deletePlan(rowData, column)}
        />
      </div>
    );
  };
  deletePlan = (row, column) => {
    let workingDate = moment(row.WorkingDate, "DD/MM/YYYY").format("YYYY-MM-DD")
    callApi(`productionplan/${workingDate}/${row.FactoryID}/${row.LineID}/${row.ShiftID}/${row.WorkPlaceID}/${row.ProductID}`, "DELETE", {}, {})
    .then(res => {
      console.log(res.status)
      if (res.status == 200) {
        //this.props.toggle();
        this.getListProductionPlan();
        userHelper.showToastMessage("SUCCESS", "success");
      }
    })
    .catch(error => {
      userHelper.showErrorMessage("Delete Failed");
    });

  }
  editPlan = (row, column) => {
    callApi("productionplan/model", "PUT", {}, {
      WorkingDate: moment(row.WorkingDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
      FactoryID: row.FactoryID,
      LineID: row.LineID,
      ShiftID: row.ShiftID,
      WorkPlaceID: row.WorkPlaceID,
      ProductID: row.ProductID,
    })
      .then(res => {
        console.log(res.status)
        if (res.status == 200) {
          //this.props.toggle();
          this.getListProductionPlan();
          userHelper.showToastMessage("SUCCESS", "success");
        }
      })
      .catch(error => {
        userHelper.showErrorMessage("Update Failed");
      });
  };
  onEditorValueChange(product, props) {
    let updatedPlans = [...props.value];
    updatedPlans[props.rowIndex][props.field] = product.ProductName;
    updatedPlans[props.rowIndex]["ProductID"] = product.ProductID;
    updatedPlans[props.rowIndex]["Product"] = product;
    this.setState({ listProductionPlan: updatedPlans });
  }

  productEditor = props => {
    return (
      <SelectProduct
        product={this.state.listProductionPlan[props.rowIndex]["Product"]}
        handleChangeProduct={value => {
          this.onEditorValueChange(value, props);
        }}
      />
    );
  };

  render() {
    const { modalIsOpen, listProductionPlan, productionPlan } = this.state;
    return (
      <Panel
        title="Production Plans"
        titleFontsize="30px"
        className="p-0-m"
        titleClassName="m-3-m"
        collapseClassName="t-3-m"
      >
        <div className="content-section implementation">
          <Button
            type="button"
            icon="pi pi-pencil"
            className="p-button-primary"
            label="Add"
            style={{ marginBottom: ".5em" }}
            onClick={this.addProductionPlan}
          />
          <DataTable value={listProductionPlan} paginator={true} rows={10}>
            <Column field="WorkingDate" header="Date" />
            <Column field="FactoryName" header="Factory" />
            <Column field="ShiftName" header="Shift" />
            <Column field="Code" header="Machine" />
            <Column
              field="ProductName"
              header="Model"
              editor={this.productEditor}
              style={{ height: "5.5em" }}
            />
            <Column
              header="Action"
              body={this.actionTemplate}
              style={{ textAlign: "center", width: "8em" }}
            />
          </DataTable>
        </div>
        <NewProdPlan
          modalIsOpen={modalIsOpen}
          toggle={this.toggle}
          productionPlan={productionPlan}
          getListProductionPlan={this.getListProductionPlan}
        />
      </Panel>
    );
  }
}
