import { useState, useEffect } from "react";
import { collection, query, where, getDocs, updateDoc, orderBy } from "firebase/firestore";
import { Table, Modal, Form, Button, Pagination, Row, Col } from "react-bootstrap";
import { db } from "../config/firebase/firebase";
import { v4 as uuid } from "uuid";

//librería de mensajes información
import { toast, ToastContainer } from "react-toastify";

//librería de iconos boostrap para react
import { MdAddBox, MdEdit, MdDelete, MdInfo} from "react-icons/md";

function Solicitar() {
  const [solicitudes, setSolicitudes] = useState([]);

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

  const [showModalEliminar, setShowModalEliminar] = useState(false);
  const [showModalModificar,setShowModalModificar] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalAction, setModalAction] = useState("");
  const [resultados, setResultados] = useState([]);
  const [valorSeleccionado, setValorSeleccionado] = useState("");

  const [solicitudAEliminar, setSolicitudAELiminar] = useState("");
  const [solicitudAModificar, setSolicitudAModificar] = useState("");

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
    fecha
  } = dataForm;
  
  const handleChange = (e) => {
    setDataForm({
      ...dataForm,
      [e.target.id]: e.target.value
    });
  };

  const handleModifyClick = (e) => {
    e.preventDefault();
    setSolicitudAModificar(e);
    cerrarModal();
    setShowModalModificar(true);
  }

  const handleConfirmModify =  () => {
    editarSolicitud(solicitudAModificar);
    setShowModalModificar(true);
  };
  const handleDeleteClick = (id) => {
    setSolicitudAELiminar(id);
    setShowModalEliminar(true);
  };

  const handleConfirmClick = () => {
    // Lógica para eliminar el elemento
    eliminarSolicitud(solicitudAEliminar);
    setShowModalEliminar(false);
  };

  useEffect(() => {
    const obtenerSolicitudes = async () => {
      const querySolicitudesCollection = query(collection(db, "solicitudes"), orderBy("fecha", "desc"));
      const snapshot = await getDocs(querySolicitudesCollection);
      const listaSolicitudes = snapshot.docs.map((doc) => ({
        ...doc.data(),
      }));
      setSolicitudes(listaSolicitudes);
    };
    obtenerSolicitudes();
  }, []);

  const abrirModal = (accion, id = "") => {
    if (accion === "agregar") {
      setModalTitle("Nueva solicitud");
      setModalAction("Agregar");
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
    } else if (accion === "editar") {
        const solicitud = solicitudes.find((solicitud) => solicitud.id === id);
      setModalTitle("Editar solicitud");
      setModalAction("Guardar cambios");
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
    }
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setShowModalModificar(false);
  };

  const agregarSolicitud = async (e) => {
    e.preventDefault();
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
        fecha };

    const nuevaSoli = {
        id:nuevaSolicitud.id,cedula,
        carne:nuevaSolicitud.carne,
        apellido1:nuevaSolicitud.apellido1,
        apellido2:nuevaSolicitud.apellido2,
        nombre:nuevaSolicitud.nombre,
        promedioPondSemAnt:nuevaSolicitud.promedioPondSemAnt,
        créditosAproSemAnt:nuevaSolicitud.créditosAproSemAnt,
        correo:nuevaSolicitud.correo,
        telefono:nuevaSolicitud.telefono,
        cuentaBancaria:nuevaSolicitud.cuentaBancaria,
        cuentaIBAN:nuevaSolicitud.cuentaIBAN,
        profesorAsistir:nuevaSolicitud.profesorAsistir,
        cursoAsistir:nuevaSolicitud.cursoAsistir,
        notaCursoAsistir:nuevaSolicitud.notaCursoAsistir,
        horario:nuevaSolicitud.horario,
        boleta:nuevaSolicitud.boleta,
        condicion:nuevaSolicitud.condicion,
        horasAsignadas:nuevaSolicitud.horasAsignadas,
        fecha:nuevaSolicitud.fecha}
    if (solicitudes.length === 0) {
      await addDoc(collection(db, "solicitudes"), nuevaSoli);
      setSolicitudes([nuevaSoli,...solicitudes,]);
      toast.success("Solicitud enviada exitosamente.");
      cerrarModal();
    }
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
      boleta,
      condicion,
      horasAsignadas,
      fecha };
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
    const listaSolicitudesActualizada = solicitudes.map((solicitud) =>
      solicitud.id === id ? { id: id, ...solicitudActualizada } : solicitud
    );
    setSolicitudes(listaSolicitudesActualizada);
    cerrarModal();
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
    const listaSolicitudesActualizada = solicitudes.filter(
      (solicitud) => solicitud.id !== id
    );
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
      <h1>Solicitar</h1>
      <div className="row">
        <div className="col">
          <Button
            className="px-2 py-1 mb-2 fs-5"
            variant="primary"
            onClick={() => abrirModal("agregar")}
          >
            <MdAddBox />
          </Button>
        </div>
        <div className="col">
          <div className="row">
            <div className="col">
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
            <div className="col">
              <Form.Control
                type="search"
                placeholder="Buscar"
                className="me-2"
                aria-label="Search"
                onChange={handleBusqueda}
              />
            </div>
          </div>
        </div>
      </div>

      <Table striped bordered hover>
      <thead className="table-dark table-bg-scale-50">
          <tr>
            <th>Carné</th>
            <th>Nombre</th>
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
              <td>{solicitud.carne}</td>
              <td>{solicitud.nombre} {solicitud.apellido1} {solicitud.apellido2}</td>
              <td>{solicitud.tipoAsistencia}</td>
              <td>{solicitud.cursoAsistir}</td>
              <td>{solicitud.profesorAsistir}</td>
              <td>{solicitud.condicion}</td>
              <td>{solicitud.horasAsignadas}</td>
              <td>
                <Button
                  className="px-2 py-1 mx-1 fs-5"
                  variant="warning"
                  onClick={() => abrirModal("editar", solicitud.id)}
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
          <Button variant="danger" onClick={handleConfirmClick}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showModalModificar}
        onHide={() => setShowModalModificar(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar modificación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que quieres modificar esta solicitud?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModalModificar(false)}
          >
            Cancelar
          </Button>
          <Button variant="success" onClick={handleConfirmModify}>
            Modificar
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal show={showModal} onHide={cerrarModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="form1" onSubmit={id ? handleModifyClick : agregarSolicitud}>
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

                <Form.Group className="mb-3" controlId="tipoAsistencia">
                  <Form.Label>Tipo de Asistencia</Form.Label>
                  <Form.Control
                    type="text"
                    value={tipoAsistencia}
                    onChange={handleChange}
                    autoComplete='off'
                    required
                    disabled
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="promedioPondSemAnt">
                  <Form.Label>Promedio Ponderado Semestre Anterior</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="N/A"
                    value={promedioPondSemAnt}
                    onChange={handleChange}
                    autoComplete='off'
                    required
                    disabled
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="horario">
                  <Form.Label>Horario</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Aqui va a ir el horario"
                    value={horario}
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

                <Form.Group className="mb-3" controlId="profesorAsistir">
                  <Form.Label>Profesor a Asistir</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="N/A"
                    value={profesorAsistir}
                    onChange={handleChange}
                    autoComplete='off'
                    required
                    disabled
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="créditosAproSemAnt">
                  <Form.Label>Creditos Aprobados Semestre Anterior</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="N/A"
                    value={créditosAproSemAnt}
                    onChange={handleChange}
                    autoComplete='off'
                    required
                    disabled
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="boleta">
                  <Form.Label>Boleta</Form.Label>
                  <Form.Control
                    type="jpg"
                    placeholder="Aqui va a ir la boleta"
                    value={boleta}
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

                <Form.Group className="mb-3" controlId="cursoAsistir">
                  <Form.Label>Curso a Asistir</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="N/A"
                    value={cursoAsistir}
                    onChange={handleChange}
                    autoComplete='off'
                    required
                    disabled
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="notaCursoAsistir">
                  <Form.Label>Nota Curso a Asistir</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="N/A"
                    value={notaCursoAsistir}
                    onChange={handleChange}
                    autoComplete='off'
                    required
                    disabled
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="condicion">
                  <Form.Label>Condicion</Form.Label>
                  <Form.Control
                    type="text"
                    value={condicion}
                    onChange={handleChange}
                    autoComplete='off'
                    required
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="horasAsignadas">
              <Form.Label>Horas Asignadas</Form.Label>
              <Form.Control
                type="number"
                min={0}
                max={10}
                value={horasAsignadas}
                onChange={handleChange}
                autoComplete='off'
                required
              />
            </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button form="form1" variant="primary" type="submit">
            {modalAction}
          </Button>{" "}
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