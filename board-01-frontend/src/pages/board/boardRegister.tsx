import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import * as React from "react";
import { useBoardModify } from "../../zustand/board/boardModify.ts";
import { useEffect } from "react";
import { boardModify_api, boardRegister_api } from "../../api/board_api/board_api.ts";

interface Props {
  setIsResister: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FormInputs {
  title: string;
  content: string;
}

export const BoardRegister: React.FC<Props> = ({ setIsResister }) => {
  const { modifyData, setModifyData } = useBoardModify();

  const queryClient = useQueryClient();

  const boardRegister = useMutation({
    mutationKey: ["boardRegister"],
    mutationFn: (data: FormInputs) => boardRegister_api(data),
    onSuccess: res => {
      alert(res.message);
      queryClient.invalidateQueries({ queryKey: ["boardAll"] });
      setIsResister(false);
    },
    onError: err => {
      alert(err.message);
    },
  });

  const boardModify = useMutation({
    mutationKey: ["boardModify"],
    mutationFn: (data: FormInputs & { idx: number }) => boardModify_api(data),
    onSuccess: res => {
      alert(res.message);
      queryClient.invalidateQueries({ queryKey: ["boardAll"] });
      setIsResister(false);
      setModifyData({ idx: 0, title: "", content: "" });
    },
    onError: err => {
      alert(err.message);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormInputs>();

  useEffect(() => {
    if (modifyData.idx !== 0) {
      setValue("title", modifyData.title);
      setValue("content", modifyData.content);
    }
  }, [modifyData.idx]);

  const onSubmit = (data: FormInputs) => {
    console.log(data);

    if (modifyData.idx !== 0) {
      // 수정
      boardModify.mutate({ ...data, idx: modifyData.idx });
    } else {
      // 등록
      boardRegister.mutate(data);
    }
  };

  return (
    <>
      <div className="mt-2">
        <div>{modifyData.idx !== 0 ? "게시판 수정" : "게시판 등록"}</div>

        <div className="d-flex">
          <div>제목:</div>
          <input type="text" {...register("title")} />
        </div>
        <div className="d-flex">
          <div>내용:</div>
          <textarea {...register("content")} />
        </div>

        <div>
          <button onClick={handleSubmit(onSubmit)}>{modifyData.idx !== 0 ? "수정" : "저장"}</button>
        </div>
      </div>
    </>
  );
};
