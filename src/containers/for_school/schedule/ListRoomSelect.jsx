import React, { Component } from "react";
import { Input } from "reactstrap";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { callApi } from "../../../helpers";

class ListRoomSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listRoom: [],
        };
    }
    componentDidMount = () => {
        this.getListRoom();
    };

    getListRoom = () => {
        const { currDept } = this.props;

        // Call API get List Room
        callApi("for_school/rooms", "GET", {
            limit: 1000,
            department_id: currDept.id,
        })
            .then(res => {
                this.setState({
                    listRoom: res.data.data.rows,
                });
            })
            .catch(error => {
                console.log(error);
            });
    };

    handleChangeRoom = e => {
        const { setSelectedRoom } = this.props;
        let roomIndex = e.target.value;
        let selectedRoom = this.state.listRoom[roomIndex];
        setSelectedRoom(selectedRoom);
    };

    render() {
        const { listRoom } = this.state;
        const { selectedRoom, name } = this.props;
        let defautlRoomIndex = null;
        let renderListRoom = null;
        if (listRoom.length > 0) {
            renderListRoom = listRoom.map((room, index) => {
                if (selectedRoom)
                    if (selectedRoom.id == room.id) defautlRoomIndex = index;
                return (
                    <option key={index} value={index}>
                        {room.name}
                    </option>
                );
            });
        }
        return (
            <Input
                type="select"
                name={name}
                value={defautlRoomIndex}
                onChange={this.handleChangeRoom}
            >
                <option value="">-Chọn phòng học-</option>
                {renderListRoom}
            </Input>
        );
    }
}

const tListRoomSelect = translate("common")(ListRoomSelect);
const mapStateToProp = state => {
    const { forSchoolReducer } = state;
    return {
        currDept: forSchoolReducer.currDept,
    };
};

const wrap = connect(mapStateToProp)(tListRoomSelect);
export { wrap as ListRoomSelect };
