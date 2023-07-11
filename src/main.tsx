import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import { App, ActivoFaltante, Config, Login, NotFound, Home } from "./lazy";
import Spinner from "./components/Spinner";
import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Suspense
    fallback={
      <Spinner
        variant="danger"
        message="Asegurese de tener buena conexion a internet"
      />
    }
  >
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route element={<App />}>
            <Route index element={<Home />}></Route>
            <Route path="config" element={<Config />} />
            <Route path="activos-faltantes" element={<ActivoFaltante />} />
          </Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  </Suspense>
);
