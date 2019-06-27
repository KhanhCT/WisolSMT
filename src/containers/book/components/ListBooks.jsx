import React, { Component } from "react";
import { Link } from "react-router-dom";
import { callApi, userHelper, errorHelper } from "../../../helpers";
import { errorConstants, ROUTES, apiConfigs } from "../../../constants";
import {
    Container,
    Row,
    Col,
    Badge,
    Card,
    CardBody,
    CardImg,
    CardText,
    CardTitle,
    CardSubtitle,
} from "reactstrap";

export class ListBooks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userBookData: [],
            error: null,
        };
    }

    handleClickLockBook = e => {
        e.preventDefault();
    };

    componentDidMount = () => {
        this.getListUserBook();
    };

    getListUserBook = () => {
        // Get user from storage
        let userStorage = userHelper.getUserFromStorage();
        if (userStorage) {
            callApi(`user_books`, "GET", { user_id: userStorage.user_id })
                .then(res => {
                    // add cms_base url to image
                    let data = res.data.data.map(item => {
                        if (item.cover_image)
                            item.cover_image = `${apiConfigs.CMS_BASE_URL}${
                                item.cover_image
                            }`;
                        return item;
                    });
                    this.setState({ userBookData: data, error: null });
                })
                .catch(error => {
                    let errorData = error.response.data;
                    let processError = errorHelper.commonProcessError.bind(
                        this
                    );
                    processError(errorData, errorConstants.USER_BOOK);
                });
        }
    };

    render() {
        const { userBookData, error } = this.state;
        let renderData = null;
        let totalActiveBookMinute = 0,
            totalUserBookMinute = 0;
        if (userBookData.length > 0) {
            renderData = userBookData.map((item, index) => {
                let users = item["users"];
                let languageLevel = item["language_level"];
                let activeBook = false;
                if (users.length > 0) {
                    activeBook = true;
                }
                return (
                    <Col sm={4} key={index} className="col-sm-6-m">
                        <Card
                            style={{
                                height: "auto",
                                width: "100%",
                                paddingBottom: "40px",
                            }}
                        >
                            <CardBody className="text-center p-3">
                                <CardImg
                                    top
                                    src={item["cover_image"]}
                                    alt={item["name"]}
                                    style={{ width: "50%", height: "auto" }}
                                />
                                <CardTitle>
                                    <p className="mt-3">
                                        <strong>
                                            {item["name"].toUpperCase()}
                                        </strong>
                                    </p>
                                </CardTitle>
                                {/* <CardText>{item["description"]}</CardText> */}
                                {/* <CardSubtitle> */}
                                <h6 className="text-primary">
                                    {item.lessions.length} Lessons
                                </h6>
                                <div className="hot-label">
                                    {languageLevel["name"].toLowerCase()}
                                </div>
                                {/* </CardSubtitle> */}
                                <br />
                                {activeBook ? (
                                    <Link
                                        className="btn btn-outline-secondary btn-sm mb-1"
                                        to={`${ROUTES.BOOKS}/${item.code}`}
                                    >
                                        VIEW
                                    </Link>
                                ) : (
                                    <Link
                                        className="btn btn-secondary btn-sm disabled mb-1"
                                        to=""
                                        onClick={this.handleClickLockBook}
                                    >
                                        LOCKED
                                    </Link>
                                )}
                            </CardBody>
                        </Card>
                    </Col>
                );
            });
        }

        return (
            <Container>
                <Row>{renderData}</Row>
            </Container>
        );
    }
}
