export const GET_ERROR_FROM_STORE = "GET_ERROR_FROM_STORE";
export const UPDATE_ERROR_TO_STORE = "UPDATE_ERROR_TO_STORE";

export function getErrorFromStore() {
    return {
        type: GET_ERROR_FROM_STORE,
    };
}

export function updateErrorToStore(error) {
    return {
        type: UPDATE_ERROR_TO_STORE,
        error,
    };
}
