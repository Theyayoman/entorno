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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { ChevronRight, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Swal from "sweetalert2";

export function EmpresasTabla() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [statusFilter, setStatusFilter] = useState("todos");
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [domicilio, setDomicilio] = useState("no");
  const [formulario, setFormulario] = useState({});

  const filteredUsers = users.filter(
    (user) =>
      // Filtra por estatus
      (statusFilter === "todos" || user.formulario?.estatus === statusFilter) &&
      // Filtra por términos de búsqueda
      Object.values(user).some((value) => {
        // Verifica si el valor no es nulo o indefinido
        if (value === null || value === undefined) return false;

        // Si el valor es un objeto (como formulario), lo convertimos a JSON string para buscar
        if (typeof value === "object") {
          value = JSON.stringify(value); // Convierte objetos a JSON
        }

        // Compara el valor convertido con el término de búsqueda
        return value
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      })
  );

  const handleDelete = async (index) => {
    try {
      // Mostrar alerta de confirmación
      const result = await Swal.fire({
        title: "¿Deseas eliminar la empresa?",
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
          `/api/Company/eliminarEmpresa?id=${index}`
        );
        if (response.status === 200) {
          await Swal.fire(
            "Eliminada",
            "La empresa ha sido eliminada",
            "success"
          );
          window.location.href = "/usuario/empresas";
        } else {
          Swal.fire("Error", "Error al eliminar la empresa", "error");
        }
      }
    } catch (error) {
      console.error("Error al eliminar al usuario:", error);
      Swal.fire(
        "Error",
        "Ocurrió un error al intentar eliminar la empresa",
        "error"
      );
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/Company/getEmpresas");
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

  const indexOfLastEvento = currentPage * itemsPerPage;
  const indexOfFirstEvento = indexOfLastEvento - itemsPerPage;
  const currentUsers = filteredUsers.slice(
    indexOfFirstEvento,
    indexOfLastEvento
  );
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
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

  const handleEditUser = (userId) => {
    const userToEdit = users.find((user) => user.id === userId); // Buscar el usuario en el estado
    setSelectedUser(userToEdit); // Establecer el usuario seleccionado en el estado
    setFormulario(userToEdit.formulario);
    setDomicilio("no");
  };

  const handleInputChange = (value, name) => {
    setFormulario((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/Company/registrarEmpresa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formulario }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      if (res.ok) {
        Swal.fire({
          title: "Creada",
          text: "La empresa ha sido creada correctamente",
          icon: "success",
          timer: 3000, // La alerta desaparecerá después de 1.5 segundos
          showConfirmButton: false,
        }).then(() => {
          window.location.href = "/usuario/empresas";
        });
      } else {
        Swal.fire("Error", "Error al crear la empresa", "error");
      }
    } catch (err) {
      console.error("Error en el registro:", err);
      setError(
        "Hubo un problema con el registro. Por favor, intenta nuevamente."
      );
    }
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/Company/actualizarEmpresa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedUser.id,
          formulario: selectedUser.formulario,
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
          text: "Los datos de la empresa se han actualizado correctamente",
          icon: "success",
          timer: 3000, // La alerta desaparecerá después de 1.5 segundos
          showConfirmButton: false,
        }).then(() => {
          window.location.href = "/usuario/empresas";
        });
      } else {
        Swal.fire(
          "Error",
          "Error al actualizar los datos de la empresa",
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

  const handleCleanForm = () => {
    setFormulario({});
    setDomicilio("no");
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-4 text-sm text-muted-foreground">
        <a href="/inicio" className="hover:underline">
          Inicio
        </a>
        <ChevronRight className="mx-2 h-4 w-4" />
        <a href="/usuario" className="hover:underline">
          Administrador de usuarios
        </a>
        <ChevronRight className="mx-2 h-4 w-4" />
        <a
          href="/usuario/empresas"
          className="font-bold hover:underline text-primary"
        >
          Administrador de empresas
        </a>
      </div>

      <h1 className="text-2xl font-bold mb-6">Administrador de empresas</h1>

      <div className="flex justify-between mb-4">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <div hidden>
            <Select onValueChange={setStatusFilter} defaultValue={statusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los roles</SelectItem>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={handleCleanForm}>
              <EmpresasIcon className="mr-2 h-4 w-4" /> Añadir empresa
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
              <DialogTitle>Nueva empresa</DialogTitle>
              <DialogDescription>
                Ingresa los detalles de la empresa.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-3 py-4">
                <div className="flex justify-end">
                  <div className="space-y-2 w-1/2 max-w-xs">
                    <Label htmlFor="domicilio">¿Agregar domicilio?</Label>
                    <Select
                      value={domicilio}
                      onValueChange={(value) => {
                        setDomicilio(value);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione una opción" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="si">Sí</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {domicilio === "no" && (
                  <>
                    <DialogHeader>
                      <DialogTitle>
                        Datos de identificación del contribuyente
                      </DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-1">
                      <div className="space-y-2 col-span-1">
                        <Label htmlFor="rfc">RFC</Label>
                        <Input
                          id="rfc"
                          name="rfc"
                          value={formulario.rfc}
                          placeholder="..."
                          onChange={(e) =>
                            handleInputChange(e.target.value, e.target.name)
                          }
                        />
                      </div>
                      <div className="space-y-2 col-span-1">
                        <Label htmlFor="razon">Razón social</Label>
                        <Input
                          id="razon"
                          name="razon"
                          value={formulario.razon}
                          placeholder="..."
                          onChange={(e) =>
                            handleInputChange(e.target.value, e.target.name)
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <div className="space-y-2 col-span-1">
                        <Label htmlFor="regimen">Régimen capital</Label>
                        <Input
                          id="regimen"
                          name="regimen"
                          value={formulario.regimen}
                          placeholder="..."
                          onChange={(e) =>
                            handleInputChange(e.target.value, e.target.name)
                          }
                        />
                      </div>
                      <div className="space-y-2 col-span-1">
                        <Label htmlFor="nombre">Nombre comercial</Label>
                        <Input
                          id="nombre"
                          name="nombre"
                          value={formulario.nombre}
                          placeholder="..."
                          onChange={(e) =>
                            handleInputChange(e.target.value, e.target.name)
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <div className="space-y-2 col-span-1">
                        <Label htmlFor="fechaInicio">
                          Fecha inicio de operaciones
                        </Label>
                        <Input
                          id="fechaInicio"
                          name="fechaInicio"
                          type="date"
                          value={formulario.fechaInicio}
                          onChange={(e) =>
                            handleInputChange(e.target.value, e.target.name)
                          }
                        />
                      </div>
                      <div className="space-y-2 col-span-1">
                        <Label htmlFor="estatus">Estatus en el padrón</Label>
                        <Select
                          name="estatus"
                          value={formulario.estatus}
                          onValueChange={(value) =>
                            handleInputChange(value, "estatus")
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione una opción" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ACTIVO">Activo</SelectItem>
                            <SelectItem value="INACTIVO">Inactivo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="fechaCambio">
                          Fecha de último cambio de estado
                        </Label>
                        <Input
                          id="fechaCambio"
                          name="fechaCambio"
                          type="date"
                          value={formulario.fechaCambio}
                          onChange={(e) =>
                            handleInputChange(e.target.value, e.target.name)
                          }
                        />
                      </div>
                    </div>
                  </>
                )}
                {domicilio === "si" && (
                  <>
                    <DialogHeader>
                      <DialogTitle>Datos del domicilio registrado</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-1">
                      <div className="space-y-2 col-span-1">
                        <Label htmlFor="codigo">Código postal</Label>
                        <Input
                          id="codigo"
                          name="codigo"
                          type="number"
                          value={formulario.codigo}
                          placeholder="..."
                          onChange={(e) =>
                            handleInputChange(e.target.value, e.target.name)
                          }
                        />
                      </div>
                      <div className="space-y-2 col-span-1">
                        <Label htmlFor="tipoVialidad">Tipo de vialidad</Label>
                        <Input
                          id="tipoVialidad"
                          name="tipoVialidad"
                          value={formulario.tipoVialidad}
                          placeholder="..."
                          onChange={(e) =>
                            handleInputChange(e.target.value, e.target.name)
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <div className="space-y-2 col-span-1">
                        <Label htmlFor="nombreVialidad">
                          Nombre de vialidad
                        </Label>
                        <Input
                          id="nombreVialidad"
                          name="nombreVialidad"
                          value={formulario.nombreVialidad}
                          placeholder="..."
                          onChange={(e) =>
                            handleInputChange(e.target.value, e.target.name)
                          }
                        />
                      </div>
                      <div className="space-y-2 col-span-1">
                        <Label htmlFor="numeroExterior">Número exterior</Label>
                        <Input
                          id="numeroExterior"
                          name="numeroExterior"
                          type="number"
                          value={formulario.numeroExterior}
                          placeholder="..."
                          onChange={(e) =>
                            handleInputChange(e.target.value, e.target.name)
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <div className="space-y-2 col-span-1">
                        <Label htmlFor="numeroInterior">Número interior</Label>
                        <Input
                          id="numeroInterior"
                          name="numeroInterior"
                          value={formulario.numeroInterior}
                          placeholder="..."
                          onChange={(e) =>
                            handleInputChange(e.target.value, e.target.name)
                          }
                        />
                      </div>
                      <div className="space-y-2 col-span-1">
                        <Label htmlFor="nombreColonia">
                          Nombre de la colonia
                        </Label>
                        <Input
                          id="nombreColonia"
                          name="nombreColonia"
                          value={formulario.nombreColonia}
                          placeholder="..."
                          onChange={(e) =>
                            handleInputChange(e.target.value, e.target.name)
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <div className="space-y-2 col-span-1">
                        <Label htmlFor="nombreLocalidad">
                          Nombre de la localidad
                        </Label>
                        <Input
                          id="nombreLocalidad"
                          name="nombreLocalidad"
                          value={formulario.nombreLocalidad}
                          placeholder="..."
                          onChange={(e) =>
                            handleInputChange(e.target.value, e.target.name)
                          }
                        />
                      </div>
                      <div className="space-y-2 col-span-1">
                        <Label htmlFor="nombreMunicipio">
                          Nombre del municipio
                        </Label>
                        <Input
                          id="nombreMunicipio"
                          name="nombreMunicipio"
                          value={formulario.nombreMunicipio}
                          placeholder="..."
                          onChange={(e) =>
                            handleInputChange(e.target.value, e.target.name)
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <div className="space-y-2 col-span-1">
                        <Label htmlFor="nombreEntidad">
                          Nombre de la entidad federativa
                        </Label>
                        <Input
                          id="nombreEntidad"
                          name="nombreEntidad"
                          value={formulario.nombreEntidad}
                          placeholder="..."
                          onChange={(e) =>
                            handleInputChange(e.target.value, e.target.name)
                          }
                        />
                      </div>
                      <div className="space-y-2 col-span-1">
                        <Label htmlFor="entreCalle">Entre calle</Label>
                        <Input
                          id="entreCalle"
                          name="entreCalle"
                          value={formulario.entreCalle}
                          placeholder="..."
                          onChange={(e) =>
                            handleInputChange(e.target.value, e.target.name)
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="yCalle">Y calle</Label>
                        <Input
                          id="yCalle"
                          name="yCalle"
                          placeholder="..."
                          value={formulario.yCalle}
                          onChange={(e) =>
                            handleInputChange(e.target.value, e.target.name)
                          }
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
              <DialogFooter>
                <Button type="submit">Agregar empresa</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>RFC</TableHead>
            <TableHead>Denominación/Razón social</TableHead>
            <TableHead>Nombre comercial</TableHead>
            <TableHead>Fecha de inicio de operaciones</TableHead>
            <TableHead>Estatus en el padrón</TableHead>
            <TableHead>Fecho de último cambio de estado</TableHead>
            <TableHead>Código postal</TableHead>
            <TableHead>Nombre de vialidad</TableHead>
            <TableHead>Número exterior</TableHead>
            <TableHead>Número interior</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentUsers.length > 0 ? (
            currentUsers.map((user, index) => (
              <TableRow key={index}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.formulario.rfc || "Sin datos"}</TableCell>
                <TableCell>{user.formulario.razon || "Sin datos"}</TableCell>
                <TableCell>{user.formulario.nombre || "Sin datos"}</TableCell>
                <TableCell>
                  {user.formulario.fechaInicio
                    ? new Date(
                        new Date(user.formulario.fechaInicio).getTime() +
                          new Date().getTimezoneOffset() * 60000
                      ).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : "Sin datos"}
                </TableCell>
                <TableCell>{user.formulario.estatus || "Sin datos"}</TableCell>
                <TableCell>
                  {user.formulario.fechaCambio
                    ? new Date(
                        new Date(user.formulario.fechaCambio).getTime() +
                          new Date().getTimezoneOffset() * 60000
                      ).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : "Sin datos"}
                </TableCell>
                <TableCell>{user.formulario.codigo || "Sin datos"}</TableCell>
                <TableCell>
                  {user.formulario.nombreVialidad || "Sin datos"}
                </TableCell>
                <TableCell>
                  {user.formulario.numeroExterior || "Sin datos"}
                </TableCell>
                <TableCell>
                  {user.formulario.numeroInterior || "Sin datos"}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => handleEditUser(user.id)}
                          variant="outline"
                          size="sm"
                        >
                          Editar
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
                          <DialogTitle>Editar empresa</DialogTitle>
                          <DialogDescription>
                            Actualiza los detalles necesarios de la empresa.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmitUpdate}>
                          <div className="space-y-3 py-4">
                            <div className="flex justify-end">
                              <div className="space-y-2 w-1/2 max-w-xs">
                                <Label htmlFor="domicilio">
                                  ¿Agregar domicilio?
                                </Label>
                                <Select
                                  value={domicilio}
                                  onValueChange={(value) => {
                                    setDomicilio(value);
                                  }}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Seleccione una opción" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="si">Sí</SelectItem>
                                    <SelectItem value="no">No</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            {domicilio === "no" && (
                              <>
                                <DialogHeader>
                                  <DialogTitle>
                                    Datos de identificación del contribuyente
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="grid grid-cols-2 gap-1">
                                  <div className="space-y-2 col-span-1">
                                    <Label htmlFor="rfc">RFC</Label>
                                    <Input
                                      id="rfc"
                                      name="rfc"
                                      placeholder="..."
                                      value={
                                        selectedUser?.formulario?.rfc || ""
                                      }
                                      onChange={(e) =>
                                        setSelectedUser({
                                          ...selectedUser,
                                          formulario: {
                                            ...selectedUser.formulario,
                                            rfc: e.target.value,
                                          },
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2 col-span-1">
                                    <Label htmlFor="razon">Razón social</Label>
                                    <Input
                                      id="razon"
                                      name="razon"
                                      placeholder="..."
                                      value={
                                        selectedUser?.formulario?.razon || ""
                                      }
                                      onChange={(e) =>
                                        setSelectedUser({
                                          ...selectedUser,
                                          formulario: {
                                            ...selectedUser.formulario,
                                            razon: e.target.value,
                                          },
                                        })
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-1">
                                  <div className="space-y-2 col-span-1">
                                    <Label htmlFor="regimen">
                                      Régimen capital
                                    </Label>
                                    <Input
                                      id="regimen"
                                      name="regimen"
                                      placeholder="..."
                                      value={
                                        selectedUser?.formulario?.regimen || ""
                                      }
                                      onChange={(e) =>
                                        setSelectedUser({
                                          ...selectedUser,
                                          formulario: {
                                            ...selectedUser.formulario,
                                            regimen: e.target.value,
                                          },
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2 col-span-1">
                                    <Label htmlFor="nombre">
                                      Nombre comercial
                                    </Label>
                                    <Input
                                      id="nombre"
                                      name="nombre"
                                      placeholder="..."
                                      value={
                                        selectedUser?.formulario?.nombre || ""
                                      }
                                      onChange={(e) =>
                                        setSelectedUser({
                                          ...selectedUser,
                                          formulario: {
                                            ...selectedUser.formulario,
                                            nombre: e.target.value,
                                          },
                                        })
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-1">
                                  <div className="space-y-2 col-span-1">
                                    <Label htmlFor="fechaInicio">
                                      Fecha inicio de operaciones
                                    </Label>
                                    <Input
                                      id="fechaInicio"
                                      name="fechaInicio"
                                      type="date"
                                      value={
                                        selectedUser?.formulario?.fechaInicio ||
                                        ""
                                      }
                                      onChange={(e) =>
                                        setSelectedUser({
                                          ...selectedUser,
                                          formulario: {
                                            ...selectedUser.formulario,
                                            fechaInicio: e.target.value,
                                          },
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2 col-span-1">
                                    <Label htmlFor="estatus">
                                      Estatus en el padrón
                                    </Label>
                                    <Select
                                      name="estatus"
                                      value={
                                        selectedUser?.formulario?.estatus || ""
                                      }
                                      onValueChange={(value) => {
                                        setSelectedUser((prev) => ({
                                          ...prev,
                                          formulario: {
                                            ...prev.formulario,
                                            estatus: value,
                                          },
                                        }));
                                      }}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Seleccione una opción" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="ACTIVO">
                                          Activo
                                        </SelectItem>
                                        <SelectItem value="INACTIVO">
                                          Inactivo
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-1">
                                  <div className="space-y-2 col-span-2">
                                    <Label htmlFor="fechaCambio">
                                      Fecha de último cambio de estado
                                    </Label>
                                    <Input
                                      id="fechaCambio"
                                      name="fechaCambio"
                                      type="date"
                                      value={
                                        selectedUser?.formulario?.fechaCambio ||
                                        ""
                                      }
                                      onChange={(e) =>
                                        setSelectedUser({
                                          ...selectedUser,
                                          formulario: {
                                            ...selectedUser.formulario,
                                            fechaCambio: e.target.value,
                                          },
                                        })
                                      }
                                    />
                                  </div>
                                </div>
                              </>
                            )}
                            {domicilio === "si" && (
                              <>
                                <DialogHeader>
                                  <DialogTitle>
                                    Datos del domicilio registrado
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="grid grid-cols-2 gap-1">
                                  <div className="space-y-2 col-span-1">
                                    <Label htmlFor="codigo">
                                      Código postal
                                    </Label>
                                    <Input
                                      id="codigo"
                                      name="codigo"
                                      type="number"
                                      placeholder="..."
                                      value={
                                        selectedUser?.formulario?.codigo || ""
                                      }
                                      onChange={(e) =>
                                        setSelectedUser({
                                          ...selectedUser,
                                          formulario: {
                                            ...selectedUser.formulario,
                                            codigo: e.target.value,
                                          },
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2 col-span-1">
                                    <Label htmlFor="tipoVialidad">
                                      Tipo de vialidad
                                    </Label>
                                    <Input
                                      id="tipoVialidad"
                                      name="tipoVialidad"
                                      placeholder="..."
                                      value={
                                        selectedUser?.formulario
                                          ?.tipoVialidad || ""
                                      }
                                      onChange={(e) =>
                                        setSelectedUser({
                                          ...selectedUser,
                                          formulario: {
                                            ...selectedUser.formulario,
                                            tipoVialidad: e.target.value,
                                          },
                                        })
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-1">
                                  <div className="space-y-2 col-span-1">
                                    <Label htmlFor="nombreVialidad">
                                      Nombre de vialidad
                                    </Label>
                                    <Input
                                      id="nombreVialidad"
                                      name="nombreVialidad"
                                      placeholder="..."
                                      value={
                                        selectedUser?.formulario
                                          ?.nombreVialidad || ""
                                      }
                                      onChange={(e) =>
                                        setSelectedUser({
                                          ...selectedUser,
                                          formulario: {
                                            ...selectedUser.formulario,
                                            nombreVialidad: e.target.value,
                                          },
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2 col-span-1">
                                    <Label htmlFor="numeroExterior">
                                      Número exterior
                                    </Label>
                                    <Input
                                      id="numeroExterior"
                                      name="numeroExterior"
                                      type="number"
                                      placeholder="..."
                                      value={
                                        selectedUser?.formulario
                                          ?.numeroExterior || ""
                                      }
                                      onChange={(e) =>
                                        setSelectedUser({
                                          ...selectedUser,
                                          formulario: {
                                            ...selectedUser.formulario,
                                            numeroExterior: e.target.value,
                                          },
                                        })
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-1">
                                  <div className="space-y-2 col-span-1">
                                    <Label htmlFor="numeroInterior">
                                      Número interior
                                    </Label>
                                    <Input
                                      id="numeroInterior"
                                      name="numeroInterior"
                                      placeholder="..."
                                      value={
                                        selectedUser?.formulario
                                          ?.numeroInterior || ""
                                      }
                                      onChange={(e) =>
                                        setSelectedUser({
                                          ...selectedUser,
                                          formulario: {
                                            ...selectedUser.formulario,
                                            numeroInterior: e.target.value,
                                          },
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2 col-span-1">
                                    <Label htmlFor="nombreColonia">
                                      Nombre de la colonia
                                    </Label>
                                    <Input
                                      id="nombreColonia"
                                      name="nombreColonia"
                                      placeholder="..."
                                      value={
                                        selectedUser?.formulario
                                          ?.nombreColonia || ""
                                      }
                                      onChange={(e) =>
                                        setSelectedUser({
                                          ...selectedUser,
                                          formulario: {
                                            ...selectedUser.formulario,
                                            nombreColonia: e.target.value,
                                          },
                                        })
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-1">
                                  <div className="space-y-2 col-span-1">
                                    <Label htmlFor="nombreLocalidad">
                                      Nombre de la localidad
                                    </Label>
                                    <Input
                                      id="nombreLocalidad"
                                      name="nombreLocalidad"
                                      placeholder="..."
                                      value={
                                        selectedUser?.formulario
                                          ?.nombreLocalidad || ""
                                      }
                                      onChange={(e) =>
                                        setSelectedUser({
                                          ...selectedUser,
                                          formulario: {
                                            ...selectedUser.formulario,
                                            nombreLocalidad: e.target.value,
                                          },
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2 col-span-1">
                                    <Label htmlFor="nombreMunicipio">
                                      Nombre del municipio
                                    </Label>
                                    <Input
                                      id="nombreMunicipio"
                                      name="nombreMunicipio"
                                      placeholder="..."
                                      value={
                                        selectedUser?.formulario
                                          ?.nombreMunicipio || ""
                                      }
                                      onChange={(e) =>
                                        setSelectedUser({
                                          ...selectedUser,
                                          formulario: {
                                            ...selectedUser.formulario,
                                            nombreMunicipio: e.target.value,
                                          },
                                        })
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-1">
                                  <div className="space-y-2 col-span-1">
                                    <Label htmlFor="nombreEntidad">
                                      Nombre de la entidad federativa
                                    </Label>
                                    <Input
                                      id="nombreEntidad"
                                      name="nombreEntidad"
                                      placeholder="..."
                                      value={
                                        selectedUser?.formulario
                                          ?.nombreEntidad || ""
                                      }
                                      onChange={(e) =>
                                        setSelectedUser({
                                          ...selectedUser,
                                          formulario: {
                                            ...selectedUser.formulario,
                                            nombreEntidad: e.target.value,
                                          },
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2 col-span-1">
                                    <Label htmlFor="entreCalle">
                                      Entre calle
                                    </Label>
                                    <Input
                                      id="entreCalle"
                                      name="entreCalle"
                                      placeholder="..."
                                      value={
                                        selectedUser?.formulario?.entreCalle ||
                                        ""
                                      }
                                      onChange={(e) =>
                                        setSelectedUser({
                                          ...selectedUser,
                                          formulario: {
                                            ...selectedUser.formulario,
                                            entreCalle: e.target.value,
                                          },
                                        })
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-1">
                                  <div className="space-y-2 col-span-2">
                                    <Label htmlFor="yCalle">Y calle</Label>
                                    <Input
                                      id="yCalle"
                                      name="yCalle"
                                      placeholder="..."
                                      value={
                                        selectedUser?.formulario?.yCalle || ""
                                      }
                                      onChange={(e) =>
                                        setSelectedUser({
                                          ...selectedUser,
                                          formulario: {
                                            ...selectedUser.formulario,
                                            yCalle: e.target.value,
                                          },
                                        })
                                      }
                                    />
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                          <DialogFooter>
                            <Button type="submit">Actualizar empresa</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={12} className="text-center">
                No se encontraron empresas
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

function EmpresasIcon(props) {
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
      <rect x="3" y="3" width="7" height="18" rx="1" ry="1"></rect>
      <rect x="14" y="7" width="7" height="14" rx="1" ry="1"></rect>
      <path d="M10 22v-2a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2"></path>
      <line x1="6" y1="8" x2="8" y2="8"></line>
      <line x1="6" y1="12" x2="8" y2="12"></line>
      <line x1="6" y1="16" x2="8" y2="16"></line>
      <line x1="17" y1="10" x2="19" y2="10"></line>
      <line x1="17" y1="14" x2="19" y2="14"></line>
      <line x1="17" y1="18" x2="19" y2="18"></line>
    </svg>
  );
}
