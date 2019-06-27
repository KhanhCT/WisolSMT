import React, { Component } from "react";
import { Container, Row, Col, Form, ButtonToolbar, Button } from "reactstrap";
import moment from "moment";
import { ModalComponent, TableComponent } from "../../../../components/bases";
import { apiConfigs } from "../../../../constants";
import { utilHelper } from "../../../../helpers";

export default class ContractModal extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleViewContract = directory => {
        let contractName = directory.split("/")[2];
        let url = `${apiConfigs.CMS_BASE_URL}${directory}`;
        utilHelper.downloadFileFromUrl(url, contractName);
    };

    render() {
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
                        <th>Tên file</th>
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
                    title="Danh sách hợp đồng"
                    header
                    toggle={toggle}
                    isOpen={modalIsOpen}
                    size="lg"
                >
                    <Container>
                        <Form id="upload-contract">
                            <Row>
                                <Col sm={12}>{renderTableListContract}</Col>
                            </Row>
                            <Row>
                                <Col md={12} lg={12} xl={12}>
                                    <ButtonToolbar className="form__button-toolbar">
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                toggle();
                                            }}
                                        >
                                            Hủy bỏ
                                        </Button>
                                    </ButtonToolbar>
                                </Col>
                            </Row>
                        </Form>
                    </Container>
                </ModalComponent>
            </div>
        );
    }
}
