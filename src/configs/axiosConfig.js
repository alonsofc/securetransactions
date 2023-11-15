import axios from "axios";
import config from "./config.json";
import { toast } from "./toastConfig.js";
import store from "../store";

// Instancia de Axios con el interceptor de autorización
const apiAuth = axios.create({
  baseURL: config.apiBaseUrl,
});

// Interceptor para agregar el token a todas las solicitudes de autenticación
apiAuth.interceptors.request.use(
  (config) => {
    const token = store.state.user.token;
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Método genérico GET con autenticación
apiAuth.GetRequest = async (url, onSuccess, onError, onFinally) => {
  await apiAuth
    .get(url)
    .then((response) => {
      if (response.data.status === 0) {
        if (onSuccess) onSuccess(response.data);
      } else
        toast.error(response.data.message + " (" + response.data.status + ")");
    })
    .catch((error) => {
      if (onError) onError(error);
      toast.error("Api Error: " + error.message);
    })
    .finally(() => {
      if (onFinally) onFinally();
    });
};

// Método genérico PUT con autenticación
apiAuth.PutRequest = async (url, data, onSuccess, onError, onFinally) => {
  await apiAuth
    .put(url, data)
    .then((response) => {
      if (response.data.status === 0) {
        if (onSuccess) onSuccess(response.data);
        toast.success(response.data.message);
      } else toast.error(response.data.message);
      return response.data;
    })
    .catch((error) => {
      if (onError) onError(error);
      toast.error("Api Error: " + error.message);
    })
    .finally(() => {
      if (onFinally) onFinally();
    });
};

// Método genérico POST con autenticación
apiAuth.PostRequest = async (url, data, onSuccess, onError, onFinally) => {
  await apiAuth
    .post(url, data)
    .then((response) => {
      if (response.data.status === 0) {
        if (onSuccess) onSuccess(response.data);
        toast.success(response.data.message);
      } else toast.error(response.data.message);
      return response.data;
    })
    .catch((error) => {
      if (onError) onError(error);
      toast.error("Api Error: " + error.message);
    })
    .finally(() => {
      if (onFinally) onFinally();
    });
};

// Instancia de Axios sin el interceptor de autorización
const api = axios.create({
  baseURL: config.apiBaseUrl,
});

// Método genérico POST sin autenticación
api.PostRequest = async (url, data, onSuccess, onError, onFinally) => {
  await api
    .post(url, data)
    .then((response) => {
      if (response.data.status === 0) {
        if (onSuccess) onSuccess(response.data);
        toast.success(response.data.message);
      } else toast.error(response.data.message);
      return response.data;
    })
    .catch((error) => {
      if (onError) onError(error);
      toast.error("Api Error: " + error.message);
    })
    .finally(() => {
      if (onFinally) onFinally();
    });
};

export { apiAuth, api };
