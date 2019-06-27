import React, { Component } from "react";
import { translate } from "react-i18next";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Input } from "reactstrap";

class ModalBuyCardLeftContent extends Component {
    render() {
        const {
            onChooseCard,
            cardChoosed,
            onChangeInput,
            numberCard,
            onSelectTab,
            payMethodIndex,
            fullname,
            phone,
            address,
            t,
        } = this.props;
        return (
            <div>
                <form id="payment-info">
                    <h5 className="mb-2 ml-1 font-weight-bold">
                        {t("pay.select_member")}:
                    </h5>
                    <div className="img_check">
                        <div
                            className={`img_check_list rounded ${
                                cardChoosed === "silver" ? "active" : ""
                            }`}
                            onClick={() => onChooseCard("silver")}
                        >
                            <label className="bg-silver rounded-circle">
                                <i className="fal fa-crown text-white fa-lg" />
                            </label>
                            <span>
                                <i className="fas fa-check-circle" />
                            </span>
                            <div>{t("common.silver")}</div>
                        </div>
                        <div
                            className={`img_check_list rounded ${
                                cardChoosed === "gold" ? "active" : ""
                            }`}
                            onClick={() => onChooseCard("gold")}
                        >
                            <label className="bg-gold rounded-circle">
                                <i className="fal fa-crown text-white fa-lg" />
                            </label>
                            <span>
                                <i className="fas fa-check-circle" />
                            </span>
                            <div>{t("common.gold")}</div>
                        </div>
                        <div
                            className={`img_check_list rounded ${
                                cardChoosed === "platinum" ? "active" : ""
                            }`}
                            onClick={() => onChooseCard("platinum")}
                        >
                            <label className="bg-platinum rounded-circle">
                                <i className="fal fa-crown text-white fa-lg" />
                            </label>
                            <span>
                                <i className="fas fa-check-circle" />
                            </span>
                            <div>{t("common.platinum")}</div>
                        </div>
                    </div>
                    <h5 className="mt-2 mb-2 ml-1 font-weight-bold">
                        {t("pay.enter_num")}:
                    </h5>
                    <Input
                        type="number"
                        name="numberCard"
                        min="0"
                        max="100"
                        defaultValue={numberCard}
                        onChange={onChangeInput}
                    />
                    <h5 className="mt-2 mb-2 ml-1 font-weight-bold">
                        {t("pay.form")}:
                    </h5>

                    <Tabs onSelect={onSelectTab} selectedIndex={payMethodIndex}>
                        <TabList className="border-0 pl-0">
                            <Tab
                                className="p-0 m-0 border-0"
                                style={{
                                    display: "inline-block",
                                }}
                            >
                                <div className="img_check_list rounded">
                                    <label className="bg-warning rounded-circle">
                                        <i className="fal fa-handshake-alt text-white fa-lg" />
                                    </label>
                                    <span>
                                        <i className="fas fa-check-circle" />
                                    </span>
                                    <div>COD</div>
                                </div>
                            </Tab>
                            <Tab
                                className="p-0 m-0 border-0"
                                style={{
                                    display: "inline-block",
                                }}
                            >
                                <div className="img_check_list rounded">
                                    <label className="bg-danger rounded-circle">
                                        <i className="fal fa-exchange-alt text-white fa-lg" />
                                    </label>
                                    <span>
                                        <i className="fas fa-check-circle" />
                                    </span>
                                    <div>{t("pay.ck")}</div>
                                </div>
                            </Tab>
                            <Tab
                                className="p-0 m-0 border-0"
                                style={{
                                    display: "inline-block",
                                }}
                            >
                                <div className="img_check_list rounded">
                                    <label className="bg-success rounded-circle">
                                        <i className="fal fa-credit-card-front text-white fa-lg" />
                                    </label>
                                    <span>
                                        <i className="fas fa-check-circle" />
                                    </span>
                                    <div>{t("pay.card")}</div>
                                </div>
                            </Tab>
                        </TabList>

                        <TabPanel>
                            <div className="p-3 rounded bg-light">
                                <h5 className="text-center mb-3">
                                    <i>({t("pay.warning_2")})</i>
                                </h5>
                                <h5 className="mb-2 ml-1 font-weight-bold">
                                    {t("common.fullname")}
                                </h5>
                                <Input
                                    name="fullname"
                                    type="text"
                                    defaultValue={fullname}
                                    onChange={onChangeInput}
                                />
                                <h5 className="mt-2 mb-2 ml-1 font-weight-bold">
                                    {t("common.phone")}
                                </h5>
                                <Input
                                    name="phone"
                                    type="text"
                                    defaultValue={phone}
                                    onChange={onChangeInput}
                                />
                                <h5 className="mt-2 mb-2 ml-1 font-weight-bold">
                                    {t("common.address")}
                                </h5>
                                <Input
                                    name="address"
                                    type="textarea"
                                    defaultValue={address}
                                    onChange={onChangeInput}
                                />
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <div className="p-3 rounded bg-light">
                                <p>{t("pay.trans_1")}</p>
                                <p>
                                    <b>{t("pay.trans_2")}</b>
                                </p>
                                <p>
                                    {t("pay.trans_3_1")}:{" "}
                                    <b>{t("common.company_name")}</b>
                                </p>
                                <p>
                                    {t("pay.trans_4")}: <b>0991000032755</b>
                                </p>
                                <p>
                                    {t("pay.trans_5_1")}:{" "}
                                    <b>{t("pay.trans_5_2")}</b>
                                </p>
                                <p>
                                    {t("common.address")}:{" "}
                                    <b>{t("pay.trans_6")}</b>
                                </p>
                                <p>
                                    SWIFT CODE: <b>BFTVVNVX099</b>
                                </p>
                                <p>
                                    {t("pay.trans_7")}:
                                    <br />
                                    <b>{t("pay.trans_8")}</b>
                                </p>
                            </div>
                        </TabPanel>
                        <TabPanel />
                    </Tabs>
                </form>
            </div>
        );
    }
}

export default translate("common")(ModalBuyCardLeftContent);
