import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import { App, ActivoFaltante, Config, Login, NotFound } from "./lazy";
import axios from "axios";
import Spinner from "./components/Spinner";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./index.css";
const queryClient = new QueryClient();
const API_URL = import.meta.env.VITE_API_URL;
axios.defaults.baseURL = API_URL;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Suspense fallback={<Spinner variant="warning" />}>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="config" element={<Config />} />
            <Route path="activos-faltantes" element={<ActivoFaltante />} />
          </Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </BrowserRouter>
  </Suspense>
);
