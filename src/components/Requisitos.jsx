import { useState, useEffect } from "react";
import { collection, getDocs, } from "firebase/firestore";
import { Table } from "react-bootstrap";
import { db } from "../config/firebase/firebase";



function Requisitos() {
    const [asistencias, setAsistencias] = useState([].sort());

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
    }, []);

    return (
        <div className="container-lg ">
            <h1>Requisitos</h1>
            <Table striped bordered hover>
                <thead className="table-dark table-bg-scale-50 headerToExcel">
                    <tr>
                        <th>Tipo de asistencia</th>
                        <th>Promedio Ponderado</th>
                        <th>Nota Curso Aprobado</th>
                        <th>Semestres Activos</th>
                        <th>Créditos Aprobados</th>
                    </tr>
                </thead>
                <tbody>
                    {asistencias.map((asistencia) => (
                        <tr key={asistencia.id}>
                            <td>{asistencia.tipoAsistencia}</td>
                            <td>{asistencia.promedioPonderado}</td>
                            <td>{asistencia.notaCurso}</td>
                            <td>{asistencia.semestresActivos}</td>
                            <td>{asistencia.creditosAprobados}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

export default Requisitos;
