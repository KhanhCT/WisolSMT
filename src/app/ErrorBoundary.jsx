import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { userHelper } from "../helpers";
import { updateErrorToStore } from "../redux/actions";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { dispatch } = nextProps;
        if (nextProps.error_store) {
            userHelper.showErrorMessage(nextProps.error_store.message);
            dispatch(updateErrorToStore(null));
        }
        return null;
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        this.setState({ hasError: true });
        // You can also log the error to an error reporting service
        // logErrorToMyService(error, info);
    }

    render() {
        // if (this.state.hasError) {
        //     // You can render any custom fallback UI
        //     return <h1>Render UI Error</h1>;
        // }
        return this.props.children;
    }
}

const mapStateToProp = state => {
    return {
        error_store: state.errorReducer.error,
    };
};

export default connect(mapStateToProp)(ErrorBoundary);
