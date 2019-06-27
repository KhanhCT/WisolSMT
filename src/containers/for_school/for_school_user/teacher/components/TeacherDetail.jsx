import React, { Component } from "react";
import { translate } from "react-i18next";
import { apiConfigs } from "../../../../../constants";
import { callApi } from "../../../../../helpers";
import ContractModal from "./ContractModal";

class TeacherDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listContract: [],
            modalContractIsOpen: false,
        };
    }

    toggleContract = () => {
        this.setState({ modalContractIsOpen: !this.state.modalContractIsOpen });
    };

    getListContract = id => {
        // Call API get list contract
        callApi("for_school/contracts", "GET", {
            teacher_id: id,
        })
            .then(res => {
                this.setState({
                    listContract: res.data.data.rows,
                });
            })
            .catch(error => {
                console.log(error);
            });
    };

    handleOpenUploadContract = () => {
        const { user } = this.props;
        this.getListContract(user.teacher.id);
        this.setState({
            modalContractIsOpen: true,
        });
    };

    render() {
        const { user, t } = this.props;
        const { listContract, modalContractIsOpen } = this.state;

        const teacherTranKey = `for_school:TEACHER.common`;
        let defaultAvatar =
            "https://sunlimetech.com/portfolio/boot4menu/assets/imgs/team/img_01.png";
        return (
            <div className="personal-info text-center">
                <div className="position-relative mb-2">
                    <img
                        className="img-fluid rounded-circle"
                        style={{
                            width: "100px",
                            height: "100px",
                        }}
                        src={
                            user
                                ? user.avatar
                                    ? `${apiConfigs.BASE_IMAGE_URL}${
                                          user.avatar
                                      }`
                                    : defaultAvatar
                                : defaultAvatar
                        }
                        alt="card image"
                    />
                    <span
                        className="center rounded-circle"
                        style={{
                            width: "100px",
                            height: "100px",
                            border: "1px solid rgba(0,0,0,0.15)",
                        }}
                    />
                </div>
                <h4 className="personal-name font-weight-bold">
                    {user ? user.fullname : ""}
                </h4>
                <p className="personal-role mt-0">
                    {t(`${teacherTranKey}.teacher`)}
                </p>
                <div className="d-flex justify-content-around mt-3">
                    <div>
                        <a href="javascript:;" className="text-dark">
                            <div
                                className="position-relative"
                                style={{
                                    height: "50px",
                                }}
                            >
                                <div
                                    className="bg-lightgrey center rounded-circle"
                                    style={{
                                        width: "42px",
                                        height: "42px",
                                    }}
                                >
                                    <i className="fal fa-bell center fa-2x" />
                                </div>
                                <span className="bagde-noti bg-red">3</span>
                            </div>
                            <span style={{ fontSize: "12px" }}>
                                {t(`${teacherTranKey}.noty`)}
                            </span>
                        </a>
                    </div>
                    <div>
                        <a href="javascript:;" className="text-dark">
                            <div
                                className="position-relative"
                                style={{
                                    height: "50px",
                                }}
                            >
                                <div
                                    className="bg-lightgrey center rounded-circle"
                                    style={{
                                        width: "42px",
                                        height: "42px",
                                    }}
                                >
                                    <i className="fal fa-star center fa-2x" />
                                </div>
                            </div>
                            <span style={{ fontSize: "12px" }}>
                                {t(`${teacherTranKey}.rating`)}
                            </span>
                        </a>
                    </div>
                    <div>
                        <a
                            href="javascript:;"
                            onClick={this.handleOpenUploadContract}
                            className="text-dark"
                        >
                            <div
                                className="position-relative"
                                style={{
                                    height: "50px",
                                }}
                            >
                                <div
                                    className="bg-lightgrey center rounded-circle"
                                    style={{
                                        width: "42px",
                                        height: "42px",
                                    }}
                                >
                                    <i className="fal fa-list-alt center fa-2x" />
                                </div>
                            </div>
                            <span style={{ fontSize: "12px" }}>
                                {t(`${teacherTranKey}.contract`)}
                            </span>
                        </a>
                    </div>
                </div>

                <ContractModal
                    listContract={listContract}
                    getListContract={this.getListContract}
                    modalIsOpen={modalContractIsOpen}
                    toggle={this.toggleContract}
                />
            </div>
        );
    }
}

const tTeacherDetail = translate(["common", "for_school"])(TeacherDetail);
export default tTeacherDetail;
