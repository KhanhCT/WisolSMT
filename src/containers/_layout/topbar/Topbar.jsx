import React, { PureComponent } from "react";
import TopbarSidebarButton from "./TopbarSidebarButton";
import TopbarProfile from "./TopbarProfile";
import TopbarLanguage from "./TopbarLanguage";
import { Link, Route } from "react-router-dom";
import PropTypes from "prop-types";
import { ROUTES } from "../../../constants";
import { translate } from "react-i18next";
import ModalBuyCard from "./ModalBuyCard";

class Topbar extends PureComponent {
  static propTypes = {
    changeMobileSidebarVisibility: PropTypes.func,
    changeSidebarVisibility: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
    };
  }

  toggle = () => {
    this.setState({ modalIsOpen: !this.state.modalIsOpen });
  };

  openModal = () => {
    this.setState({ modalIsOpen: true });
  };

  render() {
    let { changeMobileSidebarVisibility, changeSidebarVisibility } = this.props;
    const { t } = this.props;
    const { modalIsOpen } = this.state;
    return (
      <div className="topbar">
        <div className="topbar__wrapper">
          <div className="topbar__left">
            <TopbarSidebarButton
              changeMobileSidebarVisibility={changeMobileSidebarVisibility}
              changeSidebarVisibility={changeSidebarVisibility}
            />
            {/* <Link className="topbar__logo" to={ROUTES.MAIN_PAGE} /> */}
          </div>
          <div className="topbar__right">
            {/* <TopbarSearch />
                        <TopbarNotification />
                        <TopbarMail new /> */}

            {/* <div>
                            <a
                                className="top-nav--item action"
                                href="javascript:;"
                                onClick={this.openModal}
                            >
                                {t("common.buy_topup_card")}
                            </a>
                        </div>
                        <div>
                            <Link
                                className="top-nav--item text-dark"
                                to="/active-account"
                            >
                                {t("common.topup_card")}
                            </Link>
                        </div>
                        <TopbarLanguage /> */}
            <Route component={TopbarProfile} />
          </div>
        </div>
        <ModalBuyCard modalIsOpen={modalIsOpen} toggle={this.toggle} />
      </div>
    );
  }
}

const tTranslate = translate("common")(Topbar);
export default tTranslate;
