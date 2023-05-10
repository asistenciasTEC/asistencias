import React, { useContext } from 'react'
import { auth } from '../config/firebase/firebase';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { MdLogout } from "react-icons/md";
import './styles.css';

function Header() {
    const history = useNavigate();
    const { user } = useContext(AuthContext);
    const handleSignout = async () => {
        await signOut(auth);
        history("/login");
    }
    return (
        <header className='App-header'>
            <div className='NavContainer'>
                <h2>Sistema de Gestión de Asistencias</h2>
                <div className='Scroll'>
                    {user ? (
                        <>
                            <Link to="/">Inicio</Link>
                            <Link to="/solicitar">Solicitar</Link>
                            <Link to="/gestion">Gestión</Link>
                            <button type="button" className='btnLogout' onClick={handleSignout}>
                                <MdLogout />
                            </button>
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
