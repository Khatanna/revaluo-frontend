import { Spinner as SpinnerBootstrap, SpinnerProps } from "react-bootstrap";

const Spinner = ({ variant }: SpinnerProps) => {
  return (
    <>
      <div className="position-absolute top-50 start-50 translate-middle-x fs-5 text-center">
        <SpinnerBootstrap variant={variant} />
      </div>
    </>
  );
};

export default Spinner;
