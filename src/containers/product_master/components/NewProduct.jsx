import React, { Component } from "react";
import { ModalCustom } from "../../../components/common";
import { Container, Row, Col, Label, Input } from "reactstrap";
import { userHelper, callApi } from "../../../helpers";

export default class NewProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
    };
    this.handleProductNameChange = this.handleProductNameChange.bind(this);
    this.handleBarcodeChange = this.handleBarcodeChange.bind(this);
  }
  componentDidUpdate(prevProps, prevState) {
    let newProduct = this.props.selectedProduct,
    oldProduct = prevProps.selectedProduct
    if((newProduct && !oldProduct) || ( oldProduct && newProduct && newProduct.name != oldProduct.name)){
      this.setState({name: newProduct.name})
    }
  }

  saveProduct = () =>{
    const {name} = this.state
    const {selectedProduct} = this.props
    if(selectedProduct == null){
      callApi("product", "POST", {},
      {
        name: name,
        is_active: true,
      }).then(res => {
        if(res.status == 200){
          this.props.toggle()
          this.props.getListProducts()
          this.setState({name: ''})
          userHelper.showToastMessage("SUCCESS", "success");
        }
      }).catch(err =>{
        userHelper.showErrorMessage("Failed")

      })
    }else{
      callApi("product/" + selectedProduct.id, "PUT", {},
      {
        id: selectedProduct.id,
        name: name
      }).then(res => {
        if(res.status == 200){
          this.props.toggle()
          this.props.getListProducts()
          this.setState({name: ''})
          userHelper.showToastMessage("SUCCESS", "success");
        }
      }).catch(err =>{
        userHelper.showErrorMessage("Failed")
      })
    }
  }
  handleProductNameChange(event) {
    this.setState({name: event.target.value});
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
              <Input type="text" name="product_name" value={this.state.name} onChange={this.handleProductNameChange} />
            </Col>
          </Row>
        </Container>
      </ModalCustom>
    );
  }
}
