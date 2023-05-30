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
            <Route path="/asistencias/login" element={<Login />} />
            <Route exact path="/asistencias/" element={<PrivateRoute />}>
              <Route path="/asistencias/" element={<Inicio />} />
            </Route>
            <Route exact path="/asistencias/solicitar" element={<PrivateRoute />}>
              <Route path="/asistencias/solicitar" element={<Solicitar />} />
            </Route>
            <Route exact path="/asistencias/historialSolicitudes" element={<PrivateRoute />}>
              <Route path="/asistencias/historialSolicitudes" element={<HistorialSolicitudes />} />
            </Route>
            <Route exact path="/asistencias/requisitos" element={<PrivateRoute />}>
              <Route path="/asistencias/requisitos" element={<Requisitos />} />
            </Route>
            <Route exact path="/asistencias/asistentes" element={<PrivateRoute />}>
              <Route path="/asistencias/asistentes" element={<Asistentes />} />
            </Route>
            <Route exact path="/asistencias/usuario" element={<PrivateRoute />}>
              <Route path="/asistencias/usuario" element={<Usuario />} />
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