import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import ChatBubble from "./ChatBubble";
import Panel from "../../../components/Panel";

export default class Conversation extends PureComponent {
    static propTypes = {
        conversationData: PropTypes.array,
    };

    state = {
        currConversation: this.props.conversationData[0],
        conversationActiveIndex: 0,
    };

    onOpenChat = (conversation_index, e) => {
        e.preventDefault();
        this.setState({
            currConversation: this.props.conversationData[conversation_index],
            conversationActiveIndex: conversation_index,
        });
    };

    render() {
        const { conversationData } = this.props;

        return (
            <Fragment>
                {conversationData.map((c, i) => (
                    <Panel
                        key={i}
                        title={c.name}
                        className="p-0-m"
                        titleClassName="m-3-m"
                        collapseClassName="t-3-m"
                    >
                        <div className="chat__dialog-messages p-0-m mt-0-m mb-0-m ml-3-m mr-3-m">
                            {c.data.map((m, i) => (
                                <ChatBubble key={i} message={m} />
                            ))}
                        </div>
                    </Panel>
                ))}
            </Fragment>
        );
    }
}
