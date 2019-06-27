import React, { Component } from "react";
import SidebarLink from "./SidebarLink";
import SidebarCategory from "./SidebarCategory";
import { translate } from "react-i18next";
import { userHelper } from "../../../helpers";
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
    let userStorage = userHelper.getUserFromStorage();
    const { t } = this.props;
    return (
      <div className="sidebar__content">
        {/* <ul className="sidebar__block">
          <SidebarLink
            title={t("common.dashboard")}
            icon="license"
            route="/dashboard_student"
            onClick={this.hideSidebar}
          />
          <SidebarCategory title={t("sidebar.layout")} icon="layers">
            <li className="sidebar__link" onClick={this.props.changeToLight}>
              <p className="sidebar__link-title">{t("sidebar.light_theme")}</p>
            </li>
            <li className="sidebar__link" onClick={this.props.changeToDark}>
              <p className="sidebar__link-title">{t("sidebar.dark_theme")}</p>
            </li>
          </SidebarCategory>
        </ul> */}
        {/* ThanhTT custom */}
        {/* <ul className="sidebar__block">
                    <SidebarLink
                        title="Book"
                        icon="book"
                        route="/vietnamese-books"
                        onClick={this.hideSidebar}
                    />
                </ul> */}
        {/* <ul className="sidebar__block">
          <SidebarLink
            title="Flashcard"
            icon="tag"
            route="/flashcards"
            onClick={this.hideSidebar}
          />
        </ul> */}
        {/* <ul className="sidebar__block">
                    <SidebarLink
                        title={t("common.attendance_record")}
                        icon="pushpin"
                        route="/attendance_records"
                        onClick={this.hideSidebar}
                    />
                </ul>
                */}
        {/* <ul className="sidebar__block">
          <SidebarLink
            title="Video Book"
            icon="film-play"
            route="/learn-vietnamese-video"
            onClick={this.hideSidebar}
          />
        </ul> */}

        {/* <ul className="sidebar__block">
          <SidebarLink
            title={t("common.listening")}
            icon="film-play"
            route="/video-languages"
            onClick={this.hideSidebar}
          />
        </ul> */}

        {/* <ul className="sidebar__block">
          <SidebarLink
            // title={t("common.listening")}
            title="Production Monitoring"
            icon="screen"
            route={ROUTES.LIST_MODEL}
            onClick={this.hideSidebar}
          />
        </ul> */}
        <ul className="sidebar__block">
          <SidebarLink
            title="Monitor Productivity"
            icon="screen"
            route={ROUTES.GOAL_MONITOR}
            onClick={this.hideSidebar}
          />
        </ul>

        <ul className="sidebar__block">
          <SidebarLink
            title="Monitor Line Status"
            icon="screen"
            route={ROUTES.MODEL_STATUS}
            onClick={this.hideSidebar}
          />
        </ul>

        <ul className="sidebar__block">
          <SidebarLink
            // title={t("common.listening")}
            title="Plan Master"
            icon="list"
            route={ROUTES.MODEL_REGISTER}
            onClick={this.hideSidebar}
          />
        </ul>

        <ul className="sidebar__block">
          <SidebarLink
            // title={t("common.listening")}
            title="Schedule Master"
            icon="clock"
            route={ROUTES.FACTORY_SCHEDULE}
            onClick={this.hideSidebar}
          />
        </ul>

        <ul className="sidebar__block">
          <SidebarLink
            // title={t("common.listening")}
            title="Workplace Master"
            icon="wheelchair"
            route={ROUTES.WORKPLACE_CONFIG}
            onClick={this.hideSidebar}
          />
        </ul>

        <ul className="sidebar__block">
          <SidebarLink
            // title={t("common.listening")}
            title="Product Master"
            icon="construction"
            route={ROUTES.DEVICE_CONFIG}
            onClick={this.hideSidebar}
          />
        </ul>

        <ul className="sidebar__block">
          <SidebarLink
            // title={t("common.listening")}
            title="Line Result"
            icon="construction"
            route={ROUTES.LINE_RESULT}
            onClick={this.hideSidebar}
          />
        </ul>

        <ul className="sidebar__block">
          <SidebarLink
            // title={t("common.listening")}
            title="Model Result"
            icon="construction"
            route={ROUTES.MODEL_RESULT}
            onClick={this.hideSidebar}
          />
        </ul>
        {/* <ul className="sidebar__block">
          <SidebarLink
            // title={t("common.listening")}
            title="Line Chart"
            icon="clock"
            route={ROUTES.LIST_MACHINE}
            onClick={this.hideSidebar}
          />
        </ul> */}
        {/* <ul className="sidebar__block">
          <SidebarLink
            // title={t("common.listening")}
            title="Line Chart"
            icon="clock"
            route={ROUTES.STATUS_LINE_CHART}
            onClick={this.hideSidebar}
          />
        </ul> */}
        {/* <ul className="sidebar__block">
          <SidebarLink
            // title={t("common.listening")}
            title="History"
            icon="clock"
            route={ROUTES.HIST_CHART}
            onClick={this.hideSidebar}
          />
        </ul> */}


        {/* {userStorage.is_school_member ? (
          <ul className="sidebar__block">
            <SidebarLink
              title="For School"
              icon="apartment"
              route="/for-schools"
              onClick={this.hideSidebar}
            />
          </ul>
        ) : null} */}
      </div>
    );
  }
}
const tTranslate = translate("common")(SidebarContent);
export default tTranslate;
