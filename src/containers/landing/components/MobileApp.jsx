import React, { Component } from "react";
import { translate } from "react-i18next";

class MobileApp extends Component {
    render() {
        const { t } = this.props;
        return (
            <div className="contaner mw-960 pl-0 pr-0">
                <br />
                <center>
                    <a className="companyName" href="/">
                        <img
                            className="companyLogo"
                            src="images/main-logo.svg"
                        />
                    </a>
                </center>
                <br />
                <h4 className="text-center white-text mb-3">MOBILE APPS</h4>
                <center>
                    <a className="app-download" href="#" target="_blank">
                        <img
                            className="align-middle"
                            src="images/appstore-com.svg"
                            alt="App Store"
                        />
                    </a>{" "}
                    &nbsp;&nbsp;&nbsp;&nbsp;{" "}
                    <a className="app-download" href="#" target="_blank">
                        <img
                            className="align-middle"
                            src="images/googleplay_ecom.svg"
                            alt="google play store"
                        />
                    </a>
                </center>
            </div>
        );
    }
}

export default translate(["common", "landing_page"])(MobileApp);
