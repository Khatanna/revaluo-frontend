import { Row, Col, Button, Modal, Form } from "react-bootstrap";
import { useState } from "react";
import socket from "../socket";
import { useAuthStore } from "../store/useAuthStore";
import { IActivo } from "../types";
import { Endpoint } from "../constants/endpoints";
import axios from "../api/axios";
import Swal from "sweetalert2";
import { AxiosError } from "axios";
import { showCode } from "./ActivoRegistrado";

const ModalRegisterMany = () => {
  const { user } = useAuthStore((state) => state);

  const [show, setShow] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [loadingEscaneo, setLoadingEscaneo] = useState(false);
  const [escaneados, setEscaneados] = useState<IActivo[]>([]);
  const handleZebra = async (codigo: string) => {
    try {
      setLoadingEscaneo(true);
      const {
        data: { activo },
      } = await axios.get(Endpoint.ACTIVO_FIJO.concat("/", codigo));

      if (activo) {
        setEscaneados([...escaneados, activo]);
        setCodigo("");
      } else {
        Swal.fire({
          icon: "warning",
          title: "Activo no encontrado",
          confirmButtonColor: "green",
        });
      }
    } catch (e) {
      const error = e as AxiosError;
      console.log(e);
      Swal.fire(`${error.response?.data ?? "Error de conexión"}`, "warning");
    } finally {
      setLoadingEscaneo(false);
    }
  };

  const handleRegisterMany = async () => {
    const response = await axios.post(Endpoint.REGISTER_MANY_ACTIVO, {
      activos: escaneados,
      user,
    });

    console.log({ response, data: response.data });
    setEscaneados([]);
  };

  const deleteEscaneado = (codigo: string) => {
    setEscaneados(escaneados.filter((e) => e.codigo !== codigo));
  };

  socket.on("activo@registrado-error", (user, piso, message, duplicado) => {
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
          "success",
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire(
          "Cancelado",
          "Este activo no se registro como sobrante",
          "error",
        );
      }
    });
  });
  return (
    <>
      <Button
        variant={"success"}
        className="position-fixed bottom-0 end-0 m-2"
        onClick={() => setShow(true)}
      >
        Zebra
      </Button>

      <Modal
        show={show}
        onHide={() => setShow(false)}
        backdrop="static"
        keyboard={false}
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
              <Button className="w-100" onClick={() => handleZebra(codigo)}>
                Listo
              </Button>
            </Col>
            <Col>
              {loadingEscaneo ? (
                <div className="fw-bold ">Buscando activo...</div>
              ) : (
                escaneados.map((activo) => (
                  <>
                    <div className="border rounded-1 p-1 my-1 bg-primary-subtle d-flex flex-row justify-content-between">
                      <div
                        className="w-100 shadow-lg border rounded-1"
                        onClick={() => showCode(activo)}
                        style={{ cursor: "pointer" }}
                      >
                        {activo.codigo}
                      </div>
                      <div
                        className="btn-close"
                        onClick={() => deleteEscaneado(activo.codigo)}
                        key={crypto.randomUUID()}
                      ></div>
                    </div>
                  </>
                ))
              )}
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
    </>
  );
};

export default ModalRegisterMany;
