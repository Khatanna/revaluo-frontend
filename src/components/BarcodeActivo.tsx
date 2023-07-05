import { Row, Col } from "react-bootstrap";
import Barcode from "react-barcode";
import logo from "../assets/logo.png";
import { IActivo } from "../types";

const BarcodeActivo = ({ activoFijo }: { activoFijo: IActivo }) => {
  return (
    <Row>
      <Col xs={5}>
        <img
          src={logo}
          alt=""
          width={50}
          height={50}
          className="img-fluid float-start"
        />
      </Col>
      <Col xs={7} className="d-flex align-items-center">
        <div className="text-center">INSTITUTO NACIONAL DE REFORMA AGRARIA</div>
      </Col>
      <Col
        xs={12}
        className="border-1 border-top border-black mt-2 d-flex flex-column text-center align-items-center"
      >
        <Barcode value={activoFijo.codigo} height={60} margin={0} />
        <div className="mt-1">{activoFijo.rubro}</div>
      </Col>
    </Row>
  );
};

export default BarcodeActivo;
