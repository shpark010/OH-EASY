import { createContext, useContext } from "react";

const YearContext = createContext();

export const YearProvider = YearContext.Provider;
export const useYear = () => useContext(YearContext);
