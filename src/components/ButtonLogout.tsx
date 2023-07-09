import { Button } from "react-bootstrap";
import { useAuthStore } from "../store/useAuthStore";
const ButtonLogout = () => {
  const { logout } = useAuthStore((state) => state);

  return (
    <>
      <Button onClick={logout} variant="danger" className="w-100">
        Cerrar sesión
      </Button>
    </>
  );
};

export default ButtonLogout;
