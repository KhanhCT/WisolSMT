import React, { Component } from "react";
import SidebarLink from "./SidebarLink";
import { translate } from "react-i18next";
import { ROUTES } from "../../../constants";

class SidebarContent extends Component {
  hideSidebar = () => {
    this.props.onClick();
  };

  render() {
    /** Check user has role view for school side bar
     * Check "is_school_member" from token
     * if true, user has permision to view for school side bar
     */
    //let userStorage = userHelper.getUserFromStorage();
    //const { t } = this.props;
    return (
      <div className="sidebar__content">
        <ul className="sidebar__block">
          <SidebarLink
            // title={t("common.listening")}
            title="Schedule Master"
            icon="clock"
            route={ROUTES.FACTORY_MASTER}
            onClick={this.hideSidebar}
          />
        </ul>

        <ul className="sidebar__block">
          <SidebarLink
            // title={t("common.listening")}
            title="Line Master"
            icon="wheelchair"
            route={ROUTES.WORKPLACE_MASTER}
            onClick={this.hideSidebar}
          />
        </ul>
      
        <ul className="sidebar__block">
          <SidebarLink
            // title={t("common.listening")}
            title="Product Master"
            icon="list"
            route={ROUTES.PRODUCT_MASTER}
            onClick={this.hideSidebar}
          />
        </ul>

        <ul className="sidebar__block">
          <SidebarLink
            // title={t("common.listening")}
            title="Line Order"
            icon="list"
            route={ROUTES.LINE_ORDER}
            onClick={this.hideSidebar}
          />
        </ul>
        
        <ul className="sidebar__block">
          <SidebarLink
            // title={t("common.listening")}
            title="Line Result"
            icon="list"
            route={ROUTES.LINE_RESULT}
            onClick={this.hideSidebar}
          />
        </ul>

        <ul className="sidebar__block">
          <SidebarLink
            // title={t("common.listening")}
            title="Model Result"
            icon="list"
            route={ROUTES.MODEL_RESULT}
            onClick={this.hideSidebar}
          />
        </ul>
      </div>
    );
  }
}
const tTranslate = translate("common")(SidebarContent);
export default tTranslate;
