import React, { Component } from "react";

export class UnauthorizeComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div style={{ textAlign: "center" }}>
                <h1>
                    <strong>401</strong>
                </h1>
                <hr />
                <p>You don't have permision to access this view</p>
            </div>
        );
    }
}
