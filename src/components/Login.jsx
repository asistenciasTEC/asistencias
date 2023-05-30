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
    const [showTerminos, setshowTerminos] = useState(false);
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

    const openModal = () => {
        setshowTerminos(true);
    };

    const closeModal = () => {
        setshowTerminos(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setData({ ...data, errorButton1: null, loading: true });
        if (!email || !password) {
            setData({
                ...data,
                errorButton1: "Todos los campos son obligatorios",
                loading: false
            });
        } else if (email === "tec.asistencias@gmail.com" || email === "aesquivel@itcr.ac.cr") {
            setData({
                ...data,
                errorButton1: "El correo electrónico ingresado no tiene permisos de acceso a esta página",
                loading: false,
            });
        } else {
            try {
                await signInWithEmailAndPassword(auth, email, password);
                setData({
                    email: "",
                    password: "",
                    errorButton1: null,
                    loading: false,
                });
                history("/asistencias/");
            } catch (error) {
                if (error.message === "Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).") {
                    setData({
                        ...data,
                        errorButton1: 'Su cuenta a sido desabilitada por la cantidad de intentos fallidos, para habilitarla cambie de contraseña con la opcion de "¿Olvido su contraseña?"',
                        loading: false
                    });
                } else if (error.message === "Firebase: Error (auth/wrong-password).") {
                    setData({
                        ...data,
                        errorButton1: "La contraseña o el correo electrónico ingresados son incorrectos, por favor verifícalos",
                        loading: false
                    });
                } else {
                    setData({
                        ...data,
                        errorButton1: "A ocurrido un error inesperado por favor recarga la página y vuelve a intentarlo",
                        loading: false
                    });
                }

            }
        }


    };

    const restablecerContraseña = async (e) => {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                toast.success("Se envío un correo electrónico de restablecimiento de contraseña");
            })
            .catch((error) => {
                toast.error("Tiene que añadir un correo electrónico en el espacio designado");
            });
    };

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
        if (!terminosYCondiciones || !password2 || !correo || !carne || !cuentaBancaria) {
            setDataForm({ ...dataForm, errorButton2: "Todos los campos son obligatorios" });
        } else {
            try {
                await createUserWithEmailAndPassword(auth, nuevoUsuario.correo, nuevoUsuario.password2);

                await addDoc(collection(db, "usuarios"), nuevoUsuario);
                toast.success("Usuario agregado exitosamente.");
                cerrarModal();
            } catch (error) {
                setDataForm({ ...dataForm, errorButton2: error.message, loading2: false });
            }
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
                <h3>Inicio de Sesión</h3>
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
                    {errorButton1 ? <p className="error">{errorButton1}</p> : null}
                    <div className="btn_container">
                        <button className="btnIngresar" type="Submit" disabled={loading}>
                            {loading ? "Ingresando..." : "Ingresar"}
                        </button>
                    </div>
                    <div className="btn_container">
                        <button href="/" type="button" className="btn_restablecer" onClick={() => {
                            restablecerContraseña();
                        }}>Olvidó su contraseña?</button >
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
                                        <Form.Label>Correo electrónico</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Escribe el correo electrónico"
                                            value={correo}
                                            onChange={handleRegistro}
                                            name="correo"
                                            autoComplete="off"
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
                                            autoComplete="off"
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
                                            autoComplete="off"
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
                                            autoComplete="off"
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="cedula">
                                        <Form.Label>Cédula</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Escriba su cédula"
                                            value={cedula}
                                            onChange={handleRegistro}
                                            name="cedula"
                                            autoComplete="off"
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
                                            autoComplete="off"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3" controlId="carne">
                                        <Form.Label>Carné</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Escribe el carné"
                                            value={carne}
                                            onChange={handleRegistro}
                                            name="carne"
                                            autoComplete="off"
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="telefono">
                                        <Form.Label>Teléfono</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Escribe el número de teléfono"
                                            value={telefono}
                                            onChange={handleRegistro}
                                            name="telefono"
                                            autoComplete="off"
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
                                        <Form.Label>Número IBAN</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Escribe el número de cuenta IBAN"
                                            value={cuentaIBAN}
                                            onChange={handleRegistro}
                                            name="cuentaIBAN"
                                            autoComplete="off"
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="cuentaBanco">
                                        <Form.Label>Número de cuenta</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Escribe el número de cuenta"
                                            value={cuentaBanco}
                                            onChange={handleRegistro}
                                            name="cuentaBanco"
                                            autoComplete="off"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3" controlId="terminosYCondiciones">
                                <Form.Check
                                    type="checkbox"
                                    label={
                                        <Button variant="link" onClick={openModal}>
                                            Aceptar los términos y condiciones
                                        </Button>
                                    }
                                    checked={terminosYCondiciones}
                                    onChange={handleTerminos}
                                />
                            </Form.Group>
                            {errorButton2 ? <p className="error">{errorButton2}</p> : null}
                            <div className="btn_container2">
                                <Button variant="secondary" onClick={() => {
                                    cerrarModal();
                                    setDataForm({ ...dataForm, errorButton2: null });
                                }}>
                                    Atrás
                                </Button>
                                <Button variant="primary" type="Submit" disabled={loading2}>
                                    {loading2 ? "Registrando..." : "Registrar"}
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>
                <Modal show={showTerminos} onHide={closeModal}>
                    <Modal.Header>
                        <Modal.Title>Términos y Condiciones</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p className="text_terminos">
                            Al utilizar nuestro Sistema de Gestión de Asistencias, usted acepta y reconoce que recopilaremos y almacenaremos información
                            relacionada con su participación en el sistema, incluyendo pero no limitado a su nombre, dirección de correo electrónico y
                            datos de asistencia. Esta información se utilizará exclusivamente para facilitar el seguimiento y registro de su asistencia.
                            Nos comprometemos a proteger la confidencialidad y seguridad de su información personal. No compartiremos, venderemos ni
                            divulgaremos su información a terceros sin su consentimiento expreso, a menos que así lo exija la ley o que sea necesario
                            para el funcionamiento y la mejora del Sistema de Gestión de Asistencias.
                            Además, implementaremos medidas de seguridad adecuadas para proteger su información contra el acceso no autorizado o el uso
                            indebido.
                            Al utilizar nuestro Sistema de Gestión de Asistencias, usted acepta estos términos y condiciones y consiente el procesamiento
                            de su información de acuerdo con los mismos.
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeModal}>
                            Cerrar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </section>
            <ToastContainer />
        </div>
    );
};
export default Login;