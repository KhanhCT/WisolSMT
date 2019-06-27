import React, { PureComponent } from "react";
import Panel from "../../../../components/Panel";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { translate } from "react-i18next";
import { userHelper, callApi } from "../../../../helpers";
import moment from "moment";

class UserOnlineAnalytics extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            userOnlineTimeData: [],
        };
    }

    componentDidMount = () => {
        this.getUserOnlineTimeData();
    };

    getUserOnlineTimeData = () => {
        // Get user from storage
        let userStorage = userHelper.getUserFromStorage();
        if (userStorage) {
            // Get start_week and end_week data
            let startWeek = moment()
                    .subtract(10, "days")
                    .format("YYYY-MM-DD"),
                endWeek = moment().format("YYYY-MM-DD");
            callApi("user_online_time", "GET", {
                user_id: userStorage.user_id,
                start_date: startWeek,
                end_date: endWeek,
            })
                .then(res => {
                    let data = res.data.data.rows;
                    data = data.map(item => {
                        item["date"] = moment(item["date"]).format("DD/MM");
                        return item;
                    });
                    this.setState({ userOnlineTimeData: res.data.data.rows });
                })
                .catch(error => {
                    console.log(error);
                });
        }
    };

    render() {
        const { t } = this.props;
        const { userOnlineTimeData } = this.state;

        return (
            <div className="child-titlePage">
                <ResponsiveContainer height={250} className="dashboard__area">
                    <AreaChart
                        data={userOnlineTimeData}
                        margin={{ top: 20, left: -15, bottom: 20 }}
                    >
                        <XAxis dataKey="date" tickLine={false} />
                        <YAxis
                            tickFormatter={value => `${value}m`}
                            tickLine={false}
                        />
                        <Tooltip />
                        <Legend />
                        <CartesianGrid />
                        {/* <Area
                            name="Site A"
                            type="monotone"
                            dataKey="a"
                            fill="#4ce1b6"
                            stroke="#4ce1b6"
                            fillOpacity={0.2}
                        /> */}
                        <Area
                            name="User Online Time"
                            type="monotone"
                            dataKey="total_minute"
                            fill="#4ce1b640"
                            stroke="#4ce1b6"
                            fillOpacity={0.2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        );
    }
}

export default translate("common")(UserOnlineAnalytics);
