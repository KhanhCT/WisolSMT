import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { apiConfigs } from "../../../constants";

export default class VideoBySubCategory extends PureComponent {
    static propTypes = {
        video: PropTypes.object.isRequired,
        active: PropTypes.bool,
    };

    render() {
        const { video, active } = this.props;
        let subClass = classNames({
            proposed_posts: true,
            active: active,
        });

        return (
            <div className={subClass}>
                <div className="proposed_post d-flex pt-2 pb-2">
                    <div className="proposed_posts_image">
                        {/* <img
                            src={process.env.PUBLIC_URL + "/img/11.png"}
                            alt="ava"
                        /> */}
                        {video.cover_image ? (
                            <img
                                src={`${apiConfigs.BASE_IMAGE_URL}${
                                    video.cover_image
                                }`}
                                alt={video.name}
                                style={{
                                    height: "100%",
                                    borderRadius: "3px",
                                }}
                            />
                        ) : (
                            <img
                                src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180"
                                alt="Card image cap"
                                style={{
                                    height: "100%",
                                    borderRadius: "7px",
                                }}
                            />
                        )}
                    </div>
                    <div className="chat__contact-preview">
                        <p className="chat__contact-name">{video.name}</p>
                        {/* <p className="chat__contact-post">{video.description}</p> */}
                    </div>
                </div>
            </div>
        );
    }
}
