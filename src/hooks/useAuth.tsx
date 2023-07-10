import { useAuthStore } from "../store/useAuthStore";
import Swal from "sweetalert2";
import { AxiosError, AxiosResponse } from "axios";
import { useMutation, MutationFunction } from "@tanstack/react-query";
import { fetchLogin, fetchLogout } from "../services/auth";
import { IAuthResponse } from "../types";
import { IForm } from "../types";

const mutationFnLogin: MutationFunction<
  AxiosResponse<IAuthResponse>,
  IForm
> = async (form: IForm) => {
  return await fetchLogin(form);
};

const mutationFnLogout: MutationFunction<AxiosResponse, string> = async (
  token: string
) => {
  return await fetchLogout(token);
};

const useAuth = () => {
  const { login: loginStore, logout: logoutStore } = useAuthStore(
    (state) => state
  );

  const { mutate: login, isLoading: isLoadingLogin } = useMutation<
    AxiosResponse<IAuthResponse>,
    AxiosError,
    IForm,
    unknown
  >({
    mutationFn: mutationFnLogin,
    onSuccess: ({ data: { user, token } }) => {
      loginStore(user, token);
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

  const { mutate: logout, isLoading: isLoadingLogout } = useMutation<
    AxiosResponse,
    AxiosError,
    string,
    unknown
  >({
    mutationFn: mutationFnLogout,
    onSuccess: () => {
      logoutStore();
    },
    onError: (error) => {
      Swal.fire({
        icon: "warning",
        title:
          error.code === AxiosError.ERR_NETWORK
            ? "Error de conexion"
            : "Error, al intentar cerrar la sesión",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "green",
      });
    },
  });

  return { login, logout, isLoadingLogin, isLoadingLogout };
};

export default useAuth;
