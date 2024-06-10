export interface ApiResponse<T> {
  ok: boolean;
  result?: T;
  error?: string;
  code?: number;
}

export interface JsonRpcRequest {
  jsonrpc: string;
  method: string;
  params: any;
  id: any;
}

export interface JsonRpcResponse<T> {
  ok: boolean;
  jsonrpc: string;
  result?: T;
  error?: string;
  code: number;
  id: any;
}
