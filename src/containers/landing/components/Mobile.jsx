import React, { PureComponent } from "react";
import { translate } from "react-i18next";
import Footer from "./Footer";
import Header from "./Header";

class Mobile extends PureComponent {
    responsive = {
        0: { items: 4 },
        600: { items: 5 },
        1024: { items: 6 },
    };
    render() {
        return (
            <div>
                <Header />
                <div className="container">
                    <h1
                        className="mb-3 mt-4 text-center"
                        style={{ fontWeight: "500" }}
                    >
                        Lingo on the go
                    </h1>
                    <h4 className="text-center mb-4 mt-4">
                        See why Apple named us iPhone App of the Year and
                        <br />
                        Google selected us as the Best of the Best in Google
                        Play.
                    </h4>
                    <center>
                        <a
                            className="app-download"
                            href="#"
                            target="_blank"
                            style={{ background: "#f7f7f7" }}
                        >
                            <img
                                className="align-middle"
                                src="images/appstore-com.svg"
                                alt="App Store"
                            />
                        </a>{" "}
                        &nbsp;&nbsp;{" "}
                        <a
                            className="app-download"
                            href="#"
                            target="_blank"
                            style={{ background: "#f7f7f7" }}
                        >
                            <img
                                className="align-middle"
                                src="images/googleplay_ecom.svg"
                                alt="google play store"
                            />
                        </a>
                    </center>
                    <div className="mt-4 text-center mb-4">
                        <img
                            width="100%"
                            height="auto"
                            src="images/homepage.svg"
                        />
                    </div>
                </div>

                <Footer />
            </div>
        );
    }
}

const tMobile = translate(["common", "landing_page"])(Mobile);
export { tMobile as Mobile };
