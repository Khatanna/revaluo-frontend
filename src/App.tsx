import NavBar from "./components/NavBar";
import { useAuthStore } from "./store/useAuthStore";
import { Navigate } from "react-router-dom";
import axios from "./api/axios";
import Swal from "sweetalert2";

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
  const { isAuth, token, logout } = useAuthStore((state) => state);

  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  axios.interceptors.request.use((config) => {
    config.headers.Authorization = token;

    return config;
  });

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 403) {
        Swal.fire({
          icon: "info",
          title: "Su sesión ha expirado",
          confirmButtonText: "Inicar sesión",
          confirmButtonColor: "green",
        });

        logout();
      }

      return Promise.reject(error);
    }
  );

  return <NavBar />;
}

export default App;
