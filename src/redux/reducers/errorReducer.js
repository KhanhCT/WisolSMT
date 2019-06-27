import {
    GET_ERROR_FROM_STORE,
    UPDATE_ERROR_TO_STORE,
} from "../actions/errorActions";

const initialState = {
    error: null,
};

export default function(state = initialState, action) {
    switch (action.type) {
        case GET_ERROR_FROM_STORE:
            return state;
        case UPDATE_ERROR_TO_STORE:
            return { ...state, error: action.error };
        default:
            return state;
    }
}
