import { Form } from "react-bootstrap";
import { useAuthStore } from "../store/useAuthStore";

const pisos = [
  "PLANTA BAJA",
  "PISO 4",
  "PISO 3",
  "PISO 1",
  "PISO 2",
  "SUBSUELO 2",
  "SUBSUELO 1",
];

const SelectPisos = ({
  onChange,
  piso,
}: {
  onChange: (name: string, value: string) => void;
  piso?: string;
}) => {
  return (
    <Form.Select
      required
      name="piso"
      onChange={({ target: { name, value } }) => onChange(name, value)}
    >
      <option value="" selected disabled>
        Elije el piso
      </option>
      {pisos.map((p) => (
        <option
          key={crypto.randomUUID()}
          // defaultValue={p}
          value={p}
          selected={piso === p}
        >
          {p}
        </option>
      ))}
    </Form.Select>
  );
};

export default SelectPisos;
