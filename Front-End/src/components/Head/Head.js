import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

const Head = () => {
  return (
    <HelmetProvider>
      <Helmet>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
        <title>오이지</title>
      </Helmet>
    </HelmetProvider>
  );
};

export default Head;
