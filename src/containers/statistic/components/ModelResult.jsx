import React, { Component } from 'react'
import { Container, Row, Col, Label, Button } from "reactstrap";
import { TableComponent } from "../../../components/bases";
import Panel from "../../../components/Panel";
import { CustomDatePicker } from "../../../components/common";
import { callApi } from "../../../helpers";
import moment from "moment";

const columnAttrs = [
    {
        key: "product_name",
        name: "Model"
    },
    {
        key: "status",
        name: "Status"
    },
    {
        key: "remain_qty",
        name: "Remain"
    },
    {
        key: "exported_qty",
        name: "Exported"
    }
]

export class ModelResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modelResultData: [],
            date: moment()
        }
    }

    componentDidMount() {
        this.getData();
        setInterval(() => this.getData(), 1000 * 60);
    }

    getData = () => {
        const { date } = this.state;
        if (date) {
            callApi(
                `product-dtl/${date.format('YYYY-MM-DD')}`,
                "GET",
                {}
            )
                .then(res => {
                    console.log(res.status)

                    if (res.status == 200)
                    {
                        let data = res.data.data ? res.data.data : [];
                        data.map(product =>{
                            if(product.remain_qty > 24){
                                product.status= "AVAILABLE";
                                product.color = "DCD800";
                            } else {
                                product.status = "WAITING";
                                product.color = "8E1E20";
                            }
                        })
                        this.setState({
                            modelResultData: data,
                        });
                    }
                })
                .catch(error => {
                    console.log(error);
                    this.setState({ modelResultData: [] });
                });
        } else this.setState({ modelResultData: [] });
    }

    handleSetDate = date => {
        this.setState({
            date: date,
        });
    };

    render() {
        const { date, modelResultData } = this.state;
        let renderRowDatas = columnAttrs.map((cA, index) => {
            let renderColData = modelResultData.map(colData => {
                if (colData.key == "line_name") {
                    return <th key={colData.modelId} style={{ fontSize: "18px", backgroundColor: "#ddd" }}>{colData[cA.name]}</th>
                } else {
                    let bgColor = "#fff";
                    if (cA.key == "status") bgColor = `#${colData.color}`
                    return <td
                        key={colData.modelId}
                        style={{
                            backgroundColor: bgColor,
                            color: "#000000",
                            textAlign: "center",
                        }}
                    >
                        <strong style={{ fontSize: "18px" }}>
                            {colData[cA.key]}
                        </strong>
                    </td>
                }
            })

            return <tr key={index}>
                <th style={{ fontSize: "18px" }}>{cA.name}</th>
                {renderColData}
            </tr>
        })
        return (
            <Container>
                <Row>
                    <Col sm={3}>
                        <Label style={{ fontSize: "18px" }}>View Date</Label>
                        <CustomDatePicker
                            placeholderText="View Date"
                            name="date"
                            value={date}
                            showTimeSelect={false}
                            setSelectedDate={this.handleSetDate}
                        />
                    </Col>
                    <Col sm={3}>
                        <Button
                            color="primary"
                            style={{ marginTop: "10px", fontSize: "18px" }}
                            onClick={this.getData}
                        >
                            Search
                        </Button>
                    </Col>
                </Row>
                <Panel
                    title="MODEL RESULT"
                    titleFontsize="30px"
                    style={{ fontSize: "30px" }}
                    className="p-0-m"
                    titleClassName="m-3-m"
                    collapseClassName="t-3-m"
                >
                    <TableComponent
                        className="table--bordered table--head-accent table-monitoring"
                        responsive={true}
                    >
                        <tbody>
                            {renderRowDatas}
                        </tbody>
                    </TableComponent>
                </Panel>
            </Container>
        )
    }
}
