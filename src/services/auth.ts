import axios, { AxiosError, AxiosResponse } from "axios";
import { IAuthResponse, IForm } from "../types";
import { Endpoint } from "../constants/endpoints";

export const fetchLogin = async (
    form: IForm
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

export const fetchLogout = async (token: string) => {
    try {
        const response = await axios.post(Endpoint.LOGOUT, undefined, { headers: { Authorization: token } })

        return response;
    } catch (e) {
        throw e as AxiosError;
    }
}

