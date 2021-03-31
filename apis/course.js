import axios from "axios";

const courseRequest = axios.create({
  baseURL: "http://localhost:3000/api/course",
  withCredentials: true
});

// GET
export const apiGetCategory = () => courseRequest.get("/getCategory");
export const apiGetUnitCourse = params =>
  courseRequest.get("/getUnitCourse", params);
export const apiGetSelectedCourse = () =>
  courseRequest.get("/getSelectedCourse");
export const apiGetPossibleInUnit = params =>
  courseRequest.get("/getPossibleInUnit", params);
export const apiGetPossibleOutUnit = params =>
  courseRequest.get("/getPossibleOutUnit", params);
export const apiGetPossibleGeneral = params =>
  courseRequest.get("/getPossibleGeneral", params);
export const apiGetPossiblePhysical = params =>
  courseRequest.get("/getPossiblePhysical", params);
