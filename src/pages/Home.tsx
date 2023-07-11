import { Container, Row, Col } from "react-bootstrap";
import { useMemo } from "react";
import SuggestCodigos from "../components/SuggestCodigos";
import Swal from "sweetalert2";
import Spinner from "../components/Spinner";
import ActivoRegistrado from "../components/ActivoRegistrado";
import { IActivosRegistradosResponse } from "../types";
import socket from "../socket";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import axios from "../api/axios";
// import SelectUsuarios from "../components/SelectUsuarios";
import InfiniteScroll from "react-infinite-scroll-component";
import { Endpoint, SocketEvent } from "../constants/endpoints";
import ModalRegisterMany from "../components/ModalRegisterMany";
import { useAuthStore } from "../store/useAuthStore";
import { Navigate } from "react-router-dom";

const fetchActivosRegistrados = async (page: number) => {
  const response = await axios.get(Endpoint.ACTIVOS_REGISTRADOS, {
    params: {
      page,
      limit: 10,
    },
  });

  return response;
};

const Home = () => {
  const { piso } = useAuthStore((state) => state);

  const { data, error, fetchNextPage, hasNextPage, isInitialLoading, refetch } =
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
        cacheTime: 0,
      },
    );

  socket.on(SocketEvent.REGISTER, () => {
    Swal.fire({
      icon: "success",
      title: "Activo registrado",
      confirmButtonColor: "green",
      confirmButtonText: "Continuar",
    });
  });

  socket.on(SocketEvent.REGISTER_MANY_ACTIVO, () => {
    refetch();
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

  if (!piso) {
    return <Navigate to="/config" />;
  }

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
              <Col>{/* <SelectUsuarios /> */}</Col>
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
      </Container>
      <ModalRegisterMany />
    </>
  );
};

export default Home;
