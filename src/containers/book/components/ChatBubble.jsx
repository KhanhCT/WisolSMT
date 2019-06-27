import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { apiConfigs } from "../../../constants";
import moment from "moment";
import { Button } from "reactstrap";

export default class ChatBubble extends PureComponent {
    static propTypes = {
        message: PropTypes.object.isRequired,
        active: PropTypes.bool,
    };

    handlePlayAudio = () => {
        // new Audio(
        //     "https://s3-ap-southeast-1.amazonaws.com/hanaspeak/audios/2018-4-6-18-41-35_track03.mp3"
        // ).play();
    };

    render() {
        const { message, active } = this.props;
        let bubbleClass = classNames({
            chat__bubble: true,
            "chat__bubble--active": message.type === "left" ? true : false,
        });

        return (
            <div className={bubbleClass}>
                <div className="chat__bubble-avatar">
                    <img
                        src={`${apiConfigs.CMS_BASE_URL}/${message["image"]}`}
                        alt="ava"
                    />
                </div>
                <div className="chat__bubble-message-wrap">
                    {/* <p className="chat__bubble-contact-name">{message.type}</p> */}
                    <p className="chat__bubble-message">
                        {message.content}{" "}
                        <Button
                            onClick={this.handlePlayAudio}
                            style={{
                                marginLeft: "10px",
                                marginBottom: "0px",
                                borderRadius: "22px",
                                padding: "10px 12px",
                                position: "absolute",
                                top: "0px",
                                right: "-20px",
                            }}
                            color="danger"
                            outline
                        >
                            <i className="fas fa-headphones fa-lg" />
                        </Button>
                    </p>
                    {/* <p className="chat__bubble-date">{moment().format("LT")}</p> */}
                </div>
            </div>
        );
    }
}
