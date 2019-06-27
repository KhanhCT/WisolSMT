import React, { Component } from "react";
import { translate } from "react-i18next";
import { ModalCustom } from "../../../components/common";
import { TableComponent } from "../../../components/common";
import moment from "moment";

class ListCodModal extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { modalIsOpen, toggle, lstCod, t } = this.props;
        let renderData = lstCod.map((cod, index) => {
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{cod.system_cod}</td>
                    <td>
                        {cod.active ? (
                            <i
                                class="far fa-check-circle"
                                style={{ color: "green" }}
                            />
                        ) : (
                            <i
                                class="far fa-times-circle"
                                style={{ color: "red" }}
                            />
                        )}
                    </td>
                    <td>
                        {cod.active_date
                            ? moment(cod.active_date).format("DD/MM/YYYY")
                            : ""}
                    </td>
                    <td>
                        {cod.expire_date
                            ? moment(cod.expire_date).format("DD/MM/YYYY")
                            : ""}
                    </td>
                </tr>
            );
        });
        return (
            <ModalCustom
                color="primary"
                title={t("pay.list_code")}
                btn="Default"
                modalIsOpen={modalIsOpen}
                btnOkHanlder={toggle}
                toggleHeader={true}
                toggle={toggle}
                size="lg"
            >
                <TableComponent
                    responsive
                    hover
                    striped
                    className="table--bordered "
                >
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>CODE</th>
                            <th>{t("common.active")}</th>
                            <th>{t("common.start_time")}</th>
                            <th>{t("common.end_time")}</th>
                        </tr>
                    </thead>
                    <tbody>{renderData}</tbody>
                </TableComponent>
            </ModalCustom>
        );
    }
}

export default translate("common")(ListCodModal);
