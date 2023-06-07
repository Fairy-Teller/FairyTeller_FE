import { call } from "./ApiService";

export function signup(userDTO) {
  return call("/auth/signup", "POST", userDTO);
}
