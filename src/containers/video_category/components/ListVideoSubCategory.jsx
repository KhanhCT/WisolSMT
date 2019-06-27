import React, { Component } from "react";
import { Link } from "react-router-dom";
import { callApi } from "../../../helpers";
import { ROUTES, apiConfigs } from "../../../constants";
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    CardImg,
    CardText,
} from "reactstrap";

export class ListVideoSubCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            lstVideoSubCategory: [],
        };
        const { location } = this.props;
        if (!location.state || !location.state.currVideoCategory)
            window.location.pathname = ROUTES.VIDEO_CATEGORY_LANGUAGE;
    }

    componentDidMount = () => {
        this.getVideoSubCategoryData();
    };

    getVideoSubCategoryData = () => {
        const { currVideoCategory } = this.props.location.state;
        let videoCategoryId = currVideoCategory.id;
        if (videoCategoryId) {
            callApi(
                "video_sub_categories/get-video-sub-by-category-id",
                "GET",
                {
                    category_id: videoCategoryId,
                }
            )
                .then(res => {
                    this.setState({
                        error: null,
                        lstVideoSubCategory: res.data.data,
                    });
                })
                .catch(error => {
                    console.log(error);
                });
        }
    };

    handleGoBack = e => {
        e.preventDefault();
        this.props.history.goBack();
    };

    render() {
        const { lstVideoSubCategory } = this.state;
        const { match, location } = this.props;
        let currVideoCategory = location.state.currVideoCategory;
        let renderData = null;
        if (lstVideoSubCategory.length > 0) {
            renderData = lstVideoSubCategory.map((item, index) => {
                return (
                    <Col className="team_post" xs={6} md={3}>
                        <Link
                            to={{
                                pathname: ROUTES.VIDEO_BY_SUB_CATEGORY,
                                state: { currVideoSubCategory: item.data },
                            }}
                            title={item.data.name}
                        >
                            <div class="team_post_avatar">
                                {item.data.cover_image ? (
                                    <img
                                        src={`${apiConfigs.BASE_IMAGE_URL}${
                                            item.data.cover_image
                                        }`}
                                        alt={item.data.name}
                                    />
                                ) : (
                                    <img
                                        src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180"
                                        alt="Card image cap"
                                    />
                                )}
                                <span />
                            </div>
                            <div className="team_post_content">
                                <div className="team_post_title">
                                    <h4>{item.data.name}</h4>
                                </div>
                                <div className="team_post_subtile">
                                    <h5>{item.total_video} videos</h5>
                                </div>
                            </div>
                        </Link>
                    </Col>
                );
            });
        }
        return (
            <Container>
                <div className="text-center mt-4">
                    <a
                        className="text-secondary"
                        href="javascript;"
                        onClick={this.handleGoBack}
                    >
                        <i className="fal fa-chevron-left" />
                        {"    "}
                        BACK
                    </a>
                    <h1
                        className="mb-5 mt-4 sm-fontSize22"
                        style={{ fontWeight: "500" }}
                    >
                        Channels
                    </h1>
                </div>
                <Row>{renderData}</Row>
            </Container>
        );
    }
}
