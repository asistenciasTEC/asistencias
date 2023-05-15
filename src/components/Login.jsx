import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth"
import { auth } from "../config/firebase/firebase";
import { useNavigate } from "react-router-dom";
import './styles.css';
import { v4 as uuid } from "uuid";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { db } from "../config/firebase/firebase";
import { collection, addDoc } from "firebase/firestore";
const Login = () => {
    const [terminosYCondiciones, setTerminosYCondiciones] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [data, setData] = useState({
        email: "",
        password: "",
        errorButton1: null,
        loading: false,
    });
    const [dataForm, setDataForm] = useState({
        nombre: "",
        correo: "",
        errorButton2: null,
        loading2: false,
        apellido1: "",
        apellido2: "",
        cedula: "",
        carne: "",
        telefono: "",
        cuentaBancaria: "",
        cuentaIBAN: "",
        cuentaBanco: "",
        password2: ""
    });
    const {
        nombre,
        correo,
        errorButton2,
        loading2,
        apellido1,
        apellido2,
        cedula,
        carne,
        telefono,
        cuentaBancaria,
        cuentaIBAN,
        cuentaBanco,
        password2
    } = dataForm;
    const history = useNavigate();
    const { email, password, errorButton1, loading } = data;
    const handleChange = (e) => {
        e.preventDefault();
        setData({ ...data, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setData({ ...data, errorButton1: null, loading: true });
        if ((!email || !password) || email === "vargasdaniel195@gmail.com") {
            setData({ ...data, errorButton1: "Todos los campos son obligatorios" });

        }
        try {
            if (email !== "vargasdaniel195@gmail.com") {
                await signInWithEmailAndPassword(auth, email, password);
                setData({
                    email: "",
                    password: "",
                    errorButton1: null,
                    loading: false,
                });
                history("/");
            }
        } catch (errorButton1) {
            setData({ ...data, errorButton1: errorButton1.message, loading: false });
        }
    };
    const restablecerContraseña = (e) => {
        sendPasswordResetEmail(auth, email);
    }
    const handleRegistro = (e) => {
        e.preventDefault();
        setDataForm({ ...dataForm, [e.target.name]: e.target.value });
    };
    const handleTerminos = (event) => {
        setTerminosYCondiciones(event.target.checked);
    };
    const handleSubmitRegistro = async (e) => {
        e.preventDefault();
        const nuevoUsuario = {
            id: uuid(),
            nombre,
            correo,
            apellido1,
            apellido2,
            cedula,
            carne,
            telefono,
            cuentaBancaria,
            cuentaIBAN,
            cuentaBanco,
            password2,
            terminosYCondiciones
        }
        if (((!nuevoUsuario.carne || !nuevoUsuario.correo || !nuevoUsuario.password2) && !terminosYCondiciones) || (terminosYCondiciones && (!nuevoUsuario.carne || !nuevoUsuario.correo || !nuevoUsuario.password2))) {
            setDataForm({ ...dataForm, errorButton2: "Todos los campos son obligatorios" });
        }
        try {
            await createUserWithEmailAndPassword(auth, nuevoUsuario.correo, nuevoUsuario.password2)

            await addDoc(collection(db, "usuarios"), nuevoUsuario);
            toast.success("Usuario agregado exitosamente.");
            cerrarModal();
        }
        catch (errorButton2) {
            setDataForm({ ...dataForm, errorButton2: errorButton2.message, loading2: false });
        }
    };
    const abrirModal = () => {
        setShowModal(true);
    };
    const cerrarModal = () => {
        setShowModal(false);
    };
    return (
        <div>
            <section>
                <h3>Inicio de Sesion</h3>
                <form id="formLogin" className="form" onSubmit={handleSubmit}>
                    <div className="input_container">
                        <label htmlFor="email">Correo electrónico</label>
                        <input
                            type="text"
                            name="email"
                            value={email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="input_container">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={handleChange}
                        />
                    </div>
                    {errorButton1 ? <p className="error">{"Los datos son inválidos o los campos se encuentran vacíos."}</p> : null}
                    <div className="btn_container">
                        <button className="btnIngresar" type="Submit" disabled={loading}>
                            {loading ? "Ingresando..." : "Ingresar"}
                        </button>
                    </div>
                    <div className="btn_container">
                        <a href="/" type="button" onClick={() => {
                            restablecerContraseña();
                        }}>¿Olvido su contraseña?</a>
                    </div>
                    <div className="btn_container">
                        <button id="crear-cuenta" className="btn-success btn-sm" type="button" onClick={() => {
                            abrirModal();
                        }}>Crear Cuenta</button>
                    </div>
                </form>
                <ToastContainer />
            </section>
            <section>
                <Modal show={showModal} onHide={cerrarModal}>
                    <Modal.Header>
                        <Modal.Title>Registro</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form id="formRegistro" onSubmit={handleSubmitRegistro}>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="correo">
                                        <Form.Label>Correo</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Escribe el correo"
                                            value={correo}
                                            onChange={handleRegistro}
                                            name="correo"
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="nombre">
                                        <Form.Label>Nombre</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Escribe el nombre"
                                            value={nombre}
                                            onChange={handleRegistro}
                                            name="nombre"
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="apellido1">
                                        <Form.Label>Primer Apellido</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Escribe el primer apellido"
                                            value={apellido1}
                                            onChange={handleRegistro}
                                            name="apellido1"
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="apellido2">
                                        <Form.Label>Segundo Apellido</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Escribe el segundo apellido"
                                            value={apellido2}
                                            onChange={handleRegistro}
                                            name="apellido2"
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="cedula">
                                        <Form.Label>Cedula</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Escriba su cedula"
                                            value={cedula}
                                            onChange={handleRegistro}
                                            name="cedula"
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="password2">
                                        <Form.Label>Contraseña</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Escribe la contraseña"
                                            value={password2}
                                            onChange={handleRegistro}
                                            name="password2"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3" controlId="carne">
                                        <Form.Label>Carne</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Escribe el carne"
                                            value={carne}
                                            onChange={handleRegistro}
                                            name="carne"
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="telefono">
                                        <Form.Label>Telefono</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Escribe el telefono"
                                            value={telefono}
                                            onChange={handleRegistro}
                                            name="telefono"
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="cuentaBancaria">
                                        <Form.Label>Banco</Form.Label>
                                        <Form.Select
                                            value={cuentaBancaria}
                                            onChange={handleRegistro}
                                            name="cuentaBancaria"
                                        >
                                            <option value="">Selecciona un banco</option>
                                            <option value="Banco de Costa Rica">Banco de Costa Rica</option>
                                            <option value="Banco Nacional">Banco Nacional</option>
                                            <option value="Banco Popular">Banco Popular</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="cuentaIBAN">
                                        <Form.Label>Numero IBAN</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Escribe el numero de cuenta IBAN"
                                            value={cuentaIBAN}
                                            onChange={handleRegistro}
                                            name="cuentaIBAN"
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="cuentaBanco">
                                        <Form.Label>Numero de cuenta</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Escribe el numero de cuenta"
                                            value={cuentaBanco}
                                            onChange={handleRegistro}
                                            name="cuentaBanco"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3" controlId="terminosYCondiciones">
                                <Form.Check
                                    type="checkbox"
                                    label="¿Aceptar los términos y condiciones?"
                                    checked={terminosYCondiciones}
                                    onChange={handleTerminos}
                                />
                            </Form.Group>
                            {errorButton2 ? <p className="error">{"Los campos no pueden estar vacios."}</p> : null}
                            <div className="btn_container2">
                                <Button variant="secondary" onClick={() => {
                                    cerrarModal();
                                }}>
                                    Atras
                                </Button>
                                <Button variant="primary" type="Submit" disabled={loading2}>
                                    {loading2 ? "Registrando..." : "Registrar"}
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>
            </section>
            <ToastContainer />
        </div>
    );
};
export default Login;