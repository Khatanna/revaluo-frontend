import { Button, Navbar, Container, Nav, Col } from "react-bootstrap";
import "./index.css";
import { Link, Outlet } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import NavbarCollapse from "react-bootstrap/esm/NavbarCollapse";
import logo from "./assets/logo.png";

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
      <Navbar expand="lg" className="bg-body-tertiary" sticky="top">
        <Container>
          <Navbar.Brand href="#home" className="lh-lg">
            <img
              src={logo}
              alt="logo"
              width={30}
              className="d-d-inline-block align-top"
            />{" "}
            Revaluo 2023
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <NavbarCollapse id="basic-navbar-nav">
            <Nav className="justify-content-center">
              <Nav.Item className="mx-auto">
                <Nav.Link>
                  <Link
                    to={path === "/" ? "/config" : "/"}
                    className="text-decoration-none"
                  >
                    {path === "/" ? "Configuraciones" : "Inicio"}
                  </Link>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="mx-auto">
                <Nav.Link>
                  <Link
                    to={"/activos-faltantes"}
                    className="text-decoration-none"
                  >
                    Activos faltantes
                  </Link>
                </Nav.Link>
              </Nav.Item>
            </Nav>
            <Col className="ms-auto" xs={12} md={3} lg={2}>
              <Button onClick={handleLogout} variant="danger" className="w-100">
                Cerrar sesión
              </Button>
            </Col>
          </NavbarCollapse>
        </Container>
      </Navbar>

      <Outlet />
    </>
  );
}

export default App;
