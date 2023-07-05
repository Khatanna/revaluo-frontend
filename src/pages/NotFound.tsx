import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <>
      <div className="fs-4 position-absolute top-50 start-50 translate-middle-x text-center">
        <div>No se encontro esta direción</div>
        <Link to="/">Volver al inicio</Link>
      </div>
    </>
  );
};

export default NotFound;
