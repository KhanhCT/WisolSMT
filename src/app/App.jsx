import React, { Component } from "react";
import { hot } from "react-hot-loader";
import "bootstrap/dist/css/bootstrap.css";
import "video-react/dist/video-react.css";
import "react-table/react-table.css";
import "react-toastify/dist/ReactToastify.css";
import "../scss/app.scss";
import Router from "./Router";
import { ToastContainer } from "react-toastify";
import ErrorBoundary from "./ErrorBoundary";
import IdleTimer from "react-idle-timer";
import { userHelper } from "../helpers";
import { ROUTES } from "../constants";
import "react-tabs/style/react-tabs.css";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import "primereact/resources/themes/nova-light/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const USER_IDLE_TIMEOUT = 1000 * 60 * 30;

class App extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      loaded: false,
    };
  }

  componentDidMount() {
    window.addEventListener("load", () => {
      this.setState({ loading: false });
      setTimeout(() => this.setState({ loaded: true }), 300);
    });
  }

  // onIdle = e => {
  //     if (userHelper.getUserFromStorage()) {
  //         localStorage.clear();
  //         this.props.history.push(ROUTES.LANDING_PAGE);
  //         return alert("Your session is expired! Please Login");
  //     }
  // };

  render() {
    const loaded = this.state.loaded;
    return (
      <div>
        {/* <IdleTimer
                    ref={ref => {
                        this.idleTimer = ref;
                    }}
                    element={document}
                    onIdle={this.onIdle}
                    debounce={250}
                    timeout={USER_IDLE_TIMEOUT}
                /> */}
        {!loaded && (
          <div className={`load${this.state.loading ? "" : " loaded"}`}>
            <div className="load__icon-wrap">
              <svg className="load__icon">
                <path
                  fill="#4ce1b6"
                  d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"
                />
              </svg>
            </div>
          </div>
        )}
        <div>
          <ErrorBoundary>
            <Router />
          </ErrorBoundary>
        </div>
        <ToastContainer newestOnTop draggable />
      </div>
    );
  }
}

export default hot(module)(App);
