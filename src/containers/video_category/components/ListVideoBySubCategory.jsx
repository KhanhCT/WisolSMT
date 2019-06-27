import React, { Component } from "react";
import { Link } from "react-router-dom";
import { callApi } from "../../../helpers";
import { ROUTES, apiConfigs } from "../../../constants";
import { Container, Row, Col, CardText } from "reactstrap";

export class ListVideoBySubCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            lstVideoBySubCategory: [],
        };
        const { location } = this.props;
        if (!location.state || !location.state.currVideoSubCategory)
            window.location.pathname = ROUTES.VIDEO_CATEGORY_LANGUAGE;
    }

    componentDidMount = () => {
        this.getVideoBySubCategoryData();
    };

    getVideoBySubCategoryData = () => {
        const { currVideoSubCategory } = this.props.location.state;
        let videoSubCategoryId = currVideoSubCategory.id;
        if (videoSubCategoryId) {
            callApi("videos/get-video-by-video-sub-category-id", "GET", {
                sub_category_id: videoSubCategoryId,
            })
                .then(res => {
                    // Convert data subtitle, exercise to json
                    let convertedLstVideo = res.data.data.rows.map(video => {
                        if (
                            video.default_subtitle &&
                            typeof video.default_subtitle === "string"
                        )
                            video.default_subtitle = JSON.parse(
                                video.default_subtitle
                            );
                        if (
                            video.exercise &&
                            typeof video.exercise === "string"
                        )
                            video.exercise = JSON.parse(video.exercise);
                        return video;
                    });
                    this.setState({
                        error: null,
                        lstVideoBySubCategory: convertedLstVideo,
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
        const { lstVideoBySubCategory } = this.state;
        const { match, location } = this.props;
        let currVideoSubCategory = location.state.currVideoSubCategory;
        let renderData = null;
        if (lstVideoBySubCategory.length > 0) {
            renderData = lstVideoBySubCategory.map((item, index) => {
                return (
                    <Col xs={12} md={3} key={index}>
                        <div className="position-relative mb-4 grid_posts">
                            <div
                                className="box-shadow-3"
                                style={{ borderRadius: "7px" }}
                            >
                                {item.cover_image ? (
                                    <img
                                        src={`${apiConfigs.BASE_IMAGE_URL}${
                                            item.cover_image
                                        }`}
                                        alt={item.name}
                                        style={{
                                            height: "100%",
                                            borderRadius: "7px",
                                        }}
                                    />
                                ) : (
                                    <img
                                        src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180"
                                        alt="Card image cap"
                                        style={{
                                            height: "100%",
                                            borderRadius: "7px",
                                        }}
                                    />
                                )}
                                <Link
                                    className="grid_post_content"
                                    to={{
                                        pathname:
                                            ROUTES.VIDEO_SUB_CATEGORY_DETAIL,
                                        state: { currVideo: item },
                                    }}
                                >
                                    <i className="fas fa-play fa-3x grid_post_content_icon" />
                                    <div className="grid_post_content_block_title">
                                        <span className="grid_post_content_title">
                                            {item.name}
                                        </span>
                                    </div>
                                </Link>
                            </div>
                        </div>
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
                        {currVideoSubCategory.name}
                    </h1>
                </div>
                <Row>{renderData}</Row>
            </Container>
        );
    }
}
