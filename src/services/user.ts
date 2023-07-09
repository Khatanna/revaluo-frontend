import axios, { AxiosResponse, AxiosError } from "axios"; 0
import { Endpoint } from "../constants/endpoints";
import { IUserResponse } from "../types";

export const fetchUsers = async (): Promise<AxiosResponse<IUserResponse>> => {
    try {
        const response = await axios.get<IUserResponse>(Endpoint.USERS);

        return response;
    } catch (e) {
        throw e as AxiosError;
    }
};
