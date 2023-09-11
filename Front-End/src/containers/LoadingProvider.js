// LoadingProvider.js
import React, { useState } from "react";
import { LoadingContext } from "./LoadingContext";
import Loading from "./Loading";

export function LoadingProvider({ children }) {
  const [isLoading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      {isLoading && <Loading />}
      {children}
    </LoadingContext.Provider>
  );
}
