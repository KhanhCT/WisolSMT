import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import MenuIcon from "mdi-react/MenuIcon";
import MoreVertIcon from "mdi-react/MoreVertIcon";
import VideoIcon from "mdi-react/VideoIcon";
import PhoneIcon from "mdi-react/PhoneIcon";
import StarIcon from "mdi-react/StarIcon";

export default class ChatTopbar extends PureComponent {
    static propTypes = {
        conversation: PropTypes.object,
    };

    render() {
        const { conversation } = this.props;

        return (
            <div className="chat__topbar">
                {/* <button
                    className="chat__topbar-button chat__topbar-button--menu"
                    onClick={onClick}
                >
                    <MenuIcon className="chat__topbar-button-icon" />
                </button> */}
                {conversation && (
                    <div className="chat__topbar-contact">
                        <p className="chat__topbar-contact-name">
                            {conversation.name}
                        </p>
                        {/* <p className="chat__topbar-contact-post">
                            {conversation.name}
                        </p> */}
                    </div>
                )}
            </div>
        );
    }
}
