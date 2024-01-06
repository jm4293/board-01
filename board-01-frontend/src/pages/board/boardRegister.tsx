import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { useBoardModify } from "../../zustand/board/boardModify.ts";
import { useEffect } from "react";
import { boardModify_api, boardRegister_api } from "../../api/board_api/board_api.ts";
import { tokenAxios } from "../../util/axios/axios.ts";
import axios from "axios";

interface Props {
  setIsResister: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FormInputs {
  title: string;
  content: string;
  files: FileList;
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

    if (data.files.length === 0) {
      alert("파일을 선택해주세요.");
      return;
    }

    const formData = new FormData();

    [...data.files].forEach((el, index) => {
      console.log(el);
      return formData.append(`file${index + 1}`, el);
    });

    console.log(formData.getAll("files"));
    console.log("formData", formData);

    // tokenAxios
    //   .post("http://localhost:8080/board/uploads", formData, {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //   })
    //   .then(res => {
    //     console.log(res);
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });

    tokenAxios
      .post("http://localhost:8080/board/uploads/multi", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });

    // if (modifyData.idx !== 0) {
    //   // 수정
    //   boardModify.mutate({ ...data, idx: modifyData.idx });
    // } else {
    //   // 등록
    //   boardRegister.mutate(data);
    // }
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
          <div>파일:</div>
          <input type="file" multiple={true} {...register("files")} />
        </div>

        <div>
          <button onClick={handleSubmit(onSubmit)}>{modifyData.idx !== 0 ? "수정" : "저장"}</button>
        </div>

        <button
          onClick={() => axios.get("http://localhost:8080/board/download/image1704518412520.jpg")}
        >
          파일 다운
        </button>
      </div>
    </>
  );
};
