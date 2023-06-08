import { call } from "./ApiService";
import { API_BASE_URL } from "../api-config";

export function signup(userDTO) {
  return call("/auth/signup", "POST", userDTO);
}

export function signin(userDTO) {
  return call("/auth/signin", "POST", userDTO)
    .then((response) => {
      if (response && response.token) {
        localStorage.setItem("ACCESS_TOKEN", response.token);
        window.location.href = "/";
      }
    })
    .catch((error) => {
      console.log("로그인 오류");
    });
}

export function socialLogin(provider) {
  const frontendUrl = window.location.protocol + "//" + window.location.host;
  window.location.href =
    API_BASE_URL +
    "/auth/authorize/" +
    provider +
    "?redirect_url=" +
    frontendUrl;
}

export function signout() {
  localStorage.setItem("ACCESS_TOKEN", null);
  window.location.href = "/login";
}
