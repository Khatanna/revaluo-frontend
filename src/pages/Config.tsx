import { Row, Col, Form, Container, Button, Spinner } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SelectPisos from "../components/SelectPisos";
import Swal from "sweetalert2";
import socket from "../socket";

const API_URL = import.meta.env.VITE_API_URL as string;

const Config = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const user = {
    ...JSON.parse(window.localStorage.getItem("user") as string),
  };
  const [form, setForm] = useState({
    nombre: user.nombre,
    piso: "",
    color: user.color,
  });

  const updateUser = async (nombre: string, color: string) => {
    try {
      setIsLoading(true);
      const token = document.cookie.split(";").at(-1) as string;
      const { nombre: nombreStorage } = JSON.parse(
        window.localStorage.getItem("user") as string
      );

      const response = await fetch(`${API_URL}/update/user/${nombreStorage}`, {
        method: "PUT",
        body: JSON.stringify({ nombre, color }),
        headers: {
          authorization: token,
          "Content-Type": "application/json",
        },
      });

      const { user } = await response.json();
      if (user) {
        localStorage.setItem(
          "config",
          JSON.stringify({
            nombre: user.nombre,
            color: user.color,
            piso: form.piso,
          })
        );
        window.localStorage.setItem("user", JSON.stringify(user));
        Swal.fire({
          icon: "success",
          title: "Configuracion guardada",
          confirmButtonText: "Continuar",
        });

        socket.emit("usuario@actualizado");
        navigate("/");
      } else {
        Swal.fire({
          icon: "info",
          title: "Ocurrio un error al actualizar",
          confirmButtonText: "Continuar",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    Swal.fire({
      icon: "question",
      title: "¿Desea guardar los cambios?",
      showDenyButton: true,
      confirmButtonText: "Guardar",
      denyButtonText: `Cancelar`,
      confirmButtonColor: "green",
    }).then((result) => {
      if (result.isConfirmed) {
        updateUser(form.nombre, form.color);
      }
    });
  };

  const handleChange = (name: string, value: string) => {
    setForm({
      ...form,
      [name]: value,
    });
  };

  useEffect(() => {
    const config = localStorage.getItem("config");
    if (config) {
      setForm({
        ...JSON.parse(config),
      });
    }
  }, []);

  return (
    <>
      <Container fluid>
        <Row className="position-absolute top-50 start-50 translate-middle-x w-100 mx-auto justify-content-center">
          {isLoading ? (
            <Spinner variant="warning" />
          ) : (
            <Col xs={10} sm={8} md={6} lg={4}>
              <h1 className="fs-4 text text-decoration-underline text-success-emphasis py-1">
                Configuración
              </h1>
              <Form className="row g-3" noValidate onSubmit={handleSubmit}>
                <Col xs={10}>
                  <Form.Control
                    placeholder="Nombre"
                    type="text"
                    required
                    name="nombre"
                    value={form.nombre}
                    onChange={({ target: { name, value } }) =>
                      handleChange(name, value)
                    }
                  />
                </Col>
                <Col xs={2}>
                  <Form.Control
                    placeholder="Color"
                    type="color"
                    required
                    name="color"
                    className="w-100"
                    value={form.color}
                    onChange={({ target: { name, value } }) =>
                      handleChange(name, value)
                    }
                  />
                </Col>
                <Col xs={12}>
                  <SelectPisos onChange={handleChange} form={form} />
                </Col>
                <Col>
                  <Button variant="warning" className="float-end" type="submit">
                    Actualizar
                  </Button>
                </Col>
              </Form>
            </Col>
          )}
        </Row>
      </Container>
    </>
  );
};

export default Config;
