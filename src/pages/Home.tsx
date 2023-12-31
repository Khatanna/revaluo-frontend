import { Container, Row, Col } from "react-bootstrap";
import { useEffect, useMemo } from "react";
import SuggestCodigos from "../components/SuggestCodigos";
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
import Swal from "sweetalert2";

const fetchActivosRegistrados = async (page: number) => {
  const response = await axios.get(Endpoint.ACTIVOS_REGISTRADOS, {
    params: {
      page,
      limit: 20,
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

  // socket.on(SocketEvent.REGISTER, () => {
  //   Swal.fire({
  //     icon: "success",
  //     title: "Activo registrado",
  //     confirmButtonColor: "green",
  //     confirmButtonText: "Continuar",
  //   });
  // });

  useEffect(() => {
    socket.on(SocketEvent.REGISTER_MANY_ACTIVO, async () => {
      await refetch();

      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3500,
        timerProgressBar: true,
        didOpen: (toast: HTMLElement) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: "success",
        title: "Activos registrados",
      });
    });

    return () => {
      socket.off(SocketEvent.REGISTER_MANY_ACTIVO);
    };
  }, [refetch]);

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
        <Row className="align-content-center flex-column">
          <Col
            xs={12}
            sm={8}
            md={6}
            lg={4}
            style={{ height: "800px" }}
            id="items"
            className="d-flex flex-column-reverse overflow-auto"
          >
            <InfiniteScroll
              dataLength={activosRegistrados?.data.results.length ?? 0}
              next={fetchNextPage}
              hasMore={!!hasNextPage}
              inverse={true}
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
              scrollableTarget="items"
              className="overflow-hidden d-flex flex-column-reverse"
            >
              {activosRegistrados?.data.results.map((activoRegistrado) => (
                <ActivoRegistrado
                  activoRegistrado={activoRegistrado}
                  key={crypto.randomUUID()}
                />
              ))}
            </InfiniteScroll>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4} className="mt-4">
            <Row>
              <Col xs={12}>
                <SuggestCodigos />
              </Col>
              <Col>{/* <SelectUsuarios /> */}</Col>
            </Row>
          </Col>
        </Row>
      </Container>
      <ModalRegisterMany />
    </>
  );
};

export default Home;
