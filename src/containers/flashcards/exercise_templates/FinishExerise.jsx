import React, { Component } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    Jumbotron,
    Button,
    Input,
    Label,
} from "reactstrap";
import ToogleSetNumberQuestion from "./ToogleSetNumberQuestion";
import ToogleSetLevel from "./ToogleSetLevel";

export default class FinishExerise extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {} = this.props;
        return (
            <Container>
                <div className="Center">
                    <h1
                        className="textGold sm-fontSize38"
                        data-text="Congratulation!"
                    >
                        Congratulation!
                    </h1>
                    <p className="lead" style={{ fontFamily: "serif" }}>
                        <i>Chúc mừng bạn đã hoàn thành bài thực hành này!</i>
                    </p>
                </div>
                <img
                    className="Center animated pulse slow"
                    style={{
                        width: "300px",
                        zIndex: "-1",
                        opacity: "0.1",
                        left: "20%",
                        top: "30%",
                    }}
                    src="images/welldone_img.png"
                />
            </Container>
        );
    }
}
