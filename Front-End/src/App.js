import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppContent from "./containers/AppContent";
import Head from "./components/Head/Head.js";
import { CookiesProvider } from "react-cookie";

class App extends Component {
  render() {
    return (
      <React.StrictMode>
        <CookiesProvider>
          <Router>
            <Head />
            <AppContent />
          </Router>
        </CookiesProvider>
      </React.StrictMode>
    );
  }
}

export default App;
