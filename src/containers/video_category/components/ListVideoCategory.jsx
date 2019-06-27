import React, { Component } from "react";
import { Link } from "react-router-dom";
import { callApi } from "../../../helpers";
import { ROUTES, apiConfigs } from "../../../constants";
import { Container, Row, Col } from "reactstrap";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import InfiniteScroll from "react-infinite-scroller";
import { translate } from "react-i18next";

export default class ListVideoCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lstVideoCategory: [],
            lstVideos: [],
            numberVideo: 0,
            error: null,
            tabIndexSelected: 0,
            categoryIdSelected: null,
            limit: 5,
        };
        const { location } = this.props;
        if (!location.state || !location.state.currLang)
            window.location.pathname = ROUTES.VIDEO_CATEGORY_LANGUAGE;
    }

    componentDidMount = () => {
        this.getListVideoCategory();
        this.onGetListVideo(1);
    };

    getListVideoCategory = () => {
        const { currLang } = this.props.location.state;
        callApi(`video_categories`, "GET", {
            limit: 1000,
            language_id: currLang.id,
        })
            .then(res => {
                this.setState({
                    lstVideoCategory: res.data.data,
                });
            })
            .catch(error => {
                console.log(error);
            });
    };

    handleGoBack = e => {
        e.preventDefault();
        this.props.history.goBack();
    };

    onSelectTab = index => {
        this.scroll.pageLoaded = 1;
        let category = null;
        if (index !== 0) category = this.state.lstVideoCategory[index - 1];
        this.setState(
            {
                tabIndexSelected: index,
                categoryIdSelected: category ? category.data.id : 0,
                lstVideos: [],
                numberVideo: 0,
            },
            () => {
                this.onGetListVideo(1);
            }
        );
    };

    onGetListVideo = page => {
        const { categoryIdSelected, tabIndexSelected, limit } = this.state;
        const { currLang } = this.props.location.state;
        let p = null;
        if (tabIndexSelected == 0)
            p = callApi("videos/get-video-by-language", "GET", {
                language_id: currLang.id,
                page: page,
                limit: limit,
            });
        else
            p = callApi("videos/get-video-by-category-id", "GET", {
                category_id: categoryIdSelected,
                page: page,
                limit: limit,
            });
        if (p) {
            p.then(res => {
                // Convert data subtitle, exercise to json
                let convertedLstVideo = res.data.data.rows.map(video => {
                    if (
                        video.default_subtitle &&
                        typeof video.default_subtitle === "string"
                    )
                        video.default_subtitle = JSON.parse(
                            video.default_subtitle
                        );
                    if (video.exercise && typeof video.exercise === "string")
                        video.exercise = JSON.parse(video.exercise);
                    return video;
                });
                this.setState({
                    error: null,
                    lstVideos: [...this.state.lstVideos, ...convertedLstVideo],
                    numberVideo: res.data.data.count,
                });
            }).catch(error => {
                this.setState({
                    lstVideos: [],
                    numberVideo: 0,
                });
                console.log(error);
            });
        }
    };

    render() {
        const { lstVideoCategory, lstVideos, numberVideo } = this.state;
        const { t } = this.props;
        let renderTabList = lstVideoCategory.map((category, index) => {
            return (
                <Tab className="nav_cust_link" key={index}>
                    <a href="javascript:;">
                        <span>{category.data.name}</span>
                    </a>
                </Tab>
            );
        });
        let renderTabPanel = lstVideoCategory.map((category, index) => {
            return <TabPanel key={index} />;
        });

        let renderLstVideo = lstVideos.map((item, index) => {
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
                                    pathname: ROUTES.VIDEO_SUB_CATEGORY_DETAIL,
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

        return (
            <Container>
                <div className="text-center mt-4">
                    <a
                        className="text-secondary text-uppercase"
                        href="javascript;"
                        onClick={this.handleGoBack}
                    >
                        <i className="fal fa-chevron-left" />
                        {"    "}
                        {t("common.back")}
                    </a>
                    <h1 className="mb-5 mt-4" style={{ fontWeight: "500" }}>
                        Videos
                    </h1>
                </div>
                <Tabs onSelect={this.onSelectTab}>
                    <TabList
                        className="text-center"
                        style={{ height: "initial", borderBottom: 0 }}
                    >
                        <Tab className="nav_cust_link">
                            <a href="javascript:;">
                                <span>{t("common.all")}</span>
                            </a>
                        </Tab>
                        {renderTabList}
                    </TabList>
                    <TabPanel />
                    {renderTabPanel}
                </Tabs>
                <div className="bg-light p-3">
                    <InfiniteScroll
                        ref={scroll => {
                            this.scroll = scroll;
                        }}
                        pageStart={1}
                        loadMore={this.onGetListVideo}
                        hasMore={lstVideos.length < numberVideo}
                        loader={
                            <div className="loader" key={0}>
                                Loading ...
                            </div>
                        }
                    >
                        <Row>{renderLstVideo}</Row>
                    </InfiniteScroll>
                </div>
            </Container>
        );
    }
}
const tListVideoCategory = translate(["common", "landing_page"])(
    ListVideoCategory
);
export { tListVideoCategory as ListVideoCategory };
