import React from "react";
import { Route, Switch } from "react-router-dom";
import MainWrapper from "./MainWrapper";
import Layout from "../containers/_layout/index";
import { userHelper } from "../helpers";

import NotFound404 from "../containers/default_page/404/index";
// import Calendar from "../containers/default_page/calendar/index";
// import TextEditor from "../containers/default_page/text_editor/index";

// import Profile from "../containers/account/profile/index";
// import EmailConfirmation from "../containers/account/email_confimation/index";
import LogIn from "../containers/account/log_in/index";
import SignUp from "../containers/account/sign_up/index";
// import ValidateRegister from "../containers/account/sign_up/components/ValidateRegister";
// import StudentDashboard from "../containers/dashboards/student/index";

// import Mail from "../containers/mail/index";
// import { MainProfile } from "../containers/account/account_setting";
// import MainActiveAccount from "../containers/account/active_account/MainActiveAccount";
// import { ListBooks, BookDetail, LessionDetail } from "../containers/book";
// import { MainFlashcard } from "../containers/flashcards";
// import { MainAttendanceRecord } from "../containers/attendance_record";
// import {
//   ListVideoBooks,
//   VideoBookDetail,
//   LessionVideoDetail,
//   VideoDetail,
// } from "../containers/video";
// import {
//   ListVideoCategory,
//   ListVideoSubCategory,
//   ListVideoBySubCategory,
//   VideoSubCategoryDetail,
//   ListVideoLanguage,
// } from "../containers/video_category";
// import {
//   ListSchool,
//   MainDepartment,
//   ListClassroom,
//   ListForm,
//   ListTeacher,
//   ListStudent,
//   ListSchedule,
//   ListCourse,
//   ListClass,
//   ListNotification,
//   ListRole,
//   MainForSchoolUser,
//   ListUser,
//   ListTeacherReport,
// } from "../containers/for_school";
// import ReceiveResponse from "../containers/online_payment/ReceiveResponse";
// import ReceiveResponseStudent from "../containers/online_payment/ReceiveResponseStudent";
import {
  ROUTES,
  LIST_ROLES,
  ROLES,
  LIST_RIGHT_FOR_SCHOOL,
  SCHOOL_ROLE_KEY_CHECK,
} from "../constants";
import {
  Authentication,
  Authorization,
  UnauthorizeComponent,
  AuthorizarionSchoolRoute,
} from "../components/common";

// import Newfeeds
// import { NewfeedsMain } from "../containers/newfeeds";

import {
  ListModel,
  ModelStatus,
  GoalMonitor,
  StatusLineChart,
  HistChart,
  TestButton,
} from "../containers/list_model";
import { ProductionPlan } from "../containers/model_register";
import { FactorySchedule } from "../containers/factory_schedule";
import { WorkplaceConfig } from "../containers/workplace_config";
import { DeviceConfig } from "../containers/device_config";
import { LineResult } from "../containers/line_result";
import { ModelResult } from "../containers/model_result";

// List role for allow authorization
// const STUDENT = Authorization(LIST_ROLES.STUDENT);
// const TEACHER = Authorization(LIST_ROLES.TEACHER);

// Apply authorization for list screen
// const LIST_BOOKS = STUDENT(ListBooks);
// const BOOK_DETAIL = STUDENT(BookDetail);
// const LESSON_DETAIL = STUDENT(LessionDetail);

const wrappedRoutes = () => (
  <div>
    <Route component={Layout} />
    <div className="container__wrap">
      {/* ThanhTT Custom */}
      {/* <Route path="/account-settings" component={MainProfile} /> */}
      {/* <Route path="/vietnamese-books" component={Books} /> */}
      {/* <Route path="/flashcards" component={MainFlashcard} /> */}
      {/* <Route
                path="/attendance_records"
                component={MainAttendanceRecord}
            /> */}
      {/* <Route path="/learn-vietnamese-video" component={Videos} />
      <Route path="/dashboard_student" component={StudentDashboard} />
      <Route path="/video-category" component={VideoCategories} />
      <Route path="/video-languages" component={ListVideoLanguage} />
      <Route path="/for-schools" component={ForSchools} />
      <Route path="/active-account" component={MainActiveAccount} />
      <Route path="/newfeeds" component={NewfeedsMain} />
      <Route path="/receiver_response" component={ReceiveResponse} /> */}
      <Route path={ROUTES.LIST_MODEL} component={ListModel} />
      <Route path={ROUTES.MODEL_STATUS} component={ModelStatus} />
      <Route path={ROUTES.MODEL_REGISTER} component={ProductionPlan} />
      <Route path={ROUTES.FACTORY_SCHEDULE} component={FactorySchedule} />
      <Route path={ROUTES.WORKPLACE_CONFIG} component={WorkplaceConfig} />
      <Route path={ROUTES.DEVICE_CONFIG} component={DeviceConfig} />
      <Route path={ROUTES.GOAL_MONITOR} component={GoalMonitor} />
      <Route path={ROUTES.LINE_RESULT} component={LineResult} />
      <Route path={ROUTES.MODEL_RESULT} component={ModelResult} />
      {/* <Route path={ROUTES.STATUS_LINE_CHART} component={StatusLineChart} />
      <Route path={ROUTES.HIST_CHART} component={HistChart} />
      <Route path={ROUTES.LIST_MACHINE} component={TestButton} /> */}
      {/* <Route
        path="/receiver_response_student"
        component={ReceiveResponseStudent}
      /> */}
      <Route exact path="/" component={LineResult} />
    </div>
  </div>
);

// const Videos = () => (
//   <Switch>
//     <Route
//       path="/learn-vietnamese-video/:book_id/:lession_id/:video_id"
//       component={VideoDetail}
//     />
//     <Route
//       path="/learn-vietnamese-video/:book_id/:lession_id"
//       component={LessionVideoDetail}
//     />
//     <Route
//       path="/learn-vietnamese-video/:book_id"
//       component={VideoBookDetail}
//     />
//     <Route path="/learn-vietnamese-video" component={ListVideoBooks} />
//   </Switch>
// );

// const Books = () => (
//   <Switch>
//     <Route
//       path="/vietnamese-books/:book_code/:lession_code"
//       component={LESSON_DETAIL}
//     />
//     <Route path="/vietnamese-books/:book_code" component={BOOK_DETAIL} />
//     <Route path="/vietnamese-books" component={LIST_BOOKS} />
//   </Switch>
// );

// const VideoCategories = () => (
//   <Switch>
//     <Route
//       path="/video-category/sub/videos/details"
//       component={VideoSubCategoryDetail}
//     />
//     <Route
//       path="/video-category/sub/videos"
//       component={ListVideoBySubCategory}
//     />
//     <Route path="/video-category/subs" component={ListVideoSubCategory} />
//     <Route path="/video-category" component={ListVideoCategory} />
//   </Switch>
// );

/** Check user has role view for school side bar
 * Check "is_school_member" from token
 * if true, user has permision to view for school side bar
 */

/**
 * Authorize rights for company
 */

// DEPARTMENT
// const DEPARTMENT_RIGHTS = LIST_RIGHT_FOR_SCHOOL["DEPARTMENT"];
// const ListClassroomAuthorize = AuthorizarionSchoolRoute(
//   DEPARTMENT_RIGHTS["ROOM"]["VIEW"],
//   SCHOOL_ROLE_KEY_CHECK["DEPARTMENT"]
// )(ListClassroom);

// const ListFormAuthorize = AuthorizarionSchoolRoute(
//   DEPARTMENT_RIGHTS["STUDY_METHOD"]["VIEW"],
//   SCHOOL_ROLE_KEY_CHECK["DEPARTMENT"]
// )(ListForm);

// const ListTeacherAuthorize = AuthorizarionSchoolRoute(
//   DEPARTMENT_RIGHTS["TEACHER"]["VIEW"],
//   SCHOOL_ROLE_KEY_CHECK["DEPARTMENT"]
// )(ListTeacher);

// const ListStudentAuthorize = AuthorizarionSchoolRoute(
//   DEPARTMENT_RIGHTS["STUDENT"]["VIEW"],
//   SCHOOL_ROLE_KEY_CHECK["DEPARTMENT"]
// )(ListStudent);

// const ListScheduleAuthorize = AuthorizarionSchoolRoute(
//   DEPARTMENT_RIGHTS["SCHEDULE"]["VIEW"],
//   SCHOOL_ROLE_KEY_CHECK["DEPARTMENT"]
// )(ListSchedule);

// const ListCourseAuthorize = AuthorizarionSchoolRoute(
//   DEPARTMENT_RIGHTS["COURSE"]["VIEW"],
//   SCHOOL_ROLE_KEY_CHECK["DEPARTMENT"]
// )(ListCourse);

// const ListClassAuthorize = AuthorizarionSchoolRoute(
//   DEPARTMENT_RIGHTS["CLASS"]["VIEW"],
//   SCHOOL_ROLE_KEY_CHECK["DEPARTMENT"]
// )(ListClass);

// const ListRoleAuthorize = AuthorizarionSchoolRoute(
//   DEPARTMENT_RIGHTS["ROLE"]["VIEW"],
//   SCHOOL_ROLE_KEY_CHECK["DEPARTMENT"]
// )(ListRole);

// const ListUserAuthorize = AuthorizarionSchoolRoute(
//   DEPARTMENT_RIGHTS["STAFF"]["VIEW"],
//   SCHOOL_ROLE_KEY_CHECK["DEPARTMENT"]
// )(ListUser);

// const ListTeacherReportAuthorize = AuthorizarionSchoolRoute(
//   DEPARTMENT_RIGHTS["STAFF"]["VIEW"],
//   SCHOOL_ROLE_KEY_CHECK["DEPARTMENT"]
// )(ListTeacherReport);

// const ForSchools = () => {
//   let userStorage = userHelper.getUserFromStorage();
//   if (userStorage && userStorage.is_school_member)
//     return (
//       <Switch>
//         <Route
//           path="/for-schools/:school_code/:department_code/classroom"
//           component={ListClassroomAuthorize}
//         />
//         <Route
//           path="/for-schools/:school_code/:department_code/form"
//           component={ListFormAuthorize}
//         />
//         <Route
//           path="/for-schools/:school_code/:department_code/teacher"
//           component={ListTeacherAuthorize}
//         />
//         <Route
//           path="/for-schools/:school_code/:department_code/student"
//           component={ListStudentAuthorize}
//         />
//         <Route
//           path="/for-schools/:school_code/:department_code/schedule"
//           component={ListScheduleAuthorize}
//         />
//         <Route
//           path="/for-schools/:school_code/:department_code/course"
//           component={ListCourseAuthorize}
//         />
//         <Route
//           path="/for-schools/:school_code/:department_code/class"
//           component={ListClassAuthorize}
//         />
//         <Route
//           path="/for-schools/:school_code/:department_code/notification"
//           component={ListNotification}
//         />
//         <Route
//           path="/for-schools/:school_code/:department_code/role"
//           component={ListRoleAuthorize}
//         />
//         <Route
//           path="/for-schools/:school_code/:department_code/user"
//           component={ListUserAuthorize}
//         />
//         <Route
//           path="/for-schools/:school_code/:department_code/report"
//           component={ListTeacherReportAuthorize}
//         />
//         <Route
//           path="/for-schools/:school_code/:department_code"
//           component={MainForSchoolUser}
//         />
//         <Route path="/for-schools/:school_code" component={MainDepartment} />
//         <Route path="/for-schools" component={ListSchool} />
//       </Switch>
//     );
//   return <UnauthorizeComponent />;
// };

/** WRAPPED MAIN URL BY AUTHENTICATION */
// const WRAPPED_ROUTES = Authentication(wrappedRoutes);
const WRAPPED_ROUTES = wrappedRoutes;

const Router = () => (
  <MainWrapper>
    <main>
      <Switch>
        <Route path="/404" component={NotFound404} />
        {/* <Route path={ROUTES.LOGIN} component={LogIn} /> */}
        {/* <Route path={ROUTES.SIGNUP} component={SignUp} /> */}
        <Route path="/" component={WRAPPED_ROUTES} />
      </Switch>
    </main>
  </MainWrapper>
);

export default Router;
