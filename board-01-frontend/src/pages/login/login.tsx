import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface FormInputs {
  email: string;
  password: string;
}

export const Login = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setFocus,
  } = useForm<FormInputs>();

  function onSubmit(data: FormInputs) {
    // if (!data.email) {
    //   setError("email", {
    //     type: "manual",
    //     message: "이메일을 입력해주세요.",
    //   });
    //   setFocus("email");
    //   return;
    // }
    //
    // if (!data.password) {
    //   setError("password", {
    //     type: "manual",
    //     message: "비밀번호를 입력해주세요.",
    //   });
    //   setFocus("password");
    //   return;
    // }

    navigate("/board");
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>이메일</label>
        <input type="text" {...register("email")} />
        {errors.email && <span>{errors.email.message}</span>}
        <label>비밀번호</label>
        <input type="text" {...register("password")} />
        {errors.password && <span>{errors.password.message}</span>}
        <button>로그인</button>
      </form>
    </>
  );
};
