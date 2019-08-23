export const UPDATE_CURRENT_SCHOOL = "UPDATE_CURRENT_SCHOOL";
export const UPDATE_CURRENT_DEPARTMENT = "UPDATE_CURRENT_DEPARTMENT";
export const UPDATE_FOR_SCHOOL_USER_ROLE = "UPDATE_FOR_SCHOOL_USER_ROLE";
export const UPDATE_INFO_STUDENT = "UPDATE_INFO_STUDENT";

export function updateCurrentSchool(school) {
    return {
        type: UPDATE_CURRENT_SCHOOL,
        school,
    };
}

export function updateCurrentDept(department) {
    return {
        type: UPDATE_CURRENT_DEPARTMENT,
        department,
    };
}

export function updateForSchoolUserRole(role) {
    return {
        type: UPDATE_FOR_SCHOOL_USER_ROLE,
        role,
    };
}

export function updateInfoStudent(student) {
    return {
        type: UPDATE_INFO_STUDENT,
        student,
    };
}
