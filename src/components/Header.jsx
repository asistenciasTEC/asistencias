import React, { useContext, useEffect, useState } from "react";
import { auth } from '../config/firebase/firebase';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { MdLogout, MdManageAccounts } from "react-icons/md";
import './styles.css';
import { db } from "../config/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

function Header() {
    const [datosCargados, setDatosCargados] = useState(false);
    const history = useNavigate();
    const { user } = useContext(AuthContext);
    const handleSignout = async () => {
        await signOut(auth);
        history("/asistencias/login");
    }

    const [bandera, setBandera] = useState(false);
    const userEmail = user && user.email ? user.email : '';
    const [usuarios, setUsuarios] = useState([].sort());

    useEffect(() => {
        const obtenerUsuarios = async () => {
            const usuariosCollection = collection(db, "usuarios");
            const snapshot = await getDocs(usuariosCollection);
            const listaUsuarios = snapshot.docs.map((doc) => ({
                ...doc.data(),
            }));
            setUsuarios(listaUsuarios);
        };
        obtenerUsuarios();
        setTimeout(() => {
            setDatosCargados(true);
        }, 1000);
    }, []);

    useEffect(() => {
        const usuarioEncontrado = usuarios.find(usuario => usuario.correo === userEmail);
        if (usuarioEncontrado) {
            setBandera(true);
        } else {
            setBandera(false);
        }
    }, [usuarios, userEmail]);

    const handleRoute = () => {
        history('/asistencias/usuario');
    };

    return (
        <>
            {datosCargados && (
                <>
                    <header className='App-header'>
                        <div className='NavContainer'>
                            <h2>Sistema de Gestión de Asistencias</h2>
                            <div className='Scroll'>
                                {user ? (
                                    <>
                                        <Link to="/asistencias/">Inicio</Link>
                                        {bandera && <Link to="/asistencias/solicitar">Solicitar</Link>}
                                        {bandera && <Link to="/asistencias/historialSolicitudes">Historial de solicitudes</Link>}
                                        {bandera && <Link to="/asistencias/requisitos">Requisitos</Link>}
                                        {!bandera && <Link to="/asistencias/asistentes">Asistentes</Link>}
                                        <MdManageAccounts type="button" className="btnLogin" onClick={handleRoute} />
                                        <MdLogout type="button" className='btnLogout' onClick={handleSignout} />
                                    </>
                                ) : (
                                    <>
                                    </>
                                )}
                            </div>
                        </div>
                    </header>
                </>
            )}
        </>
    );

}

export default Header;
