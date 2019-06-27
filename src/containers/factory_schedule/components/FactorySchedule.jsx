import React, { Component } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import Panel from "../../../components/Panel";
import { Button } from "primereact/button";
import AddEditSchedule from "./AddEditSchedule";
import { callApi } from "../../../helpers";
import {
  SelectFactory,
  SelectLine,
  SelectShift,
} from "../../model_register/components/search_components";

export class FactorySchedule extends Component {
  constructor() {
    super();
    this.state = {
      listFactorySchedule: [],
      factorySchedule: null,
      modalIsOpen: false,
    };
    this.getListFactorySchedule();
  }

  componentDidUpdate() {
    if (this.state.listFactorySchedule == null) this.getListFactorySchedule();
  }

  getListFactorySchedule = () => {
    callApi("schedule", "GET", {})
      .then(res => {
        if (res.status == 200)
          if (res.data.Data) {
            let _listFactorySchedule = res.data.Data;
            for (let i = 0; i < _listFactorySchedule.length; i++) {
              let tmp = _listFactorySchedule[i].StartTime;
              _listFactorySchedule[i].StartTimeLb =
                ("0" + Math.floor(tmp / 60)).slice(-2) +
                ":" +
                ("0" + (tmp % 60)).slice(-2);
              tmp = _listFactorySchedule[i].StopTime;
              _listFactorySchedule[i].StopTimeLb =
                ("0" + Math.floor(tmp / 60)).slice(-2) +
                ":" +
                ("0" + (tmp % 60)).slice(-2);
            }
            this.setState({ listFactorySchedule: _listFactorySchedule });
          }
      })
      .catch(error => {
        console.log(error);
        this.setState({ listFactorySchedule: [] });
      });
  };

  toggle = () => {
    this.setState({ modalIsOpen: !this.state.modalIsOpen });
  };

  addFactorySchedule = () => {
    this.setState(
      {
        factorySchedule: null,
      },
      () => {
        this.setState({ modalIsOpen: true });
      }
    );
  };
  deleteRowData = (rowData, column) => {
    callApi(`schedule/id/${rowData.ID}`, "DELETE", {})
      .then(res => {
        if (res.status == 200) {
          this.getListFactorySchedule();
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  editRowData = (rowData, column) => {
    let editFactorySchedule = {
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
      ID: rowData.ID,
      startTime: rowData.StartTime,
      stopTime: rowData.StopTime,
      type: rowData.Type,
      description: rowData.Description,
    };
    this.setState({ factorySchedule: editFactorySchedule }, () => {
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
          onClick={() => this.editRowData(rowData, column)}
          style={{ marginRight: ".5em" }}
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
    const { modalIsOpen, listFactorySchedule, factorySchedule } = this.state;
    return (
      <Panel
        title="Scheduler Master"
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
            onClick={this.addFactorySchedule}
          />
          <DataTable value={listFactorySchedule} paginator={true} rows={10}>
            <Column field="FactoryName" header="Factory" />
            <Column field="LineCode" header="Line" />
            <Column field="Description" header="Description" />
            <Column field="StartTimeLb" header="Start Time" />
            <Column field="StopTimeLb" header="Stop Time" />
            <Column
              header="Action"
              body={this.actionTemplate}
              style={{ textAlign: "center", width: "8em" }}
            />
          </DataTable>
        </div>
        <AddEditSchedule
          modalIsOpen={modalIsOpen}
          toggle={this.toggle}
          factorySchedule={factorySchedule}
          getListFactorySchedule={this.getListFactorySchedule}
        />
      </Panel>
    );
  }
}
