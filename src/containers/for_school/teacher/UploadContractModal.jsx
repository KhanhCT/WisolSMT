import React, { Component } from "react";
import {
    Container,
    Row,
    Col,
    Form,
    ButtonToolbar,
    Button,
    FormGroup,
    Label,
    Input,
} from "reactstrap";
import { UploadIcon } from "mdi-react";
import moment from "moment";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import { ModalComponent, TableComponent } from "../../../components/bases";
import {
    validationHelper,
    callApi,
    utilHelper,
    errorHelper,
} from "../../../helpers";
import { apiConfigs } from "../../../constants";
import { ConfirmModalCustom } from "../../../components/common";

class UploadContractModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            confirmModalIsOpen: false,
            currContract: null,
        };
    }

    toggleConfirmModal = () => {
        this.setState({ confirmModalIsOpen: !this.state.confirmModalIsOpen });
    };

    handleChangeFileContract(e) {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({
                file: file,
            });
        };

        if (file) reader.readAsDataURL(file);
    }

    handleUploadContractFile = () => {
        let idForm = "upload-contract";
        // Validate form
        validationHelper.validateForm(idForm);
        let formValues = validationHelper.getFormData(idForm);
        if (formValues) {
            const { currTeacher, getListContract } = this.props;
            const { file } = this.state;
            let formData = new FormData();
            let currDate = moment(new Date()).format("YYYYMMDDHHmmss");

            if (currTeacher) {
                let convertFullName = utilHelper.convertVietnamese(
                    currTeacher.user.fullname
                );
                formData.append("teacher_id", currTeacher.id);
                formData.append("name", `${convertFullName}${currDate}`);
            }
            if (file) formData.append("directory", file);

            callApi(`for_school/contracts`, "POST", null, formData)
                .then(res => {
                    getListContract(currTeacher.id);
                })
                .catch(error => {
                    let processError = errorHelper.commonProcessError.bind(
                        this
                    );
                    processError(error, "TEACHER");
                });
        }
    };

    handleViewContract = directory => {
        let contractName = directory.split("/")[2];
        let url = `${apiConfigs.CMS_BASE_URL}${directory}`;
        utilHelper.downloadFileFromUrl(url, contractName);
    };

    handleDeleteContract = index => {
        this.setState(
            {
                currContract: this.props.listContract[index],
            },
            () => {
                this.setState({ confirmModalIsOpen: true });
            }
        );
    };

    handleConfirmDelete = () => {
        const { currContract } = this.state;
        const { currTeacher, getListContract } = this.props;
        if (currContract) {
            // Call API Delete Role
            callApi(`for_school/contracts`, "DELETE", null, {
                contract: currContract,
            })
                .then(res => {
                    getListContract(currTeacher.id);
                    this.toggleConfirmModal();
                })
                .catch(error => {
                    console.log(error);
                });
        }
    };

    render() {
        const { confirmModalIsOpen } = this.state;
        const { modalIsOpen, toggle, listContract } = this.props;
        let renderData = null,
            renderTableListContract = null;

        if (listContract && listContract.length > 0) {
            renderData = listContract.map((item, index) => {
                return (
                    <tr>
                        <td>{index + 1}</td>
                        <td>
                            {moment(item.created_at).format(
                                "DD/MM/YYYY HH:mm:ss"
                            )}
                        </td>
                        <td>{item.name}</td>
                        <td>
                            <ButtonToolbar>
                                <Button
                                    className="icon"
                                    outline
                                    onClick={() =>
                                        this.handleViewContract(item.directory)
                                    }
                                >
                                    <i className="fas fa-eye" />
                                </Button>
                                <Button
                                    className="icon"
                                    outline
                                    onClick={() =>
                                        this.handleDeleteContract(index)
                                    }
                                >
                                    <i className="fas fa-trash" />
                                </Button>
                            </ButtonToolbar>
                        </td>
                    </tr>
                );
            });
        } else {
            renderData = (
                <tr>
                    <td colSpan={4} style={{ textAlign: "center" }}>
                        Không có hợp đồng nào!
                    </td>
                </tr>
            );
        }

        renderTableListContract = (
            <TableComponent responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Thời gian upload</th>
                        <th>Tên hợp đồng</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>{renderData}</tbody>
            </TableComponent>
        );

        return (
            <div>
                <ModalComponent
                    color="primary"
                    class="modal-for-school modal-650"
                    title="Upload hợp đồng giáo viên"
                    header
                    toggle={toggle}
                    isOpen={modalIsOpen}
                    size="lg"
                >
                    <Container>
                        <Form id="upload-contract">
                            <Row>
                                <Col sm={6}>
                                    <FormGroup>
                                        <Label for="select_contract">
                                            Choose contract file
                                        </Label>
                                        <Input
                                            type="file"
                                            name="select_contract"
                                            id="select_contract"
                                            onChange={e =>
                                                this.handleChangeFileContract(e)
                                            }
                                        />
                                    </FormGroup>
                                </Col>
                                <Col sm={6}>
                                    <Button
                                        className="icon"
                                        color="success"
                                        onClick={this.handleUploadContractFile}
                                    >
                                        <UploadIcon />
                                        Upload
                                    </Button>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={12}>
                                    <h4>Danh sách hợp đồng</h4>
                                    {renderTableListContract}
                                </Col>
                            </Row>
                        </Form>
                        <ConfirmModalCustom
                            title="Xoá hợp đồng!"
                            message="Bạn có chắc chắn muốn xoá hợp đồng này không?"
                            modalIsOpen={confirmModalIsOpen}
                            toggle={this.toggleConfirmModal}
                            handleConfirmAction={this.handleConfirmDelete}
                        />
                    </Container>
                </ModalComponent>
            </div>
        );
    }
}

const tUploadContractModal = translate("common")(UploadContractModal);
const mapStateToProp = state => {
    const { forSchoolReducer } = state;
    return {
        currSchool: forSchoolReducer.currSchool,
        currDept: forSchoolReducer.currDept,
    };
};

export default connect(mapStateToProp)(tUploadContractModal);
