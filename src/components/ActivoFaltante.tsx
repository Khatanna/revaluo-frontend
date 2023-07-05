import { Row, Col, Spinner } from "react-bootstrap";
import { useMemo } from "react";
import { IActivo } from "../types";
import BarcodeActivo from "./BarcodeActivo";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";

const API_URL = import.meta.env.VITE_API_URL;

const fetcher = (
  page: number
): Promise<{
  prev: string;
  next: string;
  page: number;
  results: IActivo[];
}> =>
  fetch(`${API_URL}/activos-faltantes?page=${page}`).then((res) => res.json());

const ActivoFaltante = () => {
  const { data, error, fetchNextPage, status, hasNextPage } = useInfiniteQuery(
    ["activos-faltantes"],
    ({ pageParam = 1 }) => fetcher(pageParam),
    {
      getNextPageParam: (lastPage: {
        prev: string;
        next: string;
        page: number;
        results: IActivo[];
      }) => {
        const previousPage = lastPage.prev ? +lastPage.prev.split("=")[1] : 0;
        const currentPage = previousPage + 1;

        if (currentPage === lastPage.page) {
          return false;
        }

        return currentPage + 1;
      },
    }
  );

  const activosFaltantes = useMemo(
    () =>
      data?.pages.reduce((prev, page) => {
        return {
          page: page.page,
          prev: page.prev,
          next: page.next,
          results: [...prev.results, ...page.results],
        };
      }),
    [data]
  );

  if (status === "loading") return <Spinner />;

  if (status === "error") return <h4>Ups!, {`${error}` as string}</h4>;

  return (
    <>
      <Row className="justify-content-center">
        <Col xs={10} sm={8} md={6} lg={4}>
          <InfiniteScroll
            dataLength={activosFaltantes ? activosFaltantes.results.length : 0}
            next={fetchNextPage}
            // inverse={true}
            hasMore={!!hasNextPage}
            loader={<Spinner />}
          >
            {activosFaltantes &&
              activosFaltantes.results.map((activo) => (
                <div
                  className="mb-2 border border-1 p-2 overflow-hidden border-black"
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
