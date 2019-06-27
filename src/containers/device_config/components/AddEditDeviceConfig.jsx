import React, { Component } from "react";
import { ModalCustom, CustomDatePicker } from "../../../components/common";
import { Container, Row, Col, Label, Input } from "reactstrap";
import { userHelper, callApi } from "../../../helpers";
import { TimerThreeIcon } from "mdi-react";



export default class AddEditDeviceConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productName: '',
      barcode: '',
    };
    this.handleProductNameChange = this.handleProductNameChange.bind(this);
    this.handleBarcodeChange = this.handleBarcodeChange.bind(this);
  }
  componentDidUpdate(prevProps, prevState) {
    let newProduct = this.props.selectedProduct,
    oldProduct = prevProps.selectedProduct
    if((newProduct && !oldProduct) || ( oldProduct && newProduct && newProduct.ProductName != oldProduct.ProductName && oldProduct.barcode !=newProduct.Barcode)){
      this.setState({productName: newProduct.ProductName, barcode: newProduct.Barcode})
    }
  }

  saveProduct = () =>{
    const {productName, barcode} = this.state
    const {selectedProduct} = this.props
    if(selectedProduct == null){
      callApi("product", "POST", {},
      {
        ProductName: productName,
        Barcode: barcode,
        UnitID: 1,
        Disabled: false,
      }).then(res => {
        if(res.status == 200){
          this.props.toggle()
          this.props.getListProducts()
          this.setState({productName: '', barcode: ''})
          userHelper.showToastMessage("SUCCESS", "success");
        }
      }).catch(err =>{
        userHelper.showErrorMessage("Failed")

      })
    }else{
      callApi("product", "PUT", {},
      {
        ProductID: selectedProduct.ProductID,
        ProductName: productName,
        Barcode: barcode,
        UnitID: 1,
        Disabled: false,
      }).then(res => {
        if(res.status == 200){
          this.props.toggle()
          this.props.getListProducts()
          this.setState({productName: '', barcode: ''})
          userHelper.showToastMessage("SUCCESS", "success");
        }
      }).catch(err =>{
        userHelper.showErrorMessage("Failed")
      })
    }
  }
  handleProductNameChange(event) {
    this.setState({productName: event.target.value});
  }
  handleBarcodeChange(event) {
    this.setState({barcode: event.target.value});
  }

  render() {
    const { modalIsOpen, toggle, selectedProduct } = this.props;
    return (
      <ModalCustom
        color="secondary"
        title="Product"
        btn="Default"
        modalIsOpen={modalIsOpen}
        cancel={true}
        btnOk={selectedProduct ? "Edit" : "New"}
        btnOkHanlder={this.saveProduct}
        toggleHeader={true}
        toggle={toggle}
        size="lg">
        <Container>
          <Row>
            <Col sm="12">
              <Label for="product_name">
                <strong>Model</strong>
              </Label>
              <Input type="text" name="product_name" value={this.state.productName} onChange={this.handleProductNameChange} />
            </Col>
          </Row>
        </Container>
      </ModalCustom>
    );
  }
}
