import NavBar from "./components/NavBar";
import { Suspense } from "react";
import { Home } from "./lazy";
import Main from "./pages/Main";
import { useAuthStore } from "./store/useAuthStore";
import { Navigate } from "react-router-dom";
import Spinner from "./components/Spinner";
// function Code() {
//   const barcodeRef = useRef(null);
//   const [barcode, setBarcode] = useState("");
//   const captureBarcodeAsImage = () => {
//     if (barcodeRef.current) {
//       html2canvas(barcodeRef.current).then((canvas) => {
//         const barcodeImage = canvas.toDataURL("image/png");
//         setBarcode(barcodeImage);
//       });
//     }
//   };

//   useEffect(() => {
//     captureBarcodeAsImage();
//   }, []);

//   return (
//     <div>
//       {barcode.length > 0 ? (
//         <PDFViewer style={{ width: "100vw", height: "100vh" }}>
//           <Sticker url={barcode} />
//         </PDFViewer>
//       ) : (
//         <div ref={barcodeRef} style={{ width: "350px", height: "auto" }}>
//           <BarcodeActivo
//             activoFijo={{
//               codigo: "INRA-02-0001",
//               rubro: "ESTANTES Y MAS",
//             }}
//           />
//         </div>
//       )}
//     </div>
//   );
// }

function App() {
  const { isAuth } = useAuthStore((state) => state);

  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <NavBar />
      {/* <Main>
        <Suspense fallback={<Spinner variant="warning" />}>
          <Home />
        </Suspense>
      </Main> */}
    </>
  );
}

export default App;
