// 게시판 상제데이터 가져오기
import axios from "axios";
import { FormInputs1, FormInputs2 } from "../../interface/login_interface/login_interface.ts";

export const login_api = async (data: FormInputs1) =>
  await axios.get("http://localhost:8080/user/login", { params: data }).then(res => res.data);

export const loginJWT_api = async (data: FormInputs1) =>
  await axios
    .post("http://localhost:8080/auth/login", data, {
      withCredentials: true,
    })
    .then(res => res.data);

export const userCreate_api = async (data: FormInputs2) =>
  await axios.post("http://localhost:8080/user/create", data).then(res => res.data);
