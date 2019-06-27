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
// import { ErrorModal } from "../..";
import { errorHelper, userHelper, callApi } from "../../../helpers";
import { errorConstants, ROUTES, apiConfigs } from "../../../constants";

export class BookDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            lstLession: [],
            currBook: null,
        };
    }

    componentDidMount = () => {
        this.getBookLessionData();
    };

    getBookLessionData = () => {
        // Get book_code from url
        const { match } = this.props;
        let bookCode = match.params.book_code;
        // Get user from storage
        let userStorage = userHelper.getUserFromStorage();
        if (userStorage && bookCode) {
            callApi("user_lessions", "GET", {
                user_id: userStorage.user_id,
                book_code: bookCode,
            })
                .then(res => {
                    this.setState({
                        error: null,
                        lstLession: res.data.data.rows,
                        currBook: res.data.data.curr_book,
                    });
                })
                .catch(error => {
                    let errorData = error.response.data;
                    let processError = errorHelper.commonProcessError.bind(
                        this
                    );
                    processError(errorData, errorConstants.BOOK_DETAIL);
                });
        }
    };

    handleBack = () => {
        this.props.history.push("/vietnamese-books");
    };
    render() {
        const { error, lstLession, currBook } = this.state;
        const { match } = this.props;
        let renderData = null;
        if (lstLession.length > 0) {
            renderData = lstLession.map((item, index) => {
                let doneStatus = item.users.length > 0 ? "done" : "";
                return (
                    <Col sm={3} key={index} className="w-50-m pr-0-odd">
                        <Card className="pb-3">
                            <CardBody className="text-center p-3">
                                {item.cover_image ? (
                                    <CardImg
                                        top
                                        src={`${apiConfigs.BASE_IMAGE_URL}${
                                            item["cover_image"]
                                        }`}
                                        alt={item["name"]}
                                        style={{ width: "50%", height: "auto" }}
                                    />
                                ) : (
                                    <CardImg
                                        top
                                        src="../img/1.png"
                                        alt={item["name"]}
                                        style={{ width: "50%", height: "auto" }}
                                    />
                                )}
                                <h4>
                                    <strong>
                                        {item.name}{" "}
                                        {item.users.length > 0 ? (
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    top: "5px",
                                                    right: "5px",
                                                }}
                                            >
                                                <i className="fas fa-check-circle text-success" />
                                            </div>
                                        ) : (
                                            <Badge color="danger" />
                                        )}
                                    </strong>
                                </h4>
                                <CardText
                                    style={{
                                        fontWeight: "400",
                                        fontSize: "14px",
                                    }}
                                >
                                    {item.description}
                                </CardText>
                                <Link
                                    className="btn btn-outline-secondary btn-sm mb-1 mt-2"
                                    to={`${ROUTES.BOOKS}/${
                                        match.params.book_code
                                    }/${item.code}`}
                                >
                                    START
                                </Link>
                            </CardBody>
                        </Card>
                    </Col>
                );
            });
        }
        return (
            <Container>
                {/* <ErrorModal error={error} /> */}
                <div className="d-block">
                    {/* <button
                        className="btn btn-outline-secondary btn-sm mb-2 ml-"
                        
                    >
                        Back
                    </button> */}
                    <h4 className="heading-product pl-3 pb-2">
                        <i
                            onClick={this.handleBack}
                            className="fas fa-chevron-left"
                        />{" "}
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        {currBook ? currBook.name.toUpperCase() : ""}
                    </h4>
                </div>
                <Row>{renderData}</Row>
            </Container>
        );
    }
}
