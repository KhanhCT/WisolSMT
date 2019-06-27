import React, { Component } from 'react'
import { Container, Row, Col, Label, Button } from "reactstrap";
import { TableComponent } from "../../../components/bases";
import Panel from "../../../components/Panel";

const columnAttrs = [
    {
        key: "model_name",
        name: "Model"
    },
    {
        key: "status",
        name: "Status"
    },
    {
        key: "remain",
        name: "Remain"
    },
    {
        key: "exported",
        name: "Exported"
    }
]

const sampleData = [
    {
        "modelId": 1,
        "model_name": "LE70",
        "status": "AVAILABLE",
        "color": "DCD800",
        "remain": 30,
        "exported": 15
    },
    {
        "modelId": 2, "model_name": "LE71",
        "status": "WAITING",
        "color": "8E1E20",
        "remain": 0,
        "exported": 0
    }
]

export class ModelResult extends Component {
    render() {
        let renderRowDatas = columnAttrs.map((cA, index) => {
            let renderColData = sampleData.map(colData => {
                if (colData.key == "line_name") {
                    return <th key={colData.lineId} style={{ fontSize: "18px", backgroundColor: "#ddd" }}>{colData[cA.name]}</th>
                } else {
                    let bgColor = "#fff";
                    if (cA.key == "status") bgColor = `#${colData.color}`
                    return <td
                        key={colData.lineId}
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
