import React, { Component } from "react";
import Select from "react-select";
import { callApi } from "../../../../helpers";

export class SelectLine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSearchable: true,
      listLine: [],
    };
  }

  componentDidMount() {
    if (this.props.factory) this.getListLineByFactory();
  }

  componentDidUpdate(prevProps, prevState) {
    let prevFactory = prevProps.factory,
      newFactory = this.props.factory;
    if (
      (!prevFactory && newFactory) ||
      (prevFactory &&
        newFactory &&
        prevFactory.FactoryID != newFactory.FactoryID)
    ) {
      this.getListLineByFactory();
    }
  }

  // Get list line by factory
  getListLineByFactory = () => {
    const { factory } = this.props;
    if (factory) {
      callApi(`productionline/${factory.FactoryID}`, "GET", {})
        .then(res => {
          if (res.status == 200)
            this.setState({
              listLine: res.data.Data ? res.data.Data : [],
            });
          if (res.data.Data && res.data.Data.length > 0)
            this.props.handleChangeLine(res.data.Data[0]);
          else this.props.handleChangeLine(null);
        })
        .catch(error => {
          console.log(error);
          this.setState({ listLine: [] });
        });
    } else this.setState({ listLine: [], line: null });
  };

  findUsers = input => {
    if (!input) {
      return Promise.resolve({ options: [] });
    }
    let findOpt = {
      q: input,
    };

    return callApi("users/find-users", "GET", findOpt)
      .then(res => {
        let options = res.data.data.rows;
        options = options.map(item => {
          return {
            ...item,
            info: `${item.fullname} - Email: ${item.email} - Phone: ${
              item.phone
            }`,
          };
        });
        return { options: options };
      })
      .catch(error => {
        return Promise.resolve({ options: [] });
      });
  };

  render() {
    const { isSearchable, listLine } = this.state;
    const AsyncComponent = this.state.creatable
      ? Select.AsyncCreatable
      : Select.Async;
    const { handleChangeLine, line, async } = this.props;
    let renderSelectLine = async ? (
      <AsyncComponent
        className="custom-react-select"
        value={line}
        onChange={handleChangeLine}
        valueKey="id"
        labelKey="info"
        loadOptions={this.findUsers}
        placeholder="Find Line"
      />
    ) : (
      <Select
        className="basic-single"
        classNamePrefix="select"
        // defaultValue={factory ? factory : listFactory[0]}
        // isDisabled={isDisabled}
        // isLoading={isLoading}
        // isClearable={isClearable}
        // isRtl={isRtl}
        isSearchable={isSearchable}
        name="color"
        options={listLine}
        placeholder="Select Line"
        onChange={handleChangeLine}
        value={line}
        valueKey="LineID"
        labelKey="LineCode"
      />
    );
    return renderSelectLine;
  }
}
