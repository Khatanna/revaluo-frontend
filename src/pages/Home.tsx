import { Container, Row, Col, Button, Modal, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import SuggestCodigos from "../components/SuggestCodigos";
import Scanner from "../components/Scanner";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import ActivoRegistrado from "../components/ActivoRegistrado";
import { IActivoRegistrado, IUsuario } from "../types";
import socket from "../socket";

const API_URL = import.meta.env.VITE_API_URL;

const Home = () => {
  const navigate = useNavigate();
  const [scannerVisible, setScannerVisible] = useState(false);
  const [activosRegistrados, setActivosRegistrados] = useState<
    IActivoRegistrado[]
  >([]);
  const [usuarios, setUsuarios] = useState([]);
  const [filter, setFilter] = useState("all");

  const me = JSON.parse(window.localStorage.getItem("user") as string);

  const fetchUsuarios = async () => {
    const response = await fetch(`${API_URL}/users`);
    const data = await response.json();

    setUsuarios(data.users);
  };

  const fetchActivosRegistrados = async () => {
    const response = await fetch(`${API_URL}/activos-registrados`);
    const data = await response.json();

    setActivosRegistrados(data.activosRegistrados);
  };

  const fetchActivosRegistradosByUserId = async (userId: string) => {
    const response = await fetch(`${API_URL}/activos-registrados/${userId}`);
    const data = await response.json();

    setActivosRegistrados(data.activosRegistrados);
  };

  socket.on("activo@registrado", () => {
    // TODO: mostrar mensaje de registrado con swal
    setScannerVisible(false);
    fetchActivosRegistrados();
  });

  socket.on("usuario@actualizado", () => {
    fetchActivosRegistrados();
  });

  socket.on("activo@registrado-error", (user, piso, message, duplicado) => {
    setScannerVisible(false);

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
      confirmButtonText: "Continuar",
    });
    Swal.fire({
      icon: "warning",
      title: "Activo duplicado",
      text: `${message}`,
      footer: `Registrado por: ${user.nombre} | Piso: ${piso}`,
      confirmButtonText: duplicado ? "Marcar como sobrante" : "Continuar",
      confirmButtonColor: "green",
      showCancelButton: duplicado,
      cancelButtonText: "Cancelar",
      cancelButtonColor: "red",
    }).then((result) => {
      if (result.isConfirmed && duplicado) {
        swalWithBootstrapButtons.fire(
          "Registrado!",
          "Este activo se registro como sobrante.",
          "success"
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire(
          "Cancelado",
          "Este activo no se registro como sobrante",
          "error"
        );
      }
    });
  });

  useEffect(() => {
    const config = localStorage.getItem("config");

    if (!config) {
      Swal.fire({
        icon: "info",
        title: "Debe configurar antes de iniciar",
        confirmButtonText: "Configurar",
      });

      navigate("/config");
    } else {
      if (filter === "all") {
        fetchActivosRegistrados();
        fetchUsuarios();
      } else {
        fetchActivosRegistradosByUserId(filter);
      }
    }
  }, [navigate, filter]);

  return (
    <>
      <Container fluid>
        <Row className="justify-content-center mt-3">
          <Col xs={10} sm={8} md={6} lg={4}>
            <Row>
              <Col>
                <SuggestCodigos />
              </Col>
              <Col>
                <Form.Select
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Filtrar por usuario"
                  value={filter}
                >
                  <option disabled>Filtrar por usuario</option>
                  <option value="all">Ver todos</option>
                  {usuarios.map((usuario: IUsuario) => (
                    <option value={usuario.id} key={crypto.randomUUID()}>
                      {usuario.id === me.id ? "Tú" : usuario.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col xs={10} sm={8} md={6} lg={4}>
            {activosRegistrados.map((activoRegistrado) => (
              <ActivoRegistrado
                activoRegistrado={activoRegistrado}
                key={crypto.randomUUID()}
              />
            ))}
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col xs={10} sm={8} md={6} lg={4}>
            <Button
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
              onClick={() => setScannerVisible(true)}
              variant={"primary"}
              className="my-2 shadow-lg position-fixed bottom-0 end-0"
            >
              Abrir escaner
            </Button>

            <Modal
              show={scannerVisible}
              onHide={() => setScannerVisible(false)}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header closeButton>
                <Modal.Title>Scanner</Modal.Title>
              </Modal.Header>
              <Modal.Body>{scannerVisible && <Scanner />}</Modal.Body>
              <Modal.Footer>
                <Button
                  variant="warning"
                  onClick={() => setScannerVisible(false)}
                >
                  Cerrar escaner
                </Button>
              </Modal.Footer>
            </Modal>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
