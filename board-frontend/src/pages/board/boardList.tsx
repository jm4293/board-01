import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import * as React from "react";
import { useBoardModify } from "../../zustand/board/boardModify.ts";

interface Props {
  setIsResister: React.Dispatch<React.SetStateAction<boolean>>;
}

interface tableData {
  idx?: number;
  title: string;
  content: string;
}

export const BoardList: React.FC<Props> = ({ setIsResister }) => {
  const { modifyData, setModifyData } = useBoardModify();

  const boardAll = useQuery({
    queryKey: ["boardAll"],
    queryFn: () =>
      axios
        .get("http://localhost:8080/board/user_all", {
          params: { page: 1, limit: 10 },
        })
        .then(res => {
          return res.data;
        }),
  });

  const detailData = useMutation({
    mutationKey: ["boardDetail"],
    mutationFn: (idx: number) =>
      axios.get(`http://localhost:8080/board/user`, { params: { idx: idx } }).then(res => {
        return res.data;
      }),
  });

  const boardDelete = useMutation({
    mutationKey: ["boardDelete"],
    mutationFn: (idx: number) =>
      axios.post(`http://localhost:8080/board/delete`, { idx: idx }).then(res => {
        return res.data;
      }),
    onSuccess: res => {
      alert(res.message);
      boardAll.refetch();
    },
  });

  const btn_rowClick = (data: tableData) => {
    if (data.idx) {
      detailData.mutate(data.idx);
    }
  };

  const btn_modify = (data: tableData) => {
    setIsResister(true);
    setModifyData(data);
  };

  const btn_delete = (data: tableData) => {
    if (data.idx) {
      if (window.confirm("삭제하시겠습니까?")) {
        boardDelete.mutate(data.idx);
      }
    }
  };

  console.log("boardAll", boardAll);

  return (
    <>
      <div className="d-flex justify-content-between">
        <div>게시판 리스트</div>
        <button onClick={() => setIsResister(true)}>등록</button>
      </div>

      <div className="mt-1">
        <table>
          <colgroup>
            <col width="5%" />
            <col width="40%" />
            <col width="40%" />
            <col width="5%" />
            <col width="5%" />
          </colgroup>
          <thead>
            <tr>
              <th>No.</th>
              <th>제목</th>
              <th>내용</th>
              <th>수정</th>
              <th>삭제</th>
            </tr>
          </thead>
        </table>
        <table>
          <colgroup>
            <col width="5%" />
            <col width="40%" />
            <col width="40%" />
            <col width="5%" />
            <col width="5%" />
          </colgroup>
          <tbody>
            {boardAll.data && boardAll.data.result.length !== 0 ? (
              boardAll.data.result.map((el: tableData, index: number) => (
                <tr onClick={() => btn_rowClick(el)}>
                  <td>{index + 1}</td>
                  <td>{el.title}</td>
                  <td>{el.content}</td>
                  <td
                    onClick={e => {
                      e.stopPropagation();
                    }}
                  >
                    <button onClick={() => btn_modify(el)}>수정</button>
                  </td>
                  <td
                    onClick={e => {
                      e.stopPropagation();
                    }}
                  >
                    <button onClick={() => btn_delete(el)}>삭제</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>검색결과가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {detailData.data && (
        <div className="mt-2">
          <div>선택된 게시판</div>
          <div className="d-flex">
            <div>제목: </div>
            <div>{detailData.data.title}</div>
          </div>
          <div className="d-flex">
            <div>내용: </div>
            <div>{detailData.data.content}</div>
          </div>
        </div>
      )}
    </>
  );
};
