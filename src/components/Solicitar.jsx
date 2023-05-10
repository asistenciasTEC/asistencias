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
    editarSolicitud(profesorAModificar);
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

  }
  const agregarSolicitud = async (e) => {
    e.preventDefault();
    const nuevaSolicitud = { 
        id: uuid(), tipoAsistencia,
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
        fecha}
    if (solicitudes.length === 0) {
      await addDoc(collection(db, "solicitudes"), nuevaSoli);
      setProfesores([nuevaSoli,...solicitudes,]);
      toast.success("Solicitud enviada exitosamente.");
      cerrarModal();
    }
  };

  const editarProfesor = async (e) => {
    e.preventDefault();
    const profesorActualizado = { nombre, email, password };
    const q = query(collection(db, "profesores"), where("id", "==", id));
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
    const listaProfesoresActualizada = profesores.map((profesor) =>
      profesor.id === id ? { id: id, ...profesorActualizado } : profesor
    );
    setProfesores(listaProfesoresActualizada);
    cerrarModal();
  };

  const eliminarProfesor = async (id) => {
    const q = query(collection(db, "profesores"), where("id", "==", id));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref)
        .then(() => {
          toast.success("Profesor eliminado exitosamente.");
        })
        .catch((error) => {
          toast.error("Ha ocurrido un error.");
        });
    });
    const listaProfesoresActualizada = profesores.filter(
      (profesor) => profesor.id !== id
    );
    setProfesores(listaProfesoresActualizada);
  };

  //Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages =
    resultados.length > 0
      ? Math.ceil(resultados.length / itemsPerPage)
      : Math.ceil(profesores.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems =
    resultados.length > 0
      ? resultados.slice(startIndex, endIndex)
      : profesores.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const buscarEnLista = (terminoBusqueda) => {
    const resultadosBusq = [];
    if (
      valorSeleccionado === "default" ||
      valorSeleccionado === "nombre" ||
      valorSeleccionado === ""
    ) {
      for (let i = 0; i < profesores.length; i++) {
        if (
          profesores[i].nombre.toLowerCase() === terminoBusqueda.toLowerCase()
        ) {
          resultadosBusq.push(profesores[i]);
        }
      }
    }
    if (valorSeleccionado === "correo") {
      for (let i = 0; i < profesores.length; i++) {
        if(profesores[i].email.toLowerCase()===terminoBusqueda.toLowerCase()){
          resultadosBusq.push(profesores[i]);
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
      <h1>Profesores</h1>
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
              <Form.Select
                aria-label="Default select example"
                onChange={handleSelectChange}
              >
                <option value="default">Filtros</option>
                <option value="nombre">Por Nombre</option>
                <option value="correo">Por Correo</option>
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
            <th>Nombre completo</th>
            <th>Correo Electrónico</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((profesor) => (
            <tr key={profesor.id}>
              <td>{profesor.nombre}</td>
              <td>{profesor.email}</td>
              <td>
                <Button
                  className="px-2 py-1 mx-1 fs-5"
                  variant="warning"
                  onClick={() => abrirModal("editar", profesor.id)}
                >
                  <MdEdit />
                </Button>
                <Button
                  className="px-2 py-1 mx-1 fs-5"
                  variant="danger"
                  onClick={() => handleDeleteClick(profesor.id)}
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
          ¿Estás seguro de que quieres eliminar este profesor?
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
          ¿Estás seguro de que quieres modificar este profesor?
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
          <Form id="form1" onSubmit={id ? handleModifyClick : agregarProfesor}>
            <Form.Group className="mb-3" controlId="nombre">
              <Form.Label>Nombre completo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Escribe el nombre completo del profesor"
                value={nombre}
                onChange={handleChange}
                autoComplete="off"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                placeholder="Escribe el correo electrónico del profesor"
                value={email}
                onChange={handleChange}
                autoComplete="off"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Escribe la contraseña del profesor"
                value={password}
                onChange={handleChange}
                required={!id}
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