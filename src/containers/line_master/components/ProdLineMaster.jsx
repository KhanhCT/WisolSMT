import React, { Component } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Panel from "../../../components/Panel";
import { Button } from "primereact/button";
import NewProdLine from "./NewProdLine";
import { callApi, userHelper } from "../../../helpers";

export class ProdLineMaster extends Component {
  constructor() {
    super();
    this.state = {
      lines: [],
      modalIsOpen: false,
      selectedLine: null,
    };
    this.getListLines();
  }

  toggle = () => {
    this.setState({ modalIsOpen: !this.state.modalIsOpen });
  };

  componentDidUpdate(prevProps, prevState) {
    let prevLines = prevProps.lines,
      newLines = this.props.lines;
    if (!prevLines && newLines) {
      this.getListLines();
    }
  }

  getListLines = () => {
    callApi("prod-line/1", "GET", {})
      .then(res => {
        if (res.status === 200){
          this.setState({ lines: res.data.data });
        }
      })
      .catch(error => {
      });
  };

  editRowData = (rowData, column) => {
    this.setState({ modalIsOpen: true });
    let _selectedLine = {
      name: rowData.name,
      id: rowData.id,
      factory_id: rowData.factory_id,
    };
    this.setState({ selectedLine: _selectedLine });
  };

  deleteRowData = (rowData, column) => {
    callApi(`prod-line/${rowData.id}`, "DELETE", {})
      .then(res => {
        if (res.status === 200) {
          this.getListLines();
          userHelper.showToastMessage("SUCCESS", "success");
        }
      })
      .catch(err => {
        userHelper.showErrorMessage("Failed");
      });
  };

  addLine = () => {
    this.setState({ selectedLine: null });
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
    const { modalIsOpen, lines, selectedLine } = this.state;
    return (
      <Panel
        title="Production Line Master"
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
            onClick={this.addLine}
          />
          <DataTable value={lines} paginator={true} rows={10}>
            <Column field="id" header="ID" />
            <Column field="name" header="Line Name" />
            <Column
              header="Action"
              body={this.actionTemplate}
              style={{ textAlign: "center", width: "8em" }}
            />
          </DataTable>
        </div>
        <NewProdLine
          modalIsOpen={modalIsOpen}
          toggle={this.toggle}
          getListLines={this.getListLines}
          selectedLine={selectedLine}
        />
      </Panel>
    );
  }
}
