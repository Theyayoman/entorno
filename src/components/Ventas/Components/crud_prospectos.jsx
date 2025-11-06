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
import { ChevronRight, PackageOpen, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Swal from "sweetalert2";
import Link from "next/link";

export function Prospectos() {
  const [prospectos, setProspectos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
        title: "¿Deseas eliminar el prospecto?",
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
          `/api/Sales/eliminarProspecto?id=${index}`
        );
        if (response.status === 200) {
          await Swal.fire(
            "Eliminado",
            "El prospecto ha sido eliminado correctamente",
            "success"
          );
          getProspectos();
        } else {
          Swal.fire("Error", "Error al eliminar el prospecto", "error");
        }
      }
    } catch (error) {
      console.error("Error al eliminar el actor:", error);
      Swal.fire(
        "Error",
        "Ocurrió un error al intentar eliminar el prospecto",
        "error"
      );
    }
  };

  // Función para extraer los datos relevantes
  const extractData = (prospecto) => {
    return {
      id: prospecto.id,
      nombre: prospecto.nombre,
      telefono: prospecto.telefono,
      correo: prospecto.correo,
      marca: prospecto.marca,
      redes_sociales: prospecto.redes_sociales,
      constancia: prospecto.constancia,
      odoo_id: prospecto.odoo_id,
    };
  };

  const filteredProspectos = prospectos
    .map((prospecto) => extractData(prospecto))
    .filter((prospecto) =>
      Object.values(prospecto)
        .filter((value) => value !== null && value !== undefined)
        .some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

  const indexOfLastEvento = currentPage * itemsPerPage;
  const indexOfFirstEvento = indexOfLastEvento - itemsPerPage;
  const currentProspectos = filteredProspectos.slice(
    indexOfFirstEvento,
    indexOfLastEvento
  );
  const totalPages = Math.ceil(filteredProspectos.length / itemsPerPage);
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

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-4 text-sm text-muted-foreground">
        <a href="/inicio" className="hover:underline">
          Inicio
        </a>
        <ChevronRight className="mx-2 h-4 w-4" />
        <a
          href="/ventas/prospectos"
          className="font-bold hover:underline text-primary"
        >
          Administrador de prospectos
        </a>
      </div>

      <h1 className="text-2xl font-bold mb-6">Administrador de prospectos</h1>

      <div className="flex justify-between mb-4">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar prospecto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <div>
          <Link href="/ventas/prospectos/nuevo_prospecto">
            <Button>
              <ProspectosIcon className="h-4 w-4" />
              Añadir prospecto
            </Button>
          </Link>
        </div>
      </div>

      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>ID Odoo</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Correo electrónico</TableHead>
            <TableHead>Marca</TableHead>
            <TableHead>Redes sociales</TableHead>
            <TableHead>Constancia de situación fiscal</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentProspectos.length > 0 ? (
            currentProspectos.map((prospecto, index) => (
              <TableRow key={index}>
                <TableCell>{prospecto.odoo_id || "Sin datos"}</TableCell>
                <TableCell>{prospecto.nombre || "Sin datos"}</TableCell>
                <TableCell>{prospecto.telefono || "Sin datos"}</TableCell>
                <TableCell>{prospecto.correo || "Sin datos"}</TableCell>
                <TableCell>{prospecto.marca || "Sin datos"}</TableCell>
                <TableCell>{prospecto.redes_sociales || "Sin datos"}</TableCell>
                <TableCell>
                  {prospecto.constancia !== null
                    ? "Constancia agregada"
                    : "Sin constancia agregada"}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Link
                      href={`/ventas/prospectos/editar_prospecto/${prospecto.id}`}
                    >
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(prospecto.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                No se encontraron prospectos
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

function ProspectosIcon(props) {
  return (
    <svg
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
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="3" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="21" />
      <line x1="3" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="21" y2="12" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
