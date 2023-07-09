import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { useState } from "react";
import { IForm } from "../types";
import { useAuth } from "../hooks";
import Spinner from "../components/Spinner";
import { useAuthStore } from "../store/useAuthStore";
import { Navigate } from "react-router-dom";

const breakPoints = {
  xs: 10,
  sm: 8,
  md: 6,
  lg: 4,
};

const initialForm = {
  nombre: "",
};

const Login = () => {
  const [validated, setValidated] = useState(false);
  const { isAuth } = useAuthStore((state) => state);
  const [form, setForm] = useState<IForm>(initialForm);
  const { login, isLoading } = useAuth();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (e.currentTarget.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }
    setValidated(true);

    if (e.currentTarget.checkValidity()) {
      login(form);
      setValidated(false);
    }

    setForm(initialForm);
  };

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <>
      {isLoading ? (
        <Spinner variant="success" />
      ) : (
        <Container fluid>
          <Row className="vh-100 align-content-center justify-content-center">
            <Col
              xs={breakPoints.xs}
              sm={breakPoints.sm}
              md={breakPoints.md}
              lg={breakPoints.lg}
            >
              <Form
                className="d-flex flex-column gap-2"
                onSubmit={handleSubmit}
                noValidate
                validated={validated}
              >
                <Col>
                  <h1 className="text-center">Iniciar sesión</h1>
                </Col>
                <Col>
                  <Form.Control
                    required
                    placeholder="Nombre"
                    type="text"
                    name="nombre"
                    onChange={(e) => setForm({ nombre: e.target.value })}
                    value={form.nombre}
                  />
                  <Form.Control.Feedback type="invalid">
                    Debe ingresar su nombre
                  </Form.Control.Feedback>
                </Col>
                <Col>
                  <Button type="submit" variant="success" className="float-end">
                    Iniciar sesión
                  </Button>
                </Col>
              </Form>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};
export default Login;
