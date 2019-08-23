import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import Image404 from "../../../img/404/404.png";

export default class NotFound404 extends PureComponent {
    render() {
        return (
            <div className="not-found__content">
                <center>
                    {/* <img
                        className="not-found__image"
                        src="/img/404.png"
                        alt="404"
                    /> */}
                    <h3 className="not-found__info">
                        Ooops! The page you are looking for could not be found
                        :(
                    </h3>
                    <Link className="btn btn-primary" to="/">
                        Back Home
                    </Link>
                </center>
            </div>
        );
    }
}
