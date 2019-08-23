import React, { Component } from "react";
import { Input, FormGroup, Label, Row, Col } from "reactstrap";
import { translate } from "react-i18next";
import { callApi } from "../../../../helpers";

class ListCountrySelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listCountry: [],
        };
    }
    componentDidMount = () => {
        this.getListCountries();
    };

    getListCountries = () => {
        // Call API get List country
        callApi("countries", "GET", { limit: 1000 })
            .then(res => {
                this.setState({
                    listCountry: res.data.data.rows,
                });
            })
            .catch(error => {
                console.log(error);
            });
    };

    handleChangeCountry = e => {
        const { setSelectedCountry } = this.props;
        let countryIndex = e.target.value;
        let selectedCountry = this.state.listCountry[countryIndex];
        setSelectedCountry(selectedCountry);
    };

    render() {
        const { listCountry } = this.state;
        const { t, selectedCountry } = this.props;
        let renderListCountry = null;
        let defautlCountryIndex = null;
        if (listCountry.length > 0) {
            renderListCountry = listCountry.map((country, index) => {
                if (selectedCountry)
                    if (selectedCountry.id == country.id)
                        defautlCountryIndex = index;
                return (
                    <option key={index} value={index}>
                        {country.nicename}
                    </option>
                );
            });
        }
        return (
            <Row>
                <Col sm={12}>
                    <FormGroup>
                        <Label for="select-country">
                            {t("account.profile.choose_country")}
                        </Label>
                        <Input
                            type="select"
                            name="select-country"
                            id="select-country"
                            value={defautlCountryIndex}
                            onChange={this.handleChangeCountry}
                        >
                            {renderListCountry}
                        </Input>
                    </FormGroup>
                </Col>
            </Row>
        );
    }
}

const tListCountrySelect = translate("common")(ListCountrySelect);
export { tListCountrySelect as ListCountrySelect };
