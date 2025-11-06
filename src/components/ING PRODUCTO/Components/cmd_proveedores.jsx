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

export function CMDProveedores() {
  const [nombre, setNombre] = useState("");
  const [proveedores, setProveedores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [error, setError] = useState("");
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const { isMaster } = useUser();

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await axios.get(
          "/api/ProductEngineering/getProveedores"
        );
        if (response.data.success) {
          setProveedores(response.data.proveedores);
        } else {
          console.error(
            "Error al obtener los proveedores:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Error al hacer fetch de los proveedores:", error);
      }
    };

    fetchProveedores();
  }, []);

  const getProveedores = async () => {
    try {
      const response = await axios.get(
        "/api/ProductEngineering/getProveedores"
      );
      if (response.data.success) {
        setProveedores(response.data.proveedores);
      } else {
        console.error(
          "Error al obtener los proveedores:",
          response.data.message
        );
      }
    } catch (error) {
      console.error("Error al hacer fetch de los proveedores:", error);
    }
  };

  const handleDelete = async (index) => {
    try {
      // Mostrar alerta de confirmación
      const result = await Swal.fire({
        title: "¿Deseas eliminar el proveedor?",
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
          `/api/ProductEngineering/eliminarProveedor?id=${index}`
        );
        if (response.status === 200) {
          await Swal.fire(
            "Eliminado",
            "El proveedor ha sido eliminado correctamente",
            "success"
          );
          getProveedores();
        } else {
          Swal.fire("Error", "Error al eliminar el proveedor", "error");
        }
      }
    } catch (error) {
      console.error("Error al eliminar el proveedor:", error);
      Swal.fire(
        "Error",
        "Ocurrió un error al intentar eliminar el proveedor",
        "error"
      );
    }
  };

  // Función para extraer los datos relevantes
  const extractData = (provider) => {
    return {
      id: provider.id,
      nombre: provider.nombre,
    };
  };

  // Filtrar eventos según el término de búsqueda y estatus
  const filteredProviders = proveedores.map(extractData).filter(
    (provider) =>
      Object.values(provider)
        .filter((value) => value !== null && value !== undefined) // Filtra valores nulos o indefinidos
        .some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        ) // Filtro por término de búsqueda
  );

  const indexOfLastEvento = currentPage * itemsPerPage;
  const indexOfFirstEvento = indexOfLastEvento - itemsPerPage;
  const currentUsers = filteredProviders.slice(
    indexOfFirstEvento,
    indexOfLastEvento
  );
  const totalPages = Math.ceil(filteredProviders.length / itemsPerPage);
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

  const handleEditProvider = (providerId) => {
    const providerToEdit = proveedores.find(
      (provider) => provider.id === providerId
    ); // Buscar el usuario en el estado
    setSelectedProvider(providerToEdit); // Establecer el usuario seleccionado en el estado
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("nombre", nombre);

      const res = await fetch("/api/ProductEngineering/guardarProveedores", {
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
        getProveedores();
        Swal.fire({
          title: "Creado",
          text: "El proveedor ha sido creado correctamente",
          icon: "success",
          timer: 3000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire("Error", "Error al crear el proveedor", "error");
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
    formData.append("id", selectedProvider.id);
    formData.append("nombre", selectedProvider.nombre);

    try {
      const res = await fetch("/api/ProductEngineering/actualizarProveedor", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Hubo un problema al actualizar el proveedor");
        Swal.fire("Error", data.message, "error");
        return;
      }

      if (res.ok) {
        setOpenEdit(false);
        getProveedores();
        Swal.fire({
          title: "Actualizado",
          text: "Los datos del proveedor se han actualizado correctamente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire("Error", "Error al actualizar el proveedor", "error");
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
    setNombre("");
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-4 text-sm text-muted-foreground">
        <a href="/inicio" className="hover:underline">
          Inicio
        </a>
        <ChevronRight className="mx-2 h-4 w-4" />
        <a
          href="/configuraciones/cmd/proveedores"
          className="font-bold hover:underline text-primary"
        >
          Administrador de proveedores
        </a>
      </div>

      <h1 className="text-2xl font-bold mb-6">Administrador de proveedores</h1>

      <div className="flex justify-between mb-4">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar proveedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCleanForm}>
              <PackageOpen className="h-4 w-4" /> Añadir proveedor
            </Button>
          </DialogTrigger>

          <DialogContent
            onInteractOutside={(event) => event.preventDefault()}
            className="border-none p-5 overflow-y-auto w-full max-w-[60vh] max-h-[40vh] ml-[15vh] shadow-lg"
          >
            <DialogHeader>
              <DialogTitle className="flex justify-center items-center text-center">
                Nuevo proveedor
              </DialogTitle>
              <DialogDescription className="flex justify-center items-center text-center">
                Ingresa los detalles del proveedor.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div
                style={{ marginBottom: "15px" }}
                className="grid grid-cols-2 gap-1"
              >
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    type="text"
                    placeholder="Nombre del proveedor"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={!nombre}>
                  Agregar proveedor
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
            <TableHead className="w-4/6">Nombre</TableHead>
            <TableHead className="w-1/6">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentUsers.length > 0 ? (
            currentUsers.map((user, index) => (
              <TableRow key={index}>
                <TableCell>{user.id || "Sin datos"}</TableCell>
                <TableCell>{user.nombre || "Sin datos"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2">
                    <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => handleEditProvider(user.id)}
                          variant="outline"
                          size="sm"
                        >
                          Editar
                        </Button>
                      </DialogTrigger>
                      <DialogContent
                        onInteractOutside={(event) => event.preventDefault()}
                        className="border-none p-5 overflow-y-auto w-full max-w-[60vh] max-h-[40vh] ml-[15vh] shadow-md"
                      >
                        <DialogHeader>
                          <DialogTitle className="flex justify-center items-center text-center">Editar proveedor</DialogTitle>
                          <DialogDescription className="flex justify-center items-center text-center">
                            Actualiza los detalles necesarios del proveedor.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmitUpdate}>
                          <div
                            style={{ marginBottom: "15px" }}
                            className="grid grid-cols-2 gap-1"
                          >
                            <div className="space-y-2 col-span-2">
                              <Label htmlFor="nombre">Nombre</Label>
                              <Input
                                id="nombre"
                                name="nombre"
                                value={selectedProvider?.nombre || ""}
                                onChange={(e) =>
                                  setSelectedProvider({
                                    ...selectedProvider,
                                    nombre: e.target.value,
                                  })
                                }
                                type="text"
                                placeholder="Nombre del proveedor"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit">Actualizar proveedor</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                    {isMaster ? (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
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
              <TableCell colSpan={3} className="text-center">
                No se encontraron proveedores
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
