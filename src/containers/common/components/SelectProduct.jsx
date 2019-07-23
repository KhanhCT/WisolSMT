import React, { Component } from "react";
import Select from "react-select";
import { callApi } from "../../../helpers";

export class SelectProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSearchable: true,
      listProduct: [],
    };
  }

  componentDidMount() {
    this.getListProduct();
  }

  // Get list Product
  getListProduct = () => {
    const { product } = this.props;
    callApi("product", "GET", {})
      .then(res => {
        if (res.status == 200)
          this.setState({
            listProduct: res.data.Data ? res.data.Data : [],
          });
        if (res.data.Data && res.data.Data.length > 0) {
          !product
            ? this.props.handleChangeProduct(res.data.Data[0])
            : this.props.handleChangeProduct(product);
        } else this.props.handleChangeProduct(null);
      })
      .catch(error => {
        console.log(error);
        this.setState({ listProduct: [], product: null });
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
    const { isSearchable, listProduct } = this.state;
    const AsyncComponent = this.state.creatable
      ? Select.AsyncCreatable
      : Select.Async;
    const { handleChangeProduct, product, async } = this.props;
    let renderSelectProduct = async ? (
      <AsyncComponent
        className="custom-react-select"
        value={product}
        onChange={handleChangeProduct}
        valueKey="id"
        labelKey="info"
        loadOptions={this.findUsers}
        placeholder="Find Model"
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
        options={listProduct}
        placeholder="Select Product"
        onChange={handleChangeProduct}
        value={product}
        valueKey="ProductID"
        labelKey="ProductName"
      />
    );
    return renderSelectProduct;
  }
}
