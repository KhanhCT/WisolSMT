import error_messages_en from "../translations/en/error_messages.json";
import error_messages_vi from "../translations/vi/error_messages.json";
import { updateErrorToStore } from "../redux/actions";

const messages = {
    en: error_messages_en,
    vi: error_messages_vi,
};

export const errorHelper = {
    commonProcessError,
};

function commonProcessError(error, key) {
    let currLanguage = this.props.lng;
    if (currLanguage) currLanguage = currLanguage.split(/[-_]/)[0];
    // Get Browser default language
    if (!currLanguage || currLanguage == undefined)
        currLanguage = navigator.language.split(/[-_]/)[0];
    currLanguage = currLanguage ? currLanguage : "en";
    if (error.response) {
        let errorData = error.response.data;
        switch (errorData.code) {
            case 400:
                this.props.dispatch(
                    updateErrorToStore(messages[currLanguage][key]["ERROR_400"])
                );
                break;
            case 401:
                this.props.dispatch(
                    updateErrorToStore(messages[currLanguage][key]["ERROR_401"])
                );
                break;
            case 404:
                this.props.dispatch(
                    updateErrorToStore(messages[currLanguage][key]["ERROR_404"])
                );
                break;
            case 409:
                this.props.dispatch(
                    updateErrorToStore(messages[currLanguage][key]["ERROR_409"])
                );
                break;
            case 422:
                this.props.dispatch(
                    updateErrorToStore(messages[currLanguage][key]["ERROR_422"])
                );
                break;
            case 500:
                this.props.dispatch(
                    updateErrorToStore(messages[currLanguage][key]["ERROR_500"])
                );
                break;
            default:
                break;
        }
    } else
        this.props.dispatch(
            updateErrorToStore(messages[currLanguage]["NETWORK_ERROR"])
        );
}
