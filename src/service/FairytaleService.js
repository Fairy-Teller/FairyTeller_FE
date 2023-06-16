import { call } from "./ApiService";
import { API_BASE_URL } from "../api-config";

export function FairytaleNew(userDTO) {
  return call("/book/my-newest", "GET", userDTO).then((response) => {
    //console.log("response: ", response);
    //alert("token: " + response.token);
    if (response) {
      return response.json();
    }
  });
}

export function sendAudioData(audioDTO) {
  console.log(audioDTO);
  return call("/audio/user-record", "POST", audioDTO);
}
