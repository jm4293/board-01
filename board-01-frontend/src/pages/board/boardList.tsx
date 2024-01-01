import { useMutation, useQuery } from "@tanstack/react-query";
import * as React from "react";
import { useBoardModify } from "../../zustand/board/boardModify.ts";
import moment from "moment";
import { useState } from "react";
import { boardAll_api, boardDelete_api, boardDetail_api } from "../../api/board_api/board_api.ts";
import { pagination_type } from "../../interface/board_interface/board_interface.ts";
import { Pagination } from "../../components/pagination/pagination.tsx";

interface Props {
  setIsResister: React.Dispatch<React.SetStateAction<boolean>>;
}

interface tableData {
  idx?: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export const BoardList: React.FC<Props> = ({ setIsResister }) => {
  const [pagination, setPagination] = useState<pagination_type>({
    currentPage: 1,
    dataCount: 0,
    pageCount: 0,
  });

  const { modifyData, setModifyData } = useBoardModify();

  const boardAll = useQuery({
    queryKey: ["boardAll", pagination.currentPage],
    queryFn: () => boardAll_api(pagination, setPagination),
  });

  const detailData = useMutation({
    mutationKey: ["boardDetail"],
    mutationFn: (idx: number) => boardDetail_api(idx),
  });

  const boardDelete = useMutation({
    mutationKey: ["boardDelete"],
    mutationFn: (idx: number) => boardDelete_api(idx),
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
            <col width="5%" />
            <col width="5%" />
            <col width="5%" />
          </colgroup>
          <thead>
            <tr>
              <th>No.</th>
              <th>제목</th>
              <th>내용</th>
              <th>등록일</th>
              <th>최신 수정일</th>
              <th>삭제일</th>
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
            <col width="5%" />
            <col width="5%" />
            <col width="5%" />
          </colgroup>
          <tbody>
            {boardAll.data && boardAll.data.result.length !== 0 ? (
              boardAll.data.result.map((el: tableData) => (
                <tr onClick={() => btn_rowClick(el)}>
                  <td>{el.idx}</td>
                  <td>{el.title}</td>
                  <td>{el.content}</td>
                  <td>{moment(el.createdAt).format("YY-MM-DD HH:mm:ss")}</td>
                  <td>{moment(el.updatedAt).format("YY-MM-DD HH:mm:ss")}</td>
                  <td>{el.deletedAt ? moment(el.deletedAt).format("YY-MM-DD HH:mm:ss") : "-"}</td>
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
                <td colSpan={8}>검색결과가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination pagination={pagination} setPagination={setPagination} />

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
