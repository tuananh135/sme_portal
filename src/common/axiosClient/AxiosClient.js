import axios from "axios";
// For common config
axios.defaults.headers.post["Content-Type"] = "application/json";

const identityAxios = axios.create({
    baseURL: process.env.REACT_APP_AUTH_URL
});

const mainAxios = axios.create({
  baseURL: process.env.REACT_APP_B2C_URL
});

const enoviqAxios = axios.create({
    baseURL: process.env.REACT_APP_ENOVIQ_URL
});

export {
  identityAxios,
  mainAxios,
  enoviqAxios
};