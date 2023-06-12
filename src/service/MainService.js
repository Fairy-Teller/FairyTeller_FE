import { call } from "./ApiService";
// import { API_BASE_URL } from "../api-config";

export function sendkeyword(userDTO) {
  return call("/chat-gpt/question", "POST", userDTO).then((response) => {
    console.log(response);
    window.location.href = "/story-generated";
  });
}

export function sendtext(userDTO) {
  return call("/chat-gpt/summarize", "POST", userDTO).then((response) => {
    console.log(response);
    window.location.href = "/f-edit";
  });
}
