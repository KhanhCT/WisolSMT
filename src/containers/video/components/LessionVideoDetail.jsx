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

export class LessionVideoDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            lstVideo: [],
        };
    }

    componentDidMount = () => {
        this.getVideoData();
    };

    getVideoData = () => {
        // Get book_id from url
        const { match } = this.props;
        let lessionId = match.params.lession_id;
        if (lessionId) {
            callApi("videos/get-video-by-lession-id", "GET", {
                lession_id: lessionId,
            })
                .then(res => {
                    this.setState({
                        error: null,
                        lstVideo: res.data.data.rows,
                    });
                })
                .catch(error => {
                    console.log(error);
                });
        }
    };
    render() {
        const { lstVideo } = this.state;
        const { match, location } = this.props;
        let currLession = location.state.currLession;
        let renderData = null;
        if (lstVideo.length > 0) {
            renderData = lstVideo.map((item, index) => {
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
                                        }/${match.params.lession_id}/${
                                            item.id
                                        }`,
                                        state: { currVideo: item },
                                    }}
                                >
                                    <strong>START LEARNING</strong>
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
                        {currLession ? currLession.name.toUpperCase() : ""}
                    </h3>
                </div>
                <Row>{renderData}</Row>
            </Container>
        );
    }
}
