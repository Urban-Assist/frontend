import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import Home from "./pages/Home";
import "./App.css";
import { frontendRoutes } from "./utils/frontendRoutes";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import LoadAnimation from "./components/LoadAnimation";
import Header from "./components/Header";
import AdminHeader from "./components/AdminHeader";
import AdminDashboard from "./pages/AdminDashboard";
import MyBookings from "./pages/MyBookings";
import Redirect from "./components/Redirect";

const stripePromise = loadStripe('pk_test_51QnViyF1vLG8nlrHDfi0ryxde9fiAT2Mm3ND780vXmb3r7YbNZ2wPPrVMgAhUaT4h8UKbU8TTff6ed3woPYPYSrh007ojJgaVA');

const UserDashboard = React.lazy(() => import("./pages/UserDashboard"));
const ProviderDashboard = React.lazy(() => import("./pages/ProviderDashboard"));
const ServiceProviders = React.lazy(() => import("./pages/ServiceProviders"));
const PortfolioPage = React.lazy(() => import("./pages/PortfolioPage"));
const Login = React.lazy(() => import("./pages/Login"));
const RegistrationPage = React.lazy(() => import("./pages/Registration"));
const ProviderAvailibility = React.lazy(() => import("./pages/ProviderAvailibility"));
const ClientBookingPage = React.lazy(() => import("./pages/BookingSlots"));
const PortfolioMakerPage = React.lazy(() => import("./pages/PortfolioMaker"));
const TermsAndConditions = React.lazy(() => import("./pages/TermsAndConditions"));
const Payment = React.lazy(() => import("./pages/Payment"));
const Setting = React.lazy(() => import("./pages/Setting"));
const OAuthRedirectHandler = React.lazy(()=> import("./pages/OAuthRedirectHandler"));



function App() {
  return (
    <Router>
      <Routes>
        <Route
          path={frontendRoutes.LOGIN}
          element={<ExcludeNavbar Component={Login} />}
        />
        <Route
          path={frontendRoutes.REDIRECT}
          element={<ExcludeNavbar Component={OAuthRedirectHandler} />}
        />
        <Route
          path={frontendRoutes.REGISTER}
          element={<ExcludeNavbar Component={RegistrationPage} />}
        />
        <Route
          path={frontendRoutes.PAYMENT}
          element={<ExcludeNavbarStripe Component={Payment} />}
        />

        <Route
          path={frontendRoutes.HOME}
          element={<IncludeNavbar Component={Home} />}
        />
        <Route
          path={frontendRoutes.SETTING}
          element={<IncludeNavbar Component={Setting} />}
        />
        <Route
          path={frontendRoutes.DASHBOARD}
          element={<IncludeNavbar Component={UserDashboard} />}
        />
        <Route 
        path={frontendRoutes.GOOGLE_AUTH}
        element={<ExcludeNavbar Component={Redirect} />}
        />
        <Route
          path={frontendRoutes.MYBOOKING}
          element={<IncludeNavbar Component={MyBookings} />}
        />
        <Route
          path={frontendRoutes.ADMIN}
          element={<IncludeAdminNavbar Component={AdminDashboard} />}
        />
        <Route
          path={`${frontendRoutes.SERVICE}/:service`}
          element={<IncludeNavbar Component={ServiceProviders} />}
        />
        <Route
          path={`${frontendRoutes.PORTFOLIO}/:Id`}
          element={<IncludeNavbar Component={PortfolioPage} />}
        />
        <Route
          path={frontendRoutes.ADD_AVAIBILITY}
          element={<IncludeNavbar Component={ProviderAvailibility} />}
        />
        <Route
          path={`${frontendRoutes.BOOKING}/:Id`}
          element={<IncludeNavbar Component={ClientBookingPage} />}
        />
        <Route
          path={frontendRoutes.PROVIDER_DASHBOARD}
          element={<IncludeNavbar Component={ProviderDashboard} />}
        />
        <Route
          path={frontendRoutes.PROFILE}
          element={<IncludeNavbar Component={PortfolioMakerPage} />}
        />
        <Route
          path={frontendRoutes.TERMS_AND_CONDITIONS}
          element={<IncludeNavbar Component={TermsAndConditions} />}
        />
      </Routes>
    </Router>
  );
}
const ExcludeNavbar = ({ Component }) => (
  <Suspense fallback={<LoadAnimation />}>
    <Component />
  </Suspense>
);

const ExcludeNavbarStripe = ({ Component }) => (
  <Elements stripe={stripePromise}>
    <Suspense fallback={<LoadAnimation />}>
      <Component />
    </Suspense>
  </Elements>
);

const IncludeNavbar = ({ Component }) => (
  <>
    <Header />
    <Suspense fallback={<LoadAnimation />}>
      <Component />
    </Suspense>
  </>
);

const IncludeAdminNavbar = ({ Component }) => (
  <>
    <AdminHeader />
    <Suspense fallback={<LoadAnimation />}>
      <Component />
    </Suspense>
  </>
);

export default App;
