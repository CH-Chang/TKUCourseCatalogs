import axios from "axios";

const memberRequest = axios.create({
  baseURL: "http://localhost:3000/api/member",
  withCredentials: true
});

// GET
export const apiGetRegisterRes = () => memberRequest.get("/getRegisterRes");
export const apiGetEditRes = () => memberRequest.get("/getEditRes");
export const apiGetUserInfo = () => memberRequest.get("/getUserInfo"); //之後要偵錯
export const apiLogout = () => memberRequest.get("/logout");
// POST
export const apiGetCaptcha = data => memberRequest.post("/getCaptcha", data);
export const apiLogin = data => memberRequest.post("/login", data);
export const apiRegister = data => memberRequest.post("/register", data);
export const apiEditInfo = data => memberRequest.post("/editInfo", data);
export const apiEditPassword = data =>
  memberRequest.post("/editPassword", data);
