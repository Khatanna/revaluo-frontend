import { useAuthStore } from "../store/useAuthStore";
import Swal from "sweetalert2";
import { AxiosError, AxiosResponse } from "axios";
import { useMutation, MutationFunction } from "@tanstack/react-query";
import { fetchLogin } from "../services/auth";
import { IAuthResponse } from "../types";
import { IForm } from "../types";

const mutationFn: MutationFunction<
  AxiosResponse<IAuthResponse>,
  IForm
> = async (form: IForm) => {
  return await fetchLogin(form);
};

const useAuth = () => {
  const { login } = useAuthStore((state) => state);
  const { mutate, isLoading } = useMutation<
    AxiosResponse<IAuthResponse>,
    AxiosError,
    IForm,
    unknown
  >({
    mutationFn,
    onSuccess: ({ data: { user, token } }) => {
      login(user, token);
    },
    onError: (error) => {
      Swal.fire({
        icon: "warning",
        title:
          error.code === AxiosError.ERR_NETWORK
            ? "Error de conexion"
            : "Error, revise sus crendenciales",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "green",
      });
    },
  });
  return { login: mutate, isLoading };
};

export default useAuth;
