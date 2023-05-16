import { useState, useEffect } from "react";
import { collection, query, addDoc, getDocs, serverTimestamp, orderBy } from "firebase/firestore";
import { Table, Modal, Form, Button, Row, Col } from "react-bootstrap";
import { db } from "../config/firebase/firebase";
import { v4 as uuid } from "uuid";

//librería de mensajes información
import { toast, ToastContainer } from "react-toastify";

//librería de iconos boostrap para react
import { MdAddBox } from "react-icons/md";

function Solicitar() {
    const [solicitudes, setSolicitudes] = useState([]);
    const [asistencias, setAsistencias] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [periodos, setPeriodos] = useState([]);

    const [dataForm, setDataForm] = useState({
        id: "",
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
        const obtenerAsistencias = async () => {
            const asistenciasCollection = collection(db, "asistencias");
            const snapshot = await getDocs(asistenciasCollection);
            const listaAsistencias = snapshot.docs.map((doc) => ({
                ...doc.data(),
            }));
            setAsistencias(listaAsistencias);
        };
        obtenerAsistencias();

        const obtenerProfesores = async () => {
            const profesoresCollection = collection(db, "profesores");
            const snapshot = await getDocs(profesoresCollection);
            const listaProfesores = snapshot.docs.map((doc) => ({
                ...doc.data(),
            }));
            setProfesores(listaProfesores);
        };
        obtenerProfesores();

        const obtenerCursos = async () => {
            const cursosCollection = collection(db, "cursos");
            const snapshot = await getDocs(cursosCollection);
            const listaCursos = snapshot.docs.map((doc) => ({
                ...doc.data(),
            }));
            setCursos(listaCursos);
        };
        obtenerCursos();

        const obtenerPeriodos = async () => {
            const queryPeriodosCollection = query(collection(db, "periodos"), orderBy("fecha", "desc"));
            const snapshot = await getDocs(queryPeriodosCollection);
            const listaPeriodos = snapshot.docs.map((doc) => ({
                ...doc.data(),
            }));
            setPeriodos(listaPeriodos);
        };
        obtenerPeriodos();
    }, []);

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

    const agregarSolicitud = async (e) => {
        e.preventDefault();

        console.log("Hola")
        const hayPeriodosActivos = periodos.some((periodo) => periodo.estado);

        console.log(hayPeriodosActivos)

        if (hayPeriodosActivos === true) {
            console.log("Entro al if")
            const nuevaSolicitud = {
                id: uuid(),
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
                horasAsignadas,
                fecha: serverTimestamp()
            };
            await addDoc(collection(db, "solicitudes"), nuevaSolicitud);
            setSolicitudes([nuevaSolicitud, ...solicitudes,]);
            toast.success("Solicitud enviada exitosamente.");
            cerrarModal()
        } else {
            console.log("No entro al if")
            toast.error("No hay periodos activos.");
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
                                        value={apellido1}
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
                                        value={carne}
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
                                        value={cuentaBancaria}
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
                                        value={apellido2}
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
                                        value={cedula}
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
                                        value={cuentaIBAN}
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
                                        value={nombre}
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
                                        value={correo}
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
                                        value={telefono}
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
                                onChange={handleChange}
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