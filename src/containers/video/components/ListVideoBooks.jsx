import React, { Component } from "react";
import { Link } from "react-router-dom";
import { callApi, userHelper, errorHelper } from "../../../helpers";
import { errorConstants, ROUTES, apiConfigs } from "../../../constants";
import {
    Container,
    Row,
    Col,
    ListGroup,
    ListGroupItem,
    Badge,
} from "reactstrap";

export class ListVideoBooks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lstVideoBook: [],
            error: null,
        };
    }

    componentDidMount = () => {
        this.getListVideoBook();
    };

    getListVideoBook = () => {
        // Get user from storage
        let userStorage = userHelper.getUserFromStorage();
        callApi(`video_books`, "GET", {
            user_id: userStorage.user_id,
            limit: 1000,
        })
            .then(res => {
                this.setState({
                    lstVideoBook: res.data.data.rows,
                });
            })
            .catch(error => {
                console.log(error);
            });
    };

    render() {
        const { lstVideoBook } = this.state;
        let renderData = null;
        if (lstVideoBook.length > 0) {
            renderData = lstVideoBook.map((item, index) => {
                return (
                    <ListGroupItem key={index}>
                        <div className="list-card-user d-flex">
                            <span className="font-weight-bold">
                                {item.name}
                            </span>

                            <div className="pl-5">
                                <Link
                                    className="btn btn-primary btn-lg text-white font-weight-bold"
                                    to={{
                                        pathname: `${ROUTES.VIDEOS}/${
                                            item.book_id
                                        }`,
                                        state: { currVideoBook: item },
                                    }}
                                >
                                    <span className="pt-1 pb-1 pl-3 pr-3">
                                        <small>
                                            <i className="fa fa-play-circle" />{" "}
                                            <b className="show-destop">
                                                VIEW THIS VIDEO BOOK
                                            </b>
                                        </small>
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </ListGroupItem>
                );
            });
        } else {
            renderData = (
                <h3 className="text-center mt-5">
                    Bạn chưa được mở tính năng này
                </h3>
            );
        }

        return (
            <Container>
                <Row>
                    <Col sm={12}>
                        <ListGroup>{renderData}</ListGroup>
                    </Col>
                </Row>
            </Container>
        );
    }
}
