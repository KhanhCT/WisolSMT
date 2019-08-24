import React, { Component } from "react";
import { Container, Button, Input } from "reactstrap";
import { TableComponent } from "../../../components/bases";
import Panel from "../../../components/Panel";
import { callApi, userHelper } from "../../../helpers";

const LIST_STATUS = {
	"jig-shortage": "JIG SHORTAGE",
	"magazin-shortage": "MAGAZIN SHORTAGE",
	"plasma-waiting": "PLASMA WAITING",
	"pcb-shortage": "PCB SHORTAGE",
	ok: "OK",
	"waiting": "WAITING"
};

export class LineOrder extends Component {
	constructor(props) {
		super(props);
		this.state = {
			lineOrderData: [],
			selectedMessage: null,
		};
	}

	componentDidMount() {
		this.getData();
		setInterval(() => this.getData(), 1000 * 10);
	}

	getData = () => {
		callApi(`production-dtl/order-per-day`, "GET", {})
			.then(res => {
				if (res.status === 200)
					this.setState({
						lineOrderData: res.data.data ? res.data.data : [],
					});
			})
			.catch(error => {
				this.setState({ lineOrderData: [] });
			});
	};

	handleChangeMessage = e => {
		this.setState({
			selectedMessage: e.target.value,
		});
	};

	updateMessage = rowIndex => {
		const { lineOrderData, selectedMessage } = this.state;
		let rowData = lineOrderData[rowIndex];
		if (selectedMessage && rowIndex != null) {
			let updateData = {
				id: rowData['id'],
				working_date: rowData["working_date"],
				factory_id: rowData["factory_id"],
				line_id: rowData["line_id"],
				shift_id: rowData["shift_id"],
				message: selectedMessage,
				product_id: rowData["product_id"],
			};
			
			callApi(`production-dtl`, "PUT", {}, updateData)
				.then(res => {
					if (res.status == 200){
						this.getData();
						userHelper.showToastMessage(
							"UPDATE_MESSAGE_SUCCESS",
							"success"
						);
					}
				})
				.catch(error => {
					this.setState({ lineOrderData: [] });
				});
		}
	};

	render() {
		const { lineOrderData } = this.state;
		let renderHeaderDatas = (
			<tr>
				<th style={{ fontSize: "18px" , textAlign: "center"}}>Line</th>
				<th style={{ fontSize: "18px" , textAlign: "center"}}>Model</th>
				<th style={{ fontSize: "18px" , textAlign: "center"}}>Amount</th>
				<th style={{ fontSize: "18px" , textAlign: "center"}}>Status</th>
				<th style={{ fontSize: "18px", textAlign: "center" }}>Action</th>
			</tr>
		);
		let renderRowDatas = lineOrderData.map((rowData, index) => {
			let options = Object.keys(LIST_STATUS).map((messageKey, index) => {
				return (
					<option key={index} value={messageKey}>
						{LIST_STATUS[messageKey]}
					</option>
				);
			});
			let messageSelect = (
				<Input
					type="select"
					name="select-message"
					id="select-message"
					defaultValue={rowData.message}
					onChange={this.handleChangeMessage}
				>
					<option value={null} />
					{options}
				</Input>
			);
			let action = (
				<Button
					style={{marginTop: "15px"}}
					color="primary"
					onClick={() => this.updateMessage(index)}
				>
					Submit
				</Button>
			);
			return (
				<tr key={index}>
					<td style={{ fontSize: "18px" , textAlign: "center"}}>{rowData.line_name}</td>
					<td style={{ fontSize: "18px", textAlign: "center" }}>{rowData.product_name}</td>
					<td style={{ fontSize: "18px", textAlign: "center" }}>{rowData.amount}</td>
					<td style={{ fontSize: "18px", textAlign: "center" }}>{messageSelect}</td>
					<td style={{ fontSize: "18px", textAlign: "center" }}>{action}</td>
				</tr>
			);
		});
		return (
			<Container>
				<Panel
					title="SMT LINE ORDER"
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
							{renderHeaderDatas}
							{renderRowDatas}
							<tr>
								{lineOrderData.length === 0
									? "No data available"
									: null}
							</tr>
							<tr></tr>
						</tbody>
					</TableComponent>
				</Panel>
			</Container>
		);
	}
}
