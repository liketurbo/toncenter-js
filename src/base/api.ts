import axios, { AxiosInstance, AxiosResponse } from "axios";
import { ApiKeyConfig, ApiKeyType } from "../interfaces";
import { ApiResponse, JsonRpcRequest, JsonRpcResponse } from "./interfaces";
import {
  HttpClientError,
  HttpServerError,
  RateLimitExceededError,
} from "../errors";
import { ignoreFields as omitFields, toCamelCase } from "../utils";

export abstract class ClientApi {
  protected axiosInstance: AxiosInstance;
  protected apiKeyConfig: ApiKeyConfig | null;

  constructor(baseURL: string, apiKeyConfig: ApiKeyConfig | null = null) {
    this.axiosInstance = axios.create({ baseURL });
    this.apiKeyConfig = apiKeyConfig;
  }

  protected async get<T>(
    endpoint: string,
    params: Record<string, string>
  ): Promise<T> {
    let response = await this.sendRequest<ApiResponse<T>>(
      "GET",
      endpoint,
      params
    );

    return this.handleApiResponse(response);
  }

  protected async postApi<T>(
    endpoint: string,
    body: Record<string, unknown>
  ): Promise<T> {
    const response = await this.sendRequest<ApiResponse<T>>(
      "POST",
      endpoint,
      {},
      body
    );

    return this.handleApiResponse(response);
  }

  protected async postRpc<T>(
    endpoint: string,
    body: JsonRpcRequest
  ): Promise<T> {
    const response = await this.sendRequest<JsonRpcResponse<T>>(
      "POST",
      endpoint,
      {},
      body as Record<string, any>
    );

    return this.handleRpcResponse(response);
  }

  private async sendRequest<T>(
    method: "GET" | "POST",
    endpoint: string,
    params: Record<string, string>,
    body?: Record<string, unknown>
  ): Promise<AxiosResponse<T>> {
    const headers: Record<string, string> = {};
    const queryParams = { ...params };

    if (this.apiKeyConfig) {
      if (this.apiKeyConfig.type === ApiKeyType.Header) {
        headers["x-api-key"] = this.apiKeyConfig.key;
      } else if (this.apiKeyConfig.type === ApiKeyType.Query) {
        queryParams["api_key"] = this.apiKeyConfig.key;
      }
    }

    const config = {
      method,
      url: endpoint,
      headers,
      params: queryParams,
      data: body || {},
    };

    return this.axiosInstance.request<T>(config);
  }

  private async handleApiResponse<T>(
    response: AxiosResponse<ApiResponse<T>>
  ): Promise<T> {
    const responseBody = response.data;

    if (responseBody.ok) {
      if (responseBody.result) {
        let { result } = responseBody;
        result = omitFields(result, ["@type", "@extra"]);
        result = toCamelCase(result);
        return result;
      }
      throw new Error('Invalid response from server, expected "result"');
    }

    if (responseBody.error && responseBody.code !== undefined) {
      this.handleError(responseBody.code, responseBody.error);
    }

    throw new Error(
      'Invalid response from server, expected "result" or "error"'
    );
  }

  private async handleRpcResponse<T>(
    response: AxiosResponse<JsonRpcResponse<T>>
  ) {
    const responseBody = response.data;

    if (responseBody.ok) {
      if (responseBody.result) {
        let { result } = responseBody;
        result = toCamelCase(result);
        return result;
      }
      throw new Error('Invalid response from server, expected "result"');
    }

    if (responseBody.error && responseBody.code !== undefined) {
      this.handleError(responseBody.code, responseBody.error);
    }

    throw new Error(
      'Invalid response from server, expected "result" or "error"'
    );
  }

  private handleError(code: number, message: string): never {
    if (code === 429) {
      throw new RateLimitExceededError(message);
    } else if (400 <= code && code < 500) {
      throw new HttpClientError(code, message);
    } else {
      throw new HttpServerError(code, message);
    }
  }
}
