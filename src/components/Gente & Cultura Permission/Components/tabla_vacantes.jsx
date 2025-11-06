"use client";

import { useState, useEffect } from "react";
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
import axios from "axios";
import Swal from "sweetalert2";
import styles from "../../../../public/CSS/spinner.css";
import { useSession } from "next-auth/react";
import { CardTitle } from "@/components/ui/card";
import { Button as Button2 } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUserContext } from "@/utils/userContext";

export function TablaVacantes() {
  const { userData, loading } = useUserContext();
  const permisos = userData?.user?.permisos || {};
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("0");
  const [eventos, setEventos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [users, setUsers] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [vacante, setVacante] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [gerencia, setGerencia] = useState("");
  const [proceso_actual, setProcesoActual] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [salarioMin, setSalarioMin] = useState("");
  const [salarioMax, setSalarioMax] = useState("");
  const [fecha_apertura, setFechaApertura] = useState("");
  const [fecha_ingreso, setFechaIngreso] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [selectedVacant, setSelectedVacant] = useState(null);
  const [departmentFilter, setDepartmentFilter] = useState("todos");

  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const response = await axios.get("/api/Users/getDepartamentos");
        if (response.data.success) {
          setDepartamentos(response.data.departments);
        } else {
          console.error(
            "Error al obtener los departamentos:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Error al hacer fetch de los departamentos:", error);
      }
    };

    fetchDepartamentos();
  }, []);

  // Función para verificar si el usuario tiene permiso en la sección y campo específicos
  const tienePermiso = (seccion, campo) =>
    permisos?.campo?.[seccion]?.includes(campo) ?? false;

  const encabezados = [
    "Vacante",
    "Cantidad",
    "Gerencia",
    "Proceso actual",
    "Ubicación",
    permisos && tienePermiso("Gente y Cultura", "Vacantes sin sueldo")
      ? ""
      : permisos && tienePermiso("Gente y Cultura", "Vacantes")
      ? "Salario"
      : "",
    "Fecha de apertura",
    "Ingreso",
    "Observaciones",
    "Acción",
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/Users/getUsers");
        if (response.data.success) {
          setUsers(response.data.users);
        } else {
          console.error(
            "Error al obtener los usuarios:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Error al hacer fetch de los usuarios:", error);
      }
    };

    fetchUsers();
  }, []);

  const [ubicaciones, setUbicaciones] = useState([
    "Tepeyac",
    "Tilma",
    "Colli",
    "Paraísos",
    "Eca",
  ]);

  const [esEditable, setEsEditable] = useState(false);
  const [nuevaUbicacion, setNuevaUbicacion] = useState("");

  const handleAgregarUbicacion = () => {
    if (nuevaUbicacion && !ubicaciones.includes(nuevaUbicacion)) {
      setUbicaciones((prev) => [...prev, nuevaUbicacion]);
      setUbicacion(nuevaUbicacion);
    }
    setEsEditable(false);
    setNuevaUbicacion("");
  };

  const handleEditForm = async (index) => {
    try {
      const response = await fetch(
        `/api/Gente&CulturaVacants/obtenerVacante?id=${index}`
      );
      const data = await response.json();
      setVacante(data.vacante);
      setCantidad(data.cantidad);
      setGerencia(data.gerencia);
      setProcesoActual(data.proceso_actual);
      setUbicacion(data.ubicacion);
      const salario = data.salario;
      const [salarioMin, salarioMax] = salario.split("-");
      setSalarioMin(salarioMin);
      setSalarioMax(salarioMax);
      setFechaApertura(data.fecha_apertura);
      setFechaIngreso(data.fecha_ingreso);
      setObservaciones(data.observaciones);
    } catch (error) {
      console.error("Error al obtener el formulario:", error);
    }
  };

  const handleChangeStatus = async (index, nuevoEstatus) => {
    try {
      const response = await axios.post(
        `/api/Gente&CulturaVacants/actualizarEstatusVacantes`,
        { id: index, estatus: nuevoEstatus } // Envías los datos correctamente
      );

      if (response.status === 200) {
        // Actualizar el estado local sin recargar la página
        fetchEventos();

        // Mostrar mensaje de éxito
        Swal.fire(
          "Actualizado",
          "El estatus de la vacante ha sido actualizado con éxito",
          "success"
        );
      } else {
        Swal.fire(
          "Error",
          "Error al actualizar el estatus de la vacante",
          "error"
        );
      }
    } catch (error) {
      console.error("Error al actualizar el estatus de la vacante:", error);
      Swal.fire(
        "Error",
        "Ocurrió un error al intentar actualizar el estatus de la vacante",
        "error"
      );
    }
  };

  // Obtener eventos desde el backend
  const fetchEventos = async () => {
    try {
      const response = await axios.get("/api/Gente&CulturaVacants/getVacantes"); // Asegúrate de que esta ruta esté configurada en tu backend
      setEventos(response.data);
    } catch (error) {
      console.error("Error al obtener eventos:", error);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    return isoDate.split("T")[0]; // Extraer "YYYY-MM-DD"
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      return;
    }
    try {
      const response = await fetch(
        "/api/Gente&CulturaVacants/guardarVacantes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vacante,
            cantidad,
            gerencia,
            proceso_actual,
            ubicacion,
            salarioMin,
            salarioMax,
            fecha_apertura,
            fecha_ingreso,
            observaciones,
          }), // Enviar todo el objeto formData como JSON
        }
      );
      if (response.ok) {
        Swal.fire({
          title: "Creada",
          text: "La vacante ha sido creada correctamente",
          icon: "success",
          timer: 3000, // La alerta desaparecerá después de 1.5 segundos
          showConfirmButton: false,
        }).then(() => {
          window.location.href = "/gente_y_cultura/vacantes";
        });
      } else {
        Swal.fire("Error", "Error al crear la vacante", "error");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (index) => {
    try {
      // Mostrar alerta de confirmación
      const result = await Swal.fire({
        title: "¿Deseas eliminar la vacante?",
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
          `/api/Gente&CulturaVacants/eliminarVacantes?id=${index}`
        );
        if (response.status === 200) {
          await Swal.fire(
            "Eliminado",
            "La vacante ha sido eliminada correctamente",
            "success"
          );
          window.location.href = "/gente_y_cultura/vacantes";
        } else {
          Swal.fire("Error", "Error al eliminar la vacante", "error");
        }
      }
    } catch (error) {
      console.error("Error al eliminar la vacante:", error);
      Swal.fire(
        "Error",
        "Ocurrió un error al intentar eliminar la vacante",
        "error"
      );
    }
  };

  // Función para extraer los datos relevantes
  const extractData = (evento) => {
    return {
      id: evento.id,
      vacante: evento.vacante,
      cantidad: evento.cantidad,
      gerencia: evento.departamento.nombre,
      proceso_actual: evento.proceso_actual,
      ubicacion: evento.ubicacion,
      salario: evento.salario,
      fecha_apertura: evento.fecha_apertura,
      fecha_ingreso: evento.fecha_ingreso,
      observaciones: evento.observaciones,
      accion: (index) => (
        <div style={{ display: "flex", gap: "1px" }}>
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
          <Button
            style={{ width: "1px", height: "40px" }}
            onClick={() => handleEditForm(index)}
          >
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
        </div>
      ),
    };
  };

  const filteredEventos = eventos.map(extractData).filter((evento) => {
    // Filtrar por tipo estatus
    if (
      statusFilter !== "0" &&
      evento.proceso_actual.toString() !== statusFilter
    ) {
      return false;
    }

    // Filtrar por departamento
    if (departmentFilter !== "todos" && evento.gerencia !== departmentFilter) {
      return false;
    }

    // Filtrar por término de búsqueda
    const values = Object.values(evento).filter(
      (value) => value !== null && value !== undefined
    );
    if (
      !values.some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    ) {
      return false;
    }

    if (!evento.fecha_apertura) return true;

    const fechaEvento = new Date(evento.fecha_apertura); // 🔹 Reemplaza espacio por "T" para evitar errores en Safari
    fechaEvento.setUTCHours(0, 0, 0, 0); // 🔹 Normalizar la fecha

    // Filtrar por fecha de inicio
    if (startDate) {
      const fechaInicioFiltro = new Date(startDate);
      fechaInicioFiltro.setUTCHours(0, 0, 0, 0); // 🔹 Normalizar la fecha

      if (fechaEvento < fechaInicioFiltro) {
        return false;
      }
    }

    // Filtrar por fecha de fin
    if (endDate) {
      const fechaFinFiltro = new Date(endDate);
      fechaFinFiltro.setUTCHours(23, 59, 59, 999); // 🔹 Asegurar que incluya el día completo

      if (fechaEvento > fechaFinFiltro) {
        return false;
      }
    }

    return true;
  });

  const { data: session, status } = useSession();

  if (status === "loading" || permisos === null || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className={styles.spinner} />
        <p className="ml-3">Cargando...</p>
      </div>
    );
  }

  if (status == "loading" || loading) {
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

  const handleEditVacant = (vacantId) => {
    const vacantToEdit = eventos.find((vacant) => vacant.id === vacantId); // Buscar el usuario en el estado
    setSelectedVacant(vacantToEdit); // Establecer el usuario seleccionado en el estado
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/Gente&CulturaVacants/actualizarVacante", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedVacant.id,
          vacante: selectedVacant.vacante,
          cantidad: selectedVacant.cantidad,
          gerencia: selectedVacant.gerencia,
          proceso_actual: selectedVacant.proceso_actual,
          ubicacion: selectedVacant.ubicacion,
          salarioMin: selectedVacant.salario?.split("-")[0],
          salarioMax: selectedVacant.salario?.split("-")[1],
          fecha_apertura: selectedVacant.fecha_apertura,
          fecha_ingreso: selectedVacant.fecha_ingreso,
          observaciones: selectedVacant.observaciones,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Hubo un problema al actualizar el usuario");
        return;
      }

      if (res.ok) {
        Swal.fire({
          title: "Actualizada",
          text: "Los datos de la vacante se han actualizado correctamente",
          icon: "success",
          timer: 3000, // La alerta desaparecerá después de 1.5 segundos
          showConfirmButton: false,
        }).then(() => {
          window.location.href = "/gente_y_cultura/vacantes";
        });
      } else {
        Swal.fire(
          "Error",
          "Error al actualizar los datos de la vacante",
          "error"
        );
      }
    } catch (err) {
      console.error("Error en la actualización:", err);
      setError(
        "Hubo un problema con la actualización. Por favor, intenta nuevamente."
      );
    }
  };

  const formularioCompleto = () => {
    return (
      vacante &&
      cantidad &&
      gerencia &&
      proceso_actual &&
      salarioMin &&
      salarioMax &&
      fecha_apertura &&
      observaciones
    );
  };

  const handleCleanForm = () => {
    setVacante("");
    setCantidad("");
    setGerencia("");
    setProcesoActual("");
    setUbicacion("");
    setSalarioMin("");
    setSalarioMax("");
    setFechaApertura("");
    setFechaIngreso("");
    setObservaciones("");
  };

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
        <CardTitle className="text-3xl font-bold">Vacantes</CardTitle>
      </div>
      <div className="flex justify-between mb-4">
        <Dialog>
          <DialogTrigger asChild>
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
              }}
              onClick={handleCleanForm}
            >
              <UserPlus className="h-4 w-4" /> Añadir vacante
            </Button>
          </DialogTrigger>

          <DialogContent
            onInteractOutside={(event) => event.preventDefault()}
            className="border-none p-0 overflow-y-auto"
            style={{
              width: "100%", // Ajusta el ancho
              maxWidth: "1000px", // Límite del ancho
              height: "70vh", // Ajusta la altura
              maxHeight: "80vh", // Límite de la altura
              padding: "20px", // Margen interno
              marginLeft: "120px",
            }}
          >
            <DialogHeader>
              <DialogTitle>Nueva vacante</DialogTitle>
              <DialogDescription>
                Ingresa los detalles de la vacante.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-1">
                  <div className="space-y-2 col-span-1">
                    <Label htmlFor="vacante">Vacante*</Label>
                    <Input
                      id="vacante"
                      name="vacante"
                      placeholder="..."
                      value={vacante}
                      onChange={(e) => setVacante(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 col-span-1">
                    <Label htmlFor="cantidad">Cantidad*</Label>
                    <Input
                      id="cantidad"
                      name="cantidad"
                      type="number"
                      placeholder="#"
                      value={cantidad}
                      onChange={(e) => setCantidad(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div className="space-y-2 col-span-1">
                    <Label htmlFor="vacante">Gerencia*</Label>
                    <Select
                      value={gerencia}
                      onValueChange={(value) => {
                        setGerencia(value); // Actualizar departamento seleccionado
                      }}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Seleccione la gerencia" />
                      </SelectTrigger>
                      <SelectContent>
                        {departamentos.length > 0 ? (
                          departamentos.map((dep) => (
                            <SelectItem
                              key={dep.id.toString()}
                              value={dep.id.toString()}
                            >
                              {dep.nombre}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem disabled>
                            No hay departamentos disponibles
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 col-span-1">
                    <Label htmlFor="cantidad">Proceso actual*</Label>
                    <Select
                      value={proceso_actual}
                      onValueChange={(value) => {
                        setProcesoActual(value); // Actualizar departamento seleccionado
                      }}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Seleccione el proceso actual" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Vacante</SelectItem>
                        <SelectItem value="2">
                          Vacante próxima a publicarse
                        </SelectItem>
                        <SelectItem value="3">Análisis de perfiles</SelectItem>
                        <SelectItem value="4">
                          En proceso de entrevistas
                        </SelectItem>
                        <SelectItem value="5">Contratación</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div className="space-y-2 col-span-1">
                    <Label htmlFor="ubicacion">Ubicación</Label>
                    <div className="col-span-1">
                      {!esEditable ? (
                        <Select
                          value={ubicacion}
                          onValueChange={(value) => {
                            if (value === "nueva") {
                              setEsEditable(true);
                            } else {
                              setUbicacion(value);
                            }
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona una ubicación" />
                          </SelectTrigger>
                          <SelectContent>
                            {ubicaciones.map((ubic, idx) => (
                              <SelectItem key={idx} value={ubic}>
                                {ubic}
                              </SelectItem>
                            ))}
                            <SelectItem
                              value="nueva"
                              className="inline-flex items-center"
                            >
                              + Agregar nueva ubicación
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Input
                            type="text"
                            placeholder="Nueva ubicación"
                            value={nuevaUbicacion}
                            onChange={(e) => setNuevaUbicacion(e.target.value)}
                            autoFocus
                          />
                          <Button2
                            type="button"
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                            onClick={handleAgregarUbicacion}
                          >
                            Agregar
                          </Button2>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 col-span-1">
                    <Label htmlFor="salario">Salario*</Label>
                    <div className="flex items-center">
                      <div className="flex items-center gap-2">
                        <Label className="ml-2">Min*</Label>
                        <Input
                          id="salarioMin"
                          type="number"
                          placeholder="$"
                          value={salarioMin}
                          onChange={(e) => setSalarioMin(e.target.value)}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="ml-2">Max*</Label>
                        <Input
                          id="salarioMax"
                          type="number"
                          placeholder="$"
                          value={salarioMax}
                          onChange={(e) => setSalarioMax(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div className="space-y-2 col-span-1">
                    <Label htmlFor="fecha_apertura">Fecha de apertura*</Label>
                    <Input
                      id="fecha_apertura"
                      type="date"
                      value={fecha_apertura}
                      onChange={(e) => setFechaApertura(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 col-span-1">
                    <Label htmlFor="fecha_ingreso">Fecha de ingreso</Label>
                    <Input
                      id="fecha_ingreso"
                      type="date"
                      value={fecha_ingreso}
                      onChange={(e) => setFechaIngreso(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="observaciones">Observaciones*</Label>
                    <Textarea
                      id="observaciones"
                      placeholder="..."
                      value={observaciones}
                      onChange={(e) => setObservaciones(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button2 type="submit" disabled={!formularioCompleto()}>
                  Agregar vacante
                </Button2>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
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
        <div>
          <Label htmlFor="status-filter" className="mb-2 block">
            Fecha inicio
          </Label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Fecha inicio"
            style={{ width: "150px" }}
          />
        </div>
        <div>
          <Label htmlFor="status-filter" className="mb-2 block">
            Fecha fin
          </Label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="Fecha fin"
            style={{ width: "150px" }}
          />
        </div>
        <div className="w-full sm:w-1/3">
          <Label htmlFor="status-filter" className="mb-2 block">
            Filtrar por departamento
          </Label>
          <Select
            onValueChange={setDepartmentFilter}
            defaultValue={departmentFilter}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filtrar por departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los departamentos</SelectItem>
              {departamentos.length > 0 ? (
                departamentos.map((dep) => (
                  <SelectItem key={dep.nombre} value={dep.nombre}>
                    {dep.nombre}
                  </SelectItem>
                ))
              ) : (
                <SelectItem disabled>
                  No hay departamentos disponibles
                </SelectItem>
              )}
            </SelectContent>
          </Select>
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
              <SelectItem value="0">Todos</SelectItem>
              <SelectItem value="1">Vacante</SelectItem>
              <SelectItem value="2">Vacante próxima a publicarse</SelectItem>
              <SelectItem value="3">Análisis de perfiles</SelectItem>
              <SelectItem value="4">En proceso de entrevistas</SelectItem>
              <SelectItem value="5">Contratación</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableCaption>
            Vacantes actuales y progreso en el proceso de selección
          </TableCaption>
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
                  {/* Renderiza las celdas aquí */}
                  <TableCell>
                    {evento.vacante || "Sin vacante especificada"}
                  </TableCell>
                  <TableCell>
                    {evento.cantidad || "Sin cantidad especificada"}
                  </TableCell>
                  <TableCell>
                    {evento.gerencia || "Sin gerencia especificada"}
                  </TableCell>
                  <TableCell
                    style={{
                      color: (() => {
                        switch (evento.proceso_actual) {
                          case 1:
                            return "red";
                          case 2:
                            return "orange";
                          case 3:
                            return "orange";
                          case 4:
                            return "orange";
                          case 5:
                            return "green";
                          default:
                            return "black"; // color por defecto
                        }
                      })(),
                    }}
                  >
                    <Select
                      className="w-full min-w-[300px] max-w-[400px]"
                      value={evento.proceso_actual.toString()}
                      onValueChange={(value) =>
                        handleChangeStatus(evento.id, value)
                      }
                    >
                      <SelectTrigger
                        id="proceso_actual"
                        className="w-full min-w-[300px] max-w-[400px]"
                      >
                        <SelectValue placeholder="Selecciona una opción" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Vacante</SelectItem>
                        <SelectItem value="2">
                          Vacante próxima a publicarse
                        </SelectItem>
                        <SelectItem value="3">Análisis de perfiles</SelectItem>
                        <SelectItem value="4">
                          En proceso de entrevistas
                        </SelectItem>
                        <SelectItem value="5">Contratación</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {evento.ubicacion || "Sin ubicación especificada"}
                  </TableCell>
                  {tienePermiso("Gente y Cultura", "Vacantes sin sueldo") ? (
                    <TableCell></TableCell>
                  ) : tienePermiso("Gente y Cultura", "Vacantes") ? (
                    <TableCell>
                      {evento.salario || "Sin salario especificado"}
                    </TableCell>
                  ) : (
                    <TableCell></TableCell>
                  )}
                  <TableCell>
                    {evento.fecha_apertura
                      ? `${new Date(evento.fecha_apertura).toLocaleDateString(
                          "es-ES",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )}`
                      : "Sin datos"}
                  </TableCell>
                  <TableCell>
                    {evento.fecha_ingreso
                      ? `${new Date(evento.fecha_ingreso).toLocaleDateString(
                          "es-ES",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )}`
                      : "Sin datos"}
                  </TableCell>
                  <TableCell>
                    {evento.observaciones || "Sin observaciones especificadas"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button2
                            onClick={() => handleEditVacant(evento.id)}
                            variant="outline"
                            size="sm"
                          >
                            Editar
                          </Button2>
                        </DialogTrigger>
                        <DialogContent
                          onInteractOutside={(event) => event.preventDefault()}
                          className="border-none p-0 overflow-y-auto"
                          style={{
                            width: "100%", // Ajusta el ancho
                            maxWidth: "1000px", // Límite del ancho
                            height: "70vh", // Ajusta la altura
                            maxHeight: "80vh", // Límite de la altura
                            padding: "20px", // Margen interno
                            marginLeft: "120px",
                          }}
                        >
                          <DialogHeader>
                            <DialogTitle>Editar vacante</DialogTitle>
                            <DialogDescription>
                              Actualiza los detalles necesarios de la vacante.
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleSubmitUpdate}>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-2 gap-1">
                                <div className="space-y-2 col-span-1">
                                  <Label htmlFor="vacante">Vacante</Label>
                                  <Input
                                    id="vacante"
                                    name="vacante"
                                    placeholder="..."
                                    value={selectedVacant?.vacante || ""}
                                    onChange={(e) =>
                                      setSelectedVacant({
                                        ...selectedVacant,
                                        vacante: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="space-y-2 col-span-1">
                                  <Label htmlFor="cantidad">Cantidad</Label>
                                  <Input
                                    id="cantidad"
                                    name="cantidad"
                                    type="number"
                                    placeholder="#"
                                    value={selectedVacant?.cantidad || ""}
                                    onChange={(e) =>
                                      setSelectedVacant({
                                        ...selectedVacant,
                                        cantidad: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-1">
                                <div className="space-y-2 col-span-1">
                                  <Label htmlFor="vacante">Gerencia</Label>
                                  <Select
                                    value={selectedVacant?.gerencia || ""} // Usar el valor del departamento del usuario seleccionado
                                    onValueChange={(value) => {
                                      setSelectedVacant((prevUser) => ({
                                        ...prevUser,
                                        gerencia: value, // Actualizar el departamento del usuario seleccionado
                                      }));
                                    }}
                                  >
                                    <SelectTrigger className="col-span-3">
                                      <SelectValue placeholder="Seleccione la gerencia" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {departamentos.length > 0 ? (
                                        departamentos.map((dep) => (
                                          <SelectItem
                                            key={dep.id.toString()}
                                            value={dep.id.toString()}
                                          >
                                            {dep.nombre}
                                          </SelectItem>
                                        ))
                                      ) : (
                                        <SelectItem disabled>
                                          No hay departamentos disponibles
                                        </SelectItem>
                                      )}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2 col-span-1">
                                  <Label htmlFor="cantidad">
                                    Proceso actual
                                  </Label>
                                  <Select
                                    value={
                                      selectedVacant?.proceso_actual.toString() ||
                                      ""
                                    } // Usar el valor del departamento del usuario seleccionado
                                    onValueChange={(value) => {
                                      setSelectedVacant((prevUser) => ({
                                        ...prevUser,
                                        proceso_actual: value, // Actualizar el departamento del usuario seleccionado
                                      }));
                                    }}
                                  >
                                    <SelectTrigger className="col-span-3">
                                      <SelectValue placeholder="Seleccione el proceso actual" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="1">Vacante</SelectItem>
                                      <SelectItem value="2">
                                        Vacante próxima a publicarse
                                      </SelectItem>
                                      <SelectItem value="3">
                                        Análisis de perfiles
                                      </SelectItem>
                                      <SelectItem value="4">
                                        En proceso de entrevistas
                                      </SelectItem>
                                      <SelectItem value="5">
                                        Contratación
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-1">
                                <div className="space-y-2 col-span-1">
                                  <Label htmlFor="ubicacion">Ubicación</Label>
                                  <div className="col-span-3">
                                    {!esEditable ? (
                                      <Select
                                        value={selectedVacant?.ubicacion || ""}
                                        onValueChange={(value) => {
                                          if (value === "nueva") {
                                            setEsEditable(true);
                                          } else {
                                            setUbicacion(value);
                                            setSelectedVacant((prev) => ({
                                              ...prev,
                                              ubicacion: value,
                                            }));
                                          }
                                        }}
                                      >
                                        <SelectTrigger className="w-full">
                                          <SelectValue placeholder="Selecciona una ubicación" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {/* Agregar dinámicamente la ubicación seleccionada si no está en la lista */}
                                          {!ubicaciones.includes(
                                            selectedVacant?.ubicacion
                                          ) &&
                                            selectedVacant?.ubicacion && (
                                              <SelectItem
                                                value={selectedVacant.ubicacion}
                                              >
                                                {selectedVacant.ubicacion}
                                              </SelectItem>
                                            )}
                                          {ubicaciones.map((ubic, idx) => (
                                            <SelectItem key={idx} value={ubic}>
                                              {ubic}
                                            </SelectItem>
                                          ))}
                                          <SelectItem
                                            value="nueva"
                                            className="inline-flex items-center"
                                          >
                                            + Agregar nueva ubicación
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    ) : (
                                      <div className="flex items-center gap-2">
                                        <Input
                                          type="text"
                                          placeholder="Nueva ubicación"
                                          value={nuevaUbicacion}
                                          onChange={(e) =>
                                            setNuevaUbicacion(e.target.value)
                                          }
                                          autoFocus
                                        />
                                        <Button2
                                          type="button"
                                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                          onClick={handleAgregarUbicacion}
                                        >
                                          Agregar
                                        </Button2>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="space-y-2 col-span-1">
                                  <Label htmlFor="salario">Salario</Label>
                                  <div className="flex items-center">
                                    <div className="flex items-center gap-2">
                                      <Label className="ml-2">Min</Label>
                                      <Input
                                        id="salarioMin"
                                        type="number"
                                        placeholder="$"
                                        value={
                                          selectedVacant?.salario?.split(
                                            "-"
                                          )[0] || ""
                                        } // Valor mínimo
                                        onChange={(e) =>
                                          setSelectedVacant({
                                            ...selectedVacant,
                                            salario: `${e.target.value}-${
                                              selectedVacant?.salario?.split(
                                                "-"
                                              )[1] || ""
                                            }`, // Actualiza el salario completo
                                          })
                                        }
                                      />
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Label className="ml-2">Max</Label>
                                      <Input
                                        id="salarioMax"
                                        type="number"
                                        placeholder="$"
                                        value={
                                          selectedVacant?.salario?.split(
                                            "-"
                                          )[1] || ""
                                        } // Valor máximo
                                        onChange={(e) =>
                                          setSelectedVacant({
                                            ...selectedVacant,
                                            salario: `${
                                              selectedVacant?.salario?.split(
                                                "-"
                                              )[0] || ""
                                            }-${e.target.value}`, // Actualiza el salario completo
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-1">
                                <div className="space-y-2 col-span-1">
                                  <Label htmlFor="fecha_apertura">
                                    Fecha de apertura
                                  </Label>
                                  <Input
                                    id="fecha_apertura"
                                    type="date"
                                    value={formatDate(
                                      selectedVacant?.fecha_apertura
                                    )}
                                    onChange={(e) =>
                                      setSelectedVacant({
                                        ...selectedVacant,
                                        fecha_apertura: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="space-y-2 col-span-1">
                                  <Label htmlFor="fecha_ingreso">
                                    Fecha de ingreso
                                  </Label>
                                  <Input
                                    id="fecha_ingreso"
                                    type="date"
                                    value={formatDate(
                                      selectedVacant?.fecha_ingreso
                                    )}
                                    onChange={(e) =>
                                      setSelectedVacant({
                                        ...selectedVacant,
                                        fecha_ingreso: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-1">
                                <div className="space-y-2 col-span-2">
                                  <Label htmlFor="observaciones">
                                    Observaciones
                                  </Label>
                                  <Textarea
                                    id="observaciones"
                                    placeholder="..."
                                    value={selectedVacant?.observaciones || ""}
                                    onChange={(e) =>
                                      setSelectedVacant({
                                        ...selectedVacant,
                                        observaciones: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button2 type="submit">
                                Actualizar vacante
                              </Button2>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <Button2
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(evento.id)}
                      >
                        Eliminar
                      </Button2>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center">
                  No se encontraron vacantes activas
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

function Spinner() {
  return <div className="spinner" />;
}
