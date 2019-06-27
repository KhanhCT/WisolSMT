import React, { PureComponent } from "react";
import DownIcon from "mdi-react/ChevronDownIcon";
import TopbarMenuLink from "./TopbarMenuLink";
import { Collapse } from "reactstrap";
import { callApi, userHelper } from "../../../helpers";
import { apiConfigs, ROUTES } from "../../../constants";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { updateForSchoolUserRole } from "../../../redux/actions";

const AvaMale = process.env.PUBLIC_URL + "/img/avatar-male.svg";
const AvaFemale = process.env.PUBLIC_URL + "/img/avatar-female.svg";

class TopbarProfile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      collapse: false,
      user: {},
      userInfo: {},
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount = () => {
    let userStorage = userHelper.getUserFromStorage();
    if (userStorage) this.setState({ user: userStorage });
    // this.getUserInfo();
  };

  getUserInfo = () => {
    callApi("users/get-user-by-id", "GET", null)
      .then(res => {
        this.setState({
          userInfo: res.data.data,
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  handleLogout = e => {
    e.preventDefault();
    // Update set user_role_school to null
    this.props.dispatch(updateForSchoolUserRole(null));
    // Process logout
    localStorage.clear();
    const { history } = this.props;
    history.push(ROUTES.LANDING_PAGE);
  };

  render() {
    let userMember = userHelper.checkMemberType();
    const { user, userInfo } = this.state;
    const { t } = this.props;
    let avatar = null;
    if (!user.avatar && user.gender == 1) {
      avatar = AvaMale;
    } else if (!user.avatar && user.gender == 0) {
      avatar = AvaFemale;
    } else if (!user.avatar && !user.gender) {
      avatar = AvaMale;
    } else {
      avatar = `${apiConfigs.BASE_IMAGE_URL}${user.avatar}`;
    }
    return (
      <div className="topbar__profile">
        <div className="topbar__avatar" onClick={this.toggle}>
          <div style={{ position: "relative", marginTop: "10px" }}>
            <img
              className="topbar__avatar-img border"
              src={avatar}
              alt="avatar"
            />
            {/* {userMember ? (
                            <i
                                className={`fas fa-crown avatarIcon bg-${
                                    userMember["type"]
                                }`}
                            />
                        ) : (
                            <span className="avatarIcon freeIcon">Free</span>
                        )} */}
          </div>
          <p className="topbar__avatar-name">{user["username"]}</p>
          <DownIcon className="topbar__icon" />
        </div>
        {this.state.collapse && (
          <div className="topbar__back" onClick={this.toggle} />
        )}
        <Collapse isOpen={this.state.collapse} className="topbar__menu-wrap">
          <div className="topbar__menu">
            {/* <TopbarMenuLink
                            title="My Profile"
                            icon="user"
                            path="/account/profile"
                        />
                        <TopbarMenuLink
                            title="Calendar"
                            icon="calendar-full"
                            path="/default_pages/calendar"
                        />
                        <TopbarMenuLink
                            title="Tasks"
                            icon="list"
                            path="/default_pages/calendar"
                        />
                        <TopbarMenuLink
                            title="Inbox"
                            icon="inbox"
                            path="/mail"
                        />
                        <div className="topbar__menu-divider" /> */}
            {/* <a className="topbar__link">
                            <p className="topbar__link-title">
                                Tài khoản: Gold
                            </p>
                        </a>
                        <a className="topbar__link">
                            <p className="topbar__link-title">
                                {t("common.you_get")}:{" "}
                                {userInfo["number_medal"]}{" "}
                                <i className="fal fa-medal text-warning" />
                            </p>
                        </a>
                        <div className="topbar__menu-divider" />
                        <TopbarMenuLink
                            title={t("common.account_settings")}
                            icon="cog"
                            path={ROUTES.PROFILE}
                        />
                        <a className="topbar__link" href="/lock_screen">
                            <span className="topbar__link-icon fal fa-crown" />
                            <p className="topbar__link-title">
                                {t("common.upgrade_account")}
                            </p>
                        </a> */}
            {/* <TopbarMenuLink
                            title={t("common.active_account")}
                            icon="star"
                            path="/active-account"
                        /> */}
            <a
              className="topbar__link"
              href="javascript:;"
              onClick={this.handleLogout}
            >
              <span className="topbar__link-icon fal fa-sign-out-alt" />
              <p className="topbar__link-title">{t("common.signout")}</p>
            </a>
          </div>
        </Collapse>
      </div>
    );
  }
}
const tTranslate = translate("common")(TopbarProfile);
const mapStateToProps = () => ({});
const wrapTopBar = connect(mapStateToProps)(tTranslate);
export default wrapTopBar;
