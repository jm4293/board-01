import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FormInputs1, FormInputs2 } from "../../interface/login_interface/login_interface.ts";
import { useMutation } from "@tanstack/react-query";
import { login_api, loginCreate_api, loginJWT_api } from "../../api/login_api/login_api.ts";

export const Login = () => {
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState<boolean>(false);

  const login = useMutation({
    mutationKey: ["login"],
    mutationFn: (data: FormInputs1) => loginJWT_api(data),
    onSuccess: () => {
      // alert("로그인이 완료되었습니다.");
      // navigate("/board");
      // reset1();
    },
    onError: (err: any) => {
      alert(err.response.data.message);
    },
  });

  const create = useMutation({
    mutationKey: ["loginCreate"],
    mutationFn: (data: FormInputs2) => loginCreate_api(data),
    onSuccess: () => {
      alert("회원가입이 완료되었습니다.");
      setIsRegister(false);
      reset2();
    },
    onError: (err: any) => {
      alert(err.response.data.message);
    },
  });

  const {
    register: register1,
    handleSubmit: handleSubmit1,
    formState: { errors: errors1 },
    setFocus,
    reset: reset1,
  } = useForm<FormInputs1>();

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
    reset: reset2,
  } = useForm<FormInputs2>();

  const handlerLogin = (data: FormInputs1) => {
    console.log(data);

    if (!data.email) {
      alert("이메일을 입력해주세요.");
      setFocus("email");
      return;
    }

    if (!data.password) {
      alert("비밀번호를 입력해주세요.");
      setFocus("password");
      return;
    }

    login.mutate(data);
  };

  const handlerRegister = (data: FormInputs2) => {
    console.log(data);

    if (!data.email) {
      alert("이메일을 입력해주세요.");
      return;
    }

    if (!data.password) {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    if (!data.name) {
      alert("이름을 입력해주세요.");
      return;
    }

    if (!data.age) {
      alert("나이를 입력해주세요.");
      return;
    }

    if (!data.phone) {
      alert("전화번호를 입력해주세요.");
      return;
    }

    create.mutate({ ...data, age: +data.age });
  };

  const btn_register = () => {
    setIsRegister(true);
  };

  const btn_register_cancel = () => {
    setIsRegister(false);
    reset2();
  };

  return (
    <>
      <form onSubmit={handleSubmit1(handlerLogin)}>
        <div>
          <label>이메일</label>
          <input type="text" {...register1("email")} />
          {errors1.email && <span>{errors1.email.message}</span>}
        </div>
        <div>
          <label>비밀번호</label>
          <input type="text" {...register1("password")} />
          {errors1.password && <span>{errors1.password.message}</span>}
        </div>
        <div>
          <button>로그인</button>
          <button onClick={btn_register}>회원가입</button>
        </div>
      </form>

      {isRegister && (
        <>
          <div className="mt-2">
            <form onSubmit={handleSubmit2(handlerRegister)}>
              <div>회원간입</div>
              <div>
                <label>email</label>
                <input type="text" {...register2("email")} />
              </div>
              <div>
                <label>password</label>
                <input type="text" {...register2("password")} />
              </div>
              <div>
                <label>name</label>
                <input type="text" {...register2("name")} />
              </div>
              <div>
                <label>age</label>
                <input type="text" {...register2("age")} />
              </div>
              <div>
                <label>phone</label>
                <input type="text" {...register2("phone")} />
              </div>
              <div>
                <button>등록</button>
                <button onClick={btn_register_cancel}>취소</button>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
};
