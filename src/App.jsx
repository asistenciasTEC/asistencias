import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Inicio from "./components/Inicio";
import Usuario from "./components/Usuario";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import AuthProvider from "./contexts/AuthContext";
import NotFound from "./components/NotFound";
import Solicitar from './components/Solicitar';
import HistorialSolicitudes from './components/HistorialSolicitudes';
import Requisitos from './components/Requisitos';
import Asistentes from './components/Asistentes';
import Footer from './components/Footer';


function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="https://asistenciastec.github.io/asistencias-admin/login" element={<Login />} />
            <Route exact path="/" element={<PrivateRoute />}>
              <Route path="/" element={<Inicio />} />
            </Route>
            <Route exact path="/solicitar" element={<PrivateRoute />}>
              <Route path="/solicitar" element={<Solicitar />} />
            </Route>
            <Route exact path="/historialSolicitudes" element={<PrivateRoute />}>
              <Route path="/historialSolicitudes" element={<HistorialSolicitudes />} />
            </Route>
            <Route exact path="/requisitos" element={<PrivateRoute />}>
              <Route path="/requisitos" element={<Requisitos />} />
            </Route>
            <Route exact path="/asistentes" element={<PrivateRoute />}>
              <Route path="/asistentes" element={<Asistentes />} />
            </Route>
            <Route exact path="/usuario" element={<PrivateRoute />}>
              <Route path="/usuario" element={<Usuario />} />
            </Route>
            <Route exact path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Footer />
      </AuthProvider>
    </>
  );
}

export default App;