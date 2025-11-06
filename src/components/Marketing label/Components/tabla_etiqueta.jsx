"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@mui/material";
import Link from "next/link";
import Swal from "sweetalert2";
import styles from "../../../../public/CSS/spinner.css";
import { useSession, signOut } from "next-auth/react";
import { CardTitle } from "@/components/ui/card";

export function TablaEventosMejorada() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [eventos, setEventos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const encabezados = [
    "ID",
    "Tipo",
    "Nombre",
    "Artículo",
    "Fecha de envío",
    "Descripción",
    "Fecha de último movimiento",
    "Estatus",
    "Firmas",
    "Pendientes por firmar",
    "Acción",
  ];

  const handleChangeStatus = async (id) => {
    try {
      // Mostrar una alerta para que el usuario seleccione el nuevo estatus
      const { value: nuevoEstatus } = await Swal.fire({
        title: "Nuevo estatus de la etiqueta",
        input: "select",
        inputOptions: {
          Completado: "Completado",
          Pendiente: "Pendiente",
          Rechazado: "Rechazado",
        },
        inputPlaceholder: "Selecciona el nuevo estatus de la etiqueta",
        showCancelButton: true,
        cancelButtonColor: '#d33',
        cancelButtonText: "Cancelar",
        confirmButtonText: "Cambiar estatus",
        confirmButtonColor: "rgb(31 41 55)",
        inputValidator: (value) => {
          return !value ? "Debes seleccionar un estatus" : null;
        },
      });

      if (nuevoEstatus) {
        // Realizar la petición para cambiar el estatus
        const response = await axios.post(
          "/api/MarketingLabel/cambiarEstatusFormularioEtiqueta",
          {
            id,
            nuevoEstatus,
          }
        );

        if (response.status === 200) {
          Swal.fire(
            "Actualizado",
            "El estatus de la etiqueta ha sido actualizado correctamente",
            "success"
          );
          // Aquí podrías actualizar la lista de eventos para reflejar el cambio
          setEventos((prevEventos) =>
            prevEventos.map((evento) =>
              evento.id === id ? { ...evento, estatus: nuevoEstatus } : evento
            )
          );
        } else {
          Swal.fire(
            "Error",
            "No se pudo actualizar el estatus de la etiqueta",
            "error"
          );
        }
      }
    } catch (error) {
      console.error("Error al cambiar el estatus:", error);
      Swal.fire(
        "Error",
        "Ocurrió un error al intentar cambiar el estatus de la etiqueta",
        "error"
      );
    }
  };

  const handleDelete = async (index) => {
    try {
      // Mostrar alerta de confirmación
      const result = await Swal.fire({
        title: "¿Deseas eliminar la etiqueta?",
        text: "No podrás revertir esta acción",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "rgb(31 41 55)",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
      });

      // Si el usuario confirma la eliminación
      if (result.isConfirmed) {
        const response = await axios.post(
          `/api/MarketingLabel/eliminarFormularioEtiqueta?id=${index}`
        );
        if (response.status === 200) {
          await Swal.fire(
            "Eliminada",
            "La etiqueta ha sido eliminada correctamente",
            "success"
          );
          window.location.href = "/marketing/etiquetas";
        } else {
          Swal.fire("Error", "Error al eliminar la etiqueta", "error");
        }
      }
    } catch (error) {
      console.error("Error al eliminar la etiqueta:", error);
      Swal.fire(
        "Error",
        "Ocurrió un error al intentar eliminar la etiqueta",
        "error"
      );
    }
  };
  // Obtener eventos desde el backend
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await axios.get("/api/MarketingLabel/getEtiquetas");
        setEventos(response.data);
      } catch (error) {
        console.error("Error al obtener etiquetas:", error);
      }
    };
    fetchEventos();
  }, []);

  const renderNombres = (evento) => {
    const nombresPorDefecto = {
      DirMkt: "Directora de marketing",
      GerMaq: "Gerente de maquilas",
      IYD: "Investigación y desarrollo de nuevos productos",
      IP: "Ingeniería de productos",
      GerMkt: "Gerente de marketing",
      Diseñador: "Diseñador gráfico",
      GerCal: "Gerente de calidad",
      GerAud: "Gerente auditorías",
      Quimico: "Químico",
      Planeacion: "Planeación",
      Maquilas: "Maquilas",
    };

    return Object.keys(nombresPorDefecto)
      .filter((key, index, arr) => {
        // Excluir el último elemento si el tipo no es "Maquilas"
        if (
          evento.datos_formulario.tipo !== "Maquilas" &&
          index === arr.length - 1
        )
          return false;
        const verifierKey = `verifier-${index}`;
        const authorizeKey = `authorize-${index}`;

        // Incluir solo los nombres cuya firma no existe o está vacía
        const pendingToSign =
          evento.datos_formulario?.[verifierKey] &&
          evento.datos_formulario?.[authorizeKey];
        return !pendingToSign; // Excluir si existe un valor en verifier
      })
      .map((key) => nombresPorDefecto[key])
      .join(", ");
  };

  // Función para extraer los datos relevantes
  const extractData = (evento) => {
    const fechaCompleta = evento.fecha_envio;
    const fecha = new Date(fechaCompleta);

    // Extraer solo la fecha y la hora
    const fechaFormateada = fecha.toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const fechaCompleta2 = evento.fecha_actualizacion;
    const fecha2 = new Date(fechaCompleta2);

    // Extraer solo la fecha y la hora
    const fechaFormateada2 = fecha2.toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    return {
      id: evento.id,
      tipo: evento.datos_formulario.tipo,
      nombreProducto: evento.datos_formulario.nombre_producto,
      articulo: evento.datos_formulario.articulo,
      fechaElaboracion: fechaFormateada,
      descripcion: evento.datos_formulario.description,
      fechaUltimoMovimiento: fechaFormateada2,
      estatus: evento.estatus,
      firmas: evento.firmas,
      formulario: evento,
    };
  };

  // Filtrar los eventos en base a la búsqueda y el filtro de estatus
  const filteredEventos = eventos.map(extractData).filter(
    (evento) =>
      (statusFilter === "todos" || evento.estatus === statusFilter) &&
      Object.values(evento)
        .filter((value) => value !== null && value !== undefined) // Filtra valores nulos o indefinidos
        .some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
  );

  // Acción que contiene los botones
  const renderAccion = (index) => (
    <div style={{ display: "flex", gap: "1px" }}>
      {(session && session.user.email === "o.rivera@aionsuplementos.com") ||
      session.user.email === "p.gomez@aionsuplementos.com" ||
      session.user.email === "a.garcilita@aionsuplementos.com" ? (
        <Button
          onClick={() => handleChangeStatus(index)}
          style={{ width: "1px", height: "40px" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            stroke="rgb(31 41 55)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-refresh-cw"
          >
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0114.63-4.89L23 10M1 14a9 9 0 0014.63 4.89L17 14"></path>
          </svg>
        </Button>
      ) : (
        <div></div>
      )}

      <Link href={`/marketing/etiquetas/Editar?id=${index}`}>
        <Button style={{ width: "1px", height: "40px" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            stroke="rgb(31 41 55)"
            fill="rgb(31 41 55)"
            width="20px"
            height="20px"
          >
            <path d="M21,11.5V15H18a3,3,0,0,0-3,3v3H4.5A1.5,1.5,0,0,1,3,19.5V4.5A1.5,1.5,0,0,1,4.5,3h9A1.5,1.5,0,0,0,15,1.5h0A1.5,1.5,0,0,0,13.5,0h-9A4.5,4.5,0,0,0,0,4.5v15A4.5,4.5,0,0,0,4.5,24H16.484a4.5,4.5,0,0,0,3.181-1.317l3.017-3.017A4.5,4.5,0,0,0,24,16.485V11.5A1.5,1.5,0,0,0,22.5,10h0A1.5,1.5,0,0,0,21,11.5Z" />
            <path d="M17.793,1.793l-12.5,12.5A1,1,0,0,0,5,15v3a1,1,0,0,0,1,1H9a1,1,0,0,0,.707-.293L22.038,6.376a3.379,3.379,0,0,0,.952-3.17A3.118,3.118,0,0,0,17.793,1.793Z" />
          </svg>
        </Button>
      </Link>

      {(session && session.user.email === "o.rivera@aionsuplementos.com") ||
      session.user.email === "p.gomez@aionsuplementos.com" ||
      session.user.email === "a.garcilita@aionsuplementos.com" ? (
        <Button
          onClick={() => handleDelete(index)}
          style={{ width: "1px", height: "40px" }}
        >
          <svg
            width="25px"
            height="25px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 3L21 21M18 6L17.6 12M17.2498 17.2527L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6H4M16 6L15.4559 4.36754C15.1837 3.55086 14.4194 3 13.5585 3H10.4416C9.94243 3 9.47576 3.18519 9.11865 3.5M11.6133 6H20M14 14V17M10 10V17"
              stroke="rgb(31 41 55)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
      ) : (
        <div></div>
      )}
    </div>
  );

  const { data: session, status } = useSession();
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className={styles.spinner} />
        <p className="ml-3">Cargando...</p>
      </div>
    );
  }
  if (status == "loading") {
    return <p>cargando...</p>;
  }
  if (!session || !session.user) {
    return (
      (window.location.href = "/"),
      (
        <div className="flex items-center justify-center min-h-screen">
          <Spinner className={styles.spinner} />
          <p className="ml-3">No has iniciado sesión</p>
        </div>
      )
    );
  }

  // Paginación
  const indexOfLastEvento = currentPage * itemsPerPage;
  const indexOfFirstEvento = indexOfLastEvento - itemsPerPage;
  const currentEventos = filteredEventos.slice(
    indexOfFirstEvento,
    indexOfLastEvento
  );
  const totalPages = Math.ceil(filteredEventos.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto">
      <div className="flex justify-center items-center text-center mb-4">
        <CardTitle className="text-3xl font-bold">Etiquetas</CardTitle>
      </div>
      {(session && session.user.email === "o.rivera@aionsuplementos.com") ||
      session.user.email === "a.garcilita@aionsuplementos.com" ? (
        <div style={{ display:"flex" }}>
          <a href="/marketing/etiquetas/formulario">
            <Button
              style={{ 
                background: "rgb(31 41 55)", 
                padding: "10px 15px", 
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                color: "white",
                border: "none",
                cursor: "pointer",
                marginBottom: "10px"
              }}
            >
              <FirmasIcon className="h-4 w-4" /> Agregar etiqueta
            </Button>
          </a>
        </div>
      ) : (
        <div hidden></div>
      )}
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-1/3">
          <Label htmlFor="search" className="mb-2 block">
            Buscar
          </Label>
          <SearchIcon
            style={{ marginTop: "10px", marginLeft: "15px" }}
            className="absolute h-5 w-5 text-gray-400"
          />
          <Input
            id="search"
            placeholder="Buscar en todos los campos..."
            className="w-full pl-12 pr-4 py-2 bg-gray-700 rounded-md text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-1/3">
          <Label htmlFor="status-filter" className="mb-2 block">
            Filtrar por estatus
          </Label>
          <Select onValueChange={setStatusFilter} defaultValue={statusFilter}>
            <SelectTrigger id="status-filter">
              <SelectValue placeholder="Seleccionar estatus" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="Completado">Completado</SelectItem>
              <SelectItem value="Pendiente">Pendiente</SelectItem>
              <SelectItem value="Rechazado">Rechazado</SelectItem>
              <SelectItem value="Eliminado">Eliminado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableCaption>Etiquetas vigentes</TableCaption>
          <TableHeader>
            <TableRow>
              {encabezados.map((encabezado, index) => (
                <TableHead key={index} className="whitespace-nowrap">
                  {encabezado}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentEventos.length > 0 ? (
              currentEventos.map((evento, index) => (
                <TableRow key={index}>
                  <TableCell>{evento.id || "Sin id especificado"}</TableCell>
                  <TableCell>
                    {Array.isArray(evento.tipo) &&
                    evento.tipo.length === 1 &&
                    evento.tipo[0] === ""
                      ? "Sin tipo" // Si es un array con un valor vacío, mostrar "Sin tipo"
                      : Array.isArray(evento.tipo) && evento.tipo.length > 0
                      ? evento.tipo.join(", ") // Si es un array y tiene valores, unirlos y mostrarlos
                      : typeof evento.tipo === "string" &&
                        evento.tipo.trim() !== ""
                      ? evento.tipo // Si es una cadena no vacía, mostrarla
                      : "Sin tipo"}
                  </TableCell>
                  <TableCell>{evento.nombreProducto || "Sin nombre"}</TableCell>
                  <TableCell>{evento.articulo || "Sin artículo"}</TableCell>
                  <TableCell>
                    {evento.fechaElaboracion || "Sin fecha"}
                  </TableCell>
                  <TableCell>
                    {evento.descripcion || "Sin descripción"}
                  </TableCell>
                  <TableCell>
                    {evento.fechaUltimoMovimiento || "Sin fecha"}
                  </TableCell>
                  <TableCell
                    style={{
                      color: (() => {
                        switch (evento.estatus) {
                          case "Completado":
                            return "green";
                          case "Pendiente":
                            return "orange";
                          case "Rechazado":
                            return "red";
                          default:
                            return "black"; // color por defecto
                        }
                      })(),
                    }}
                  >
                    {evento.estatus || "Sin estatus"}
                  </TableCell>
                  {(
                    Array.isArray(evento.tipo)
                      ? evento.tipo.includes("Maquilas")
                      : evento.tipo === "Maquilas"
                  ) ? (
                    <TableCell>
                      {evento.firmas ? evento.firmas + "/11" : "0/11"}
                    </TableCell>
                  ) : (
                    <TableCell>
                      {evento.firmas ? evento.firmas + "/10" : "0/10"}
                    </TableCell>
                  )}
                  <TableCell
                    style={{
                      color: (() => {
                        switch (renderNombres(evento.formulario)) {
                          case "":
                            return "green";
                          default:
                            return "#aea600"; // color por defecto
                        }
                      })(),
                    }}
                  >
                    {renderNombres(evento.formulario) || "Firmas completadas"}
                  </TableCell>
                  <TableCell>{renderAccion(evento.id)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={11} className="text-center">
                  No se encontraron etiquetas
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      <div className="flex justify-center mt-4 mb-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span style={{ marginRight: "2rem" }}></span>

        {/* Páginas */}
        {currentPage > 3 && (
          <>
            <button onClick={() => paginate(1)}>1</button>
            <span style={{ marginLeft: "1rem", marginRight: "1rem" }}>...</span>
          </>
        )}

        {Array.from({ length: totalPages }, (_, index) => index + 1)
          .filter(
            (page) =>
              page === currentPage ||
              page === currentPage - 1 ||
              page === currentPage + 1
          )
          .map((page) => (
            <button
              key={page}
              onClick={() => paginate(page)}
              className={currentPage === page ? "font-bold" : ""}
              style={{ marginLeft: "1rem", marginRight: "1rem" }}
            >
              {page}
            </button>
          ))}

        {currentPage < totalPages - 2 && (
          <>
            <span style={{ marginLeft: "1rem", marginRight: "1rem" }}>...</span>
            <button onClick={() => paginate(totalPages)}>{totalPages}</button>
          </>
        )}

        <span style={{ marginLeft: "2rem" }}></span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function FirmasIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="white"
    >
      <path d="M2 22l2-6 12-12a4 4 0 1 1 6 6L8 22l-6 0zm16.5-16.5a2 2 0 0 0-2.83 0L6 15.17 8.83 18l9.67-9.67a2 2 0 0 0 0-2.83z" />
    </svg>
  );
}

function Spinner() {
  return <div className="spinner" />;
}
