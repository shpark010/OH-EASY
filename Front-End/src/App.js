import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppContent from "./containers/AppContent";
import Head from "./components/Head/Head.js";

class App extends Component {
  render() {
    return (
      <Router>
        <Head />
        <AppContent />
      </Router>
    );
  }
}

export default App;
