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
    const history = useNavigate();
    const { user } = useContext(AuthContext);
    const handleSignout = async () => {
        await signOut(auth);
        history("/login");
    }

    const [bandera, setBandera] = useState(false);
    const userEmail = user && user.email ? user.email : '';
    const [usuarios, setUsuarios] = useState([].sort());
    const [profesores, setProfesores] = useState([].sort());

    useEffect(() => {
        const obtenerUsuarios = async () => {
            const usuariosCollection = collection(db, "usuarios");
            const snapshot = await getDocs(usuariosCollection);
            const listaUsuarios = snapshot.docs.map((doc) => ({
                ...doc.data(),
            }));
            setUsuarios(listaUsuarios);
        };
        const obtenerProfesores = async () => {
            const profesoresCollection = collection(db, "profesores");
            const snapshot = await getDocs(profesoresCollection);
            const listaProfesores = snapshot.docs.map((doc) => ({
                ...doc.data(),
            }));
            setProfesores(listaProfesores);
        };
        obtenerProfesores();
        obtenerUsuarios();
    }, []);

    useEffect(() => {
        const usuarioEncontrado = usuarios.find(usuario => usuario.correo === userEmail);
        const profesorEncontrado = profesores.find(profesor => profesor.email === userEmail);
        if (usuarioEncontrado) {
            setBandera(true);

        } else if (profesorEncontrado) {
            setBandera(false);
        }
    }, [profesores, usuarios, userEmail]);

    const handleRoute = () => {
        history('/usuario');
    };

    return (
        <header className='App-header'>
            <div className='NavContainer'>
                <h2>Sistema de Gestión de Asistencias</h2>
                <div className='Scroll'>
                    {user ? (
                        <>
                            {!bandera && <Link to="/">Inicio</Link>}
                            {/* {bandera && <Link to="/solicitar">Solicitar</Link>}
                            {bandera && <Link to="/historialSolicitudes">Historial de solicitudes</Link>} */}
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
    );

}

export default Header;
