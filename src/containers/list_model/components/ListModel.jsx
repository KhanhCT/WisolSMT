import React, { Component } from "react";
import { Container, Row, Col, Label, Button } from "reactstrap";
import { TableComponent } from "../../../components/bases";
import Panel from "../../../components/Panel";
import { CustomDatePicker } from "../../../components/common";
import {
	SelectFactory,
	SelectShift,
} from "../../model_register/components/search_components";
import { callApi } from "../../../helpers";
import moment from "moment";

const LIST_SHIFT = {
	DAY: {
		ShiftID: 1,
		ShiftName: "DAY",
	},
	NIGHT: {
		ShiftID: 2,
		ShiftName: "NIGHT",
	},
};

export class ListModel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			factory: null,
			shift: null,
			fromDate: moment(),
			toDate: moment(),
			listProduct: [],
			listProductionPlan: [],
			updateData: false,
		};
	}

	componentDidMount = () => {
		setInterval(() => this.getListProduct(), 1000 * 60);
	};

	componentDidUpdate(prevProps, prevState) {
		const { factory, shift, fromDate, toDate, updateData } = this.state;
		if (factory && shift && fromDate && toDate && updateData)
			this.getListProduct();
	}

	// Get list product
	getListProduct = () => {
		callApi("product", "GET", {})
			.then(res => {
				if (res.status === 200) {
					this.getListProductionPlan();
					this.setState({
						listProduct: res.data.Data ? res.data.Data : [],
					});
				}
			})
			.catch(error => {
				console.log(error);
				this.setState({ listProduct: [] });
			});
	};

	// Get list production plan
	getListProductionPlan = () => {
		let currDate = moment();
		let newShift = null;
		// change shift
		if (currDate.hours() === 8 && currDate.minutes() <= 10)
			newShift = LIST_SHIFT["DAY"];
		else if (currDate.hours() === 20 && currDate.minutes() <= 10)
			newShift = LIST_SHIFT["NIGHT"];
		if (newShift) {
			this.setState(
				{
					shift: newShift,
					fromDate: currDate,
					toDate: currDate,
				},
				() => {
					this.getData();
				}
			);
		} else this.getData();
	};

	getData = () => {
		const { factory, shift, fromDate, toDate } = this.state;
		if (factory && shift && fromDate && toDate) {
			let from = fromDate.format("YYYY-MM-DD"),
				to = toDate.format("YYYY-MM-DD");
			callApi(
				`productionplan/line/${factory.FactoryID}/${
					shift.ShiftID
				}/${from}/${to}`,
				"GET",
				{}
			)
				.then(res => {
					if (res.status == 200)
						this.setState({
							listProductionPlan: res.data.Data
								? res.data.Data
								: [],
						});
					this.setState({ updateData: false });
				})
				.catch(error => {
					console.log(error);
					this.setState({
						listProductionPlan: [],
						updateData: false,
					});
				});
		} else this.setState({ listProductionPlan: [] });
	};

	handleSetFromDate = date => {
		this.setState({
			fromDate: date,
			updateData: true,
		});
	};

	handleSetToDate = date => {
		this.setState({
			toDate: date,
			updateData: true,
		});
	};

	handleChangeFactory = value => {
		this.setState({ factory: value, updateData: true });
	};

	handleChangeShift = value => {
		this.setState({ shift: value, updateData: true });
	};

	render() {
		const {
			fromDate,
			toDate,
			factory,
			shift,
			listProduct,
			listProductionPlan,
		} = this.state;
		let renderRowHeaders = listProductionPlan.map(line => {
			return <th key={line.id}>{line.name}</th>;
		});
		let renderRowDatas = null;
		if (listProduct.length > 0 && listProductionPlan.length > 0)
			renderRowDatas = listProduct.map(product => {
				let rowLineData = listProductionPlan.map(line => {
					return (
						<td key={line.id}>
							<strong style={{ fontSize: "14px" }}>
								{line.body[product.ProductID]}
							</strong>
						</td>
					);
				});
				return (
					<tr key={product.ProductID}>
						<td>{product.ProductName}</td>
						{rowLineData}
					</tr>
				);
			});
		return (
			<Container>
				<Panel
					title="Production Monitoring"
					titleFontsize="30px"
					className="p-0-m"
					titleClassName="m-3-m"
					collapseClassName="t-3-m"
				>
					<Row>
						<Col sm={3}>
							<Label>Factory</Label>
							<SelectFactory
								factory={factory}
								handleChangeFactory={this.handleChangeFactory}
							/>
						</Col>
						<Col sm={3}>
							<Label>Shift</Label>
							<SelectShift
								factory={factory}
								shift={shift}
								handleChangeShift={this.handleChangeShift}
							/>
						</Col>
						<Col sm={3}>
							<Label>From Date</Label>
							<CustomDatePicker
								placeholderText="From Date"
								name="from_date"
								value={fromDate}
								showTimeSelect={false}
								setSelectedDate={this.handleSetFromDate}
							/>
						</Col>
						<Col sm={3}>
							<Label>To Date</Label>
							<CustomDatePicker
								placeholderText="To Date"
								name="to_date"
								value={toDate}
								showTimeSelect={false}
								setSelectedDate={this.handleSetToDate}
							/>
						</Col>
					</Row>
					<Row>
						<Col sm={3}>
							<Button
								color="primary"
								onClick={this.getListProduct}
							>
								Search
							</Button>
						</Col>
					</Row>
					<TableComponent
						className="table--bordered table--head-accent"
						id="production-monitoring-table"
						responsive={true}
					>
						<tbody>
							<tr>
								<th>Product</th>
								{renderRowHeaders}
							</tr>
							{renderRowDatas}
						</tbody>
					</TableComponent>
				</Panel>
			</Container>
		);
	}
}
