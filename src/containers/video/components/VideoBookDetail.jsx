import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    CardImg,
    CardText,
    Badge,
} from "reactstrap";
import { errorHelper, userHelper, callApi } from "../../../helpers";
import { errorConstants, ROUTES } from "../../../constants";

export class VideoBookDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            lstLession: [],
        };
    }

    componentDidMount = () => {
        this.getVideoBookLessionData();
    };

    getVideoBookLessionData = () => {
        // Get book_id from url
        const { match } = this.props;
        let bookId = match.params.book_id;
        if (bookId) {
            callApi("lessions/get-lession-by-book-id", "GET", {
                book_id: bookId,
            })
                .then(res => {
                    this.setState({
                        error: null,
                        lstLession: res.data.data.rows,
                    });
                })
                .catch(error => {
                    console.log(error);
                });
        }
    };
    render() {
        const { lstLession } = this.state;
        const { match, location } = this.props;
        let currVideoBook = location.state.currVideoBook;
        let renderData = null;
        if (lstLession.length > 0) {
            renderData = lstLession.map((item, index) => {
                return (
                    <Col sm={3} key={index}>
                        <Card>
                            <CardImg
                                top
                                width="100%"
                                src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180"
                                alt="Card image cap"
                            />
                            <CardBody>
                                <h4>
                                    <strong>{item.name} </strong>
                                </h4>
                                <CardText
                                    style={{
                                        fontWeight: "500",
                                        fontSize: "14px",
                                    }}
                                >
                                    {item.description}
                                </CardText>
                                <br />
                                <Link
                                    className="btn btn-outline-primary"
                                    to={{
                                        pathname: `${ROUTES.VIDEOS}/${
                                            match.params.book_id
                                        }/${item.id}`,
                                        state: { currLession: item },
                                    }}
                                >
                                    <strong>VIEW LESSION</strong>
                                </Link>
                            </CardBody>
                        </Card>
                    </Col>
                );
            });
        }
        return (
            <Container>
                <div className="d-block">
                    <h3 className="heading-product">
                        {currVideoBook ? currVideoBook.name.toUpperCase() : ""}
                    </h3>
                </div>
                <Row>{renderData}</Row>
            </Container>
        );
    }
}
