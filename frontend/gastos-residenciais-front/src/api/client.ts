
import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
});

// melhora mensagem de erro
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg =
      err?.response?.data?.error ||
      err?.response?.data?.title ||
      err?.message ||
      "Erro inesperado";
    err.friendlyMessage = msg;
    return Promise.reject(err);
  }
);
