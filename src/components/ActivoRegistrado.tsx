import { Col } from "react-bootstrap";
import { IActivo, type IActivoRegistrado } from "../types";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import swal from "@sweetalert/with-react";
import Swal from "sweetalert2";
import { useAuthStore } from "../store/useAuthStore";
import Activo from "./Activo";

export const showCode = (activoFijo: IActivo) => {
  swal(<Activo activo={activoFijo} />, {
    buttons: {
      confirm: {
        text: "Copiar Codigo",
        className: "btn btn-sm btn-primary",
        value: true,
        visible: true,
      },
      cancel: {
        text: "Continuar",
        value: false,
        visible: true,
        className: "btn btn-sm btn-success",
        closeModal: true,
      },
    },
  }).then((value: boolean) => {
    if (value) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: (toast: HTMLElement) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });

      navigator.clipboard
        .writeText(activoFijo.codigo)
        .then(() => {
          Toast.fire({
            icon: "success",
            title: "Texto copiado en el portapapeles",
          });
        })
        .catch(() => {
          Toast.fire({
            icon: "success",
            title: "Ocurrio un error al copiar",
          });
        });
    }
  });
};

const ActivoRegistrado = ({
  activoRegistrado,
}: {
  activoRegistrado: IActivoRegistrado;
}) => {
  const { activoFijo, usuario, piso } = activoRegistrado;
  const { user } = useAuthStore((state) => state);

  const style: { [index: string]: string } = {
    backgroundColor: usuario.color,
    fontSize: "0.8rem",
    cursor: "pointer",
  };

  const show = () => {
    showCode(activoFijo);
  };
  return (
    <>
      <Col>
        <div
          style={style}
          className="mt-3 border border-1 rounded-1 p-1 text-start position-relative"
          onClick={show}
        >
          <div className="position-absolute top-0 start-50  rounded-pill bg-dark text-white translate-middle badge mb-1">
            {user?.nombre === usuario.nombre ? "Tu" : usuario.nombre} | {piso}
          </div>

          <div className="shadow px-2 py-1 rounded-1 border border-secondary-subtle">
            <div>
              <strong>Codigo:</strong> {activoFijo.codigo}
            </div>
            <div>
              <strong>Responsable:</strong>{" "}
              <span className="text-decoration-underline">
                {activoFijo.responsable}
              </span>
            </div>
            <div>
              <strong>Tipo:</strong> {activoFijo.tipo}
            </div>
            <div>
              <strong>Imprimir:</strong>{" "}
              <span
                className={`text-${
                  activoRegistrado.imprimir ? "success" : "danger"
                } fw-bold`}
              >
                {activoRegistrado.imprimir ? "SI" : "NO"}
              </span>
            </div>
            {/* <div>
              <strong>
                Condición:{" "}
                <span
                  className={`text-${
                    condicion[activoFijo.condicion.toLowerCase()]
                  }`}
                >
                  {activoFijo.condicion}
                </span>
              </strong>
            </div> */}
          </div>
        </div>
      </Col>
    </>
  );
};

export default ActivoRegistrado;
