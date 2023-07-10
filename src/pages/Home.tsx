import { Container, Row, Col, Button, Modal, Form } from "react-bootstrap";
import { useMemo, useState } from "react";
import SuggestCodigos from "../components/SuggestCodigos";
// import Scanner from "../components/Scanner";
import Swal from "sweetalert2";
import Spinner from "../components/Spinner";
import ActivoRegistrado from "../components/ActivoRegistrado";
import { IActivo, IActivoRegistrado } from "../types";
import socket from "../socket";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import SelectUsuarios from "../components/SelectUsuarios";
import InfiniteScroll from "react-infinite-scroll-component";
import { Endpoint, SocketEvent } from "../constants/endpoints";
import { useAuthStore } from "../store/useAuthStore";
const API_URL = import.meta.env.VITE_API_URL;

interface IActivosRegistradosResponse {
  prev: string;
  next: string;
  page: number;
  results: IActivoRegistrado[];
}

const fetchActivosRegistrados = async (page: number, token: string) => {
  const response = await axios.get(Endpoint.ACTIVOS_REGISTRADOS, {
    params: {
      page,
      limit: 20,
    },
    headers: {
      Authorization: token,
    },
  });

  return response;
};

const Home = () => {
  // const [scannerVisible, setScannerVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [escaneados, setEscaneados] = useState<IActivo[]>([]);
  const [codigo, setCodigo] = useState("");
  const { user, token } = useAuthStore((state) => state);
  const { data, error, fetchNextPage, hasNextPage, isInitialLoading, refetch } =
    useInfiniteQuery<AxiosResponse<IActivosRegistradosResponse>, Error>(
      ["activos-registrados"],
      async ({ pageParam = 1 }) =>
        await fetchActivosRegistrados(pageParam, token),
      {
        getNextPageParam: (
          lastPage: AxiosResponse<IActivosRegistradosResponse>
        ) => {
          if (lastPage.data.next) {
            const { searchParams } = new URL(lastPage.data.next);
            const page = parseInt(searchParams.get("page") as string);

            return page;
          }

          return undefined;
        },
        cacheTime: 0,
      }
    );

  const handleZebra = async (codigo: string) => {
    try {
      const response = await fetch(`${API_URL}/activo/${codigo}`);
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const { activo } = await response.json();

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
    } catch (error) {
      Swal.showValidationMessage(`Error de escaneo: ${error}`);
    }
  };

  const handleRegisterMany = async () => {
    try {
      const response = await axios.post(Endpoint.REGISTER_MANY_ACTIVO, {
        activos: escaneados,
        user,
      });

      console.log({ response, data: response.data });
      setEscaneados([]);
    } catch (e) {
      //setScannerVisible(false);
      const duplicado = true;
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
        //text: `${message}`,
        // footer: `Registrado por: ${user.nombre} | Piso: ${piso}`,
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
    }
  };

  const deleteEscaneado = (codigo: string) => {
    setEscaneados(escaneados.filter((e) => e.codigo !== codigo));
  };

  // socket.on(SocketEvent.REGISTER, () => {
  //   Swal.fire({
  //     icon: "success",
  //     title: "Activo registrado",
  //     confirmButtonColor: "green",
  //     confirmButtonText: "Continuar",
  //   });
  // });

  socket.on(SocketEvent.REGISTER_MANY_ACTIVO, () => {
    refetch();
  });

  socket.on("activo@registrado-error", (user, piso, message, duplicado) => {
    //setScannerVisible(false);

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
    [data]
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
        <Row className="align-content-center flex-column">
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
          <Col xs={12} sm={8} md={6} lg={4} className="vh-100">
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
          {/* <Modal
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
          </Modal> */}
        </Row>
      </Container>
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
              <Button className="w-100" onClick={() => handleZebra(codigo)}>
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
    </>
  );
};

export default Home;
