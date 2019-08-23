import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Topbar from "./topbar/Topbar";
import TopbarWithNavigation from "./topbar_with_navigation/TopbarWithNavigation";
import Sidebar from "./sidebar/Sidebar";
import SidebarMobile from "./topbar_with_navigation/sidebar_mobile/SidebarMobile";
import {
  changeMobileSidebarVisibility,
  changeSidebarVisibility,
} from "../../redux/actions/sidebarActions";
import {
  changeThemeToDark,
  changeThemeToLight,
} from "../../redux/actions/themeActions";
import {
  changeBorderRadius,
  toggleBoxShadow,
  toggleTopNavigation,
} from "../../redux/actions/customizerActions";

// Create main socket client
import { userHelper } from "../../helpers";
import { ROUTES } from "../../constants";
// export let socket = userHelper.connectSocket();

class Layout extends Component {
  componentDidMount() {
    // this.initialSocketClientConnect();
  }

  //   initialSocketClientConnect = () => {
  //     if (!socket) {
  //       socket = userHelper.connectSocket();
  //     }
  //     // Check socket unauthorized
  //     socket.on("unauthorized", function(error, callback) {
  //       // console.log("Socket unauthorized");
  //       if (
  //         error.data.type == "UnauthorizedError" ||
  //         error.data.code == "invalid_token"
  //       ) {
  //         // redirect user to login page perhaps or execute callback:
  //         // callback();
  //         // console.log("User's token has expired");
  //         const { history } = this.props;
  //         history.push(ROUTES.LOGIN);
  //       }
  //     });
  //   };

  changeSidebarVisibility = () => {
    this.props.dispatch(changeSidebarVisibility());
  };

  changeMobileSidebarVisibility = () => {
    this.props.dispatch(changeMobileSidebarVisibility());
  };

  changeToDark = () => {
    this.props.dispatch(changeThemeToDark());
  };

  changeToLight = () => {
    this.props.dispatch(changeThemeToLight());
  };

  toggleTopNavigation = () => {
    this.props.dispatch(toggleTopNavigation());
  };

  changeBorderRadius = () => {
    this.props.dispatch(changeBorderRadius());
  };

  toggleBoxShadow = () => {
    this.props.dispatch(toggleBoxShadow());
  };

  render() {
    let { customizer, sidebar, theme } = this.props;

    return (
      <div>
        {/* <Customizer
                    customizer={customizer}
                    sidebar={sidebar}
                    theme={theme}
                    changeSidebarVisibility={this.changeSidebarVisibility}
                    toggleTopNavigation={this.toggleTopNavigation}
                    changeToDark={this.changeToDark}
                    changeToLight={this.changeToLight}
                    changeBorderRadius={this.changeBorderRadius}
                    toggleBoxShadow={this.toggleBoxShadow}
                /> */}
        {this.props.customizer.topNavigation ? (
          <TopbarWithNavigation
            changeMobileSidebarVisibility={this.changeMobileSidebarVisibility}
          />
        ) : (
          <Topbar
            changeMobileSidebarVisibility={this.changeMobileSidebarVisibility}
            changeSidebarVisibility={this.changeSidebarVisibility}
          />
        )}
        {this.props.customizer.topNavigation ? (
          <SidebarMobile
            sidebar={sidebar}
            changeToDark={this.changeToDark}
            changeToLight={this.changeToLight}
            changeMobileSidebarVisibility={this.changeMobileSidebarVisibility}
          />
        ) : (
          <Sidebar
            sidebar={sidebar}
            changeToDark={this.changeToDark}
            changeToLight={this.changeToLight}
            changeMobileSidebarVisibility={this.changeMobileSidebarVisibility}
          />
        )}
      </div>
    );
  }
}

export default withRouter(
  connect(state => {
    return {
      customizer: state.customizer,
      sidebar: state.sidebar,
      theme: state.theme,
    };
  })(Layout)
);
