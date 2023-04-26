import React from 'react'
import imagen from '../assets/logo-TEC.jpg';
import './styles.css';

const Inicio = () => {
    return (
        <>
            <div className='pagImagen'>
                <img src={imagen} alt="Logo2" />
            </div>
            <div className='pagText'>
                <h4>Te damos la bienvenida al Sistema de Gestión de Asistencias del Tecnológico de Costa Rica</h4>
            </div>
        </>
    )
}

export default Inicio