import { Row, Col } from "react-bootstrap";
import Barcode from "react-barcode";
import logo from "../assets/logo.png";
import { IActivo } from "../types";

const BarcodeActivo = ({
  activoFijo,
}: {
  activoFijo: Pick<IActivo, "codigo" | "rubro">;
}) => {
  return (
    <Row>
      <Col className="text-start">
        <img src={logo} alt="" width={60} height={60} className="img-fluid" />
      </Col>
      <Col className="px-3 d-flex align-items-center">
        <div className="">INSTITUTO NACIONAL DE REFORMA AGRARIA</div>
      </Col>
      <Col
        xs={12}
        className="border-1 border-top border-black mt-2 d-flex flex-column align-items-center"
      >
        <Barcode value={activoFijo.codigo} height={60} margin={0} />
        <div className="mt-1">{activoFijo.rubro}</div>
      </Col>
    </Row>
  );
};

export default BarcodeActivo;
