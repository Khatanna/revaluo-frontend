import { Row, Col, Button, Modal, Form } from "react-bootstrap";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { IActivo } from "../types";
import { Endpoint } from "../constants/endpoints";
import axios from "../api/axios";
import Swal from "sweetalert2";
import { AxiosError } from "axios";
import { showCode } from "./ActivoRegistrado";

interface Escaneo extends IActivo {
  print: boolean;
}

const ModalRegisterMany = () => {
  const { user, piso } = useAuthStore((state) => state);

  const [show, setShow] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [loadingEscaneo, setLoadingEscaneo] = useState(false);
  const [escaneados, setEscaneados] = useState<Escaneo[]>([]);
  const handleZebra = async (codigo: string, print: boolean) => {
    try {
      setLoadingEscaneo(true);
      const {
        data: { activo },
      } = await axios.get(Endpoint.REGISTER_MANY_ACTIVO.concat("/", codigo));

      if (activo) {
        setEscaneados([...escaneados, { ...activo, print }]);
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
      Swal.fire(`${error.response?.data ?? "Error de conexión"}`, "warning");
    } finally {
      setLoadingEscaneo(false);
    }
  };

  const handleRegisterMany = async () => {
    await axios.post(Endpoint.REGISTER_MANY_ACTIVO, {
      activos: escaneados,
      user,
      piso,
    });

    setEscaneados([]);
  };

  const deleteEscaneado = (codigo: string) => {
    setEscaneados(escaneados.filter((e) => e.codigo !== codigo));
  };

  const handleCheckItem = (index: number) => {
    setEscaneados(
      escaneados.map((e, i) => {
        if (i === index) {
          e.print = !e.print;
        }
        return e;
      })
    );
  };

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
              <Button
                className="w-100"
                onClick={() => handleZebra(codigo, false)}
              >
                Listo
              </Button>
            </Col>
            <Col>
              {loadingEscaneo ? (
                <div className="fw-bold ">Buscando activo...</div>
              ) : (
                escaneados.map((activo, index) => (
                  <div key={crypto.randomUUID()}>
                    <div className="border rounded-1 p-1 my-1 bg-primary-subtle d-flex flex-row justify-content-between align-items-center gap-1">
                      <div className="input-group-text bg-primary-subtle shadow-lg p-1">
                        <input
                          className="form-check-input mt-0"
                          type="checkbox"
                          checked={activo.print}
                          onChange={() => handleCheckItem(index)}
                        />
                        🖨️
                      </div>
                      <div
                        className="w-100 shadow-lg rounded-1 px-2 py-1"
                        onClick={() => showCode(activo)}
                        style={{ cursor: "pointer" }}
                      >
                        {activo.codigo}
                      </div>
                      <div
                        className="btn-close"
                        onClick={() => deleteEscaneado(activo.codigo)}
                      ></div>
                    </div>
                  </div>
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
