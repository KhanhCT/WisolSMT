import React, { Component } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Panel from "../../../components/Panel";
import { Button } from "primereact/button";
import NewProduct from "./NewProduct";
import { callApi, userHelper } from "../../../helpers";

export class ProductMaster extends Component {
  constructor() {
    super();
    this.state = {
      products: [],
      modalIsOpen: false,
      selectedProduct: null,
    };
    this.getListProducts();
  }

  toggle = () => {
    this.setState({ modalIsOpen: !this.state.modalIsOpen });
  };

  componentDidUpdate(prevProps, prevState) {
    let prevProducts = prevProps.products,
      newProducts = this.props.products;
    if (!prevProducts && newProducts) {
      this.getListProducts();
    }
  }

  getListProducts = () => {
    callApi("product/getLstModel", "GET", {})
      .then(res => {
        if (res.status === 200){
          this.setState({ products: res.data.data });
        }
      })
      .catch(error => {
        this.setState({ listFactorySchedule: [] });
      });
  };

  editRowData = (rowData, column) => {
    this.setState({ modalIsOpen: true });
    let _selectedProduct = {
      product_name: rowData.product_name,
      barcode: rowData.barcode,
      id: rowData.id,
    };
    this.setState({ selectedProduct: _selectedProduct });
  };

  deleteRowData = (rowData, column) => {
    callApi(`product/id/${rowData.id}`, "DELETE", {})
      .then(res => {
        if (res.status === 200) {
          this.getListProducts();
          userHelper.showToastMessage("SUCCESS", "success");
        }
      })
      .catch(err => {
        userHelper.showErrorMessage("Failed");
      });
  };

  addProduct = () => {
    this.setState({ selectedProduct: null });
    this.setState({ modalIsOpen: true });
  };

  actionTemplate = (rowData, column) => {
    return (
      <div>
        <Button
          type="button"
          icon="pi pi-pencil"
          className="p-button-warning"
          onClick={() => this.editRowData(rowData, column)}
        />
        <Button
          type="button"
          icon="pi pi-trash"
          className="p-button-danger"
          onClick={() => this.deleteRowData(rowData, column)}
        />
      </div>
    );
  };

  render() {
    const { modalIsOpen, products, selectedProduct } = this.state;
    return (
      <Panel
        title="Product Master"
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
            onClick={this.addProduct}
          />
          <DataTable value={products} paginator={true} rows={10}>
            <Column field="id" header="ID" />
            <Column field="product_name" header="Model" />
            <Column
              header="Action"
              body={this.actionTemplate}
              style={{ textAlign: "center", width: "8em" }}
            />
          </DataTable>
        </div>
        <NewProduct
          modalIsOpen={modalIsOpen}
          toggle={this.toggle}
          getListProducts={this.getListProducts}
          selectedProduct={selectedProduct}
        />
      </Panel>
    );
  }
}
