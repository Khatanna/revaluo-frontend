import { Row, Col, Form, Container, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import SelectPisos from "../components/SelectPisos";
import Swal from "sweetalert2";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const Config = () => {
  const navigate = useNavigate();
  const { user, piso, update } = useAuthStore((state) => state);

  const [form, setForm] = useState({
    nombre: user?.nombre ?? "",
    color: user?.color ?? "",
    piso,
  });

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
        update(
          {
            nombre: form.nombre,
            color: form.color,
          },
          form.piso
        );

        navigate("/");
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
    if (!piso) {
      Swal.fire({
        icon: "info",
        text: "Debe configurar antes de iniciar",
        confirmButtonText: "Configurar",
        confirmButtonColor: "green",
      });
    }
  }, [piso]);

  return (
    <>
      <Container fluid>
        <Row className="position-absolute top-50 start-50 translate-middle-x w-100 mx-auto justify-content-center">
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
                <SelectPisos onChange={handleChange} piso={form.piso} />
              </Col>
              <Col>
                <Button variant="warning" className="float-end" type="submit">
                  Actualizar
                </Button>
              </Col>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Config;
