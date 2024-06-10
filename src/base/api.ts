import axios, { AxiosInstance, AxiosResponse } from "axios";
import { ApiKeyConfig, ApiKeyType } from "../interfaces";
import { ApiResponse } from "./interfaces";
import { HttpClientError, HttpServerError, RateLimitExceededError } from "../errors";
import { toCamelCase } from "../utils";

export abstract class ClientApi {
  protected axiosInstance: AxiosInstance;
  protected apiKeyConfig: ApiKeyConfig | null;

  constructor(baseURL: string, apiKeyConfig: ApiKeyConfig | null = null) {
    this.axiosInstance = axios.create({ baseURL });
    this.apiKeyConfig = apiKeyConfig;
  }

  protected async sendRequest<T>(
    method: "GET" | "POST",
    endpoint: string,
    params: Record<string, string>,
    body?: Record<string, unknown>
  ): Promise<T> {
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

    const response = await this.axiosInstance.request<ApiResponse<T>>(config);
    return this.handleApiResponse(response);
  }

  protected async handleApiResponse<T>(
    response: AxiosResponse<ApiResponse<T>>
  ): Promise<T> {
    const responseBody = response.data;

    if (responseBody.ok) {
      if (responseBody.result) {
        return toCamelCase(responseBody.result);
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
