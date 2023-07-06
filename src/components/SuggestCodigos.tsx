// @ts-ignore
import Autosuggest from "react-autosuggest";
import Swal from "sweetalert2";
// @ts-ignore
import swal from "@sweetalert/with-react";
import Activo from "./Activo";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";

const API_URL = import.meta.env.VITE_API_URL as string;

const SuggestCodigos = () => {
  const [codigos, setCodigos] = useState<{ codigo: string }[]>([]);
  const [codigo, setCodigo] = useState("INRA-");
  const navigate = useNavigate();

  const onSuggestionsFetchRequested = async ({
    value,
  }: Autosuggest.SuggestionsFetchRequestedParams) => {
    try {
      const token = document.cookie.split(";").at(-1) as string;
      const response = await fetch(`${API_URL}/activos/${value}`, {
        headers: {
          authorization: token,
        },
      });
      const { codigos } = await response.json();
      if (response.status === 200) {
        setCodigos(codigos);
      } else {
        Swal.fire({
          icon: "info",
          title: "La sesión expiro inicie sesión nuevamente",
          confirmButtonText: "Iniciar sesión",
        });
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.localStorage.removeItem("auth");

        navigate("/login");
      }
    } catch (e) {
      setCodigos([]);
    }
  };

  const handleSelectedItem = (suggestion: { codigo: string }) => {
    fetchActivo(suggestion.codigo);
  };

  const fetchActivo = async (codigo: string) => {
    const token = document.cookie.split(";").at(-1) as string;
    const response = await fetch(`${API_URL}/activo/${codigo}`, {
      headers: {
        authorization: token,
      },
    });
    const { activo } = await response.json();

    swal(<Activo activo={activo} />, {
      buttons: {
        confirm: {
          text: "Registrar",
          className: "btn-confirm",
        },
        cancel: {
          text: "Cancelar",
          value: false,
          visible: true,
          className: "btn-cancel",
          closeModal: true,
        },
      },
    }).then((value: boolean) => {
      if (value) {
        const user = JSON.parse(localStorage.getItem("user") as string);
        const { piso } = JSON.parse(localStorage.getItem("config") as string);
        socket.emit("activo@registrado", activo.codigo, user, piso);
      }
    });

    setCodigo("INRA-");
  };

  return (
    <>
      <Autosuggest
        suggestions={codigos}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionSelected={(_: any, { suggestion, method }: any) => {
          if (method === "enter") {
            handleSelectedItem(suggestion);
          }
        }}
        onSuggestionsClearRequested={() => setCodigos([])}
        getSuggestionValue={(suggestion: any) => suggestion.codigo}
        renderSuggestion={(suggestion: any) => (
          <div
            className="px-2"
            onClick={() => {
              handleSelectedItem(suggestion);
            }}
          >
            {suggestion.codigo}
          </div>
        )}
        onKeyDown={(e) => console.log(e.key)}
        inputProps={{
          placeholder: "Codigo",
          value: codigo,
          inputMode: "numeric",
          pattern: "[0-9]*",
          onChange: (_: any, { newValue }: any) => {
            setCodigo(newValue);
          },
          onKeyDown: (e: any) => {
            if (e.key === "Enter") {
              handleSelectedItem({ codigo: e.target.value.trim() });
            }
          },
        }}
      />
    </>
  );
};

export default SuggestCodigos;
