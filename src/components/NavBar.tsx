import { Navbar, Container, Nav, Col } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import logo from "../assets/logo.png";
import ButtonLogout from "./ButtonLogout";
const NavBar = () => {
  return (
    <>
      <div>
        <Navbar expand="lg" className="bg-body-tertiary" sticky="top">
          <Container>
            <Navbar.Brand href="#home" className="lh-lg">
              <img
                src={logo}
                alt="logo"
                width={50}
                className="d-d-inline-block"
              />{" "}
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="justify-content-center gap-3">
                <Nav.Item className="mx-auto">
                  <Link to="/" className="text-decoration-none">
                    Inicio
                  </Link>
                </Nav.Item>
                <Nav.Item className="mx-auto">
                  <Link
                    to="/activos-faltantes"
                    className="text-decoration-none"
                  >
                    Activos faltantes
                  </Link>
                </Nav.Item>
                <Nav.Item className="mx-auto">
                  <Link to="/config" className="text-decoration-none">
                    Configuraciones
                  </Link>
                </Nav.Item>
              </Nav>
              <Col
                className="mx-auto mx-lg-0 ms-lg-auto mt-3 mt-lg-0"
                xs={12}
                md={3}
                lg={2}
              >
                <ButtonLogout />
              </Col>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Outlet />
      </div>
    </>
  );
};

export default NavBar;
