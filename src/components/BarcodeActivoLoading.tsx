const style = {
  backgroundColor: "#d6d3d3",
  animation: "pulse 1s infinite ease-in-out",
};

const BarcodeActivoLoading = () => {
  return (
    <div
      className="mb-2  p-2 overflow-hidden border-tertiary"
      style={style}
      key={crypto.randomUUID()}
    >
      <div className="d-flex">
        <div
          style={{
            height: 50,
            width: "15%",
            backgroundColor: "#b6b6b6",
            margin: 5,
          }}
        ></div>
        <div
          style={{
            width: "50%",
            backgroundColor: "#b6b6b6",
            margin: "5px 5px 5px auto",
          }}
        ></div>
      </div>
      <div
        style={{
          borderTop: "1px solid black",
          padding: 5,
        }}
      >
        <div
          className="mt-1 mx-auto"
          style={{
            backgroundColor: "#aaa7a7",
            width: "80%",
            height: "65px",
          }}
        ></div>
        <div
          className="mt-1 mx-auto"
          style={{
            backgroundColor: "#b3b2b2",
            width: "50%",
            height: "15px",
          }}
        ></div>
        <div
          className="mt-1 mx-auto"
          style={{
            backgroundColor: "#969696",
            width: "70%",
            height: "15px",
          }}
        ></div>
      </div>
    </div>
  );
};

export default BarcodeActivoLoading;
