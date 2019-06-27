import React, { PureComponent } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    ButtonToolbar,
    Button,
} from "reactstrap";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import moment from "moment";
import { TableComponent } from "../../../components/bases";
import { callApi, utilHelper } from "../../../helpers";
import AddEditScheduleModal from "./AddEditScheduleModal";
import { ListCourseSelect } from "./ListCourseSelect";
import ListClassSelect from "./ListClassSelect";
import { ListRoomSelect } from "./ListRoomSelect";
import {
    LIST_RIGHT_FOR_SCHOOL,
    SCHOOL_ROLE_KEY_CHECK,
} from "../../../constants";
import { AuthorizarionSchoolComponent } from "../../../components/common";
import { Route } from "react-router-dom";
import objectLodash from "lodash/object";
import collectionLodash from "lodash/collection";
import randomColor from "randomcolor";

let arrThu = [1, 2, 3, 4, 5, 6, 0];

class ListSchedule extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            currSchedule: null,
            listSchedule: {},
            listClass: [],
            updateSchedule: false,
            selectedCourse: null,
            selectedClass: null,
            selectedRoom: null,
        };
    }

    componentDidMount() {
        this.getListClass();
        this.getListSchedule();
    }

    setSelectedCourse = selectedCourse => {
        this.setState(
            {
                selectedCourse: selectedCourse,
            },
            () => {
                if (this.state.selectedCourse) {
                    this.getListClass(this.state.selectedCourse.id);
                } else {
                    this.setState({ selectedClass: null, listClass: [] });
                }
            }
        );
    };

    setSelectedClass = selectedClass => {
        this.setState({
            selectedClass: this.state.listClass[selectedClass],
        });
    };

    setSelectedRoom = selectedRoom => {
        this.setState({
            selectedRoom: selectedRoom,
        });
    };

    getListClass = courseId => {
        // Call API get List Class
        callApi("for_school/classes/get-list-class-by-course-id", "GET", {
            course_id: courseId,
        })
            .then(res => {
                this.setState({
                    listClass: res.data.data.rows,
                });
            })
            .catch(error => {
                console.log(error);
            });
    };

    getListSchedule = () => {
        const { selectedRoom, selectedClass } = this.state;
        let roomId = null;
        let classId = null;
        if (selectedRoom) {
            roomId = selectedRoom.id;
        }
        if (selectedClass) {
            classId = selectedClass.id;
        }
        // Call API get list schedule
        callApi("for_school/schedules", "GET", {
            class_id: classId,
            room_id: roomId,
        })
            .then(res => {
                let arrScheduleTmp = res.data.data;
                if (!utilHelper.isEmpty(arrScheduleTmp)) {
                    this.setState({
                        listSchedule: arrScheduleTmp,
                    });
                } else {
                    this.setState({
                        listSchedule: {},
                    });
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    handleBack = () => {
        this.props.history.goBack();
    };

    toggle = () => {
        this.setState({ modalIsOpen: !this.state.modalIsOpen });
    };

    handleOpenAddSchedule = () => {
        this.setState(
            {
                currSchedule: null,
            },
            () => {
                this.setState({
                    modalIsOpen: true,
                    updateSchedule: false,
                });
            }
        );
    };

    handleOpenEditSchedule = item => {
        this.setState(
            {
                currSchedule: item,
            },
            () => {
                this.setState({
                    modalIsOpen: true,
                    updateSchedule: true,
                });
            }
        );
    };

    render() {
        const SCHEDULE_RIGHT = LIST_RIGHT_FOR_SCHOOL["DEPARTMENT"]["SCHEDULE"];
        const KEY_CHECK = SCHOOL_ROLE_KEY_CHECK["DEPARTMENT"];
        const {
            modalIsOpen,
            currSchedule,
            listSchedule,
            updateSchedule,
            selectedCourse,
            selectedClass,
            selectedRoom,
            listClass,
        } = this.state;

        let renderTableListSchedule = null;
        let scheduleData = {};

        let objClassId = {};

        Object.keys(listSchedule).map(thu => {
            let weekdayData = listSchedule[thu];
            weekdayData = collectionLodash.sortBy(weekdayData, ["start_time"]);
            scheduleData[thu] = weekdayData.map((item, index) => {
                let classId = item["class_id"];
                if (!objectLodash.hasIn(objClassId, classId)) {
                    objClassId[classId] = randomColor({
                        luminosity: "light",
                        hue: "random",
                    });
                }
                let startTime = `${moment().format("YYYY-MM-DD")} ${
                        item["start_time"]
                    }`,
                    endTime = `${moment().format("YYYY-MM-DD")} ${
                        item["end_time"]
                    }`;
                return (
                    <li className="mb-2 item-schedule" key={index}>
                        <a
                            href="javascript:;"
                            className={`badge`}
                            style={{ backgroundColor: objClassId[classId] }}
                            onClick={() => {
                                this.handleOpenEditSchedule(item);
                            }}
                        >
                            <p className="font-weight-bold">
                                {item["room"]["name"]}{" "}
                            </p>
                            <p className="font-weight-bold">
                                {item["class"]["name"]}{" "}
                            </p>
                            <p>
                                <strong className="text-success">
                                    {moment(startTime).format("HH:mm")}
                                </strong>{" "}
                                -->{" "}
                                <strong className="text-danger">
                                    {moment(endTime).format("HH:mm")}
                                </strong>
                            </p>
                        </a>
                    </li>
                );
            });
        });

        renderTableListSchedule = (
            <TableComponent responsive className="table-schedule">
                <thead>
                    <tr>
                        <th>Thứ hai</th>
                        <th>Thứ ba</th>
                        <th>Thứ tư</th>
                        <th>Thứ năm</th>
                        <th>Thứ sáu</th>
                        <th>Thứ bảy</th>
                        <th>Chủ nhật</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(listSchedule).length > 0 ? (
                        <tr>
                            <td>
                                <ul className="list-schedule">
                                    {scheduleData[1]}
                                </ul>
                            </td>
                            <td>
                                <ul className="list-schedule">
                                    {scheduleData[2]}
                                </ul>
                            </td>
                            <td>
                                <ul className="list-schedule">
                                    {scheduleData[3]}
                                </ul>
                            </td>
                            <td>
                                <ul className="list-schedule">
                                    {scheduleData[4]}
                                </ul>
                            </td>
                            <td>
                                <ul className="list-schedule">
                                    {scheduleData[5]}
                                </ul>
                            </td>
                            <td>
                                <ul className="list-schedule">
                                    {scheduleData[6]}
                                </ul>
                            </td>
                            <td>
                                <ul className="list-schedule">
                                    {scheduleData[0]}
                                </ul>
                            </td>
                        </tr>
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center">
                                Không có thời khóa biểu nào
                            </td>
                        </tr>
                    )}
                </tbody>
            </TableComponent>
        );

        return (
            <Container>
                <Row>
                    <Col md={12}>
                        <h3 className="page-title">
                            {" "}
                            <a className="hover-back" onClick={this.handleBack}>
                                <i className="fas fa-chevron-left" />{" "}
                                &nbsp;&nbsp; Thời khóa biểu{" "}
                            </a>
                        </h3>
                        <h3 className="page-subhead subhead">
                            Mô tả ngăn Thời khóa biểu
                        </h3>
                    </Col>
                </Row>
                <Row>
                    <Col md={12} lg={12} xl={12}>
                        <Card>
                            <CardBody>
                                <div className="card__title">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <ListCourseSelect
                                                setSelectedCourse={
                                                    this.setSelectedCourse
                                                }
                                                selectedCourse={selectedCourse}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <ListClassSelect
                                                listClass={listClass}
                                                setSelectedClass={
                                                    this.setSelectedClass
                                                }
                                                selectedClass={selectedClass}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <ListRoomSelect
                                                setSelectedRoom={
                                                    this.setSelectedRoom
                                                }
                                                selectedRoom={selectedRoom}
                                            />
                                        </div>

                                        <div className="col-md-12 mt-3">
                                            <ButtonToolbar>
                                                <Button
                                                    color="primary"
                                                    onClick={
                                                        this.getListSchedule
                                                    }
                                                >
                                                    <i className="fas fa-search" />{" "}
                                                    Tìm kiếm
                                                </Button>

                                                <Route
                                                    component={AuthorizarionSchoolComponent(
                                                        SCHEDULE_RIGHT["ADD"],
                                                        KEY_CHECK
                                                    )(() => (
                                                        <Button
                                                            color="success"
                                                            onClick={
                                                                this
                                                                    .handleOpenAddSchedule
                                                            }
                                                        >
                                                            <i className="fas fa-plus" />{" "}
                                                            Thêm mới
                                                        </Button>
                                                    ))}
                                                />
                                            </ButtonToolbar>
                                        </div>
                                    </div>
                                </div>

                                {renderTableListSchedule}

                                <AddEditScheduleModal
                                    currSchedule={currSchedule}
                                    modalIsOpen={modalIsOpen}
                                    toggle={this.toggle}
                                    getListSchedule={this.getListSchedule}
                                    updateSchedule={updateSchedule}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }
}

const tListSchedule = translate("common")(ListSchedule);
const mapStateToProp = state => {
    const { forSchoolReducer } = state;
    return {
        currSchool: forSchoolReducer.currSchool,
        currDept: forSchoolReducer.currDept,
    };
};

const wrap = connect(mapStateToProp)(tListSchedule);
export { wrap as ListSchedule };
