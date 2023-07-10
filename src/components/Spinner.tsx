import { Spinner as SpinnerBootstrap, SpinnerProps } from "react-bootstrap";

const Spinner = ({
  variant,
  message,
  absolute = true,
}: SpinnerProps & { message?: string; absolute?: boolean }) => {
  return (
    <>
      <div
        className={
          absolute
            ? "position-absolute top-50 start-50 translate-middle-x fs-5 text-center"
            : ""
        }
      >
        <SpinnerBootstrap variant={variant} />
        {message && <div>{message}</div>}
      </div>
    </>
  );
};

export default Spinner;
