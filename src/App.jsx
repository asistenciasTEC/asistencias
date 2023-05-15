import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Inicio from "./components/Inicio";
import Usuario from "./components/Usuario";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import AuthProvider from "./contexts/AuthContext";
import NotFound from "./components/NotFound";

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route exact path="/" element={<PrivateRoute />}>
              <Route path="/" element={<Inicio />} />
            </Route>
            <Route exact path="/usuario" element={<PrivateRoute />}>
              <Route path="/usuario" element={<Usuario />} />
            </Route>
            <Route exact path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;