import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppContent from "./containers/AppContent";
import Head from "./components/Head/Head.js";
import { CookiesProvider } from "react-cookie";
import { LoadingProvider } from "./containers/LoadingProvider";

class App extends Component {
  render() {
    return (
      <React.StrictMode>
        <CookiesProvider>
          <Router>
            <LoadingProvider>
              <Head />
              <AppContent />
            </LoadingProvider>
          </Router>
        </CookiesProvider>
      </React.StrictMode>
    );
  }
}

export default App;
