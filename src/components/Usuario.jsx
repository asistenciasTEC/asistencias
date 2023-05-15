import React, { useContext, useEffect, useState } from "react";
import { collection, getDocs, updateDoc, query, where, } from "firebase/firestore";
import { AuthContext } from '../contexts/AuthContext';
import { db } from "../config/firebase/firebase";
import { toast, ToastContainer } from "react-toastify";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { getAuth, updatePassword, signOut } from "firebase/auth";
function Usuario() {
    const { user } = useContext(AuthContext);
    const auth = getAuth();
    const usuarioAuthentication = auth.currentUser
    const history = useNavigate();
    const userEmail = user && user.email ? user.email : '';
    const [datosCargados, setDatosCargados] = useState(false);
    const [bandera, setBandera] = useState(false);
    const [usuarios, setUsuarios] = useState([].sort());
    const [profesores, setProfesores] = useState([].sort());
    const [cambioContraseña, setCambioContraseña] = useState({
        nuevaContraseña: "",
        confirmacionContraseña: ""
    });
    const [datosProfesor, setDatosProfesor] = useState({
        nombre: "",
        email: "",
        password: ""
    });
    const [datosUsuario, setDatosUsuario] = useState(
        {
            nombre: "",
            correo: "",
            apellido1: "",
            apellido2: "",
            cedula: "",
            carne: "",
            telefono: "",
            cuentaBancaria: "",
            cuentaIBAN: "",
            password2: ""
        });
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
            setDatosUsuario(usuarioEncontrado);
            setBandera(false);
        } else if (profesorEncontrado) {
            setDatosProfesor(profesorEncontrado);
            setBandera(true);
        }
        setTimeout(() => {
            setDatosCargados(true);
        }, 700);
    }, [profesores, usuarios, userEmail]);
    const handleChangePassword = (e) => {
        e.preventDefault();
        setCambioContraseña({ ...cambioContraseña, [e.target.name]: e.target.value });
    };
    const handleRegistro = (e) => {
        e.preventDefault();
        setDatosUsuario({ ...datosUsuario, [e.target.name]: e.target.value });
    };

    async function actualizar(coleccion, usuario, actualizado, mensaje) {
        const q = query(collection(db, coleccion), where("id", "==", usuario.id));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            updateDoc(doc.ref, actualizado)
                .then(() => {
                    toast.success(mensaje);
                })
                .catch((error) => {
                    toast.error("Ha ocurrido un error.");
                });
        });
    }

    const handleSubmitRegistro = async (e) => {
        e.preventDefault();
        const usuarioActualizado =
        {
            nombre: datosUsuario.nombre,
            apellido1: datosUsuario.apellido1,
            apellido2: datosUsuario.apellido2,
            cedula: datosUsuario.cedula,
            carne: datosUsuario.carne,
            telefono: datosUsuario.telefono,
            cuentaBancaria: datosUsuario.cuentaBancaria,
            cuentaIBAN: datosUsuario.cuentaIBAN,
            password2: ""
        };
        try {
            if ((cambioContraseña.nuevaContraseña === cambioContraseña.confirmacionContraseña) && (cambioContraseña.nuevaContraseña !== "" && cambioContraseña.confirmacionContraseña !== "") && (cambioContraseña.nuevaContraseña !== datosUsuario.password2)) {
                usuarioActualizado.password2 = cambioContraseña.confirmacionContraseña;
                actualizar("usuarios", datosUsuario, usuarioActualizado);
                updatePassword(usuarioAuthentication, cambioContraseña.confirmacionContraseña).then(() => {
                    signOut(auth);
                    history("/login");
                })
            } else if (cambioContraseña.nuevaContraseña === "" && cambioContraseña.confirmacionContraseña === "") {
                usuarioActualizado.password2 = datosUsuario.password2;
                actualizar("usuarios", datosUsuario, usuarioActualizado, "El usuario se actualizo correctamente");

            } else {
                throw new Error("Las contraseñas no son iguales o son iguales a la contraseña actual");
            }
        } catch (error) {
            toast.error(error.message);
        }
    };
    const handleProfesor = (e) => {
        e.preventDefault();
        setDatosProfesor({ ...datosProfesor, [e.target.name]: e.target.value });
    };


    const handleSubmitProfesor = async (e) => {
        e.preventDefault();
        const profesorActualizado =
        {
            nombre: datosProfesor.nombre,
            password: ""
        };
        try {
            if ((cambioContraseña.nuevaContraseña === cambioContraseña.confirmacionContraseña) && (cambioContraseña.nuevaContraseña !== "" && cambioContraseña.confirmacionContraseña !== "") && (cambioContraseña.nuevaContraseña !== datosProfesor.password)) {
                profesorActualizado.password = cambioContraseña.confirmacionContraseña;
                actualizar("profesores", datosProfesor, profesorActualizado);
                updatePassword(usuarioAuthentication, cambioContraseña.confirmacionContraseña).then(() => {
                    signOut(auth);
                    history("/login");
                })
            } else if (cambioContraseña.nuevaContraseña === "" && cambioContraseña.confirmacionContraseña === "") {
                profesorActualizado.password = datosProfesor.password;
                actualizar("profesores", datosProfesor, profesorActualizado, "El profesor se actualizo correctamente");

            } else {
                throw new Error("Las contraseñas no son iguales o son iguales a la contraseña actual");
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <>
            {datosCargados && (
                <>
                    {!bandera && <Form id="formRegistro" onSubmit={handleSubmitRegistro}>
                        <h2>Usuario Estudiante</h2>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="correo">
                                    <Form.Label>Correo</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={datosUsuario.correo}
                                        name="correo"
                                        disabled={!false}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="nombre">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={datosUsuario.nombre}
                                        onChange={handleRegistro}
                                        name="nombre"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="apellido1">
                                    <Form.Label>Primer Apellido</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={datosUsuario.apellido1}
                                        onChange={handleRegistro}
                                        name="apellido1"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="apellido2">
                                    <Form.Label>Segundo Apellido</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={datosUsuario.apellido2}
                                        onChange={handleRegistro}
                                        name="apellido2"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="cedula">
                                    <Form.Label>Cedula</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={datosUsuario.cedula}
                                        onChange={handleRegistro}
                                        name="cedula"
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="carne">
                                    <Form.Label>Carne</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={datosUsuario.carne}
                                        onChange={handleRegistro}
                                        name="carne"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="telefono">
                                    <Form.Label>Telefono</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={datosUsuario.telefono}
                                        onChange={handleRegistro}
                                        name="telefono"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="cuentaBancaria">
                                    <Form.Label>Banco</Form.Label>
                                    <Form.Select
                                        value={datosUsuario.cuentaBancaria}
                                        onChange={handleRegistro}
                                        name="cuentaBancaria"
                                    >
                                        <option value="">Selecciona un banco</option>
                                        <option value="BCR">Banco de Costa Rica</option>
                                        <option value="BN">Banco Nacional de Costa Rica</option>
                                        <option value="BP">Banco Popular</option>

                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="cuentaIBAN">
                                    <Form.Label>Numero de cuenta</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={datosUsuario.cuentaIBAN}
                                        onChange={handleRegistro}
                                        name="cuentaIBAN"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="cambioContraseña">
                                    <Form.Label>Nueva contraseña</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={cambioContraseña.nuevaContraseña}
                                        onChange={handleChangePassword}
                                        name="nuevaContraseña"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="confirmacionContraseña">
                                    <Form.Label>Confirmar contraseña</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={cambioContraseña.confirmacionContraseña}
                                        onChange={handleChangePassword}
                                        name="confirmacionContraseña"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className="btn_container2">
                            <Button variant="primary" type="Submit">
                                Modificar
                            </Button>
                        </div>
                    </Form>}
                    {bandera && <Form id="formRegistro" onSubmit={handleSubmitProfesor} className="formContainer">
                        <Row>
                            <Col>
                                <h2>Usuario Profesor</h2>
                                <Form.Group className="mb-3" controlId="correo">
                                    <Form.Label>Correo</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={datosProfesor.email}
                                        name="correo"
                                        disabled={!false}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="nombre">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={datosProfesor.nombre}
                                        onChange={handleProfesor}
                                        name="nombre"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="cambioContraseña">
                                    <Form.Label>Nueva contraseña</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={cambioContraseña.nuevaContraseña}
                                        onChange={handleChangePassword}
                                        name="nuevaContraseña"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="confirmacionContraseña">
                                    <Form.Label>Confirmar contraseña</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={cambioContraseña.confirmacionContraseña}
                                        onChange={handleChangePassword}
                                        name="confirmacionContraseña"
                                    />
                                </Form.Group>
                                <div className="btn_container2">
                                    <Button variant="primary" type="Submit">
                                        Modificar
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Form>}
                    <ToastContainer />
                </>
            )}
        </>

    )
}
export default Usuario
