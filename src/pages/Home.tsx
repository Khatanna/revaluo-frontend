import { Container, Row, Col, Button, Modal, Form } from "react-bootstrap";
import { useMemo, useState } from "react";
import SuggestCodigos from "../components/SuggestCodigos";
import Scanner from "../components/Scanner";
import Swal from "sweetalert2";
import Spinner from "../components/Spinner";
import ActivoRegistrado from "../components/ActivoRegistrado";
import { IActivo, IActivoRegistrado } from "../types";
import socket from "../socket";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import SelectUsuarios from "../components/SelectUsuarios";
import InfiniteScroll from "react-infinite-scroll-component";
const API_URL = import.meta.env.VITE_API_URL;

interface IActivosRegistradosResponse {
  prev: string;
  next: string;
  page: number;
  results: IActivoRegistrado[];
}

const fetchActivosRegistrados = async (page: number) => {
  const response = await axios.get("/activos-registrados", {
    params: {
      page,
      limit: 10,
    },
  });
  // const { results }: { results: Awaited<IActivoRegistrado[]> } = response.data;

  return response;
};

const Home = () => {
  const [scannerVisible, setScannerVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [escaneados, setEscaneados] = useState<IActivo[]>([]);
  const [codigo, setCodigo] = useState("");

  const { data, error, fetchNextPage, hasNextPage, isInitialLoading } =
    useInfiniteQuery<AxiosResponse<IActivosRegistradosResponse>, Error>(
      ["activos-registrados"],
      async ({ pageParam = 1 }) => await fetchActivosRegistrados(pageParam),
      {
        getNextPageParam: (
          lastPage: AxiosResponse<IActivosRegistradosResponse>,
        ) => {
          if (lastPage.data.next) {
            const { searchParams } = new URL(lastPage.data.next);
            const page = parseInt(searchParams.get("page") as string);

            return page;
          }

          return undefined;
        },
        getPreviousPageParam: (
          lastPage: AxiosResponse<IActivosRegistradosResponse>,
        ) => {
          if (lastPage.data.prev) {
            const { searchParams } = new URL(lastPage.data.prev);
            const page = parseInt(searchParams.get("page") as string);

            return page;
          }

          return undefined;
        },
        cacheTime: 0,
      },
    );

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
    escaneados.forEach((activo) => {
      console.log({ activo });
      // socket.emit("activo@registrado", activo.codigo, user, piso);
    });
    setEscaneados([]);
  };

  const deleteEscaneado = (codigo: string) => {
    setEscaneados(escaneados.filter((e) => e.codigo !== codigo));
  };

  socket.on("activo@registrado", () => {
    Swal.fire({
      icon: "success",
      title: "Registrado",
      confirmButtonColor: "green",
      confirmButtonText: "Continuar",
    });
    setScannerVisible(false);
    // fetchActivosRegistrados();
  });

  socket.on("usuario@actualizado", () => {
    // fetchActivosRegistrados();
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
  const activosRegistrados = useMemo(
    () =>
      data?.pages.reduce((prev, page) => {
        return {
          ...page,
          data: {
            ...page.data,
            results: [...prev.data.results, ...page.data.results],
          },
        };
      }),
    [data],
  );

  if (isInitialLoading) {
    // TODO simular lazy loading aqui
    return <Spinner variant="primary" />;
  }

  if (error) {
    return (
      <h4 className="position-absolute top-50 start-50 translate-middle-x fs-5 text-center">
        No se encontraron los resultados
      </h4>
    );
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
                <SelectUsuarios />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col xs={12} sm={8} md={6} lg={4}>
            <InfiniteScroll
              dataLength={activosRegistrados?.data.results.length ?? 0}
              next={fetchNextPage}
              hasMore={!!hasNextPage}
              loader={
                <div className="d-flex justify-content-center mx-auto">
                  <Spinner variant="success" absolute={false} />
                </div>
              }
              endMessage={
                <p style={{ textAlign: "center" }}>
                  <b>No hay mas resultados</b>
                </p>
              }
              className="overflow-hidden"
            >
              {activosRegistrados?.data.results.map((activoRegistrado) => (
                <ActivoRegistrado
                  activoRegistrado={activoRegistrado}
                  key={crypto.randomUUID()}
                />
              ))}
            </InfiniteScroll>
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
                Escaner
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
                      <div className="border rounded-1 p-1 my-1 bg-primary-subtle d-flex flex-row flex-row-reverse justify-content-between">
                        <div
                          className="btn-close"
                          onClick={() => deleteEscaneado(activo.codigo)}
                        ></div>
                        <div>{activo.codigo}</div>
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
