import { Route, Routes } from "react-router-dom";
import { Login } from "../pages/login/login.tsx";
import { Layout } from "../components/layout/layout.tsx";
import { Board } from "../pages/board/board.tsx";

export const RootRouter = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="board" element={<Board />} />
          {/*<Route path="settings" element={<Settings />} />*/}
        </Route>
      </Routes>
    </>
  );
};
