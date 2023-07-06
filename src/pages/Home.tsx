import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Spinner,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import SuggestCodigos from "../components/SuggestCodigos";
import Scanner from "../components/Scanner";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import ActivoRegistrado from "../components/ActivoRegistrado";
import { IActivo, IActivoRegistrado, IUsuario } from "../types";
import socket from "../socket";
import { useQuery } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

const Home = () => {
  const navigate = useNavigate();
  const [scannerVisible, setScannerVisible] = useState(false);
  const [show, setShow] = useState(false);
  // const [activosRegistrados, setActivosRegistrados] = useState<
  //   IActivoRegistrado[]
  // >([]);
  const [usuarios, setUsuarios] = useState([]);
  const [escaneados, setEscaneados] = useState<IActivo[]>([]);
  const [codigo, setCodigo] = useState("");
  const [filter, setFilter] = useState("all");

  const {
    data: activosRegistrados,
    error,
    isLoading,
  } = useQuery<IActivoRegistrado[]>(["activos-registrados"], {
    queryFn: () => fetchActivosRegistrados(),
  });

  const me = JSON.parse(window.localStorage.getItem("user") as string);

  const fetchUsuarios = async () => {
    const response = await fetch(`${API_URL}/users`);
    const data = await response.json();

    setUsuarios(data.users);
  };

  const fetchActivosRegistrados = async () => {
    const response = await fetch(`${API_URL}/activos-registrados`);
    const {
      activosRegistrados,
    }: { activosRegistrados: Awaited<IActivoRegistrado[]> } =
      await response.json();

    return activosRegistrados;
  };

  const fetchActivosRegistradosByUserId = async (userId: string) => {
    const response = await fetch(`${API_URL}/activos-registrados/${userId}`);
    const data = await response.json();

    // setActivosRegistrados(data.activosRegistrados);
  };

  const handleZebra = async (codigo: string) => {
    const token = document.cookie.split(";").at(-1) as string;

    try {
      const response = await fetch(`${API_URL}/activo/${codigo}`, {
        headers: {
          authorization: token,
        },
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const { activo } = await response.json();

      setEscaneados([...escaneados, activo]);
      setCodigo("");
    } catch (error) {
      Swal.showValidationMessage(`Error de escaneo: ${error}`);
    }
  };

  const handleRegisterMany = async () => {
    const user = JSON.parse(localStorage.getItem("user") as string);
    const { piso } = JSON.parse(localStorage.getItem("config") as string);

    escaneados.forEach((activo) => {
      socket.emit("activo@registrado", activo.codigo, user, piso);
    });
  };

  socket.on("activo@registrado", () => {
    Swal.fire({
      icon: "success",
      title: "Registrado",
      confirmButtonColor: "green",
      confirmButtonText: "Continuar",
    });
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

  if (isLoading) {
    return (
      <div className="position-absolute top-50 start-50 translate-middle-x">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div>Error al obtener los datos</div>;
  }

  return (
    <>
      <Container fluid>
        <Row className="justify-content-center mt-3">
          <Col xs={12} sm={8} md={6} lg={4}>
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
          <Col xs={12} sm={8} md={6} lg={4}>
            {activosRegistrados?.map((activoRegistrado) => (
              <ActivoRegistrado
                activoRegistrado={activoRegistrado}
                key={crypto.randomUUID()}
              />
            ))}
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col xs={12} sm={8} md={6} lg={4}>
            <div className="m-3 shadow-lg position-fixed bottom-0 end-0">
              <Button
                variant={"success"}
                className=""
                onClick={() => setShow(true)}
              >
                Zebra
              </Button>
              <Button
                onClick={() => setScannerVisible(true)}
                variant={"primary"}
                className="ms-1"
              >
                Abrir escaner
              </Button>
            </div>

            <Modal
              show={scannerVisible}
              onHide={() => setScannerVisible(false)}
              backdrop="static"
              keyboard={false}
              centered
              size="lg"
            >
              <Modal.Header closeButton>
                <Modal.Title>Escaner</Modal.Title>
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

            <Modal
              show={show}
              onHide={() => setShow(false)}
              backdrop="static"
              keyboard={false}
              centered
              size="lg"
            >
              <Modal.Header closeButton></Modal.Header>
              <Modal.Body>
                <Row>
                  <Col xs={9}>
                    <Form.Control
                      type="text"
                      placeholder="Escaneé un codigo"
                      value={codigo}
                      onChange={(e) => setCodigo(e.target.value)}
                    />
                  </Col>
                  <Col xs={3}>
                    <Button
                      className="w-100"
                      onClick={() => handleZebra(codigo)}
                    >
                      Listo
                    </Button>
                  </Col>
                  <Col>
                    {escaneados.map((activo) => (
                      <div className="border rounded-1 p-1 my-1 bg-primary-subtle">
                        {activo.codigo}
                      </div>
                    ))}
                  </Col>
                </Row>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="danger" onClick={() => setShow(false)}>
                  Cerrar
                </Button>
                <Button variant="success" onClick={handleRegisterMany}>
                  Registrar todos
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
