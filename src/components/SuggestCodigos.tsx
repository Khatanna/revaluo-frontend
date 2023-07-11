// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Autosuggest from "react-autosuggest";
import Swal from "sweetalert2";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import swal from "@sweetalert/with-react";
import Activo from "./Activo";
import { useState } from "react";
import socket from "../socket";
import { useAuthStore } from "../store/useAuthStore";
import { Endpoint } from "../constants/endpoints";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL as string;

const SuggestCodigos = () => {
  const { logout } = useAuthStore((state) => state);
  const [codigos, setCodigos] = useState<{ codigo: string }[]>([]);
  const [codigo, setCodigo] = useState("INRA-");
  const { token } = useAuthStore((state) => state);
  const onSuggestionsFetchRequested = async ({
    value,
  }: Autosuggest.SuggestionsFetchRequestedParams) => {
    try {
      console.log(value);
      const response = await axios.get(
        Endpoint.ACTIVOS_FIJOS_BY_CODIGO.concat("/", value),
        {
          headers: {
            authorization: token,
          },
          params: {
            codigo,
          },
        }
      );
      const {
        data: { codigos },
      } = response;
      if (response.status === 200) {
        setCodigos(codigos);
      } else {
        Swal.fire({
          icon: "info",
          title: "La sesión expiro inicie sesión nuevamente",
          confirmButtonText: "Iniciar sesión",
        });
        logout();
      }
    } catch (e) {
      setCodigos([]);
    }
  };

  const handleSelectedItem = (suggestion: { codigo: string }) => {
    fetchActivo(suggestion.codigo);
  };

  const fetchActivo = async (codigo: string) => {
    const response = await axios.get(Endpoint.ACTIVO_FIJO.concat("/", codigo), {
      headers: {
        authorization: token,
      },
    });
    const {
      data: { activo },
    } = response;

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
        // const user = JSON.parse(localStorage.getItem("user") as string);
        // const { piso } = JSON.parse(localStorage.getItem("config") as string);
        // socket.emit("activo@registrado", activo.codigo, user, piso);
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
