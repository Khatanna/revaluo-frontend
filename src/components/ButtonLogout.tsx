import { Button } from "react-bootstrap";
import { useAuth } from "../hooks";
import Spinner from "./Spinner";
import { useAuthStore } from "../store/useAuthStore";
const ButtonLogout = () => {
  const { token } = useAuthStore((state) => state);
  const { logout, isLoadingLogout } = useAuth();

  if (isLoadingLogout) {
    return <Spinner variant="sucess" />;
  }
  return (
    <>
      <Button onClick={() => logout(token)} variant="danger" className="w-100">
        Cerrar sesión
      </Button>
    </>
  );
};

export default ButtonLogout;
