import React, { Component, Fragment } from "react";
import classNames from "classnames";
import { callApi, userHelper } from "../../../helpers";
import { apiConfigs, FREE_MEMBER_CONSTANTS } from "../../../constants";
import { translate } from "react-i18next";
import { Badge, Col, Row, CardImg, CardTitle } from "reactstrap";
import ArrayLodash from "lodash/array";

class ListCategorySelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listCategory: [],
            vipMember: userHelper.checkMemberType() ? true : false,
            defaultActiveCategoryId: null,
        };
    }
    componentDidMount = () => {
        this.getListBook();
    };

    getListBook = () => {
        const { setSelectedCategory } = this.props;
        // Call API get List Flashcard Category
        callApi("flash_card_category", "GET", { limit: 1000 })
            .then(res => {
                let lstCategory = res.data.data.rows.map(category => {
                    if (typeof category["name"] === "string")
                        category["name"] = JSON.parse(category["name"]);
                    return category;
                });
                this.setState({
                    listCategory: lstCategory,
                    defaultActiveCategoryId: lstCategory[0].id,
                });
                setSelectedCategory(lstCategory[0]);
            })
            .catch(error => {
                console.log(error);
            });
    };

    handleChangeCategory = categoryId => {
        this.setState({ defaultActiveCategoryId: categoryId });
        const { setSelectedCategory } = this.props;
        let selectedCategory = this.state.listCategory.filter(
            category => category.id === categoryId
        );
        setSelectedCategory(selectedCategory[0]);
        this.props.handleCloseDock();
    };

    render() {
        const { t, lstCategoryIdChoosed, to } = this.props;
        const { listCategory, vipMember, defaultActiveCategoryId } = this.state;
        let lstCategoryChoosed = listCategory.filter(category =>
                lstCategoryIdChoosed.includes(category.id)
            ),
            lstCategoryNotChoose = ArrayLodash.difference(
                listCategory,
                lstCategoryChoosed
            );
        let renderLstCategoryChoosed = lstCategoryChoosed.map(
            (category, index) => {
                return (
                    <Col
                        className="p-2 border bg-white position-relative"
                        xs={6}
                        md={2}
                        key={index}
                    >
                        <a
                            href="javascript:;"
                            className={classNames({
                                active: true,
                            })}
                            onClick={() => {
                                this.handleChangeCategory(category.id);
                            }}
                        >
                            <CardImg
                                src={userHelper.concatUrl(category.cover_image)}
                            />
                            <div className="p-1 text-center">
                                <CardTitle>{category.name[to]}</CardTitle>
                            </div>
                            <label
                                className="bg-danger pt-1 pb-1 pr-2 pl-2 text-white rounded"
                                style={{
                                    position: "absolute",
                                    right: "5px",
                                    top: "5px",
                                }}
                            >
                                {t("flash_card.have_cards")}
                            </label>
                        </a>
                    </Col>
                );
            }
        );
        let renderListCategoryNotChoosed = lstCategoryNotChoose.map(
            (category, index) => {
                let renderItem = null;
                if (
                    !vipMember &&
                    index >=
                        FREE_MEMBER_CONSTANTS.MAX_CATEGORY -
                            lstCategoryIdChoosed.length
                )
                    renderItem = (
                        <Fragment>
                            <Badge className="iconCenter" color="warning">
                                VIP
                                <br />
                                <i className="fas fa-crown" />
                            </Badge>
                            <a
                                style={{ opacity: "0.4" }}
                                href="javascript:;"
                                className={classNames({
                                    active: false,
                                })}
                                onClick={e => {
                                    e.preventDefault();
                                }}
                            >
                                <CardImg
                                    top
                                    src={userHelper.concatUrl(
                                        category.cover_image
                                    )}
                                />
                                <div className="p-1 text-center">
                                    <CardTitle>{category.name[to]}</CardTitle>
                                </div>
                            </a>
                        </Fragment>
                    );
                else
                    renderItem = (
                        <a
                            href="javascript:;"
                            className={classNames({
                                active: category.id == defaultActiveCategoryId,
                            })}
                            onClick={() => {
                                this.handleChangeCategory(category.id);
                            }}
                        >
                            <CardImg
                                src={userHelper.concatUrl(category.cover_image)}
                            />
                            <div className="p-1 text-center">
                                <CardTitle>{category.name[to]}</CardTitle>
                            </div>
                            <div className="checked">
                                <div className="icon" />
                            </div>
                        </a>
                    );

                return (
                    <Col
                        className={`p-2 border bg-white checkStyle ${classNames(
                            {
                                selected:
                                    category.id == defaultActiveCategoryId,
                            }
                        )}`}
                        xs={6}
                        md={2}
                        key={index}
                    >
                        {renderItem}
                    </Col>
                );
            }
        );

        return (
            <div className="pb-4 bg-border">
                <Row className="border">
                    {lstCategoryChoosed.length > 0 ? (
                        <Fragment>{renderLstCategoryChoosed} </Fragment>
                    ) : (
                        ""
                    )}
                    {renderListCategoryNotChoosed}
                </Row>
            </div>
        );
    }
}

const tListCategorySelect = translate("common")(ListCategorySelect);
export { tListCategorySelect as ListCategorySelect };
