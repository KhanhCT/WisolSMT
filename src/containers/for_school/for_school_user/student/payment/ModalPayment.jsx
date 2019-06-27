import React, { Component } from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import {
    Row,
    Col,
    Input,
    Button,
    InputGroup,
    InputGroupAddon,
    Badge,
} from "reactstrap";
import { Route } from "react-router-dom";
import { ModalCustom } from "../../../../../components/common";
import { callApi, utilHelper, userHelper } from "../../../../../helpers";
import { ModalPaymentRightContent } from "./ModalPaymentRightContent";
import SelectStudent from "./SelectStudent";

class ModalPayment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listStudyMethod: [],
            listStudentPayment: [],
            selectedStudyMethod: null,
            numberHoursPayment: 0,
            student: null,
        };
    }

    componentDidMount = () => {
        this.getListStudyMethod();
    };

    getListStudyMethod = () => {
        const { currDept } = this.props;
        // Call API get list study_method
        callApi("for_school/study_methods", "GET", {
            department_id: currDept.id,
            limit: 1000,
        })
            .then(res => {
                let newLstStudyMethod = res.data.data.rows.map(studyMethod => {
                    studyMethod["price"] = utilHelper.convertStringToJSON(
                        studyMethod["price"]
                    );
                    return studyMethod;
                });
                this.setState({
                    listStudyMethod: newLstStudyMethod,
                    selectedStudyMethod: newLstStudyMethod[0],
                });
            })
            .catch(error => {
                console.log(error);
            });
    };

    componentDidUpdate = (prevProps, prevState) => {
        if (!prevProps.infoStudent) {
            if (this.props.infoStudent) {
                let userStorage = userHelper.getUserFromStorage();
                this.setState({
                    listStudentPayment: [
                        ...this.state.listStudentPayment,
                        {
                            id: this.props.infoStudent["id"],
                            fullname: userStorage["fullname"],
                            gender: userStorage["gender"],
                            avatar: userStorage["avatar"],
                        },
                    ],
                });
            }
        } else if (prevProps.infoStudent.id != this.props.infoStudent.id) {
            let userStorage = userHelper.getUserFromStorage();
            this.setState({
                listStudentPayment: [
                    ...this.state.listStudentPayment,
                    {
                        id: this.props.infoStudent["id"],
                        fullname: userStorage["fullname"],
                        gender: userStorage["gender"],
                        avatar: userStorage["avatar"],
                    },
                ],
            });
        }
    };

    handleChangeStudyMethod = event => {
        this.setState({
            selectedStudyMethod: this.state.listStudyMethod[event.target.value],
        });
    };

    onChangeNumberHours = event => {
        this.setState({ numberHoursPayment: event.target.value });
    };

    handleChangeStudent = value => {
        this.setState({
            student: value,
        });
    };

    handleAddStudentPayment = () => {
        const { student, listStudentPayment } = this.state;
        if (student) {
            if (
                listStudentPayment.findIndex(o => {
                    return o.id == student.id;
                }) == -1
            ) {
                this.setState(
                    {
                        listStudentPayment: [
                            ...listStudentPayment,
                            {
                                id: student.id,
                                fullname: student.user["fullname"],
                                gender: student.user["gender"],
                                avatar: student.user["avatar"],
                            },
                        ],
                    },
                    () => {
                        this.setState({ student: null });
                    }
                );
            } else {
                alert("Học viên đã được thêm vào danh sách thanh toán");
            }
        } else {
            alert("Vui lòng chọn học viên");
        }
    };

    handleDeleteStudentPayment = idx => {
        let arrayStudentPaymentSplice = [...this.state.listStudentPayment];
        arrayStudentPaymentSplice.splice(idx, 1);
        this.setState({
            listStudentPayment: arrayStudentPaymentSplice,
        });
    };

    render() {
        const { toggle, modalIsOpen, infoStudent } = this.props;
        const {
            listStudyMethod,
            listStudentPayment,
            selectedStudyMethod,
            numberHoursPayment,
            student,
        } = this.state;
        let renderStudyMethod = null,
            renderStudentPayment = null;

        if (listStudyMethod && listStudyMethod.length > 0) {
            renderStudyMethod = listStudyMethod.map((item, index) => {
                return (
                    <li key={index}>
                        <label>
                            <input
                                type="radio"
                                value={index}
                                checked={selectedStudyMethod.id == item.id}
                                onChange={this.handleChangeStudyMethod}
                            />
                            {item["name"]}
                        </label>
                    </li>
                );
            });
        }

        if (listStudentPayment && listStudentPayment.length > 0) {
            renderStudentPayment = listStudentPayment.map((item, index) => {
                return (
                    <a href="javascript:;" key={index}>
                        <div
                            className="p-2"
                            style={{
                                display: "inline-block",
                            }}
                        >
                            <div className="circle-text position-relative">
                                <span className="center rounded-circle" />
                                {infoStudent &&
                                infoStudent["id"] != item["id"] ? (
                                    <a
                                        href="javascript:;"
                                        onClick={() => {
                                            this.handleDeleteStudentPayment(
                                                index
                                            );
                                        }}
                                    >
                                        <i className="fal fa-times-circle del-student" />
                                    </a>
                                ) : (
                                    ""
                                )}

                                <img
                                    src={utilHelper.getAvatarUser(
                                        item["avatar"],
                                        item["gender"]
                                    )}
                                    alt={item["fullname"]}
                                    className="rounded-circle"
                                />
                            </div>
                            <p className="personal-role mt-2 text-center text-capitalize">
                                {infoStudent &&
                                infoStudent["id"] != item["id"] ? (
                                    item["fullname"]
                                ) : (
                                    <Badge
                                        color="success"
                                        className="badge-it-me"
                                    >
                                        It me
                                    </Badge>
                                )}
                            </p>
                        </div>
                    </a>
                );
            });
        }

        return (
            <ModalCustom
                color="secondary"
                title="Thanh toán trực tuyến"
                btn="Default"
                modalIsOpen={modalIsOpen}
                btnOkHanlder={toggle}
                toggleHeader={false}
                toggle={toggle}
                size="lg"
            >
                <div>
                    <div
                        className="bg-white box-shadow-1 rounded p-3"
                        style={{ textAlign: "justify" }}
                    >
                        <div className="bg-warning p-2 rounded mb-3 text-center">
                            Vui lòng không tắt trình duyệt khi tiến hành thanh
                            toán. Xin cảm ơn!
                        </div>
                        <Row>
                            <Col md="7" sm="12">
                                <form id="payment-info">
                                    <div>
                                        <h5 className="mb-2 ml-1 font-weight-bold">
                                            Chọn hình thức học
                                        </h5>
                                        <div>
                                            <ul className="student-method-radio">
                                                {renderStudyMethod}
                                            </ul>
                                        </div>
                                        <h5 className="mb-2 ml-1 font-weight-bold">
                                            Nhập số giờ thanh toán
                                        </h5>
                                        <Input
                                            type="number"
                                            min={1}
                                            max={100}
                                            name="hours_payment"
                                            placeholder="Số giờ thanh toán"
                                            onChange={this.onChangeNumberHours}
                                        />
                                        <h5 className="mt-3 mb-2 ml-1 font-weight-bold">
                                            Chọn thêm học viên cần thanh toán
                                        </h5>
                                        <div className="list-student-payment">
                                            <div className="input-append">
                                                <InputGroup>
                                                    <Route
                                                        render={props => (
                                                            <SelectStudent
                                                                {...props}
                                                                currStudent={
                                                                    student
                                                                }
                                                                handleChangeStudent={
                                                                    this
                                                                        .handleChangeStudent
                                                                }
                                                            />
                                                        )}
                                                    />
                                                    <InputGroupAddon addonType="append">
                                                        <Button
                                                            type="button"
                                                            outline
                                                            style={{
                                                                padding:
                                                                    "7px 25px",
                                                            }}
                                                            onClick={
                                                                this
                                                                    .handleAddStudentPayment
                                                            }
                                                        >
                                                            <i className="fas fa-plus" />
                                                        </Button>
                                                    </InputGroupAddon>
                                                </InputGroup>
                                            </div>
                                            <div
                                                className="slider-student-payment overflow-center text-left"
                                                id="style-scroll"
                                            >
                                                {renderStudentPayment}
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </Col>
                            <Col md="5" sm="12">
                                <ModalPaymentRightContent
                                    selectedStudyMethod={selectedStudyMethod}
                                    numberHoursPayment={numberHoursPayment}
                                    listStudentPayment={listStudentPayment}
                                />
                            </Col>
                        </Row>
                    </div>
                </div>
            </ModalCustom>
        );
    }
}

const mapStateToProps = state => {
    const { forSchoolReducer } = state;
    return {
        currDept: forSchoolReducer.currDept,
        infoStudent: forSchoolReducer.infoStudent,
    };
};

const tModalPayment = connect(mapStateToProps)(
    translate("common")(ModalPayment)
);
export { tModalPayment as ModalPayment };
