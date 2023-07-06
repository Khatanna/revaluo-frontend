import { Container, Form, Button, Row, Col, Spinner } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const API_URL = import.meta.env.VITE_API_URL as string;

interface IForm {
  [index: string]: string;
}

const Login = () => {
  const navigate = useNavigate();
  const breakPoints = {
    xs: 10,
    sm: 8,
    md: 6,
    lg: 4,
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (e.currentTarget.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }

    setValidated(true);

    const login = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
        const { token, isAuth, user } = await response.json();
        document.cookie = `token=${token}; max-age=${
          60 * 60 * 60
        }; path=/; samesite=strict`;

        if (isAuth) {
          window.localStorage.setItem("auth", isAuth);
          // window.localStorage.setItem("config", JSON.stringify({ ...user }));
          window.localStorage.setItem("user", JSON.stringify(user));
          navigate("/");
        } else {
          Swal.fire({
            icon: "error",
            title: "Inicio de sesión incorrecto",
            text: "Intente nuevamente",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "green",
          });

          setForm({ nombre: "" });
          setValidated(false);
        }
      } catch (e) {
        Swal.fire({
          icon: "warning",
          title: "Error de sesión",
          text: "Ocurrio un error intente mas tarde",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "green",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (e.currentTarget.checkValidity()) {
      login();
    }
  };
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<IForm>({
    nombre: "",
  });
  return (
    <>
      {isLoading ? (
        <div className="position-absolute top-50 start-50 translate-middle-x fs-5 text-center">
          <Spinner variant="success" />
          <div>Cargando...</div>
        </div>
      ) : (
        <Container fluid="">
          <Row className="vh-100 align-content-center justify-content-center">
            <Col
              xs={breakPoints.xs}
              sm={breakPoints.sm}
              md={breakPoints.md}
              lg={breakPoints.lg}
            >
              <Form
                className="row g-3"
                onSubmit={handleSubmit}
                noValidate
                validated={validated}
              >
                <Col xs={12}>
                  <h1 className="text-center">Iniciar sesión</h1>
                </Col>
                <Col xs={12}>
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
                <Col xs={12}>
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
