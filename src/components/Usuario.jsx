import React, { useContext, useEffect, useState } from "react";
import { collection, getDocs, updateDoc, query, where } from "firebase/firestore";
import { AuthContext } from '../contexts/AuthContext';
import { db } from "../config/firebase/firebase";
import { toast, ToastContainer } from "react-toastify";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { getAuth, updatePassword, signOut } from "firebase/auth";

function Usuario() {
    const { user } = useContext(AuthContext);
    const auth = getAuth();
    const usuarioAuthentication = auth.currentUser;
    const history = useNavigate();
    const userEmail = user && user.email ? user.email : '';
    const [datosCargados, setDatosCargados] = useState(false);
    const [bandera, setBandera] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [cambioContraseña, setCambioContraseña] = useState({
        nuevaContraseña: "",
        confirmacionContraseña: ""
    });
    const [datosProfesor, setDatosProfesor] = useState({
        nombre: "",
        email: "",
        password: ""
    });
    const [datosUsuario, setDatosUsuario] = useState({
        nombre: "",
        correo: "",
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

    useEffect(() => {
        const obtenerUsuarios = async () => {
            const queryUsuariosCollection = query(collection(db, "usuarios"), where("correo", "==", user.email));
            const snapshot = await getDocs(queryUsuariosCollection);
            const listaUsuarios = snapshot.docs.map((doc) => ({
                ...doc.data(),
            }));
            setUsuarios(listaUsuarios);
        };

        const obtenerProfesores = async () => {
            const queryProfesoresCollection = query(collection(db, "profesores"), where("email", "==", user.email));
            const snapshot = await getDocs(queryProfesoresCollection);
            const listaProfesores = snapshot.docs.map((doc) => ({
                ...doc.data(),
            }));
            setProfesores(listaProfesores);
        };

        obtenerProfesores();
        obtenerUsuarios();
    }, []);

    useEffect(() => {
        const usuarioEncontrado = usuarios.find((usuario) => usuario.correo === userEmail);
        const profesorEncontrado = profesores.find((profesor) => profesor.email === userEmail);

        if (usuarioEncontrado) {
            setDatosUsuario(usuarioEncontrado);
            setBandera(false);
        } else if (profesorEncontrado) {
            setDatosProfesor(profesorEncontrado);
            setBandera(true);
        }

        setTimeout(() => {
            setDatosCargados(true);
        }, 2000);
    }, [profesores, usuarios, userEmail]);

    const handleChangePassword = (e) => {
        e.preventDefault();
        setCambioContraseña({ ...cambioContraseña, [e.target.name]: e.target.value });
    };

    const handleRegistro = (e) => {
        e.preventDefault();
        setDatosUsuario({ ...datosUsuario, [e.target.name]: e.target.value });
    };

    const handleRegistroProfesor = (e) => {
        e.preventDefault();
        setDatosProfesor({ ...datosProfesor, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (bandera) {
                const profesorActualizado = { nombre: datosProfesor.nombre, email: datosProfesor.email, password: datosProfesor.password };
                const q = query(collection(db, "profesores"), where("email", "==", user.email));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    updateDoc(doc.ref, profesorActualizado)
                        .then(() => {
                            toast.success("Profesor editado exitosamente.");
                        })
                        .catch((error) => {
                            toast.error("Ha ocurrido un error.");
                        });
                });
            } else {
                const usuarioActualizado = {
                    nombre: datosUsuario.nombre,
                    correo: datosUsuario.correo,
                    apellido1: datosUsuario.apellido1,
                    apellido2: datosUsuario.apellido2,
                    cedula: datosUsuario.cedula,
                    carne: datosUsuario.carne,
                    telefono: datosUsuario.telefono,
                    cuentaBancaria: datosUsuario.cuentaBancaria,
                    cuentaIBAN: datosUsuario.cuentaIBAN,
                    cuentaBanco: datosUsuario.cuentaBanco,
                    password2: datosUsuario.password2
                }
                const q = query(collection(db, "usuarios"), where("correo", "==", user.email));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    updateDoc(doc.ref, usuarioActualizado)
                        .then(() => {
                            toast.success("Usuario editado exitosamente.");
                        })
                        .catch((error) => {
                            toast.error("Ha ocurrido un error.");
                        });
                });
            }
        } catch (error) {
            toast.error("Error al actualizar los datos.");
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        try {
            if (cambioContraseña.nuevaContraseña !== cambioContraseña.confirmacionContraseña) {
                toast.error("Las contraseñas no coinciden.");
                return;
            }
            try {
                await updatePassword(usuarioAuthentication, cambioContraseña.confirmacionContraseña);
                signOut(auth);
                history("/login");
            } catch (error) {
                if (error.code === "auth/requires-recent-login") {
                    toast.error("Error al actualizar la contraseña. Por favor, vuelva a iniciar sesión e inténtelo de nuevo");
                } else {
                    throw error;
                }
            }
        } catch (error) {
            toast.error("Error al actualizar la contraseña. Por favor, vuelva a intentarlo más tarde.");
        }
    };


    return (
        <div style={{ marginLeft: '20px', marginRight: '20px', height: '110vh' }}>
            {datosCargados ? (
                <>
                    <h2>Perfil de Usuario</h2>
                    <Form onSubmit={handleSubmit}>
                        {!bandera ? (
                            <>

                                <Form.Group as={Row} controlId="correo" className="mb-3">
                                    <Form.Label column sm="3">
                                        Correo electrónico:
                                    </Form.Label>
                                    <Col sm="9">
                                        <Form.Control
                                            type="text"
                                            name="correo"
                                            value={datosUsuario.correo}
                                            disabled={true}
                                        />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} controlId="nombre" className="mb-3">
                                    <Form.Label column sm="3">
                                        Nombre:
                                    </Form.Label>
                                    <Col sm="9">
                                        <Form.Control
                                            type="text"
                                            name="nombre"
                                            value={datosUsuario.nombre}
                                            onChange={handleRegistro}
                                            placeholder="Ingresa tu nombre"
                                            required
                                        />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} controlId="apellido1" className="mb-3">
                                    <Form.Label column sm="3">
                                        Primer apellido:
                                    </Form.Label>
                                    <Col sm="9">
                                        <Form.Control
                                            type="text"
                                            name="apellido1"
                                            value={datosUsuario.apellido1}
                                            onChange={handleRegistro}
                                            placeholder="Ingresa tu primer apellido"
                                            required
                                        />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} controlId="apellido2" className="mb-3">
                                    <Form.Label column sm="3">
                                        Segundo apellido:
                                    </Form.Label>
                                    <Col sm="9">
                                        <Form.Control
                                            type="text"
                                            name="apellido2"
                                            value={datosUsuario.apellido2}
                                            onChange={handleRegistro}
                                            placeholder="Ingresa tu segundo apellido"
                                            required
                                        />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} controlId="carne" className="mb-3">
                                    <Form.Label column sm="3">
                                        Carné:
                                    </Form.Label>
                                    <Col sm="9">
                                        <Form.Control
                                            type="text"
                                            name="carne"
                                            value={datosUsuario.carne}
                                            onChange={handleRegistro}
                                            placeholder="Ingresa tu carné"
                                            required
                                        />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} controlId="cedula" className="mb-3">
                                    <Form.Label column sm="3">
                                        Cédula:
                                    </Form.Label>
                                    <Col sm="9">
                                        <Form.Control
                                            type="text"
                                            name="cedula"
                                            value={datosUsuario.cedula}
                                            onChange={handleRegistro}
                                            placeholder="Ingresa tu cedula"
                                            required
                                        />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} controlId="cuentaBancaria" className="mb-3">
                                    <Form.Label column sm="3">
                                        Tipo de banco:
                                    </Form.Label>
                                    <Col sm="9">
                                        <Form.Select
                                            name="cuentaBancaria"
                                            value={datosUsuario.cuentaBancaria}
                                            onChange={handleRegistro}
                                            required
                                        >
                                            <option value="Banco de Costa Rica">Banco de Costa Rica</option>
                                            <option value="Banco Nacional">Banco Nacional</option>
                                            <option value="Banco Popular">Banco Popular</option>
                                        </Form.Select>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} controlId="cuentaBanco" className="mb-3">
                                    <Form.Label column sm="3">
                                        Número de cuenta:
                                    </Form.Label>
                                    <Col sm="9">
                                        <Form.Control
                                            type="text"
                                            name="cuentaBanco"
                                            value={datosUsuario.cuentaBanco}
                                            onChange={handleRegistro}
                                            placeholder="Ingresa tu numero de cuenta"
                                            required
                                        />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} controlId="cuentaIBAN" className="mb-3">
                                    <Form.Label column sm="3">
                                        Número de cuenta IBAN:
                                    </Form.Label>
                                    <Col sm="9">
                                        <Form.Control
                                            type="text"
                                            name="cuentaIBAN"
                                            value={datosUsuario.cuentaIBAN}
                                            onChange={handleRegistro}
                                            placeholder="Ingresa tu numero de cuenta IBAN"
                                            required
                                        />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} controlId="telefono" className="mb-3">
                                    <Form.Label column sm="3">
                                        Teléfono:
                                    </Form.Label>
                                    <Col sm="9">
                                        <Form.Control
                                            type="text"
                                            name="telefono"
                                            value={datosUsuario.telefono}
                                            onChange={handleRegistro}
                                            placeholder="Ingresa tu numero de teléfono"
                                            required
                                        />
                                    </Col>
                                </Form.Group>


                                <Button type="submit" className="mb-3">Guardar cambios</Button>
                            </>
                        ) : (
                            <>
                                <Form.Group as={Row} controlId="correo" className="mb-3">
                                    <Form.Label column sm="3">
                                        Correo electrónico:
                                    </Form.Label>
                                    <Col sm="9">
                                        <Form.Control
                                            type="email"
                                            value={datosProfesor.email}
                                            name="correo"
                                            disabled={!false}
                                        />
                                    </Col>

                                </Form.Group>

                                <Form.Group as={Row} controlId="nombre" className="mb-3">
                                    <Form.Label column sm="3">
                                        Nombre:
                                    </Form.Label>
                                    <Col sm="9">
                                        <Form.Control
                                            type="text"
                                            name="nombre"
                                            value={datosProfesor.nombre}
                                            onChange={handleRegistroProfesor}
                                            placeholder="Ingresa tu nombre"
                                            required
                                        />
                                    </Col>
                                </Form.Group>

                                <Button type="submit" className="mb-3">Guardar cambios</Button>
                            </>
                        )}
                    </Form>

                    <h2>Cambio de Contraseña</h2>
                    <Form onSubmit={handlePasswordSubmit}>
                        <Form.Group as={Row} controlId="nuevaContraseña" className="mb-3">
                            <Form.Label column sm="3">
                                Nueva Contraseña:
                            </Form.Label>
                            <Col sm="9">
                                <Form.Control
                                    type="password"
                                    name="nuevaContraseña"
                                    value={cambioContraseña.nuevaContraseña}
                                    onChange={handleChangePassword}
                                    placeholder="Ingresa tu nueva contraseña"
                                    required
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="confirmacionContraseña" className="mb-3">
                            <Form.Label column sm="3">
                                Confirmar Contraseña:
                            </Form.Label>
                            <Col sm="9">
                                <Form.Control
                                    type="password"
                                    name="confirmacionContraseña"
                                    value={cambioContraseña.confirmacionContraseña}
                                    onChange={handleChangePassword}
                                    placeholder="Confirma tu nueva contraseña"
                                    required
                                />
                            </Col>
                        </Form.Group>
                        <Button type="submit" className="mb-3">Cambiar Contraseña</Button>
                    </Form>
                    <ToastContainer />
                </>
            ) : (
                <p>Cargando datos...</p>
            )}
        </div>
    );
}

export default Usuario;