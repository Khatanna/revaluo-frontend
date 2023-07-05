import Swal from "sweetalert2";
import { useState } from "react";
import { Form } from "react-bootstrap";

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
  form,
}: {
  onChange: (name: string, value: string) => void;
  form: { color: string; nombre: string; piso: string };
}) => {
  return (
    <Form.Select
      required
      name="piso"
      value={form.piso}
      onChange={({ target: { name, value } }) => onChange(name, value)}
    >
      <option value="" selected disabled>
        {localStorage.getItem("piso") ?? "Elije el piso"}
      </option>
      {pisos.map((piso) => (
        <option
          key={crypto.randomUUID()}
          defaultValue={piso}
          selected={localStorage.getItem("piso") === piso}
        >
          {piso}
        </option>
      ))}
    </Form.Select>
  );
};

export default SelectPisos;
