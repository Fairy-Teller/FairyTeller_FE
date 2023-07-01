import { call } from "./ApiService";
import { API_BASE_URL } from "../api-config";

//"../../recoil/FairytaleState";

export function signup(userDTO) {
  return call("/auth/signup", "POST", userDTO);
}

export function signin(userDTO) {
  return call("/auth/signin", "POST", userDTO)
    .then((response) => {
      if (response && response.token) {
        localStorage.setItem("ACCESS_TOKEN", response.token);
        window.location.href = "/start";
      }
      return response;
    })
    .catch((error) => {
      console.error(error);
      alert("로그인에 실패하였습니다. 아이디 혹은 비밀번호를 확인해주세요.");
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
  localStorage.removeItem("ACCESS_TOKEN");
  window.location.href = "/login";
}

export function updateUser(userDTO) {
  return call("/mypage/update-user", "PUT", userDTO).then((response) => {
    window.location.href = "/";
  });
}
