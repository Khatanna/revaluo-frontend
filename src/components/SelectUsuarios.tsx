import { Form } from "react-bootstrap";
import { IUsuario } from "../types";
import { useAuthStore } from "../store/useAuthStore";
import { useFetchUser } from "../hooks";

const renderUsers = (
  users: Pick<IUsuario, "id" | "nombre">[],
  user?: IUsuario
) => {
  return users.map(({ id, nombre }: Pick<IUsuario, "id" | "nombre">) => (
    <option value={id} key={crypto.randomUUID()}>
      {id === user?.id ? "Tú" : nombre}
    </option>
  ));
};

const SelectUsuarios = () => {
  const { user } = useAuthStore((state) => state);
  const { users, isLoading } = useFetchUser();

  return (
    <>
      <Form.Select
        onChange={(e) => console.log(e.target.value)}
        placeholder="Filtrar por usuario"
      >
        {isLoading ? (
          <option>Cargando usuarios...</option>
        ) : (
          <>
            <option disabled>Filtrar por usuario</option>
            <option value="all">Ver todos</option>
            {renderUsers(users ?? [], user)}
          </>
        )}
      </Form.Select>
    </>
  );
};

export default SelectUsuarios;
