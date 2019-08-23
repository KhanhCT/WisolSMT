export const ROLES = {
    TEACHER: "teacher",
    STUDENT: "student",
    ADMINISTRATOR: "administrator",
};

export const LIST_ROLES = {
    STUDENT: [ROLES.STUDENT, ROLES.ADMINISTRATOR],
    TEACHER: [ROLES.TEACHER, ROLES.ADMINISTRATOR],
    ADMINISTRATOR: [ROLES.ADMINISTRATOR],
};

export const RIGHT_PERMISSION_OF_SCHOOL_ADMIN = [
    // For Director
    {
        value: "100_1",
        label: "Quản lý trường học",
        children: [
            { value: "100_1_1", label: "Thêm" },
            { value: "100_1_2", label: "Sửa" },
            { value: "100_1_3", label: "Xoá" },
        ],
    },
];

export const RIGHT_PERMISSION_OF_DIRECTOR = [
    {
        value: "200_1",
        label: "Quản lý cơ sở",
        children: [
            { value: "200_1_1", label: "Thêm" },
            { value: "200_1_2", label: "Sửa" },
            { value: "200_1_3", label: "Xóa" },
        ],
    },
    {
        value: "200_3",
        label: "Quản lý giám đốc cơ sở",
        children: [
            { value: "200_3_1", label: "Thêm" },
            { value: "200_3_2", label: "Sửa" },
            { value: "200_3_3", label: "Xóa" },
        ],
    },
];

export const RIGHT_PERMISSION_OF_DEPARTMENT = [
    // For Manager and Department's Staff
    {
        value: "300_1",
        label: "Quản lý phòng học",
        children: [
            { value: "300_1_1", label: "Thêm" },
            { value: "300_1_2", label: "Sửa" },
            { value: "300_1_3", label: "Xóa" },
        ],
    },
    {
        value: "300_2",
        label: "Quản lý hình thức học",
        children: [
            { value: "300_2_1", label: "Thêm" },
            { value: "300_2_2", label: "Sửa" },
            { value: "300_2_3", label: "Xóa" },
        ],
    },
    {
        value: "300_3",
        label: "Quản lý khoá học",
        children: [
            { value: "300_3_1", label: "Thêm" },
            { value: "300_3_2", label: "Sửa" },
            { value: "300_3_3", label: "Xóa" },
        ],
    },
    {
        value: "300_4",
        label: "Quản lý lớp học",
        children: [
            { value: "300_4_1", label: "Thêm" },
            { value: "300_4_2", label: "Sửa" },
            { value: "300_4_3", label: "Xóa" },
        ],
    },
    {
        value: "300_5",
        label: "Quản lý giáo viên",
        children: [
            { value: "300_5_1", label: "Thêm" },
            { value: "300_5_2", label: "Sửa" },
            { value: "300_5_3", label: "Xóa" },
        ],
    },
    {
        value: "300_6",
        label: "Quản lý học viên",
        children: [
            { value: "300_6_1", label: "Thêm" },
            { value: "300_6_2", label: "Sửa" },
            { value: "300_6_3", label: "Xóa" },
        ],
    },
    {
        value: "300_7",
        label: "Quản lý thời khóa biểu",
        children: [
            { value: "300_7_1", label: "Thêm" },
            { value: "300_7_2", label: "Sửa" },
            { value: "300_7_3", label: "Xóa" },
        ],
    },
    {
        value: "300_8",
        label: "Quản lý quyền",
        children: [
            { value: "300_8_1", label: "Thêm" },
            { value: "300_8_2", label: "Sửa" },
            { value: "300_8_3", label: "Xóa" },
        ],
    },
    {
        value: "300_9",
        label: "Quản lý nhân viên",
        children: [
            { value: "300_9_1", label: "Thêm" },
            { value: "300_9_2", label: "Sửa" },
            { value: "300_9_3", label: "Xóa" },
        ],
    },
];

export const TMP = [
    // For Teacher
    {
        value: "400",
        label: "Teacher",
    },
    // For Student
    {
        value: "500",
        label: "Student",
    },
];

export const LIST_RIGHT_FOR_SCHOOL = {
    ADMIN: {
        SCHOOL: {
            ADD: "100_1_1",
            EDIT: "100_1_2",
            DELETE: "100_1_3",
        },
    },
    SCHOOL: {
        // department
        DEPARTMENT: {
            VIEW: "200_1",
            ADD: "200_1_1",
            EDIT: "200_1_2",
            DELETE: "200_1_3",
        },
        // department's manager
        DEPARTMENT_MANAGER: {
            VIEW: "200_2",
            ADD: "200_2_1",
            EDIT: "200_2_2",
            DELETE: "200_2_3",
        },
    },
    DEPARTMENT: {
        // room
        ROOM: {
            ADD: "300_1_1",
            EDIT: "300_1_2",
            DELETE: "300_1_3",
            VIEW: "300_1",
        },
        // study method
        STUDY_METHOD: {
            ADD: "300_2_1",
            EDIT: "300_2_2",
            DELETE: "300_2_3",
            VIEW: "300_2",
        },
        // course
        COURSE: {
            ADD: "300_3_1",
            EDIT: "300_3_2",
            DELETE: "300_3_3",
            VIEW: "300_3",
        },
        // class
        CLASS: {
            ADD: "300_4_1",
            EDIT: "300_4_2",
            DELETE: "300_4_3",
            VIEW: "300_4",
        },
        // teacher
        TEACHER: {
            ADD: "300_5_1",
            EDIT: "300_5_2",
            DELETE: "300_5_3",
            VIEW: "300_5",
        },
        // student
        STUDENT: {
            ADD: "300_6_1",
            EDIT: "300_6_2",
            DELETE: "300_6_3",
            VIEW: "300_6",
        },
        // schedule
        SCHEDULE: {
            ADD: "300_7_1",
            EDIT: "300_7_2",
            DELETE: "300_7_3",
            VIEW: "300_7",
        },
        // role
        ROLE: {
            ADD: "300_8_1",
            EDIT: "300_8_2",
            DELETE: "300_8_3",
            VIEW: "300_8",
        },
        // staff
        STAFF: {
            ADD: "300_9_1",
            EDIT: "300_9_2",
            DELETE: "300_9_3",
            VIEW: "300_9",
        },
    },
    TEACHER: "400",
    STUDENT: "500",
};

export const SCHOOL_ROLE_KEY_CHECK = {
    SCHOOL: "schools",
    DEPARTMENT: "departments",
    DIRECTOR: "director",
};
