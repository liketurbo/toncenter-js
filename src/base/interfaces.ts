export interface ApiResponse<T> {
    ok: boolean;
    result?: T;
    error?: string;
    code?: number;
}