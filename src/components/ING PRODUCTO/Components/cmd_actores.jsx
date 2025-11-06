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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import styles from "../../../../public/CSS/spinner.css";
import { ChevronRight, PackageOpen, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Swal from "sweetalert2";
import { useUser } from "@/pages/api/hooks";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users } from 'lucide-react';

export function CMDActores() {
  const [users, setUsers] = useState([]);
  const [actor, setActor] = useState("");
  const [tipo, setTipo] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [error, setError] = useState("");
  const [selectedActor, setSelectedActor] = useState(null);
  const [actores, setActores] = useState([]);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const { isMaster } = useUser();
  const [searchTermPass, setSearchTermPass] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [proveedores, setProveedores] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);

  useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedSearchTerm(searchTermPass);
      }, 500);
  
      return () => {
        clearTimeout(handler); // limpia el timeout si se escribe antes de los 3s
      };
    }, [searchTermPass]);

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

    useEffect(() => {
        const fetchActores = async () => {
          try {
            const response = await axios.get(
              "/api/ProductEngineering/getActores"
            );
            if (response.data.success) {
              setActores(response.data.actores);
            } else {
              console.error(
                "Error al obtener los actores:",
                response.data.message
              );
            }
          } catch (error) {
            console.error("Error al hacer fetch de los actores:", error);
          }
        };
    
        fetchActores();
      }, []);
    
      const getActores = async () => {
        try {
          const response = await axios.get(
            "/api/ProductEngineering/getActores"
          );
          if (response.data.success) {
            setActores(response.data.actores);
          } else {
            console.error(
              "Error al obtener los actores:",
              response.data.message
            );
          }
        } catch (error) {
          console.error("Error al hacer fetch de los actores:", error);
        }
      };

  const handleDelete = async (index) => {
    try {
      // Mostrar alerta de confirmación
      const result = await Swal.fire({
        title: "¿Deseas eliminar el actor?",
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
          `/api/ProductEngineering/eliminarActor?id=${index}`
        );
        if (response.status === 200) {
          await Swal.fire(
            "Eliminado",
            "El actor ha sido eliminado correctamente",
            "success"
          );
          getActores();
        } else {
          Swal.fire("Error", "Error al eliminar el actor", "error");
        }
      }
    } catch (error) {
      console.error("Error al eliminar el actor:", error);
      Swal.fire(
        "Error",
        "Ocurrió un error al intentar eliminar el actor",
        "error"
      );
    }
  };

  const userMap = Object.fromEntries(
    users.map((u) => [u.id, `${u.nombre} ${u.apellidos}`])
  );  

  const transformarActorParaBusqueda = (actorToTransform) => {
    const roles = {
      1: "Ingeniero de productos",
      2: "Calidad",
      3: "Ejecutivo de cuenta",
      4: "Diseño",
      5: "Nutrición",
    };
  
    return {
      ...actorToTransform,
      actor: userMap[actorToTransform.actor] || "Sin datos",
      tipo: roles[actorToTransform.tipo] || "Sin datos",
    };
  }; 

  // Función para extraer los datos relevantes
  const extractData = (actor) => {
    return {
      id: actor.id,
      actor: actor.user_id,
      tipo: actor.tipo,
    };
  };

  const filteredActors = actores
  .map((actor) => transformarActorParaBusqueda(extractData(actor)))
  .filter((actor) =>
    Object.values(actor)
      .filter((value) => value !== null && value !== undefined)
      .some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const indexOfLastEvento = currentPage * itemsPerPage;
  const indexOfFirstEvento = indexOfLastEvento - itemsPerPage;
  const currentActors = filteredActors.slice(
    indexOfFirstEvento,
    indexOfLastEvento
  );
  const totalPages = Math.ceil(filteredActors.length / itemsPerPage);
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

  const handleEditActor = (actorId) => {
    const actorToEdit = actores.find(
      (actor) => actor.id === actorId
    ); // Buscar el usuario en el estado
    setSelectedActor(actorToEdit); // Establecer el usuario seleccionado en el estado
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("actor", actor);
      formData.append("tipo", tipo);

      const res = await fetch("/api/ProductEngineering/guardarActores", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        Swal.fire("Error", data.message, "error");
        return;
      }

      if (res.ok) {
        setOpen(false);
        getActores();
        Swal.fire({
          title: "Creado",
          text: "El actor ha sido creado correctamente",
          icon: "success",
          timer: 3000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire("Error", "Error al crear el actor", "error");
      }
    } catch (err) {
      console.error("Error en el registro:", err);
      setError(
        "Hubo un problema con el registro. Por favor, intenta nuevamente."
      );
      Swal.fire("Error", "Hubo un problema con el registro", "error");
    }
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Agregar los datos del producto
    formData.append("id", selectedActor.id);
    formData.append("actor", selectedActor.user_id);
    formData.append("tipo", selectedActor.tipo);

    try {
      const res = await fetch("/api/ProductEngineering/actualizarActor", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Hubo un problema al actualizar el actor");
        Swal.fire("Error", data.message, "error");
        return;
      }

      if (res.ok) {
        setOpenEdit(false);
        getActores();
        Swal.fire({
          title: "Actualizado",
          text: "Los datos del actor se han actualizado correctamente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire("Error", "Error al actualizar el actor", "error");
      }
    } catch (err) {
      console.error("Error en la actualización:", err);
      setError(
        "Hubo un problema con la actualización. Por favor, intenta nuevamente."
      );
      Swal.fire("Error", "Hubo un problema con la actualización", "error");
    }
  };

  const handleCleanForm = () => {
    setActor("");
    setTipo("");
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-4 text-sm text-muted-foreground">
        <a href="/inicio" className="hover:underline">
          Inicio
        </a>
        <ChevronRight className="mx-2 h-4 w-4" />
        <a
          href="/configuraciones/cmd/actores"
          className="font-bold hover:underline text-primary"
        >
          Administrador de actores
        </a>
      </div>

      <h1 className="text-2xl font-bold mb-6">Administrador de actores</h1>

      <div className="flex justify-between mb-4">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar actor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCleanForm}>
              <Users className="h-4 w-4" />Añadir actor
            </Button>
          </DialogTrigger>

          <DialogContent
            onInteractOutside={(event) => event.preventDefault()}
            className="border-none p-5 overflow-y-auto w-full max-w-[80vh] max-h-[40vh] ml-[15vh] shadow-lg"
          >
            <DialogHeader>
              <DialogTitle className="flex justify-center items-center text-center">
                Nuevo actor
              </DialogTitle>
              <DialogDescription className="flex justify-center items-center text-center">
                Ingresa los detalles del actor.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div
                style={{ marginBottom: "15px" }}
                className="grid grid-cols-2 gap-1"
              >
                <div className="space-y-2">
                  <Label htmlFor="nombre">Actor</Label>
                <div className="mb-4">
                <Select id="actor" name="actor" value={actor || ''} onValueChange={(value) => { setActor(value); setSearchTermPass(""); }}>
                    <SelectTrigger>
                    <SelectValue placeholder="Seleccionar usuario" />
                    </SelectTrigger>
                    <SelectContent>
                    {/* Input dentro del Select para filtrar, sin afectar la selección */}
                    <div className="p-2">
                        <Input
                        placeholder="Buscar usuario..."
                        value={searchTermPass}
                        onChange={(e) => setSearchTermPass(e.target.value)}
                        onKeyDown={(e) => e.stopPropagation()} // Evitar selecciones accidentales con el teclado
                        />
                    </div>
                    
                    {/* Filtrado sin selección automática */}
                    {users.filter(user => 
                        user.nombre.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                        user.apellidos.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
                    ).length === 0 ? (
                        <div className="p-2 text-center text-gray-500">No se encontraron usuarios</div>
                    ) : (
                        users
                        .filter(user => 
                            user.nombre.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                            user.apellidos.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
                        )
                        .map(user => (
                            <SelectItem key={user.id.toString()} value={user.id.toString()}>
                            {user.nombre} {user.apellidos}
                            </SelectItem>
                        ))
                    )}
                    </SelectContent>
                </Select>
                </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo">Sección</Label>
                  <Select 
                    id="tipo" 
                    name="tipo" 
                    value={tipo || ''}
                    onValueChange={(value) => { setTipo(value); }}
                >
                <SelectTrigger><SelectValue placeholder="Seleccione la sección" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="1">Ingeniero de productos</SelectItem>
                    <SelectItem value="2">Calidad</SelectItem>
                    <SelectItem value="3">Ejecutivo de cuenta</SelectItem>
                    <SelectItem value="4">Diseño</SelectItem>
                    <SelectItem value="5">Nutrición</SelectItem>
                </SelectContent>
                </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={!actor || !tipo}>
                  Agregar actor
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/6">ID</TableHead>
            <TableHead className="w-3/6">Nombre</TableHead>
            <TableHead className="w-1/6">Sección</TableHead>
            <TableHead className="w-1/6">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentActors.length > 0 ? (
            currentActors.map((actor, index) => (
              <TableRow key={index}>
                <TableCell>{actor.id || "Sin datos"}</TableCell>
                <TableCell>{actor.actor || "Sin datos"}</TableCell>
              <TableCell>{actor.tipo || "Sin datos"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2">
                    <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => handleEditActor(actor.id)}
                          variant="outline"
                          size="sm"
                        >
                          Editar
                        </Button>
                      </DialogTrigger>
                      <DialogContent
                        onInteractOutside={(event) => event.preventDefault()}
                        className="border-none p-5 overflow-y-auto w-full max-w-[80vh] max-h-[40vh] ml-[15vh] shadow-md"
                      >
                        <DialogHeader>
                          <DialogTitle className="flex justify-center items-center text-center">Editar actor</DialogTitle>
                          <DialogDescription className="flex justify-center items-center text-center">
                            Actualiza los detalles necesarios del actor.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmitUpdate}>
                        <div
                            style={{ marginBottom: "15px" }}
                            className="grid grid-cols-2 gap-1"
                        >
                            <div className="space-y-2">
                            <Label htmlFor="nombre">Actor</Label>
                            <div className="mb-4">
                            <Select id="actor" name="actor" value={selectedActor?.user_id?.toString() || ''} onValueChange={(value) => {
                                setSelectedActor((prevActor) => ({
                                ...prevActor,
                                user_id: value, // Actualizar el departamento del usuario seleccionado
                                }));
                                setSearchTermPass("");
                            }}>
                                <SelectTrigger>
                                <SelectValue placeholder="Seleccionar usuario" />
                                </SelectTrigger>
                                <SelectContent>
                                {/* Input dentro del Select para filtrar, sin afectar la selección */}
                                <div className="p-2">
                                    <Input
                                    placeholder="Buscar usuario..."
                                    value={searchTermPass}
                                    onChange={(e) => setSearchTermPass(e.target.value)}
                                    onKeyDown={(e) => e.stopPropagation()} // Evitar selecciones accidentales con el teclado
                                    />
                                </div>
                                
                                {/* Filtrado sin selección automática */}
                                {users.filter(user => 
                                    user.nombre.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                                    user.apellidos.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
                                ).length === 0 ? (
                                    <div className="p-2 text-center text-gray-500">No se encontraron usuarios</div>
                                ) : (
                                    users
                                    .filter(user => 
                                        user.nombre.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                                        user.apellidos.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
                                    )
                                    .map(user => (
                                        <SelectItem key={user.id.toString()} value={user.id.toString()}>
                                        {user.nombre} {user.apellidos}
                                        </SelectItem>
                                    ))
                                )}
                                </SelectContent>
                            </Select>
                            </div>
                            </div>
                            <div className="space-y-2">
                            <Label htmlFor="tipo">Sección</Label>
                            <Select 
                                id="tipo" 
                                name="tipo" 
                                value={selectedActor?.tipo?.toString() || ''} onValueChange={(value) => {
                                    setSelectedActor((prevActor) => ({
                                    ...prevActor,
                                    tipo: value, // Actualizar el departamento del usuario seleccionado
                                    }));
                                }}
                            >
                            <SelectTrigger><SelectValue placeholder="Seleccione la sección" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Ingeniero de productos</SelectItem>
                                <SelectItem value="2">Calidad</SelectItem>
                                <SelectItem value="3">Ejecutivo de cuenta</SelectItem>
                                <SelectItem value="4">Diseño</SelectItem>
                                <SelectItem value="5">Nutrición</SelectItem>
                            </SelectContent>
                            </Select>
                            </div>
                        </div>
                          <DialogFooter>
                            <Button type="submit">Actualizar actor</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                    {isMaster ? (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(actor.id)}
                      >
                        Eliminar
                      </Button>
                    ) : (
                      <div hidden></div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No se encontraron actores
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

function ProductIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="6.5 6.7 35.1 34.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.03 17.58v12.8c0 2.53 1.56 4.8 3.92 5.71l10.91 4.22c1.42 0.55 3 0.55 4.42 0l10.91-4.22c2.36-0.91 3.92-3.18 3.92-5.71v-12.8c0-2.53-1.56-4.8-3.92-5.71L26.27 7.66c-1.42-0.55-3-0.55-4.42 0l-10.91 4.22c-2.36 0.91-3.92 3.18-3.92 5.71z" />
      <polyline points="8.3 13.85 24.06 19.59 39.76 14.25" />
      <line x1="15.25" y1="15.97" x2="32.23" y2="10.19" />
      <line x1="24.06" y1="19.59" x2="24.06" y2="40.5" />
      <g strokeWidth="3">
        <line x1="38" y1="7" x2="38" y2="13" />
        <line x1="35" y1="10" x2="41" y2="10" />
      </g>
    </svg>
  );
}