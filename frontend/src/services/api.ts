// Configuração do axios
import axios from "axios";

export const api = axios.create({
  baseURL: "http://192.168.0.128:3333/" // Substitua localhost pelo IP local http://192.168.0.128:3000
});