import React, { Component } from "react";
import { ModalCustom, CustomDatePicker } from "../../../components/common";
import { Container, Row, Col, Label, FormGroup, Input } from "reactstrap";
import {
  SelectFactory,
  SelectProduct,
  SelectLine,
} from "../../model_register/components/search_components";
import { userHelper, callApi } from "../../../helpers";

export default class AddEditWorkplaceConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      factory: null,
      line: null,
      product: null,
      machine: 0,
    };
    this.handleChangeMachine = this.handleChangeMachine.bind(this);
    this.handleChangeProduct = this.handleChangeProduct.bind(this);
    this.handleChangeFactory = this.handleChangeFactory.bind(this);
    this.handleChangeLine = this.handleChangeLine.bind(this);
  }

  handleSetDate = date => {
    this.setState({
      date: date,
    });
  };

  handleChangeFactory = value => {
    this.setState({ factory: value, updateData: true });
  };

  handleChangeLine = value => {
    this.setState({ line: value, updateData: true });
  };
  handleChangeProduct = value => {
    this.setState({ product: value, updateData: true });
  };
  enableWorkPlace = () =>{
    const {factory, line, product, machine} = this.state
    if(this.props.isEdit){
      if(factory != null && line != null && product != null && machine){
        callApi("workplace/enable", "PUT", {  
        }, {
          FactoryID: factory.FactoryID,
          LineID: line.LineID,
          ProductID: product.ProductID,
          WorkPlaceID: parseInt(machine),     
        }
        ).then(res =>{
          if (res.status == 200) {
            this.props.toggle()
            this.props.findWorkPlaces()
            userHelper.showToastMessage("SUCCESS", "success");
          }
        }).catch(err => {
          userHelper.showErrorMessage("Failed")
        });
      }
    }else{
      if(factory != null && line != null && product != null && machine){
        callApi("workplace", "POST", {  
        }, {
          FactoryID: factory.FactoryID,
          LineID: line.LineID,
          ProductID: product.ProductID,
          WorkPlaceID: parseInt(machine), 
          WorkPlaceCode: 'N/A',
          CycleTime: 0.0,
          Disabled:false,
        }
        ).then(res =>{
          if (res.status == 200) {
            this.props.toggle()
            this.props.findWorkPlaces()
            userHelper.showToastMessage("SUCCESS", "success");
          }
        }).catch(err => {
          userHelper.showErrorMessage("Failed")
        });
      }
    }

  }
  handleChangeMachine(event) {
    this.setState({machine: event.target.value});
  }
  render() {
    const { factory, line, product, machine } = this.state;
    const { modalIsOpen, toggle, isEdit} = this.props;
    console.log(isEdit)
    return (
      <ModalCustom
        color="secondary"
        title="Enable WorkPlace"
        btn="Default"
        modalIsOpen={modalIsOpen}
        cancel={true}
        btnOk={isEdit ? "Enable" : "Add"}
        btnOkHanlder={this.enableWorkPlace}
        toggleHeader={true}
        toggle={toggle}
        size="lg"
      >
        <Container>
          <Row>
            <Col sm="4">
              <Label for="factory">
                <strong>Factory</strong>
              </Label>
              <SelectFactory
                factory={factory}
                handleChangeFactory={this.handleChangeFactory}
              />
            </Col>
            <Col sm={4} hidden>
              <Label>Line</Label>
              <SelectLine
                factory={factory}
                line={line}
                handleChangeLine={this.handleChangeLine}
              />
            </Col>
            <Col sm={4}>
              <Label>Model</Label>
              <SelectProduct
                product={product}
                handleChangeProduct={this.handleChangeProduct}
              />
            </Col>
            <Col sm={4}>
              <Label>Machine</Label>
              <Input type="number" name="WorkPlaceID" value={this.state.machine} onChange={this.handleChangeMachine} />
            </Col>
          </Row>
        </Container>
      </ModalCustom>
    );
  }
}
