import { Row, Col, Button, Modal, Form } from "react-bootstrap";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { IScanned } from "../types";
import { Endpoint } from "../constants/endpoints";
import axios from "../api/axios";
import Swal from "sweetalert2";
import { AxiosError } from "axios";
import { showCode } from "./ActivoRegistrado";
import { useScannedStore } from "../store/useScannedStore";

const ModalRegisterMany = () => {
  const { user, piso } = useAuthStore((state) => state);
  const {
    scanned,
    addScanned,
    deleteScanned,
    resetState,
    checkScanned,
    exist,
  } = useScannedStore((state) => state);
  const [show, setShow] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [loadingEscaneo, setLoadingEscaneo] = useState(false);
  const [draggedItem, setDraggedItem] = useState<IScanned | null>(null);

  const handleZebra = async (codigo: string, print: boolean) => {
    try {
      if (exist(codigo)) {
        throw Error(
          `El activo con el codigo (${codigo}) ya esta en la lista, pero aun no esta registrado`
        );
      }

      setLoadingEscaneo(true);
      const {
        data: { activo },
      } = await axios.get(Endpoint.REGISTER_MANY_ACTIVO.concat("/", codigo));

      if (activo) {
        addScanned({ ...activo, print });
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

      Swal.fire({
        icon: "warning",
        title: "Error al listar",
        text: `${error.message ?? "Error de conexión"}`,
      });
    } finally {
      setLoadingEscaneo(false);
      setCodigo("");
    }
  };

  const handleRegisterMany = async () => {
    await axios.post(Endpoint.REGISTER_MANY_ACTIVO, {
      activos: scanned,
      user,
      piso,
    });

    resetState;
  };

  const handleDragStart = (
    _: React.DragEvent<HTMLDivElement>,
    item: IScanned
  ) => {
    setDraggedItem(item);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    event.preventDefault();
    const itemIndex = scanned.indexOf(draggedItem!);
    scanned.splice(itemIndex, 1);
    scanned.splice(index, 0, draggedItem!);
    setDraggedItem(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(e.target.value, e.target.value.match(/^INRA-\d{2}-\d{5}$/));
    if (e.target.value.match(/^INRA-\d{2}-\d{5}$/)?.length) {
      handleZebra(codigo.concat(e.target.value), false);
    }

    setCodigo(e.target.value.toUpperCase());
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
                onChange={handleChange}
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
                <div className="fw-bold ms-1">Buscando activo...</div>
              ) : (
                scanned.map((activo, index) => (
                  <div
                    key={crypto.randomUUID()}
                    draggable
                    onDragStart={(event) => handleDragStart(event, activo)}
                    onDragOver={handleDragOver}
                    onDrop={(event) => handleDrop(event, index)}
                  >
                    <div className="border rounded-1 p-1 my-1 bg-primary-subtle d-flex flex-row justify-content-between align-items-center gap-1">
                      <div className="input-group-text bg-primary-subtle shadow-lg p-1">
                        <label
                          htmlFor={`print${index}`}
                          className="d-flex justify-content-between flex-column gap-2 align-items-center"
                        >
                          <input
                            className="form-check-input mt-0"
                            type="checkbox"
                            id={`print${index}`}
                            checked={activo.print}
                            onChange={() => checkScanned(index)}
                          />
                          <div>🖨️</div>
                        </label>
                      </div>
                      <div className="w-100 shadow-lg rounded-1 px-2 py-1">
                        <div>
                          <strong>Codigo:</strong>
                          <small> {activo.codigo}</small>
                        </div>
                        <div>
                          <strong>Responsable:</strong>
                          <small> {activo.responsable}</small>
                        </div>
                        <div className="d-flex justify-content-between ">
                          <div
                            className="nav-link text-success"
                            onClick={() => showCode(activo)}
                          >
                            <strong>Detalles</strong>
                          </div>
                          <div className="nav-link text-primary">
                            <strong>Observaciones</strong>
                          </div>
                        </div>
                      </div>
                      <div
                        className="btn-close"
                        onClick={() => deleteScanned(activo.codigo)}
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
