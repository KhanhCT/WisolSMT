import React, { Component } from "react";
import Select from "react-select";
import { callApi } from "../../../helpers";

export class SelectWorkPlace extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSearchable: true,
      listWorkPlace: [],
    };
  }

  componentDidMount() {
    if (this.props.line) this.calListWorkPlaceQty();
  }

  componentDidUpdate(prevProps, prevState) {
    let prevLine = prevProps.line,
      newLine = this.props.line;
    if (
      (!prevLine && newLine) ||
      (prevLine && newLine && prevLine.LineID != newLine.LineID)
    )
      this.calListWorkPlaceQty();
  }

  // Calculate work place
  calListWorkPlaceQty = () => {
    const { line } = this.props;
    if (line) {
      this.setState({
        listWorkPlace: Array.from({ length: line.WorkPlaceQty }, (v, k) => {
          return { id: k + 1, value: k + 1 };
        }),
        workPlace: line.WorkPlaceQty > 0 ? { id: 1, value: 1 } : null,
      });
      if (line.WorkPlaceQty > 0)
        this.props.handleChangeWorkPlace({ id: 1, value: 1 });
      else this.props.handleChangeWorkPlace(null);
    } else {
      this.setState({ listWorkPlace: [] });
      this.props.handleChangeWorkPlace(null);
    }
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
    const { isSearchable, listWorkPlace } = this.state;
    const AsyncComponent = this.state.creatable
      ? Select.AsyncCreatable
      : Select.Async;
    const { handleChangeWorkPlace, workPlace, async } = this.props;
    let renderSelectWorkplace = async ? (
      <AsyncComponent
        className="custom-react-select"
        value={workPlace}
        onChange={handleChangeWorkPlace}
        valueKey="id"
        labelKey="info"
        loadOptions={this.findUsers}
        placeholder="Find Worker"
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
        options={listWorkPlace}
        placeholder="Select Work Place"
        onChange={handleChangeWorkPlace}
        value={workPlace}
        valueKey="id"
        labelKey="value"
      />
    );
    return renderSelectWorkplace;
  }
}
