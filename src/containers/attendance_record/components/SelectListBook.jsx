import React, { Component } from "react";
import classNames from "classnames";
import { FormGroup, Label, Input } from "reactstrap";
import { callApi } from "../../../helpers";
import { translate } from "react-i18next";
import { apiConfigs } from "../../../constants";

class SelectListBook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lstBook: [],
            indexCheckActive: 0,
        };
    }

    componentDidMount = () => {
        this.getLstBook();
    };

    getLstBook = () => {
        const { setCurrBook } = this.props;
        callApi("books", "GET", null)
            .then(res => {
                this.setState({ lstBook: res.data.data.rows });
                setCurrBook(res.data.data.rows[0]);
            })
            .catch(error => {
                this.setState({ error: error });
            });
    };

    handleChangeBook = index => {
        const { setCurrBook } = this.props;
        this.setState({ indexCheckActive: index });
        setCurrBook(this.state.lstBook[index]);
    };

    render() {
        const { lstBook, indexCheckActive } = this.state;
        const { t } = this.props;
        let renderLstBook = null;
        if (lstBook.length > 0) {
            renderLstBook = lstBook.map((item, index) => {
                return (
                    <li key={index} value={index}>
                        <a
                            href="javascrit:;"
                            className={classNames({
                                active: indexCheckActive === index,
                            })}
                            onClick={() => {
                                this.handleChangeBook(index);
                            }}
                            title={item.name}
                        >
                            {item.cover_image ? (
                                <img
                                    src={`${apiConfigs.BASE_IMAGE_URL}${
                                        item.cover_image
                                    }`}
                                    style={{ width: "60%" }}
                                />
                            ) : (
                                <img src="img/1.png" style={{ width: "60%" }} />
                            )}

                            <span>{item.name}</span>
                        </a>
                    </li>
                );
            });
        }
        return (
            <FormGroup>
                {/* <Label for="choose-book">
                    {t("attendance_record.select_book")}
                </Label> */}
                <ul className="overflowNav">{renderLstBook}</ul>
            </FormGroup>
        );
    }
}

export default translate("common")(SelectListBook);
