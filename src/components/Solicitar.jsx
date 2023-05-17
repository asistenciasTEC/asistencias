import { useState, useEffect, useContext } from "react";
import { collection, query, addDoc, getDocs, serverTimestamp, orderBy, doc, updateDoc } from "firebase/firestore";
import { Table, Modal, Form, Button, Row, Col } from "react-bootstrap";
import { db } from "../config/firebase/firebase";
import { v4 as uuid } from "uuid";
import { AuthContext } from '../contexts/AuthContext';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';


//librería de mensajes información
import { toast, ToastContainer } from "react-toastify";

//librería de iconos boostrap para react
import { MdAddBox } from "react-icons/md";

function Solicitar() {
    const { user } = useContext(AuthContext);
    const [archivo, setArchivo] = useState("");
    const [solicitudes, setSolicitudes] = useState([]);
    const [asistencias, setAsistencias] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [periodos, setPeriodos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const userEmail = user && user.email ? user.email : '';
    const storage = getStorage();

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
            cuenta: "",
            password2: ""
        });

    const [dataForm, setDataForm] = useState({
        id: "",
        idPeriodo: "",
        tipoAsistencia: "",
        cedula: "",
        carne: "",
        apellido1: "",
        apellido2: "",
        nombre: "",
        promedioPondSemAnt: "",
        créditosAproSemAnt: "",
        correo: "",
        telefono: "",
        cuentaBancaria: "",
        cuentaIBAN: "",
        profesorAsistir: "",
        cursoAsistir: "",
        notaCursoAsistir: "",
        horario: "",
        boleta: "",
        condicion: "",
        horasAsignadas: "",
        fecha: ""
    });

    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const {
        idPeriodo,
        tipoAsistencia,
        cedula,
        carne,
        apellido1,
        apellido2,
        nombre,
        promedioPondSemAnt,
        créditosAproSemAnt,
        semestresActivo,
        correo,
        telefono,
        cuentaBancaria,
        cuentaIBAN,
        profesorAsistir,
        cursoAsistir,
        notaCursoAsistir,
        horario,
        boleta,
        condicion,
        horasAsignadas
    } = dataForm;

    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                const asistenciasCollection = collection(db, "asistencias");
                const profesoresCollection = collection(db, "profesores");
                const cursosCollection = collection(db, "cursos");
                const periodosCollection = collection(db, "periodos");
                const usuariosCollection = collection(db, "usuarios");

                const [asistenciasSnapshot, profesoresSnapshot, cursosSnapshot, periodosSnapshot, usuariosSnapshot] = await Promise.all([
                    getDocs(asistenciasCollection),
                    getDocs(profesoresCollection),
                    getDocs(cursosCollection),
                    getDocs(periodosCollection),
                    getDocs(usuariosCollection)
                ]);

                const listaAsistencias = [];
                asistenciasSnapshot.forEach((doc) => {
                    listaAsistencias.push(doc.data());
                });
                setAsistencias(listaAsistencias);

                const listaProfesores = [];
                profesoresSnapshot.forEach((doc) => {
                    listaProfesores.push(doc.data());
                });
                setProfesores(listaProfesores);

                const listaCursos = [];
                cursosSnapshot.forEach((doc) => {
                    listaCursos.push(doc.data());
                });
                setCursos(listaCursos);

                const listaPeriodos = [];
                periodosSnapshot.forEach((doc) => {
                    listaPeriodos.push(doc.data());
                });
                setPeriodos(listaPeriodos);

                const listaUsuarios = [];
                usuariosSnapshot.forEach((doc) => {
                    listaUsuarios.push(doc.data());
                });
                setUsuarios(listaUsuarios);
            } catch (error) {
                console.error("Error al obtener los datos:", error);
            }
        };
        obtenerDatos();
    }, []);

    useEffect(() => {
        const usuarioEncontrado = usuarios.find(usuario => usuario.correo === userEmail);
        if (usuarioEncontrado && usuarioEncontrado !== datosUsuario) {
            setDatosUsuario(usuarioEncontrado);
        }
    }, [usuarios, userEmail, datosUsuario]);


    const handleChange = (e) => {
        setDataForm({
            ...dataForm,
            [e.target.id]: e.target.value
        });
    };

    const abrirModal = (id = "") => {
        setModalTitle("Nueva solicitud");
        setDataForm({
            id: "",
            idPeriodo: "",
            tipoAsistencia: "",
            cedula: "",
            carne: "",
            apellido1: "",
            apellido2: "",
            nombre: "",
            promedioPondSemAnt: "",
            créditosAproSemAnt: "",
            semestresActivo: "",
            correo: "",
            telefono: "",
            cuentaBancaria: "",
            cuentaIBAN: "",
            profesorAsistir: "",
            cursoAsistir: "",
            notaCursoAsistir: "",
            horario: "",
            boleta: "",
            condicion: "",
            horasAsignadas: "",
            fecha: ""
        });
        setShowModal(true);
    };

    const cerrarModal = () => {
        setShowModal(false);
    };

    const handleFileChange = async (e) => {
        try {
            const file = e.target.files[0];
            const storageRef = ref(storage, "boletasEstudiantes/" + file.name);

            await uploadBytes(storageRef, file);

            const downloadURL = await getDownloadURL(storageRef);

            console.log("URL de descarga:", downloadURL);

            setArchivo(downloadURL);
        } catch (error) {
            console.error("Error al subir el archivo o obtener la URL de descarga:", error);
            throw error;
        }
    };

    const agregarSolicitud = async (e) => {
        e.preventDefault();
        const hayPeriodosActivos = periodos.find((periodo) => periodo.estado);
        console.log(hayPeriodosActivos.id)
        if (hayPeriodosActivos) {
            try {
                const nuevaSolicitud = {
                    id: uuid(),
                    idPeriodo: hayPeriodosActivos.id,
                    tipoAsistencia,
                    cedula: datosUsuario.cedula,
                    carne: datosUsuario.carne,
                    apellido1: datosUsuario.apellido1,
                    apellido2: datosUsuario.apellido2,
                    nombre: datosUsuario.nombre,
                    promedioPondSemAnt,
                    créditosAproSemAnt,
                    semestresActivo,
                    correo: datosUsuario.correo,
                    telefono: datosUsuario.telefono,
                    cuentaBancaria: datosUsuario.cuentaBancaria,
                    cuentaIBAN: datosUsuario.cuentaIBAN,
                    cuenta: datosUsuario.cuenta ?? '',
                    profesorAsistir,
                    cursoAsistir,
                    notaCursoAsistir,
                    horario,
                    boleta: archivo,
                    condicion: "Pendiente",
                    horasAsignadas,
                    fecha: serverTimestamp()
                };
                await addDoc(collection(db, "solicitudes"), nuevaSolicitud);
                setSolicitudes([nuevaSolicitud, ...solicitudes,]);
                setArchivo("")
                toast.success("Solicitud enviada exitosamente.");
                cerrarModal()
            } catch (error) {
                console.error("Error al obtener la URL de descarga:", error);
            }
        } else {
            toast.error("No hay periodos activos.");
            cerrarModal()
        }
    };

    return (
        <div className="container-lg ">
            <h1>Solicitar</h1>
            <div className="row d-flex justify-content-center">
                <div className="col">
                    <Button
                        className="px-2 py-1 mb-2 fs-5"
                        variant="primary"
                        onClick={() => abrirModal("agregar")}
                    >
                        <MdAddBox />
                    </Button>
                </div>
            </div>

            <Modal show={showModal} onHide={cerrarModal} className="modal-xl">
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={agregarSolicitud}>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="apellido1">
                                    <Form.Label>Primer Apellido</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={datosUsuario.apellido1}
                                        onChange={handleChange}
                                        autoComplete='off'
                                        required
                                        disabled
                                    />

                                </Form.Group>

                                <Form.Group className="mb-3" controlId="carne">
                                    <Form.Label>Carné</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={datosUsuario.carne}
                                        onChange={handleChange}
                                        autoComplete='off'
                                        required
                                        disabled
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="cuentaBancaria">
                                    <Form.Label>Cuenta Bancaria</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="N/A"
                                        value={datosUsuario.cuentaBancaria}
                                        onChange={handleChange}
                                        autoComplete='off'
                                        required
                                        disabled
                                    />
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group className="mb-3" controlId="apellido2">
                                    <Form.Label>Segundo Apellido</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={datosUsuario.apellido2}
                                        onChange={handleChange}
                                        autoComplete='off'
                                        required
                                        disabled
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="cedula">
                                    <Form.Label>Cedula</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={datosUsuario.cedula}
                                        onChange={handleChange}
                                        autoComplete='off'
                                        required
                                        disabled
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="cuentaIBAN">
                                    <Form.Label>Cuenta IBAN</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="N/A"
                                        value={datosUsuario.cuentaIBAN}
                                        onChange={handleChange}
                                        autoComplete='off'
                                        required
                                        disabled
                                    />
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group className="mb-3" controlId="nombre">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={datosUsuario.nombre}
                                        onChange={handleChange}
                                        autoComplete='off'
                                        required
                                        disabled
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="correo">
                                    <Form.Label>Correo</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={datosUsuario.correo}
                                        onChange={handleChange}
                                        autoComplete='off'
                                        required
                                        disabled
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="telefono">
                                    <Form.Label>Telefono</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={datosUsuario.telefono}
                                        onChange={handleChange}
                                        autoComplete='off'
                                        required
                                        disabled
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group controlId="tipoAsistencia">
                            <Form.Label>Tipo de Asistencia</Form.Label>
                            <Form.Control
                                as="select"
                                value={tipoAsistencia}
                                onChange={handleChange}>
                                <option value="">Seleccionar</option>
                                {asistencias.map((asistencia) => (
                                    <option key={asistencia.tipoAsistencia} value={asistencia.tipoAsistencia}>
                                        {asistencia.tipoAsistencia}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        {tipoAsistencia === 'Horas Estudiantes' && (
                            <>
                                <Form.Group controlId="promedioPondSemAnt">
                                    <Form.Label>Promedio Ponderado</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        value={promedioPondSemAnt}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group controlId="horario">
                                    <Form.Label>Horario</Form.Label>
                                    <Table bordered>
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>Lunes</th>
                                                <th>Martes</th>
                                                <th>Miércoles</th>
                                                <th>Jueves</th>
                                                <th>Viernes</th>
                                                <th>Sábado</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>07:00 - 12:00</td>
                                                <td>
                                                    <Form.Check type="checkbox" />
                                                </td>
                                                <td>
                                                    <Form.Check type="checkbox" />
                                                </td>
                                                <td>
                                                    <Form.Check type="checkbox" />
                                                </td>
                                                <td>
                                                    <Form.Check type="checkbox" />
                                                </td>
                                                <td>
                                                    <Form.Check type="checkbox" />
                                                </td>
                                                <td>
                                                    <Form.Check type="checkbox" />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>12:00 - 17:00</td>
                                                <td>
                                                    <Form.Check type="checkbox" />
                                                </td>
                                                <td>
                                                    <Form.Check type="checkbox" />
                                                </td>
                                                <td>
                                                    <Form.Check type="checkbox" />
                                                </td>
                                                <td>
                                                    <Form.Check type="checkbox" />
                                                </td>
                                                <td>
                                                    <Form.Check type="checkbox" />
                                                </td>
                                                <td>
                                                    <Form.Check type="checkbox" />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>17:00 - 22:00</td>
                                                <td>
                                                    <Form.Check type="checkbox" />
                                                </td>
                                                <td>
                                                    <Form.Check type="checkbox" />
                                                </td>
                                                <td>
                                                    <Form.Check type="checkbox" />
                                                </td>
                                                <td>
                                                    <Form.Check type="checkbox" />
                                                </td>
                                                <td>
                                                    <Form.Check type="checkbox" />
                                                </td>
                                                <td>
                                                    <Form.Check type="checkbox" />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Form.Group>
                            </>
                        )}
                        {tipoAsistencia === 'Asistencia Especial' && (
                            <>
                                <Form.Group controlId="profesorAsistir">
                                    <Form.Label>Profesor a Asistir</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={profesorAsistir}
                                        onChange={handleChange}>
                                        <option value="">Seleccionar</option>
                                        {profesores.map((profesor) => (
                                            <option key={profesor.nombre} value={profesor.nombre}>
                                                {profesor.nombre}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="cursoAsistir">
                                    <Form.Label>Curso a Asistir</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={cursoAsistir}
                                        onChange={handleChange}>
                                        <option value="">Seleccionar</option>
                                        {cursos.map((curso) => (
                                            <option key={curso.nombre} value={curso.nombre}>
                                                {curso.nombre}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="semestresActivo">
                                    <Form.Label>Cantidad de Semestres Activo</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={semestresActivo}
                                        onChange={handleChange} />
                                </Form.Group>

                                <Form.Group controlId="créditosAproSemAnt">
                                    <Form.Label>Creditos Aprobados Semestre Anterior</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={créditosAproSemAnt}
                                        onChange={handleChange} />
                                </Form.Group>

                            </>

                        )}
                        {tipoAsistencia === 'Tutoria Estudiantil' && (
                            <>
                                <Form.Group controlId="cursoAsistir">
                                    <Form.Label>Curso a Asistir</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={cursoAsistir}
                                        onChange={handleChange}>
                                        <option value="">Seleccionar</option>
                                        {cursos.map((curso) => (
                                            <option key={curso.nombre} value={curso.nombre}>
                                                {curso.nombre}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="promedioPondSemAnt">
                                    <Form.Label>Promedio Ponderado Semestre Anterior</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        value={promedioPondSemAnt}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="notaCursoAsistir">
                                    <Form.Label>Nota Curso a Asistir</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        value={notaCursoAsistir}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group controlId="semestresActivo">
                                    <Form.Label>Cantidad de Semestres Activo</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={semestresActivo}
                                        onChange={handleChange} />
                                </Form.Group>
                            </>
                        )}
                        {tipoAsistencia === 'Horas Asistente' && (
                            <>
                                <Form.Group controlId="profesorAsistir">
                                    <Form.Label>Profesor a Asistir</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={profesorAsistir}
                                        onChange={handleChange}>
                                        <option value="">Seleccionar</option>
                                        {profesores.map((profesor) => (
                                            <option key={profesor.nombre} value={profesor.nombre}>
                                                {profesor.nombre}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="cursoAsistir">
                                    <Form.Label>Curso a Asistir</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={cursoAsistir}
                                        onChange={handleChange}>
                                        <option value="">Seleccionar</option>
                                        {cursos.map((curso) => (
                                            <option key={curso.nombre} value={curso.nombre}>
                                                {curso.nombre}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="promedioPondSemAnt">
                                    <Form.Label>Promedio Ponderado Semestre Anterior</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        value={promedioPondSemAnt}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="notaCursoAsistir">
                                    <Form.Label>Nota Curso a Asistir</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        value={notaCursoAsistir}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </>
                        )}

                        <Form.Group controlId="boleta">
                            <Form.Label>Boleta</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={handleFileChange}
                                required
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button id="botonAceptar" form="form1" variant="success" type="submit" onClick={agregarSolicitud}>
                        Aceptar
                    </Button>
                    <Button variant="secondary" onClick={cerrarModal}>
                        Cancelar
                    </Button>{" "}
                </Modal.Footer>
            </Modal>
            <ToastContainer />
        </div>
    );
}

export default Solicitar;