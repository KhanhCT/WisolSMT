import React, { Component } from "react";
import Select from "react-select";
import { callApi } from "../../../helpers";

export class SelectFactory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSearchable: true,
      listFactory: [],
    };
  }

  componentDidMount() {
    this.getListFactory();
  }

  // Get list Factory
  getListFactory = () => {
    const { factory } = this.props;
    callApi("factory", "GET", {})
      .then(res => {
        if (res.status == 200)
          this.setState({
            listFactory: res.data.Data ? res.data.Data : [],
          });
        if (res.data.Data && res.data.Data.length)
          !factory
            ? this.props.handleChangeFactory(res.data.Data[0])
            : this.props.handleChangeFactory(factory);
        else this.props.handleChangeFactory(null);
      })
      .catch(error => {
        console.log(error);
        this.setState({ listFactory: [], factory: null });
      });
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
    const { isSearchable, listFactory } = this.state;
    const AsyncComponent = this.state.creatable
      ? Select.AsyncCreatable
      : Select.Async;
    const { handleChangeFactory, factory, async } = this.props;
    let renderSelectFactory = async ? (
      <AsyncComponent
        className="custom-react-select"
        value={factory}
        onChange={handleChangeFactory}
        valueKey="id"
        labelKey="info"
        loadOptions={this.findUsers}
        placeholder="Find Factory"
      />
    ) : (
      <Select
        className="basic-single"
        classNamePrefix="select"
        isSearchable={isSearchable}
        name="color"
        options={listFactory}
        placeholder="Select Factory"
        onChange={handleChangeFactory}
        value={factory}
        valueKey="FactoryID"
        labelKey="FactoryName"
      />
    );
    return renderSelectFactory;
  }
}
