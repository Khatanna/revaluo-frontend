import { lazy } from 'react';

export const App = lazy(() => import("../App"));
export const Home = lazy(() => import("../pages/Home"));
export const Login = lazy(() => import("../pages/Login"));
export const Config = lazy(() => import("../pages/Config"));
export const NotFound = lazy(() => import("../pages/NotFound"));
export const ActivoFaltante = lazy(() => import("../components/ActivoFaltante"));