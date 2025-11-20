const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export type ApiError = {
  message: string;
  statusCode?: number;
};

export async function httpClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      let errorMessage = "Ocorreu um erro";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }

      if (response.status === 401 && typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }

      const error: ApiError = {
        message: errorMessage,
        statusCode: response.status,
      };
      throw error;
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    if (error && typeof error === "object" && "message" in error) {
      throw error as ApiError;
    }
    throw {
      message: "Erro de conexão. Por favor, verifique sua conexão.",
      statusCode: 0,
    };
  }
}
