import React from "react";
import { Route, Switch } from "react-router-dom";
import MainWrapper from "./MainWrapper";
import Layout from "../containers/_layout/index";

import NotFound404 from "../containers/default_page/404/index";

// import Profile from "../containers/account/profile/index";
// import EmailConfirmation from "../containers/account/email_confimation/index";
import LogIn from "../containers/account/log_in/index";
import SignUp from "../containers/account/sign_up/index";
// import ValidateRegister from "../containers/account/sign_up/components/ValidateRegister";
// import StudentDashboard from "../containers/dashboards/student/index";

import {
  ROUTES,
} from "../constants";
import {
} from "../components/common";

import { ProductMaster } from "../containers/product_master";
import { ProductionPlan } from "../containers/plan_master";

import {
  LineOrder,
  LineResult,
  ModelResult
} from "../containers/statistic"

const wrappedRoutes = () => (
  <div>
    <Route component={Layout} />
    <div className="container__wrap">
      <Route path={ROUTES.PRODUCT_MASTER} component={ProductMaster} />
      <Route path={ROUTES.PLAN_MASTER} component={ProductionPlan} />

      <Route path={ROUTES.LINE_ORDER} component={LineOrder} />
      <Route path={ROUTES.LINE_RESULT} component={LineResult} />
      <Route path={ROUTES.MODEL_RESULT} component={ModelResult} />
    </div>
  </div>
);

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
