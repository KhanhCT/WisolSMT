import React, { PureComponent } from "react";
import { translate } from "react-i18next";
import { Collapse } from "reactstrap";

const gb = process.env.PUBLIC_URL + "/img/language/gb.png";
const fr = process.env.PUBLIC_URL + "/img/language/fr.png";
const de = process.env.PUBLIC_URL + "/img/language/de.png";
const vi = process.env.PUBLIC_URL + "/img/language/vi.png";

const GbLng = () => (
    <span className="topbar__language-btn-title">
        <img src={gb} alt="gb" />
        <span>EN</span>
    </span>
);

const FrLng = () => (
    <span className="topbar__language-btn-title">
        <img src={fr} alt="fr" />
        <span>FR</span>
    </span>
);

const DeLng = () => (
    <span className="topbar__language-btn-title">
        <img src={de} alt="de" />
        <span>DE</span>
    </span>
);

const ViLng = () => (
    <span className="topbar__language-btn-title">
        <img src={vi} alt="vi" />
        <span>VI</span>
    </span>
);

class ChangeLanguage extends PureComponent {
    constructor() {
        super();
        var userLang = navigator.language || navigator.userLanguage;
        try {
            userLang = userLang.split("-")[0];
        } catch (error) {
            userLang = "en";
        }
        let mainButtonContent = <GbLng />;
        switch (userLang) {
            case "en":
                mainButtonContent = <GbLng />;
                break;
            case "vi":
                mainButtonContent = <ViLng />;
                break;
            default:
                break;
        }
        this.state = {
            collapse: false,
            mainButtonContent: mainButtonContent,
        };
    }

    toggle = () => {
        this.setState({ collapse: !this.state.collapse });
    };

    changeLanguage = lng => {
        this.props.i18n.changeLanguage(lng);
        switch (lng) {
            case "en":
                this.setState({ mainButtonContent: <GbLng /> });
                break;
            case "fr":
                this.setState({ mainButtonContent: <FrLng /> });
                break;
            case "de":
                this.setState({ mainButtonContent: <DeLng /> });
                break;
            case "vi":
                this.setState({ mainButtonContent: <ViLng /> });
                break;
            default:
                this.setState({ mainButtonContent: <GbLng /> });
                break;
        }
        this.setState({ collapse: false });
    };

    render() {
        const { t } = this.props;
        return (
            <div className="mt-2">
                <div className="text-center">
                    <div className="mr-2" style={{ display: "inline-block" }}>
                        {t("common.choose_language")}
                    </div>
                    <div
                        className="topbar__collapse topbar__collapse--language"
                        style={{
                            display: "inline-block",
                            border: "1px solid #d7d7d7",
                            borderRadius: "16px",
                            padding: "5px 8px",
                        }}
                    >
                        <button className="topbar__btn" onClick={this.toggle}>
                            {this.state.mainButtonContent}
                            {/* <DownIcon className="topbar__icon" /> */}
                        </button>
                        <Collapse
                            isOpen={this.state.collapse}
                            // className="topbar__collapse-content topbar__collapse-content--language"
                        >
                            <button
                                className="topbar__language-btn p-0"
                                type="button"
                                onClick={() => this.changeLanguage("en")}
                            >
                                <GbLng />
                            </button>
                            {/* <button
                        className="topbar__language-btn"
                        type="button"
                        onClick={() => this.changeLanguage("fr")}
                    >
                        <FrLng />
                    </button>
                    <button
                        className="topbar__language-btn"
                        type="button"
                        onClick={() => this.changeLanguage("de")}
                    >
                        <DeLng />
                    </button> */}
                            <button
                                className="topbar__language-btn p-0"
                                type="button"
                                onClick={() => this.changeLanguage("vi")}
                            >
                                <ViLng />
                            </button>
                        </Collapse>
                    </div>
                </div>
            </div>
        );
    }
}

export default translate("common")(ChangeLanguage);
