import { useState, useEffect } from "react";
import { collection, query, where, getDocs, updateDoc, deleteDoc, orderBy } from "firebase/firestore";
import { Table, Modal, Form, Button, Pagination, Row, Col } from "react-bootstrap";
import { db } from "../config/firebase/firebase";

//librería de mensajes información
import { toast, ToastContainer } from "react-toastify";

//librería de iconos boostrap para react
import { MdInfo, MdEdit, MdDelete } from "react-icons/md";

const HistorialSolicitudes = () => {
    const userPrueba = "harold@gmail.com"

    const [solicitudes, setSolicitudes] = useState([]);

    const [asistencias, setAsistencias] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [profesores, setProfesores] = useState([]);

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

    const [showModalMoreInfo, setShowModalMoreInfo] = useState(false);
    const [solicitudInfo, setSolicitudInfo] = useState("");

    const [showModalEliminar, setShowModalEliminar] = useState(false);
    const [solicitudAEliminar, setSolicitudAELiminar] = useState("");

    const [showModalEditar, setShowModalEditar] = useState(false);
    const [solicitudAEditar, setSolicitudAEditar] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [resultados, setResultados] = useState([]);
    const [valorSeleccionado, setValorSeleccionado] = useState("");

    const {
        id,
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
    } = dataForm;

    const handleChange = (e) => {
        setDataForm({
            ...dataForm,
            [e.target.id]: e.target.value
        })
    }

    useEffect(() => {
        const obtenerSolicitudes = async () => {
            const querySolicitudesCollection = query(collection(db, "solicitudes"), where("correo", "==", userPrueba), orderBy("fecha", "desc"));
            const snapshot = await getDocs(querySolicitudesCollection);
            const listaSolicitudes = snapshot.docs.map((doc) => ({
                ...doc.data(),
            }));
            setSolicitudes(listaSolicitudes);
        };

        const obtenerAsistencias = async () => {
            const asistenciasCollection = collection(db, "asistencias");
            const snapshot = await getDocs(asistenciasCollection);
            const listaAsistencias = snapshot.docs.map((doc) => ({
                ...doc.data(),
            }));
            setAsistencias(listaAsistencias);
        };

        const obtenerCursos = async () => {
            const cursosCollection = collection(db, "cursos");
            const snapshot = await getDocs(cursosCollection);
            const listaCursos = snapshot.docs.map((doc) => ({
                ...doc.data(),
            }));
            setCursos(listaCursos);
        };

        const obtenerProfesores = async () => {
            const profesoresCollection = collection(db, "profesores");
            const snapshot = await getDocs(profesoresCollection);
            const listaProfesores = snapshot.docs.map((doc) => ({
                ...doc.data(),
            }));
            setProfesores(listaProfesores);
        };

        obtenerSolicitudes();
        obtenerAsistencias();
        obtenerCursos();
        obtenerProfesores();
    }, []);

    //More Info
    const abrirModalInfo = (id) => {
        const solicitud = solicitudes.find((solicitud) => solicitud.id === id);
        setSolicitudInfo(solicitud.condicion);
        setShowModalMoreInfo(true);
    };

    //Confirm update
    const handleUpdateClick = (e) => {
        e.preventDefault();
        setSolicitudAEditar(e);
        cerrarModal();
        setShowModalEditar(true);
    };

    const handleConfirmUpdate = () => {
        editarSolicitud(solicitudAEditar);
        setShowModalEditar(false);
    };

    //Confirm delete
    const handleDeleteClick = (id) => {
        setSolicitudAELiminar(id);
        setShowModalEliminar(true);
    };

    const handleConfirmDelete = () => {
        eliminarSolicitud(solicitudAEliminar);
        setShowModalEliminar(false);
    };

    const abrirModal = (id) => {
        const solicitud = solicitudes.find((solicitud) => solicitud.id === id);
        setDataForm({
            id: solicitud.id,
            tipoAsistencia: solicitud.tipoAsistencia,
            cedula: solicitud.cedula,
            carne: solicitud.carne,
            apellido1: solicitud.apellido1,
            apellido2: solicitud.apellido2,
            nombre: solicitud.nombre,
            promedioPondSemAnt: solicitud.promedioPondSemAnt,
            créditosAproSemAnt: solicitud.créditosAproSemAnt,
            correo: solicitud.correo,
            telefono: solicitud.telefono,
            cuentaBancaria: solicitud.cuentaBancaria,
            cuentaIBAN: solicitud.cuentaIBAN,
            profesorAsistir: solicitud.profesorAsistir,
            cursoAsistir: solicitud.cursoAsistir,
            notaCursoAsistir: solicitud.notaCursoAsistir,
            horario: solicitud.horario,
            boleta: solicitud.boleta,
            condicion: solicitud.condicion,
            horasAsignadas: solicitud.horasAsignadas,
            fecha: solicitud.fecha
        });
        setShowModal(true);
    };

    const cerrarModal = () => {
        setShowModal(false);
    };

    const editarSolicitud = async (e) => {
        e.preventDefault();
        const solicitudActualizada = {
            tipoAsistencia,
            cedula,
            carne,
            apellido1,
            apellido2,
            nombre,
            promedioPondSemAnt,
            créditosAproSemAnt,
            correo,
            telefono,
            cuentaBancaria,
            cuentaIBAN,
            profesorAsistir,
            cursoAsistir,
            notaCursoAsistir,
            horario,
            boleta
        };
        const q = query(collection(db, "solicitudes"), where("id", "==", id));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            updateDoc(doc.ref, solicitudActualizada)
                .then(() => {
                    toast.success("Solicitud editada exitosamente.");
                })
                .catch((error) => {
                    toast.error("Ha ocurrido un error.");
                });
        });
        const listaSolicitudsActualizada = solicitudes.map((solicitud) =>
            solicitud.id === id ? { id: id, ...solicitudActualizada } : solicitud
        );
        setSolicitudes(listaSolicitudsActualizada);
    };

    const eliminarSolicitud = async (id) => {
        const q = query(collection(db, "solicitudes"), where("id", "==", id));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            deleteDoc(doc.ref)
                .then(() => {
                    toast.success("Solicitud eliminada exitosamente.");
                })
                .catch((error) => {
                    toast.error("Ha ocurrido un error.");
                });
        });
        const listaSolicitudesActualizada = solicitudes.filter((solicitud) => solicitud.id !== id);
        setSolicitudes(listaSolicitudesActualizada);
    };

    //Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages =
        resultados.length > 0
            ? Math.ceil(resultados.length / itemsPerPage)
            : Math.ceil(solicitudes.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems =
        resultados.length > 0
            ? resultados.slice(startIndex, endIndex)
            : solicitudes.slice(startIndex, endIndex);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    //Busqueda
    const buscarEnLista = (terminoBusqueda) => {
        const resultadosBusq = [];
        if (
            valorSeleccionado === "default" ||
            valorSeleccionado === ""
        ) {
            for (let i = 0; i < solicitudes.length; i++) {
                if (
                    solicitudes[i].carne.toLowerCase() === terminoBusqueda.toLowerCase() ||
                    solicitudes[i].nombre.toLowerCase() === terminoBusqueda.toLowerCase() ||
                    solicitudes[i].apellido1.toLowerCase() === terminoBusqueda.toLowerCase() ||
                    solicitudes[i].apellido2.toLowerCase() === terminoBusqueda.toLowerCase() ||
                    (solicitudes[i].nombre + ' ' + solicitudes[i].apellido1 + ' ' + solicitudes[i].apellido2).toLowerCase() === terminoBusqueda.toLowerCase() ||
                    solicitudes[i].tipoAsistencia.toLowerCase() === terminoBusqueda.toLowerCase() ||
                    solicitudes[i].cursoAsistir.toLowerCase() === terminoBusqueda.toLowerCase() ||
                    solicitudes[i].profesorAsistir.toLowerCase() === terminoBusqueda.toLowerCase() ||
                    solicitudes[i].condicion.toLowerCase() === terminoBusqueda.toLowerCase()
                ) {
                    resultadosBusq.push(solicitudes[i]);
                }
            }
        }
        if (valorSeleccionado === "carne") {
            for (let i = 0; i < solicitudes.length; i++) {
                if (solicitudes[i].carne.toLowerCase() === terminoBusqueda.toLowerCase()
                ) {
                    resultadosBusq.push(solicitudes[i]);
                }
            }
        }
        if (valorSeleccionado === "nombre") {
            for (let i = 0; i < solicitudes.length; i++) {

                if (
                    solicitudes[i].nombre.toLowerCase() === terminoBusqueda.toLowerCase() ||
                    solicitudes[i].apellido1.toLowerCase() === terminoBusqueda.toLowerCase() ||
                    solicitudes[i].apellido2.toLowerCase() === terminoBusqueda.toLowerCase() ||
                    (solicitudes[i].nombre + ' ' + solicitudes[i].apellido1 + ' ' + solicitudes[i].apellido2).toLowerCase() === terminoBusqueda.toLowerCase()
                ) {
                    resultadosBusq.push(solicitudes[i]);
                }
            }
        }
        if (valorSeleccionado === "tipoAsistencia") {
            for (let i = 0; i < solicitudes.length; i++) {
                if (solicitudes[i].tipoAsistencia.toLowerCase() === terminoBusqueda.toLowerCase()
                ) {
                    resultadosBusq.push(solicitudes[i]);
                }
            }
        }
        if (valorSeleccionado === "cursoAsistir") {
            for (let i = 0; i < solicitudes.length; i++) {
                if (solicitudes[i].cursoAsistir.toLowerCase() === terminoBusqueda.toLowerCase()
                ) {
                    resultadosBusq.push(solicitudes[i]);
                }
            }
        }
        if (valorSeleccionado === "profesorAsistir") {
            for (let i = 0; i < solicitudes.length; i++) {
                if (solicitudes[i].profesorAsistir.toLowerCase() === terminoBusqueda.toLowerCase()
                ) {
                    resultadosBusq.push(solicitudes[i]);
                }
            }
        }
        if (valorSeleccionado === "condicion") {
            for (let i = 0; i < solicitudes.length; i++) {
                if (solicitudes[i].condicion.toLowerCase() === terminoBusqueda.toLowerCase()
                ) {
                    resultadosBusq.push(solicitudes[i]);
                }
            }
        }
        if (valorSeleccionado === "horasAsignadas") {
            for (let i = 0; i < solicitudes.length; i++) {
                if (solicitudes[i].horasAsignadas.toLowerCase() === terminoBusqueda.toLowerCase()
                ) {
                    resultadosBusq.push(solicitudes[i]);
                }
            }
        }
        setResultados(resultadosBusq);
    };
    const handleBusqueda = (event) => {
        const terminoBusqueda = event.target.value;
        buscarEnLista(terminoBusqueda);
    };

    function handleSelectChange(event) {
        setValorSeleccionado(event.target.value);
    }

    return (
        <div className="container-lg ">
            <h1>Historial de Solicitudes</h1>
            <div className="row mb-2 justify-content-end">
                <div className="col-3">
                    <Form.Select aria-label="Default select example"
                        onChange={handleSelectChange}>
                        <option value="default">Filtros</option>
                        <option value="carne">Por Carné</option>
                        <option value="nombre">Por Nombre</option>
                        <option value="tipoAsistencia">Por Tipo de asistencia</option>
                        <option value="cursoAsistir">Por Curso a asistir</option>
                        <option value="profesorAsistir">Por Profesor a asistir</option>
                        <option value="condicion">Por Condición</option>
                        <option value="horasAsignadas">Por Horas asignadas</option>
                    </Form.Select>
                </div>
                <div className="col-3">
                    <Form.Control
                        type="search"
                        placeholder="Buscar"
                        className="me-2"
                        aria-label="Search"
                        onChange={handleBusqueda}
                    />
                </div>
            </div>

            <Table striped bordered hover>
                <thead className="table-dark table-bg-scale-50">
                    <tr>
                        <th>Tipo de Asistencia</th>
                        <th>Curso</th>
                        <th>Profesor</th>
                        <th>Condición</th>
                        <th>Horas asignadas</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((solicitud) => (
                        <tr key={solicitud.id}>
                            <td>{solicitud.tipoAsistencia}</td>
                            <td>{solicitud.cursoAsistir}</td>
                            <td>{solicitud.profesorAsistir}</td>
                            <td>{solicitud.condicion}</td>
                            <td>{solicitud.horasAsignadas}</td>
                            {solicitud.condicion === 'Pendiente' ? (
                                <td>
                                    <Button
                                        className="px-2 py-1 mx-1 fs-5"
                                        variant="warning"
                                        onClick={() => abrirModal(solicitud.id)}
                                    >
                                        <MdEdit />
                                    </Button>
                                    <Button
                                        className="px-2 py-1 mx-1 fs-5"
                                        variant="danger"
                                        onClick={() => handleDeleteClick(solicitud.id)}
                                    >
                                        <MdDelete />
                                    </Button>
                                </td>
                            ) : (
                                <td>
                                    <Button
                                        className="px-2 py-1 mx-1 fs-5"
                                        variant="info"
                                        onClick={() => abrirModalInfo(solicitud.id)}
                                    >
                                        <MdInfo />
                                    </Button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Pagination className="justify-content-center">
                <Pagination.Prev
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                />
                {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item
                        key={index}
                        active={index + 1 === currentPage}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                />
            </Pagination>

            <Modal
                show={showModalMoreInfo}
                onHide={() => setShowModalMoreInfo(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Información de la Solicitud</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Su solicitud se encuentra en la condición de: <strong>{solicitudInfo}</strong>, para más información por favor comunicarse con el encargado.
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="success"
                        onClick={() => setShowModalMoreInfo(false)}
                    >
                        ¡Entendido!
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={showModalEliminar}
                onHide={() => setShowModalEliminar(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Estás seguro de que quieres eliminar esta solicitud?
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowModalEliminar(false)}
                    >
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>
                        Aceptar
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={showModalEditar}
                onHide={() => setShowModalEditar(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar edición</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Estás seguro de que quieres editar esta solicitud?
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowModalEditar(false)}
                    >
                        Cancelar
                    </Button>
                    <Button variant="success" onClick={handleConfirmUpdate}>
                        Aceptar
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal className="modal-xl" show={showModal} onHide={cerrarModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar solicitud</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleConfirmUpdate}>
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
                    <Button variant="secondary" onClick={cerrarModal}>
                        Cancelar
                    </Button>{" "}
                    <Button id="botonEditar" form="form1" variant="success" type="submit" onClick={handleUpdateClick}>
                        Guardar cambios
                    </Button>
                </Modal.Footer>
            </Modal>
            <ToastContainer />
        </div>
    );
}

export default HistorialSolicitudes