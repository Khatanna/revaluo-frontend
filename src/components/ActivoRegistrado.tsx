import { Col } from "react-bootstrap";
import { type IActivoRegistrado } from "../types";
// @ts-ignore
import swal from "@sweetalert/with-react";
import Swal from "sweetalert2";
import BarcodeActivo from "./BarcodeActivo";

const ActivoRegistrado = ({
  activoRegistrado,
}: {
  activoRegistrado: IActivoRegistrado;
}) => {
  const { activoFijo, usuario, piso } = activoRegistrado;
  const me = JSON.parse(window.localStorage.getItem("user") as string);
  const condicion: { [index: string]: string } = {
    nuevo: "success",
    bueno: "primary",
    regular: "warning",
    malo: "danger",
    desuso: "secondary",
  };

  const style: { [index: string]: string } = {
    backgroundColor: usuario.color,
    fontSize: "0.8rem",
  };

  const showCode = () => {
    swal(<BarcodeActivo activoFijo={activoFijo} />, {
      buttons: {
        confirm: {
          text: "Copiar Codigo",
          className: "btn-confirm",
          // closeModal: false,
          value: true,
          visible: true,
        },
        cancel: {
          text: "Continuar",
          value: false,
          visible: true,
          className: "btn-cancel",
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
          didOpen: (toast: any) => {
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
          .catch((_) => {
            Toast.fire({
              icon: "success",
              title: "Ocurrio un error al copiar",
            });
          });
      }
    });
  };

  return (
    <>
      <Col>
        <div
          style={style}
          className="mt-3 border border-1 rounded-1 p-1 text-start position-relative"
        >
          <div className="position-absolute top-0 start-50  rounded-pill bg-dark text-white translate-middle badge mb-1">
            {me.nombre === usuario.nombre ? "Tu" : usuario.nombre}
          </div>
          <div className="shadow px-2 py-1 rounded-1 border border-secondary-subtle">
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
              <strong>Piso:</strong> {activoFijo.piso}
            </div>
            <div>
              <strong>Ubicación:</strong> {activoFijo.ubicacion}
            </div>
            <div>
              <strong>Estado:</strong> {activoFijo.estado}
            </div>
            <div>
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
            </div>
            <div>
              <strong>Escaneado en:</strong> {piso}
            </div>
            <div
              onClick={showCode}
              style={{ cursor: "pointer" }}
              className="text-primary text-primary link-primary"
            >
              Mostrar codigo
            </div>
          </div>
        </div>
      </Col>
    </>
  );
};

export default ActivoRegistrado;
