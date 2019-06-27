import React, { Component } from "react";
import Select from "react-select";
import { callApi } from "../../../../helpers";

export class SelectShift extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSearchable: true,
      listShift: [],
    };
  }

  componentDidMount() {
    if (this.props.factory) this.getListShiftByFactory();
  }

  componentDidUpdate(prevProps, prevState) {
    let prevFactory = prevProps.factory,
      newFactory = this.props.factory;
    if (
      (!prevFactory && newFactory) ||
      (prevFactory &&
        newFactory &&
        prevFactory.FactoryID != newFactory.FactoryID)
    )
      this.getListShiftByFactory();
  }

  // Get list shift by factory
  getListShiftByFactory = () => {
    const { factory } = this.props;
    if (factory) {
      callApi(`shift/id/${factory.FactoryID}`, "GET", {})
        .then(res => {
          if (res.status == 200)
            this.setState({
              listShift: res.data.Data ? res.data.Data : [],
            });
          if (res.data.Data && res.data.Data.length > 0)
            this.props.handleChangeShift(res.data.Data[0]);
          else this.props.handleChangeShift(null);
        })
        .catch(error => {
          console.log(error);
          this.setState({ listShift: [] });
        });
    } else this.setState({ listShift: [], shift: null });
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
    const { isSearchable, listShift } = this.state;
    const AsyncComponent = this.state.creatable
      ? Select.AsyncCreatable
      : Select.Async;
    const { handleChangeShift, shift, async } = this.props;
    let renderSelectShift = async ? (
      <AsyncComponent
        className="custom-react-select"
        value={shift}
        onChange={handleChangeShift}
        valueKey="id"
        labelKey="info"
        loadOptions={this.findUsers}
        placeholder="Find Shift"
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
        options={listShift}
        placeholder="Select Shift"
        onChange={handleChangeShift}
        value={shift}
        valueKey="ShiftID"
        labelKey="ShiftName"
      />
    );
    return renderSelectShift;
  }
}
