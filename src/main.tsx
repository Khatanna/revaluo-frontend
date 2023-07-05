import ReactDOM from "react-dom/client";
import App from "./App";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Config from "./pages/Config";
import ActivoFaltante from "./components/ActivoFaltante";

const queryClient = new QueryClient();

const AuthWrapper = ({ children }: { children: JSX.Element }) => {
  const useAuth = () => {
    const auth = window.localStorage.getItem("auth");
    return auth;
  };

  const auth = useAuth();
  return auth ? children : <Navigate to="/login" replace />;
};

const GuestWrapper = ({ children }: { children: JSX.Element }) => {
  const useAuth = () => {
    const auth = window.localStorage.getItem("auth");
    return auth;
  };

  const auth = useAuth();
  return !auth ? children : <Navigate to="/home" replace />;
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route
          path="/"
          element={
            <AuthWrapper>
              <App />
            </AuthWrapper>
          }
        >
          <Route element={<Home />} index />
          <Route path="config" element={<Config />} />
          <Route path="activos-faltantes" element={<ActivoFaltante />} />
        </Route>
        <Route
          path="/login"
          element={
            <GuestWrapper>
              <Login />
            </GuestWrapper>
          }
        ></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </QueryClientProvider>
  </BrowserRouter>
);
