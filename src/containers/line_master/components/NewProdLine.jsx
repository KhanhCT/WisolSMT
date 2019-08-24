import React, { Component } from "react";
import { ModalCustom } from "../../../components/common";
import { Container, Row, Col, Label, Input } from "reactstrap";
import { userHelper, callApi } from "../../../helpers";

export default class NewProdLine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      factory_id: 1
    };
    this.handleLineNameChange = this.handleLineNameChange.bind(this);
    this.handleBarcodeChange = this.handleBarcodeChange.bind(this);
  }
  componentDidUpdate(prevProps, prevState) {
    let newLine = this.props.selectedLine,
    oldLine = prevProps.selectedLine
    if((newLine && !oldLine) || ( oldLine && newLine && newLine.name != oldLine.name)){
      this.setState({name: newLine.name})
    }
  }

  saveLine = () =>{
    const {name, factory_id} = this.state
    const {selectedLine} = this.props
    if(selectedLine == null){
      callApi("prod-line", "POST", {},
      {
        name: name,
        factory_id: factory_id, 
        is_active: true,
      }).then(res => {
        if(res.status == 200){
          this.props.toggle()
          this.props.getListLines()
          this.setState({name: ''})
          userHelper.showToastMessage("SUCCESS", "success");
        }
      }).catch(err =>{
        userHelper.showErrorMessage("Failed")
      })
    }else{
      callApi("prod-line/" + selectedLine.id, "PUT", {},
      {
        id: selectedLine.id,
        name: name
      }).then(res => {
        if(res.status == 200){
          this.props.toggle()
          this.props.getListLines()
          this.setState({name: ''})
          userHelper.showToastMessage("SUCCESS", "success");
        }
      }).catch(err =>{
        userHelper.showErrorMessage("Failed")
      })
    }
  }
  handleLineNameChange(event) {
    this.setState({name: event.target.value});
  }
  handleBarcodeChange(event) {
    this.setState({barcode: event.target.value});
  }

  render() {
    const { modalIsOpen, toggle, name, selectedLine } = this.props;
    return (
      <ModalCustom
        color="secondary"
        title="Production Line"
        btn="Default"
        modalIsOpen={modalIsOpen}
        cancel={true}
        btnOk={selectedLine ? "Edit" : "New"}
        btnOkHanlder={this.saveLine}
        toggleHeader={true}
        toggle={toggle}
        size="lg">
        <Container>
          <Row>
            <Col sm="12">
              <Label for="line_name">
                <strong>Line Name</strong>
              </Label>
              <Input type="text" name="line_name" value={this.state.name} onChange={this.handleLineNameChange} />
            </Col>
          </Row>
        </Container>
      </ModalCustom>
    );
  }
}
