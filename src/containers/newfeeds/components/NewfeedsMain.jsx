import React, { Component } from "react";
import { Container, Row, Col, Card } from "reactstrap";
import { translate } from "react-i18next";

export default class NewfeedsMain extends Component {
    render() {
        return (
            <Container>
                <Row>
                    <Col sm="12" md="8">
                        <Card>
                            <div className="box-shadow-1 rounded mt-3 newfeed_posts p-3">
                                <div className="d-flex newfeed_post">
                                    <div
                                        className="newfeed_post_content_img mr-2"
                                        style={{ width: "48px" }}
                                    >
                                        <img src="images/lang-vi.png" />
                                    </div>
                                    <div className="flex-grow-1 newfeed_post_content">
                                        <div className="newfeed_post_content_desc">
                                            <textarea
                                                class="form-control"
                                                rows="1"
                                                id="comment"
                                                placeholder="Hello …"
                                                style={{
                                                    borderRadius: 0,
                                                    borderTop: 0,
                                                    borderLeft: 0,
                                                    borderRight: 0,
                                                }}
                                            />
                                        </div>
                                        <div className="newfeed_post_content_title">
                                            <input
                                                type="text"
                                                class="form-control"
                                                placeholder="Title"
                                                style={{
                                                    borderRadius: 0,
                                                    borderTop: 0,
                                                    borderLeft: 0,
                                                    borderRight: 0,
                                                }}
                                                id="usr"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col sm="12" md="4">
                        aa
                    </Col>
                </Row>
            </Container>
        );
    }
}
const tNewfeedsMain = translate(["common"])(NewfeedsMain);
export { tNewfeedsMain as NewfeedsMain };
