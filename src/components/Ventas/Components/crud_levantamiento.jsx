"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import styles from "../../../../public/CSS/spinner.css";
import { ChevronRight, ClipboardList } from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Swal from "sweetalert2";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { pdf } from "@react-pdf/renderer";

export function LevantamientoRequerimientos() {
  const [levantamientos, setLevantamientos] = useState([]);
  const [levantamiento, setLevantamiento] = useState(null);
  const [prospectos, setProspectos] = useState([]);
  const [usuariosFilter, setUsuariosFilter] = useState("todos");
  const [prospectosFilter, setProspectosFilter] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
    useEffect(() => {
        const fetchLevantamientos = async () => {
          try {
            const response = await axios.get(
              "/api/Sales/getLevantamientos"
            );
            if (response.data.success) {
              setLevantamientos(response.data.levantamientos);
            } else {
              console.error(
                "Error al obtener los levantamientos:",
                response.data.message
              );
            }
          } catch (error) {
            console.error("Error al hacer fetch de los levantamientos:", error);
          }
        };
    
        fetchLevantamientos();
      }, []);

      const fetchLevantamiento = async (id) => {
        if (!id) return null;
      
        try {
          const response = await axios.get(
            `/api/Sales/getLevantamientoCompleto?id=${id}`
          );
          if (response.data.success) {
            setLevantamiento(response.data.levantamiento);
            return response.data.levantamiento;
          } else {
            console.error("Error al obtener el levantamiento:", response.data.message);
          }
        } catch (error) {
          console.error("Error al hacer fetch del levantamiento:", error);
        }
      };
    
      const getLevantamientos = async () => {
        try {
          const response = await axios.get(
            "/api/Sales/getLevantamientos"
          );
          if (response.data.success) {
            setLevantamientos(response.data.levantamientos);
          } else {
            console.error(
              "Error al obtener los levantamientos:",
              response.data.message
            );
          }
        } catch (error) {
          console.error("Error al hacer fetch de los levantamientos:", error);
        }
      };

  useEffect(() => {
    const fetchProspectos = async () => {
      try {
        const response = await axios.get("/api/Sales/getProspectos");
        if (response.data.success) {
          setProspectos(response.data.prospectos);
        } else {
          console.error(
            "Error al obtener los prospectos:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Error al hacer fetch de los prospectos:", error);
      }
    };

    fetchProspectos();
  }, []);

  const getProspectos = async () => {
    try {
      const response = await axios.get("/api/Sales/getProspectos");
      if (response.data.success) {
        setProspectos(response.data.prospectos);
      } else {
        console.error(
          "Error al obtener los prospectos:",
          response.data.message
        );
      }
    } catch (error) {
      console.error("Error al hacer fetch de los prospectos:", error);
    }
  };

  const handleDelete = async (index) => {
    try {
      // Mostrar alerta de confirmación
      const result = await Swal.fire({
        title: "¿Deseas eliminar el levantamiento?",
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
          `/api/Sales/eliminarLevantamiento?id=${index}`
        );
        if (response.status === 200) {
          await Swal.fire(
            "Eliminado",
            "El levantamiento ha sido eliminado correctamente",
            "success"
          );
          getLevantamientos();
          getProspectos();
        } else {
          Swal.fire("Error", "Error al eliminar el levantamiento", "error");
        }
      }
    } catch (error) {
      console.error("Error al eliminar el levantamiento:", error);
      Swal.fire(
        "Error",
        "Ocurrió un error al intentar eliminar el levantamiento",
        "error"
      );
    }
  };

  const levantamientoAPDF = async (id) => {
    Swal.fire({
      title: 'Generando...',
      text: 'Estamos procesando el archivo, por favor espere...',
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const levantamientoExistente = await fetchLevantamiento(id);

    if (!levantamientoExistente) return;

    let codigoBase64 = "";
    let qrBase64 = "";

    if (levantamientoExistente?.codigo_barras) {
      const res = await fetch(`/api/Sales/obtenerCodigoBarrasPDF?rutaImagen=${encodeURIComponent(levantamientoExistente.codigo_barras)}`);
      const data = await res.json();
      codigoBase64 = data?.base64 || "";
    }

    if (levantamientoExistente?.distribuidor?.qr) {
      const res2 = await fetch(`/api/Sales/obtenerCodigoQRPDF?rutaImagen=${encodeURIComponent(levantamientoExistente.distribuidor.qr)}`);
      const data2 = await res2.json();
      qrBase64 = data2?.base64 || "";
    }

    handleAbrirPDF(levantamientoExistente, codigoBase64, qrBase64);
  };

  const handleAbrirPDF = async (levantamiento, codigoBarras, codigoQR) => {
    try {
      const { default: LevantamientoAPDF } = await import('./pdf_levantamiento');
      const blob = await pdf(<LevantamientoAPDF levantamiento={levantamiento} codigoBarras={codigoBarras} codigoQR={codigoQR} />).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
  
      Swal.close(); // solo cerrar cuando termine
    } catch (error) {
      console.error("Error al generar PDF:", error);
      Swal.fire({
        title: "Error...",
        text: "Hubo un error al generar el PDF.",
        icon: "error",
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };  

  // Función para extraer los datos relevantes
  const extractData = (levantamiento) => {
    return {
      id: levantamiento.id,
      creado_por: levantamiento.creado_por,
      nombre_creado_por: levantamiento.nombre_creado_por,
      apellidos_creado_por: levantamiento.apellidos_creado_por,
      id_prospecto: levantamiento.prospecto_id,
      nombre: levantamiento.nombre_prospecto,
      correo: levantamiento.correo_prospecto,
      marca: levantamiento.marca_prospecto,
      publico_objetivo: levantamiento.publico_objetivo,
      monto_inversion: levantamiento.monto_inversion,
      constancia: levantamiento.constancia_prospecto,
      odoo_id: levantamiento.odoo_id_prospecto,
      fecha_envio: levantamiento.createdAt,
      fecha_actualizacion: levantamiento.updatedAt,
    };
  };

  const filteredLevantamientos = levantamientos
    .map((levantamiento) => extractData(levantamiento))
    .filter(
      (levantamiento) =>
        (prospectosFilter === "todos" ||
          levantamiento.id_prospecto === prospectosFilter) &&
        (usuariosFilter === "todos" ||
          levantamiento.creado_por === usuariosFilter) &&
        Object.values(levantamiento)
          .filter((value) => value !== null && value !== undefined)
          .some((value) =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
    );

  const indexOfLastEvento = currentPage * itemsPerPage;
  const indexOfFirstEvento = indexOfLastEvento - itemsPerPage;
  const currentLevantamientos = filteredLevantamientos.slice(
    indexOfFirstEvento,
    indexOfLastEvento
  );
  const totalPages = Math.ceil(filteredLevantamientos.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

  const usuariosUnicos = Array.from(
    new Map(levantamientos.map((l) => [l.creado_por, l.usuario])).values()
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-4 text-sm text-muted-foreground">
        <a href="/inicio" className="hover:underline">
          Inicio
        </a>
        <ChevronRight className="mx-2 h-4 w-4" />
        <a
          href="/ventas/levantamiento_requerimientos"
          className="font-bold hover:underline text-primary"
        >
          Administrador de levantamiento de requerimientos
        </a>
      </div>

      <h1 className="text-2xl font-bold mb-6">
        Administrador de levantamiento de requerimientos
      </h1>

      <div className="flex justify-between mb-4">
        <div className="flex gap-4 flex-wrap">
          <div className="flex flex-col">
            <Label htmlFor="levantamiento_search" className="mb-2">
              Buscar levantamiento
            </Label>
            <div className="relative">
              <SearchIcon
                className="absolute h-5 w-5 text-gray-400"
                style={{
                  top: "50%",
                  left: "15px",
                  transform: "translateY(-50%)",
                }}
              />
              <Input
                placeholder="Buscar levantamiento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-2 bg-gray-700 rounded-md text-white"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <Label htmlFor="usuario_filter" className="mb-2">
              Filtrar por usuario
            </Label>
            <Select
              onValueChange={setUsuariosFilter}
              defaultValue={usuariosFilter}
            >
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Filtrar por usuario" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los usuarios</SelectItem>
                {usuariosUnicos.length > 0 ? (
                  usuariosUnicos.map((usuario) => (
                    <SelectItem key={usuario.id} value={usuario.id}>
                      {usuario.nombre} {usuario.apellidos}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled>No hay usuarios disponibles</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col">
            <Label htmlFor="prospecto_filter" className="mb-2">
              Filtrar por prospecto
            </Label>
            <Select
              onValueChange={setProspectosFilter}
              defaultValue={prospectosFilter}
            >
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Filtrar por prospecto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los prospectos</SelectItem>
                {prospectos.length > 0 ? (
                  prospectos.map((prospecto) => (
                    <SelectItem key={prospecto.id} value={prospecto.id}>
                      {prospecto.nombre}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled>
                    No hay prospectos disponibles
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-end ml-auto">
          <Link href="/ventas/levantamiento_requerimientos/nuevo_levantamiento">
            <Button>
              <ClipboardList className="h-4 w-4" />
              Añadir nuevo levantamiento
            </Button>
          </Link>
        </div>
      </div>

      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Creado por</TableHead>
            <TableHead>Nombre del prospecto</TableHead>
            <TableHead>Correo electrónico</TableHead>
            <TableHead>Marca</TableHead>
            <TableHead>Monto de inversión</TableHead>
            <TableHead>Fecha de creación</TableHead>
            <TableHead>Fecha de actualización</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentLevantamientos.length > 0 ? (
            currentLevantamientos.map((levantamiento, index) => (
              <TableRow key={index}>
                <TableCell>
                  {levantamiento.nombre_creado_por +
                    " " +
                    levantamiento.apellidos_creado_por || "Sin datos"}
                </TableCell>
                <TableCell>{levantamiento.nombre || "Sin datos"}</TableCell>
                <TableCell>{levantamiento.correo || "Sin datos"}</TableCell>
                <TableCell>{levantamiento.marca || "Sin datos"}</TableCell>
                <TableCell>
                  {levantamiento.monto_inversion || "Sin datos"}
                </TableCell>
                <TableCell>
                  {levantamiento.fecha_envio
                    ? `${new Date(levantamiento.fecha_envio).toLocaleDateString(
                        "es-ES",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )} ${new Date(
                        levantamiento.fecha_envio
                      ).toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false, // Cambiar a true si prefieres formato de 12 horas
                      })}`
                    : "Sin datos"}
                </TableCell>
                <TableCell>
                  {levantamiento.fecha_actualizacion
                    ? `${new Date(
                        levantamiento.fecha_actualizacion
                      ).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })} ${new Date(
                        levantamiento.fecha_actualizacion
                      ).toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false, // Cambiar a true si prefieres formato de 12 horas
                      })}`
                    : "Sin datos"}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Link href={`/ventas/levantamiento_requerimientos/detalle_levantamiento/${levantamiento.id}`}><Button variant="outline" size="sm">Detalle</Button></Link>
                    {/*<Link href={`/ventas/levantamiento_requerimientos/referencias?id=${levantamiento.id}`}><Button variant="outline" size="sm">Referencias</Button></Link>
                    <Link href={`/ventas/levantamiento_requerimientos/formulaciones?id=${levantamiento.id}`}><Button variant="outline" size="sm">Formulaciones</Button></Link>
                    <Link href={`/ventas/levantamiento_requerimientos/etiquetado?id=${levantamiento.id}`}><Button variant="outline" size="sm">Etiquetado</Button></Link>
                    <Link href={`/ventas/levantamiento_requerimientos/distribuidores?id=${levantamiento.id}`}><Button variant="outline" size="sm">Distribuidores</Button></Link>
                    <Link href={`/ventas/levantamiento_requerimientos/nombre_producto?id=${levantamiento.id}`}><Button variant="outline" size="sm">Nombre del producto</Button></Link>*/}
                    <Button variant="outline" size="sm" onClick={() => levantamientoAPDF(levantamiento.id)}>Generar PDF</Button>
                    <Link href={`/ventas/levantamiento_requerimientos/editar_levantamiento?id=${levantamiento.id}`}><Button variant="outline" size="sm">Editar</Button></Link>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(levantamiento.id)}>Eliminar</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                No se encontraron levantamientos
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
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

function Spinner() {
  return <div className="spinner" />;
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
