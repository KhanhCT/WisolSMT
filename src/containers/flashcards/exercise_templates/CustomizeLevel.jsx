import React, { Component } from "react";
import { Container, Row, Col, Card, CardBody, Button } from "reactstrap";
import ToogleSetNumberQuestion from "./ToogleSetNumberQuestion";
import ToogleSetLevel from "./ToogleSetLevel";
import { translate } from "react-i18next";

class CustomizeLevel extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {
            numberQuestion,
            onChangeNumberQuestion,
            changeCustomiseInfo,
            level,
            onChangeLevel,
            t,
        } = this.props;
        return (
            <Container className="mw-960 sm-pl-1 sm-pr-1">
                <div className="text-center">
                    <h1 className="bg-lightgrey inline-block pl-2 pr-2 sm-fontSize22">
                        {t("exerise.customise_level.header")}
                    </h1>
                    <p>{t("exerise.customise_level.content1")}</p>
                </div>
                <Row>
                    <Col sm={12}>
                        <Card>
                            <CardBody>
                                <ToogleSetNumberQuestion
                                    value={numberQuestion}
                                    onChangeNumberQuestion={
                                        onChangeNumberQuestion
                                    }
                                />
                            </CardBody>
                        </Card>
                    </Col>
                    <Col sm={12}>
                        <Card>
                            <CardBody>
                                <ToogleSetLevel
                                    level={level}
                                    onChangeLevel={onChangeLevel}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <center>
                    <Button color="primary" onClick={changeCustomiseInfo}>
                        {t("exerise.customise_level.button")}
                    </Button>
                </center>
            </Container>
        );
    }
}

export default translate("common")(CustomizeLevel);
