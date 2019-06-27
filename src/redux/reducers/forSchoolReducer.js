import {
    UPDATE_CURRENT_SCHOOL,
    UPDATE_CURRENT_DEPARTMENT,
    UPDATE_FOR_SCHOOL_USER_ROLE,
    UPDATE_INFO_STUDENT,
} from "../actions";

const initialState = {
    currSchool: null,
    currDept: null,
    schoolUserRole: null,
    infoStudent: null,
};

export default function(state = initialState, action) {
    switch (action.type) {
        case UPDATE_CURRENT_SCHOOL:
            return { ...state, currSchool: action.school };
        case UPDATE_CURRENT_DEPARTMENT:
            return { ...state, currDept: action.department };
        case UPDATE_FOR_SCHOOL_USER_ROLE:
            return { ...state, schoolUserRole: action.role };
        case UPDATE_INFO_STUDENT:
            return { ...state, infoStudent: action.student };
        default:
            return state;
    }
}
