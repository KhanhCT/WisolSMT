import axios from "axios";
import { authHeader } from "../helpers";
import { apiConfigs } from "../constants";

export function callApi(
    endpoint,
    method = "GET",
    params,
    body,
    headers = authHeader()
) {
    if (!headers)
        headers = {
            "Content-Type": "application/json",
        };
    return axios({
        baseURL: apiConfigs.BASE_API,
        method: method,
        url: endpoint,
        headers: headers,
        data: body,
        params: params,
    });
}
