import { Button, Navbar, Container } from "react-bootstrap";
import "./index.css";
import { Link, Outlet } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [path, setPath] = useState(location.pathname);

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.localStorage.removeItem("auth");
    window.localStorage.removeItem("config");
    window.localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    setPath(location.pathname);
  }, [location]);

  return (
    <>
      <Navbar className="shadow-md border border-bottom">
        <Container fluid>
          <Link
            to={path === "/" ? "/config" : "/"}
            className="text-decoration-none me-3"
          >
            {path === "/" ? "Configuraciones" : "Inicio"}
          </Link>
          <Link to={"/activos-faltantes"} className="text-decoration-none">
            Activos faltantes
          </Link>
          <Button
            onClick={handleLogout}
            variant="danger"
            className="float-end ms-auto"
          >
            Cerrar sesión
          </Button>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
}

export default App;
