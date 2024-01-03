import axios from "axios";
import { pagination_type } from "../../interface/board_interface/board_interface.ts";
import { SetStateAction } from "react";
import { tokenAxios } from "../../util/axios/axios.ts";

// 게시판 데이터가져오기(페이지네이션)
export const boardAll_api = async (
  pagination: pagination_type,
  setPagination: React.Dispatch<SetStateAction<pagination_type>>
) => {
  try {
    const result = await axios
      .get("http://localhost:8080/board/user_all", {
        params: { page: pagination.currentPage, limit: 5 },
      })
      .then(res => {
        return res.data;
      });

    setPagination({
      ...pagination,
      dataCount: result.total,
      pageCount: Math.ceil(result.total / 5),
    });

    return result;
  } catch (error) {
    console.log(error);
  }
};

// 게시판 상제데이터 가져오기
export const boardDetail_api = async (idx: number) => {
  try {
    return await tokenAxios
      .get(`http://localhost:8080/board/user`, { params: { idx: idx } })
      .then(res => {
        return res.data;
      });
  } catch (error) {
    console.log(error);
  }
};

// 게시판 저장
export const boardRegister_api = async (data: { title: string; content: string }) => {
  try {
    return axios.post(`http://localhost:8080/board/register`, data).then(res => {
      return res.data;
    });
  } catch (err) {
    console.log(err);
  }
};

// 게시판 수정
export const boardModify_api = async (data: { title: string; content: string }) => {
  try {
    return axios.put(`http://localhost:8080/board/modify`, data).then(res => {
      return res.data;
    });
  } catch (err) {
    console.log(err);
  }
};

// 게시판 삭제
export const boardDelete_api = async (idx: number) => {
  try {
    return await axios
      .delete(`http://localhost:8080/board/delete`, { params: { idx: idx } })
      .then(res => {
        return res.data;
      });
  } catch (error) {
    console.log(error);
  }
};
