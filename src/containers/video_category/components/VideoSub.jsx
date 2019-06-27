import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Badge } from "reactstrap";
import { utilHelper } from "../../../helpers";

export default class VideoSub extends PureComponent {
    static propTypes = {
        sub: PropTypes.object.isRequired,
        active: PropTypes.bool,
    };

    render() {
        const { subId, sub, active } = this.props;
        let subClass = classNames({
            chat__contact: true,
            "chat__contact--active": active,
        });

        // let renderSpan = null;
        // if (sub.vi_sub.length > 0) {
        //     renderSpan = sub.vi_sub.map((item, i) => {
        //         return (
        //             <span style={{ marginRight: "5px" }} key={i}>
        //                 {item}
        //             </span>
        //         );
        //     });
        // }

        return (
            <div className={subClass}>
                <div
                    className="chat__contact-avatar rounded-0"
                    style={{
                        height: "auto",
                    }}
                >
                    <Badge>{utilHelper.formatSecondToTime(subId)}</Badge>
                </div>
                <div className="chat__contact-preview sub-preview">
                    <p className="chat__contact-name text-sub-vi">
                        {sub.vi_sub}
                    </p>
                    <p className="chat__contact-post text-sub-en">
                        {sub.en_sub}
                    </p>
                </div>
            </div>
        );
    }
}
