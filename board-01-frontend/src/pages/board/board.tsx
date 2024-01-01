import { useState } from "react";
import { BoardList } from "./boardList.tsx";
import { BoardRegister } from "./boardRegister.tsx";

export const Board = () => {
  const [isResister, setIsResister] = useState<boolean>(false);

  return (
    <>
      <BoardList setIsResister={setIsResister} />

      {isResister && <BoardRegister setIsResister={setIsResister} />}
    </>
  );
};
