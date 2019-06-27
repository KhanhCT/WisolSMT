import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default class ChatUser extends PureComponent {
    static propTypes = {
        conversation: PropTypes.object,
        conversation_index: PropTypes.number,
        active: PropTypes.bool,
    };

    render() {
        const { active, conversation, conversation_index } = this.props;
        let contactClass = classNames({
            chat__contact: true,
            "chat__contact--active": active,
        });

        return (
            <div className={contactClass}>
                {/* <div className="chat__contact-avatar">
                    <img src={contact.avatar} alt="ava" />
                </div> */}
                <div className="chat__contact-preview">
                    <p className="chat__contact-name">
                        {conversation.name
                            ? conversation.name
                            : `Conversation ${conversation_index}`}
                    </p>
                    {/* <p className="chat__contact-post">{contact.post}</p> */}
                </div>
            </div>
        );
    }
}
