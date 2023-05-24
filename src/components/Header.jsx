import React, { useContext, useEffect, useState } from "react";
import { auth } from '../config/firebase/firebase';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { MdLogout, MdManageAccounts } from "react-icons/md";
import './styles.css';
import { db } from "../config/firebase/firebase";
import { collection, getDocs, query, where, } from "firebase/firestore";

function Header() {
    const [datosCargados, setDatosCargados] = useState(false);
    const history = useNavigate();
    const { user } = useContext(AuthContext);
    const handleSignout = async () => {
        await signOut(auth);
        history("/login");
    }

    const [bandera, setBandera] = useState();


    useEffect(() => {
        const obtenerUsuarios = async () => {
            const queryUsuariosCollection = query(collection(db, "usuarios"), where("correo", "==", user.email));
            const snapshot = await getDocs(queryUsuariosCollection);
            const listaUsuarios = snapshot.docs.map((doc) => ({
                ...doc.data(),
            }));

            if (listaUsuarios.length > 0) {
                setBandera(true);
            } else {
                setBandera(false);
            }
        };
        obtenerUsuarios();
        setTimeout(() => {
            setDatosCargados(true);
        }, 1000);
    }, []);



    const handleRoute = () => {
        history('/usuario');
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
                                        <Link to="/">Inicio</Link>
                                        {bandera && <Link to="/solicitar">Solicitar</Link>}
                                        {bandera && <Link to="/historialSolicitudes">Historial de solicitudes</Link>}
                                        {bandera && <Link to="/requisitos">Requisitos</Link>}
                                        {!bandera && <Link to="/asistentes">Asistentes</Link>}
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
