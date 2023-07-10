import { Row, Col } from "react-bootstrap";
import { useMemo } from "react";
import { IActivo } from "../types";
import BarcodeActivo from "./BarcodeActivo";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "./Spinner";
import BarcodeActivoLoading from "./BarcodeActivoLoading";
import axios, { AxiosResponse } from "axios";
import { Endpoint } from "../constants/endpoints";
import { useAuthStore } from "../store/useAuthStore";

interface IActivosFaltantesResponse {
  prev: string;
  next: string;
  page: number;
  results: IActivo[];
}

const fetcher = async (page: number, token: string) => {
  const response = await axios.get(Endpoint.ACTIVOS_FALTANTES, {
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

const ActivoFaltante = () => {
  const { token } = useAuthStore((state) => state);
  const { data, error, fetchNextPage, hasNextPage, isInitialLoading } =
    useInfiniteQuery<AxiosResponse<IActivosFaltantesResponse>, Error>(
      ["activos-faltantes"],
      async ({ pageParam = 1 }) => await fetcher(pageParam, token),
      {
        getNextPageParam: (
          lastPage: AxiosResponse<IActivosFaltantesResponse>
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

  const activosFaltantes = useMemo(
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
    return (
      <Row className="justify-content-center">
        <Col xs={10} sm={8} md={6} lg={4}>
          <BarcodeActivoLoading />
          <BarcodeActivoLoading />
          <BarcodeActivoLoading />
          <BarcodeActivoLoading />
          <div className="d-flex justify-content-center mx-auto">
            <Spinner variant="success" absolute={false} />
          </div>
        </Col>
      </Row>
    );
  }

  if (error)
    return (
      <h4 className="position-absolute top-50 start-50 translate-middle-x fs-5 text-center">
        No se encontraron los resultados
      </h4>
    );

  return (
    <>
      <Row className="justify-content-center">
        <Col xs={10} sm={8} md={6} lg={4}>
          <InfiniteScroll
            dataLength={activosFaltantes?.data.results.length ?? 0}
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
            {activosFaltantes?.data.results.map((activo) => (
              <div
                className="mb-2 border border-1 p-2 overflow-hidden border-tertiary"
                key={crypto.randomUUID()}
              >
                <BarcodeActivo activoFijo={activo} />
              </div>
            ))}
          </InfiniteScroll>
        </Col>
      </Row>
    </>
  );
};

export default ActivoFaltante;
