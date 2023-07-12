import { AxiosError, AxiosResponse } from "axios";
import { IAuthResponse, IForm } from "../types";
import { Endpoint } from "../constants/endpoints";
import axios from "../api/axios";

export const fetchLogin = async (
  form: IForm,
): Promise<AxiosResponse<IAuthResponse>> => {
  try {
    const response = await axios.post<IAuthResponse>(Endpoint.LOGIN, {
      ...form,
    });
    return response;
  } catch (e) {
    throw e as AxiosError;
  }
};

export const fetchLogout = async () => {
  try {
    const response = await axios.post(Endpoint.LOGOUT);

    return response;
  } catch (e) {
    throw e as AxiosError;
  }
};
