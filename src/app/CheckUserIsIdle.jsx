import React, { Component } from "react";

const MINUTES_UNITL_AUTO_LOGOUT = 5; // in mins
const CHECK_INTERVAL = 15000; // in ms
const STORE_KEY = "lastAction";

export default class CheckUserIsIdle extends Component {
    constructor(props) {
        super(props);
        this.check();
        this.initListener();
        this.initInterval();
    }

    getLastAction = () => {
        return parseInt(localStorage.getItem(STORE_KEY));
    };

    setLastAction = lastAction => {
        localStorage.setItem(STORE_KEY, lastAction.toString());
    };

    initListener = () => {
        document.body.addEventListener("click", () => this.reset());
        document.body.addEventListener("mouseover", () => this.reset());
        document.body.addEventListener("mouseout", () => this.reset());
        document.body.addEventListener("keydown", () => this.reset());
        document.body.addEventListener("keyup", () => this.reset());
        document.body.addEventListener("keypress", () => this.reset());
    };

    reset = () => {
        this.setLastAction(Date.now());
    };

    initInterval = () => {
        setInterval(() => {
            this.check();
        }, CHECK_INTERVAL);
    };

    check = () => {
        const now = Date.now();
        const timeleft =
            this.getLastAction() + MINUTES_UNITL_AUTO_LOGOUT * 60 * 1000;
        const diff = timeleft - now;
        const isTimeout = diff < 0;
        if (isTimeout) {
            alert("logout"); // Call here logout function, expire session
            // localStorage.clear();
        }
    };

    render() {
        return (
            <div>
                <p>Automatic Logout With Custom Time That Magic Happen :)</p>
            </div>
        );
    }
}