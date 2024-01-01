import { create } from "zustand";

interface IModifyData {
  idx: number;
  title: string;
  content: string;
}

interface IStore {
  modifyData: IModifyData;
  setModifyData: (newData: IModifyData) => void;
}

export const useBoardModify = create<IStore>(set => ({
  modifyData: { idx: 0, title: "", content: "" },
  setModifyData: (newData: IModifyData) => set({ modifyData: newData }),
}));
