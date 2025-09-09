import axios from "axios";

// Função para ler o token do cookie

function getAccessToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access");
  }
  return null;
}


const api = axios.create();

// Interceptor para adicionar o token em todas as requisições (apenas no client)
api.interceptors.request.use(
  (config) => {
    let token: string | null = null;
    if (typeof window !== "undefined") {
      token = getAccessToken();
    }
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// Interceptor de resposta para tratar 401 (token expirado ou inválido)
if (typeof window !== "undefined") {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );
}

export default api;
