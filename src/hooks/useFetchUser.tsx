import { useQuery } from "@tanstack/react-query";
import { IUserResponse, IUsuario } from "../types";
import { AxiosResponse, AxiosError } from "axios";
import { fetchUsers } from "../services/user";

const useFetchUser = () => {
  const { data, isLoading } = useQuery<
    AxiosResponse<IUserResponse>,
    AxiosError
  >(["fetchUser"], fetchUsers);

  const users = data?.data.users.map(
    ({ id, nombre }: Pick<IUsuario, "id" | "nombre">) => ({
      id,
      nombre,
    })
  );

  return { users, isLoading };
};

export default useFetchUser;
