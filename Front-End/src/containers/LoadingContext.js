import { createContext, useContext } from "react";

export const LoadingContext = createContext();

export function useLoading() {
  return useContext(LoadingContext);
}
