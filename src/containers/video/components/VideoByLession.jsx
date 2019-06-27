import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default class VideoByLession extends PureComponent {
    static propTypes = {
        video: PropTypes.object.isRequired,
        active: PropTypes.bool,
    };

    render() {
        const { video, active } = this.props;
        let subClass = classNames({
            chat__contact: true,
            "chat__contact--active": active,
        });

        return (
            <div className={subClass}>
                <div className="chat__contact-avatar">
                    <img
                        src={process.env.PUBLIC_URL + "/img/11.png"}
                        alt="ava"
                    />
                </div>
                <div className="chat__contact-preview">
                    <p className="chat__contact-name">{video.name}</p>
                    {/* <p
                        className="chat__contact-post"
                        dangerouslySetInnerHTML={{
                            __html: video.description,
                        }}
                    /> */}
                </div>
            </div>
        );
    }
}
