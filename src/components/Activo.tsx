import { type IActivo } from "../types";
import BarcodeActivo from "./BarcodeActivo";

const Activo = ({ activo }: { activo: IActivo }) => {
  const condicion: { [index: string]: string } = {
    nuevo: "success",
    bueno: "primary",
    regular: "warning",
    malo: "danger",
    desuso: "secondary",
  };

  return (
    <>
      <div>
        <div className="my-2 border border-1 rounded-1 p-4 text-start">
          <div>
            <strong>Responsable:</strong>{" "}
            <span className="text-decoration-underline">
              {activo.responsable}
            </span>
          </div>
          <div>
            <strong>Tipo:</strong> {activo.tipo}
          </div>
          <div>
            <strong>Piso:</strong> {activo.piso}
          </div>
          <div>
            <strong>Ubicación:</strong> {activo.ubicacion}
          </div>
          <div>
            <strong>Estado:</strong> {activo.estado}
          </div>
          <div>
            <strong>Condición:</strong>{" "}
            <span
              className={`text-${condicion[activo.condicion.toLowerCase()]}`}
            >
              {activo.condicion}
            </span>
          </div>
        </div>
        <div className="border border-1 rounded-1 overflow-x-hidden">
          <BarcodeActivo activoFijo={activo} />
        </div>
      </div>
    </>
  );
};

export default Activo;
