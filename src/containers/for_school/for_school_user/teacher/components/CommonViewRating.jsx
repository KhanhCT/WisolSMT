import React, { Component } from "react";
import Rating from "react-rating";

export default class CommonViewRating extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { initialValue } = this.props;
        return (
            <Rating
                initialRating={initialValue}
                emptySymbol={<i className="fal fa-star" />}
                fullSymbol={
                    <i
                        className="fas fa-star"
                        style={{ color: "rgb(255, 180, 0)" }}
                    />
                }
                readonly={true}
            />
        );
    }
}
