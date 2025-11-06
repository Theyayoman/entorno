"use client";

import { useState, useRef, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import styles from "../../../../public/CSS/spinner.css";
import { ChevronRight, Search, UserPlus, X, KeyRound } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import axios from "axios";
import Swal from "sweetalert2";

const formSections = [
  {
    id: "Investigación y Desarrollo de Nuevos Productos",
    name: "Investigación y Desarrollo de Nuevos Productos",
    changeOptions: [
      "Código QR",
      "Código de barras",
      "Cambio estético",
      "Cambio crítico",
      "Distribuido y elaborado por",
      "Tabla nutrimental",
      "Lista de ingredientes",
    ],
  },
  {
    id: "Diseño",
    name: "Diseño",
    changeOptions: [
      "nombre_producto",
      "proveedor",
      "terminado",
      "articulo",
      "fecha_elaboracion",
      "edicion",
      "sustrato",
      "dimensiones",
      "escala",
      "description",
      "Tamaño de letra",
      "Logotipo",
      "Tipografía",
      "Colores",
    ],
  },
  {
    id: "Calidad",
    name: "Calidad",
    changeOptions: ["Información", "Ortografía"],
  },
  {
    id: "Auditorías",
    name: "Auditorías",
    changeOptions: ["Auditable"],
  },
  {
    id: "Laboratorio",
    name: "Laboratorio",
    changeOptions: ["Fórmula"],
  },
  {
    id: "Ingeniería de Productos",
    name: "Ingeniería de Productos",
    changeOptions: [
      "Dimensiones",
      "Sustrato",
      "Impresión",
      "Acabado",
      "Rollo",
      "Seleccionar imágenes",
    ],
  },
  {
    id: "Gerente de Marketing",
    name: "Gerente de Marketing",
    changeOptions: ["Teléfono", "Mail/email"],
  },
  {
    id: "Compras",
    name: "Compras",
    changeOptions: ["Valor"],
  },
  {
    id: "Planeación",
    name: "Planeación",
    changeOptions: ["Inventario"],
  },
  {
    id: "Verificación",
    name: "Verificación",
    changeOptions: [
      "Directora de marketing",
      "Gerente de maquilas y desarrollo de nuevo productos",
      "Investigación y desarrollo de nuevos productos",
      "Ingeniería de productos",
      "Gerente de marketing",
      "Diseñador gráfico",
      "Gerente o supervisor de calidad",
      "Gerente o coordinador de auditorías",
      "Químico o formulador",
      "Planeación",
      "Maquilas",
    ],
  },
  {
    id: "Papeletas",
    name: "Papeletas",
    changeOptions: [
      "Autorizar",
      "Modulo papeletas",
      "Solicitudes",
      "Papeletas enviadas",
    ],
  },
  {
    id: "Gente y Cultura",
    name: "Gente y Cultura",
    changeOptions: ["Vacantes", "Vacantes sin sueldo"],
  },
  {
    id: "Marketing",
    name: "Marketing",
    changeOptions: ["Firmas"],
  },
  {
    id: "Ing. Productos",
    name: "Ing. Productos",
    changeOptions: ["CMD Productos"],
  },
  {
    id: "Ventas",
    name: "Ventas",
    changeOptions: ["Levantamiento requerimientos", "Formulas", "Costos"],
  },
];

const plataformas = {
  aionet: "Aionet",
  aionbusiness: "AionBusiness",
  correo: "Correo electrónico",
  synology: "Synology",
};

export function UserManagementTable() {
  const [selectedSections, setSelectedSections] = useState([]);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [position, setPosition] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [entryDate, setEntryDate] = useState("");
  const [directBoss, setDirectBoss] = useState("");
  const [company, setCompany] = useState("");
  const [workPlant, setWorkPlant] = useState("");
  const [selectedPermission, setSelectedPermission] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedChanges, setSelectedChanges] = useState({});
  const [isChangeOptionsDialogOpen, setIsChangeOptionsDialogOpen] =
    useState(false);
  const [isFormSectionsDialogOpen, setIsFormSectionsDialogOpen] =
    useState(false);
  const [statusFilter, setStatusFilter] = useState("todos");
  const [departmentFilter, setDepartmentFilter] = useState("todos");
  const [error, setError] = useState("");
  const [role, setSelectedRole] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDepartamento, setSelectedDepartamento] = useState(""); // ID del departamento seleccionado
  const [filteredUsersDpto, setFilteredUsers] = useState([]);
  const [nuevaContraseña, setNuevaContraseña] = useState("");
  const [confirmarContraseña, setConfirmarContraseña] = useState("");
  const [searchTermPass, setSearchTermPass] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const inputRef = useRef(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState({});
  const [open, setOpen] = useState(false);

  const filteredUsers = users.filter(
    (user) =>
      (statusFilter === "todos" || user.rol === statusFilter) &&
      (departmentFilter === "todos" || user.id_dpto === departmentFilter) &&
      Object.values(user)
        .filter((value) => value !== null && value !== undefined) // Filtra valores nulos o indefinidos
        .some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
  );

  // Este useEffect se encarga del debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTermPass);
    }, 500);

    return () => {
      clearTimeout(handler); // limpia el timeout si se escribe antes de los 3s
    };
  }, [searchTermPass]);

  const handleDelete = async (index) => {
    try {
      // Mostrar alerta de confirmación
      const result = await Swal.fire({
        title: "¿Deseas eliminar al usuario?",
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
          `/api/Users/eliminarUsuario?id=${index}`
        );
        if (response.status === 200) {
          await Swal.fire(
            "Eliminado",
            "El usuario ha sido eliminado correctamente",
            "success"
          );
          window.location.href = "/usuario";
        } else {
          Swal.fire("Error", "Error al eliminar al usuario", "error");
        }
      }
    } catch (error) {
      console.error("Error al eliminar al usuario:", error);
      Swal.fire(
        "Error",
        "Ocurrió un error al intentar eliminar al usuario",
        "error"
      );
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // Enfoca el input al abrir el Select
    }
  }, [searchTermPass]);

  const handleSelectUser = (userId) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    if (!selectedUsers.some((u) => u.id === userId)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setSearchTermPass(""); // Resetea la búsqueda después de seleccionar un usuario
  };

  const handleCheckboxChange = (key) => {
    setSelectedPlatforms((prev) => ({
      ...prev,
      [key]: !prev[key], // Alterna entre true y false
    }));
  };

  const handleCheckboxChangeEdit = (key) => {
    setSelectedUser((prev) => {
      let plataformas = prev.plataformas;

      // Verificar si plataformas es null o undefined
      if (!plataformas) {
        plataformas = {}; // Inicializar como un objeto vacío
      } else if (typeof plataformas === "string") {
        try {
          plataformas = JSON.parse(plataformas);
        } catch (error) {
          console.error("Error al parsear plataformas:", error);
          plataformas = {}; // Si falla el parseo, inicializar como objeto vacío
        }
      }

      return {
        ...prev,
        plataformas: {
          ...plataformas,
          [key]: !plataformas[key], // Alternar entre true y false
        },
      };
    });
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter((u) => u.id !== userId));
  };

  const openPermissionsDialog = (userId) => {
    setSelectedSections([]);
    setSelectedUserId(userId); // Guardar el ID del usuario seleccionado
    setIsChangeOptionsDialogOpen(false);
  };
  const handlePermissionChange = (permission) => {
    setSelectedPermission(permission);
    setIsFormSectionsDialogOpen(true);
  };

  const handleSectionSelection = (sectionId) => {
    setSelectedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true); // Iniciar carga
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
      } finally {
        setLoading(false); // Finalizar carga
      }
    };

    fetchUsers();
    const fetchSelections = async () => {
      if (selectedUserId) {
        setLoading(true); // Iniciar carga
        try {
          const response = await fetch(
            `/api/Gente&CulturaPermission/registroPermiso?id=${selectedUserId}`
          );
          if (response.ok) {
            const data = await response.json();

            // Asegurarse de que data.permiso tenga la estructura esperada
            setSelectedSections(data.permiso?.seccion || []);
            setSelectedChanges(data.permiso?.campo || {});
          } else {
            console.error(
              "Error en la respuesta del servidor:",
              response.status
            );
          }
        } catch (error) {
          console.error("Error fetching selections", error);
        } finally {
          setLoading(false); // Finalizar carga
        }
      }
    };

    // Solo ejecutar fetchSelections si hay un userId seleccionado
    if (selectedUserId) {
      fetchSelections();
    }
  }, [selectedUserId]);

  useEffect(() => {
    if (!users || users.length === 0) {
      return;
    }

    if (!selectedDepartamento) {
      setFilteredUsers([]);
      return;
    }

    const filtered = users.filter(
      (usuario) =>
        usuario.departamento_id === selectedDepartamento ||
        usuario.departamento_id === 17
    );

    setFilteredUsers(filtered);
  }, [selectedDepartamento, users]);

  useEffect(() => {
    if (selectedUser?.departamento_id) {
      setFilteredUsers(
        users.filter(
          (user) =>
            user.departamento_id.toString() ===
              selectedUser.departamento_id.toString() ||
            user.departamento_id === 17
        )
      );
    } else {
      setFilteredUsers([]);
    }
  }, [selectedUser?.departamento_id, users]);

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

  const fetchEmployeeNumber = async () => {
    try {
      const response = await axios.get("/api/Users/obtenerNumeroEmpleado");
      if (response.data.success) {
        setEmployeeNumber(response.data.numeroEmpleado);
      } else {
        console.error(
          "Error al obtener el numero de empleado:",
          response.data.message
        );
      }
    } catch (error) {
      console.error("Error al hacer fetch del numero de empleado:", error);
    }
  };

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
    setSelectedUser(userToEdit);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");

      return;
    }

    try {
      const res = await fetch("/api/Users/registroMaster", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          lastName,
          email,
          employeeNumber,
          position,
          selectedDepartamento,
          password,
          confirmPassword,
          role,
          phoneNumber,
          entryDate,
          directBoss,
          company,
          workPlant,
          selectedPlatforms,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      if (res.ok) {
        Swal.fire({
          title: "Creado",
          text: "El usuario ha sido creado correctamente",
          icon: "success",
          timer: 3000, // La alerta desaparecerá después de 1.5 segundos
          showConfirmButton: false,
        }).then(() => {
          window.location.href = "/usuario";
        });
      } else {
        Swal.fire("Error", "Error al crear al usuario", "error");
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
      const res = await fetch("/api/Users/actualizarUsuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedUser.id,
          nombre: selectedUser.nombre,
          apellidos: selectedUser.apellidos,
          correo: selectedUser.correo,
          numero_empleado: selectedUser.numero_empleado,
          puesto: selectedUser.puesto,
          telefono: selectedUser.telefono,
          fecha_ingreso: selectedUser.fecha_ingreso,
          jefe_directo: selectedUser.jefe_directo,
          departamento_id: selectedUser.departamento_id,
          empresa_id: selectedUser.empresa_id,
          planta: selectedUser.planta,
          rol: selectedUser.rol,
          plataformas: selectedUser.plataformas,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Hubo un problema al actualizar el usuario");
        return;
      }

      if (res.ok) {
        Swal.fire({
          title: "Actualizado",
          text: "Los datos del usuario se han actualizado correctamente",
          icon: "success",
          timer: 3000, // La alerta desaparecerá después de 1.5 segundos
          showConfirmButton: false,
        }).then(() => {
          window.location.href = "/usuario";
        });
      } else {
        Swal.fire(
          "Error",
          "Error al actualizar los datos del usuario",
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

  const handleSubmitResetPass = async (e) => {
    e.preventDefault();

    if (selectedUsers.length === 0) {
      Swal.fire("Error", "Selecciona al menos un usuario", "error");
      return;
    }

    try {
      const res = await fetch("/api/Users/resetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedUsers,
          resetPass: "generica2025", // Enviar la contraseña directamente
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire(
          "Error",
          data.message || "Hubo un problema al reestablecer las contraseñas",
          "error"
        );
        return;
      }

      Swal.fire({
        title: "Actualizadas",
        text: "Las contraseñas se han reestablecido correctamente",
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
      }).then(() => {
        window.location.href = "/usuario";
      });
    } catch (err) {
      console.error("Error en la actualización:", err);
      Swal.fire(
        "Error",
        "Hubo un problema con la actualización. Por favor, intenta nuevamente.",
        "error"
      );
    }
  };

  const saveSelections = async () => {
    if (!selectedUserId) return; // Validación para asegurarnos que tenemos el ID
    const selectedData = [];

    selectedSections.forEach((sectionId) => {
      const section = formSections.find((s) => s.id === sectionId);
      if (section && selectedChanges[sectionId]) {
        selectedChanges[sectionId].forEach((option) => {
          selectedData.push({
            seccion: section.name,
            campo: option,
          });
        });
      }
    });

    const response = await fetch(
      `/api/Gente&CulturaPermission/registroPermiso?id=${selectedUserId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selections: selectedData }),
      }
    );

    if (response.ok) {
      Swal.fire({
        title: "Creado",
        text: "Se ha creado correctamente el permiso para el usuario",
        icon: "success",
        timer: 3000, // La alerta desaparecerá después de 1.5 segundos
        showConfirmButton: false,
      }).then(() => {
        window.location.href = "/usuario";
      });
    } else {
      Swal.fire("Error", "Error al crear el permiso para el usuario", "error");
    }
  };

  const handleChangePassword = async (index) => {
    if (nuevaContraseña !== confirmarContraseña) {
      Swal.fire({
        title: "Error",
        text: "Las contraseñas no coinciden",
        icon: "error",
        timer: 3000, // La alerta desaparecerá después de 1.5 segundos
        showConfirmButton: false,
      });
      return; // Detener ejecución si hay un error
    }

    try {
      // Enviar petición al servidor para cambiar la contraseña
      const response = await fetch("/api/Users/cambiarPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: index, // ID del usuario seleccionado
          nuevaContraseña,
        }),
      });

      if (!response.ok) {
        Swal.fire({
          title: "Error",
          text: "Error al cambiar la contraseña",
          icon: "error",
          timer: 3000, // La alerta desaparecerá después de 1.5 segundos
          showConfirmButton: false,
        });
      }

      Swal.fire({
        title: "Actualizada",
        text: "La contraseña ha sido actualizada correctamente",
        icon: "success",
        timer: 3000, // La alerta desaparecerá después de 1.5 segundos
        showConfirmButton: false,
      }).then(() => {
        window.location.href = "/usuario";
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al intentar cambiar la contraseña",
        icon: "error",
        timer: 3000, // La alerta desaparecerá después de 1.5 segundos
        showConfirmButton: false,
      });
    }
  };

  const removeSection = (sectionId) => {
    setSelectedSections((prev) => prev.filter((id) => id !== sectionId));
    setSelectedChanges((prev) => {
      const { [sectionId]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleChangeOptionSelection = (sectionId, option) => {
    setSelectedChanges((prev) => ({
      ...prev,
      [sectionId]: prev[sectionId]?.includes(option)
        ? prev[sectionId].filter((opt) => opt !== option) // Deselecciona
        : [...(prev[sectionId] || []), option], // Selecciona
    }));
  };
  const openChangeOptionsDialog = () => {
    setIsChangeOptionsDialogOpen(true);
    setIsFormSectionsDialogOpen(false);
  };

  const handleCleanForm = () => {
    fetchEmployeeNumber();
    setSelectedPlatforms({});
    setName("");
    setLastName("");
    setEmail("");
    setPosition("");
    setPhoneNumber("");
    setEntryDate("");
    setSelectedDepartamento("");
    setDirectBoss("");
    setCompany("");
    setWorkPlant("");
    setPassword("");
    setConfirmPassword("");
    setSelectedRole("");
  };

  const handleCleanFormPass = () => {
    setSelectedUsers([]);
    setSearchTermPass("");
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-4 text-sm text-muted-foreground">
        <a href="/inicio" className="hover:underline">
          Inicio
        </a>
        <ChevronRight className="mx-2 h-4 w-4" />
        <a href="/usuario" className="font-bold hover:underline text-primary">
          Administrador de usuarios
        </a>
        <ChevronRight className="mx-2 h-4 w-4" />
        <a href="/usuario/empresas" className="hover:underline">
          Administrador de empresas
        </a>
      </div>

      <h1 className="text-2xl font-bold mb-6">Administrador de usuarios</h1>

      <div className="flex justify-between mb-4">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select onValueChange={setStatusFilter} defaultValue={statusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filtrar por rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los roles</SelectItem>
              <SelectItem value="Máster">Máster</SelectItem>
              <SelectItem value="Administrador">Administrador</SelectItem>
              <SelectItem value="Estándar">Estándar</SelectItem>
              <SelectItem value="Dado de baja">Dado de baja</SelectItem>
            </SelectContent>
          </Select>
          <Select
            onValueChange={setDepartmentFilter}
            defaultValue={departmentFilter}
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Filtrar por departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los departamentos</SelectItem>
              {departamentos.length > 0 ? (
                departamentos.map((dep) => (
                  <SelectItem key={dep.id} value={dep.id}>
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

        <Dialog>
          <DialogTrigger asChild>
            <Button
              onClick={handleCleanFormPass}
              style={{ marginLeft: "400px" }}
            >
              <KeyRound className="mr-2 h-4 w-4" />
              Reestablecer contraseñas
            </Button>
          </DialogTrigger>
          <DialogContent
            className="border-none p-0 overflow-y-auto no-scrollbar"
            style={{
              width: "100%",
              maxWidth: "800px",
              height: "35vh",
              maxHeight: "65vh",
              padding: "30px",
              marginLeft: "120px",
            }}
          >
            <DialogHeader>
              <DialogTitle>Reestablecer contraseñas</DialogTitle>
              <DialogDescription>
                Selecciona los usuarios a los que se les reestablecerá la
                contraseña.
              </DialogDescription>
            </DialogHeader>

            {/* Breadcrumbs de usuarios seleccionados */}
            {selectedUsers.length > 0 && (
              <div className="flex flex-wrap gap-2 border p-2 rounded-lg">
                {selectedUsers.map((user) => (
                  <span
                    style={{ fontSize: 12, backgroundColor: "lightgray" }}
                    key={user.id}
                    className="inline-flex items-center bg-gray-200 px-2 py-1 rounded-md"
                  >
                    {user.nombre} {user.apellidos}
                    <X
                      className="ml-2 h-4 w-4 cursor-pointer text-red-500"
                      onClick={() => handleRemoveUser(user.id)}
                    />
                  </span>
                ))}
              </div>
            )}

            {/* Selección de usuarios con búsqueda manual */}
            <div className="mb-4">
              <Select onValueChange={handleSelectUser} value="">
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar usuarios" />
                </SelectTrigger>
                <SelectContent>
                  {/* Input dentro del Select para filtrar, sin afectar la selección */}
                  <div className="p-2">
                    <Input
                      ref={inputRef}
                      placeholder="Buscar usuario..."
                      value={searchTermPass}
                      onChange={(e) => setSearchTermPass(e.target.value)}
                      onKeyDown={(e) => e.stopPropagation()} // Evitar selecciones accidentales con el teclado
                    />
                  </div>

                  {/* Filtrado sin selección automática */}
                  {users.filter(
                    (user) =>
                      user.nombre
                        .toLowerCase()
                        .includes(debouncedSearchTerm.toLowerCase()) ||
                      user.apellidos
                        .toLowerCase()
                        .includes(debouncedSearchTerm.toLowerCase())
                  ).length === 0 ? (
                    <div className="p-2 text-center text-gray-500">
                      No se encontraron usuarios
                    </div>
                  ) : (
                    users
                      .filter(
                        (user) =>
                          user.nombre
                            .toLowerCase()
                            .includes(debouncedSearchTerm.toLowerCase()) ||
                          user.apellidos
                            .toLowerCase()
                            .includes(debouncedSearchTerm.toLowerCase())
                      )
                      .map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.nombre} {user.apellidos}
                        </SelectItem>
                      ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Formulario de cambio de contraseña */}
            <form onSubmit={handleSubmitResetPass}>
              <input type="hidden" id="resetPass" value="generica2025" />

              <DialogFooter>
                <Button type="submit" disabled={selectedUsers.length === 0}>
                  Reestablecer contraseñas
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={handleCleanForm}>
              <UserPlus className="mr-2 h-4 w-4" /> Añadir usuario
            </Button>
          </DialogTrigger>
          <DialogContent
            onInteractOutside={(event) => event.preventDefault()}
            className="border-none p-0 overflow-y-auto no-scrollbar"
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
              <DialogTitle>Nuevo usuario</DialogTitle>
              <DialogDescription>
                Ingresa los detalles del usuario.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div
                style={{ marginBottom: "15px" }}
                className="grid grid-cols-2 gap-1"
              >
                <div className="space-y-2 col-span-1">
                  <Label htmlFor="name">Nombre(s)*</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2 col-span-1">
                  <Label htmlFor="lastName">Apellidos*</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div
                style={{ marginBottom: "15px" }}
                className="grid grid-cols-2 gap-1"
              >
                <div className="space-y-2 col-span-1">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2 col-span-1">
                  <Label htmlFor="employeeNumber">No. empleado*</Label>
                  <Input
                    id="employeeNumber"
                    type="number"
                    value={employeeNumber}
                    onChange={(e) => setEmployeeNumber(e.target.value)}
                  />
                </div>
              </div>
              <div
                style={{ marginBottom: "15px" }}
                className="grid grid-cols-3 gap-1"
              >
                <div className="space-y-2 col-span-1">
                  <Label htmlFor="position">Puesto</Label>
                  <Input
                    id="position"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                  />
                </div>
                <div className="space-y-2 col-span-1">
                  <Label htmlFor="phoneNumber">Teléfono</Label>
                  <Input
                    id="phoneNumber"
                    type="number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <div className="space-y-2 col-span-1">
                  <Label htmlFor="entryDate">Fecha de ingreso</Label>
                  <Input
                    id="entryDate"
                    type="date"
                    value={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                  />
                </div>
              </div>
              <div
                style={{ marginBottom: "15px" }}
                className="grid grid-cols-2 gap-1"
              >
                <div className="space-y-2 col-span-1">
                  <Label htmlFor="departamento">Departamento*</Label>
                  <Select
                    value={selectedDepartamento || ""}
                    onValueChange={(value) => {
                      const selectedDepartamento = departamentos.find(
                        (d) => d.id === value
                      );
                      if (selectedDepartamento) {
                        setSelectedDepartamento(selectedDepartamento.id);
                        setDirectBoss("");
                        setSearchTermPass("");
                      }
                    }}
                    disabled={departamentos.length === 0} // Deshabilitar si no hay subcategorías
                  >
                    <SelectTrigger>
                      {departamentos.find((d) => d.id === selectedDepartamento)
                        ?.nombre || "Seleccione el departamento"}
                    </SelectTrigger>
                    <SelectContent>
                      {departamentos.length > 0 ? (
                        departamentos.map((dep) => (
                          <SelectItem key={dep.id} value={dep.id}>
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
                  <Label htmlFor="directBoss">Jefe Directo</Label>
                  <Select
                    onValueChange={(value) => {
                      setDirectBoss(value);
                      setSearchTermPass("");
                    }}
                    value={directBoss}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccione el jefe directo" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Input dentro del Select para filtrar, sin afectar la selección */}
                      <div className="p-2">
                        <Input
                          ref={inputRef}
                          placeholder="Buscar usuario..."
                          value={searchTermPass}
                          onChange={(e) => setSearchTermPass(e.target.value)}
                          onKeyDown={(e) => e.stopPropagation()} // Evitar selecciones accidentales con el teclado
                        />
                      </div>

                      {/* Filtrado sin selección automática */}
                      {users.filter(
                        (user) =>
                          user.nombre
                            .toLowerCase()
                            .includes(debouncedSearchTerm.toLowerCase()) ||
                          user.apellidos
                            .toLowerCase()
                            .includes(debouncedSearchTerm.toLowerCase())
                      ).length === 0 ? (
                        <div className="p-2 text-center text-gray-500">
                          No se encontraron usuarios
                        </div>
                      ) : (
                        users
                          .filter(
                            (user) =>
                              user.nombre
                                .toLowerCase()
                                .includes(debouncedSearchTerm.toLowerCase()) ||
                              user.apellidos
                                .toLowerCase()
                                .includes(debouncedSearchTerm.toLowerCase())
                          )
                          .map((user) => (
                            <SelectItem
                              key={user.id.toString()}
                              value={user.id.toString()}
                            >
                              {user.nombre} {user.apellidos}
                            </SelectItem>
                          ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div
                style={{ marginBottom: "15px" }}
                className="grid grid-cols-3 gap-1"
              >
                <div className="space-y-2 col-span-1">
                  <Label htmlFor="company">Empresa*</Label>
                  <Select
                    value={company}
                    onValueChange={(value) => {
                      setCompany(value); // Actualizar departamento seleccionado
                    }}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccione la empresa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">
                        Asesoría y desarrollo...
                      </SelectItem>
                      <SelectItem value="2">Eren</SelectItem>
                      <SelectItem value="3">Inik</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-1">
                  <Label htmlFor="workPlant">Planta*</Label>
                  <Select
                    value={workPlant}
                    onValueChange={(value) => {
                      setWorkPlant(value); // Actualizar departamento seleccionado
                    }}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccione una opción" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No</SelectItem>
                      <SelectItem value="1">Sí</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-1">
                  <Label htmlFor="role" className="text-right">
                    Rol
                  </Label>
                  <Select onValueChange={(value) => setSelectedRole(value)}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccione el rol para el usuario" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Máster">Máster</SelectItem>
                      <SelectItem value="Administrador">
                        Administrador
                      </SelectItem>
                      <SelectItem value="Estándar">Estándar</SelectItem>
                      <SelectItem value="Dado de baja">Dado de baja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div
                style={{ marginBottom: "15px" }}
                className="grid grid-cols-3 gap-1"
              >
                <div className="space-y-2 col-span-1">
                  <Label htmlFor="password">Contraseña*</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2 col-span-1">
                  <Label htmlFor="confirmPassword">
                    {" "}
                    Confirmar Contraseña*
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="********"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2 col-span-1">
                  <Label htmlFor="platforms">Plataformas</Label>
                  <br />
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => setOpen(true)}
                        style={{
                          backgroundColor: "white",
                          color: "#000000e8",
                          border: "1px solid lightgray",
                        }}
                        className="w-full"
                      >
                        Seleccionar plataformas
                      </Button>
                    </DialogTrigger>
                    <DialogContent
                      className=" overflow-y-auto no-scrollbar"
                      onInteractOutside={(event) => event.preventDefault()}
                      style={{
                        width: "100%",
                        maxWidth: "500px",
                        height: "29vh",
                        maxHeight: "35vh",
                        padding: "30px",
                        marginLeft: "120px",
                      }}
                    >
                      <DialogHeader>
                        <DialogTitle>Seleccionar plataformas</DialogTitle>
                        <DialogDescription>
                          Selecciona las plataformas que el usuario va a
                          utilizar.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-2 col-span-1">
                        {Object.keys(plataformas).map((key) => (
                          <div
                            key={key}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={key}
                              checked={!!selectedPlatforms[key]}
                              onCheckedChange={() => handleCheckboxChange(key)}
                              className="cursor-pointer"
                            />
                            <Label htmlFor={key} className="cursor-pointer">
                              {plataformas[key]}
                            </Label>
                          </div>
                        ))}
                      </div>
                      <DialogFooter>
                        <Button onClick={() => setOpen(false)}>Aceptar</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={
                    !name ||
                    !lastName ||
                    !employeeNumber ||
                    !selectedDepartamento ||
                    !company ||
                    !workPlant ||
                    !password ||
                    !confirmPassword
                  }
                >
                  Agregar usuario
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No. empleado</TableHead>
            <TableHead>Nombre completo</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Puesto</TableHead>
            <TableHead>Jefe directo</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentUsers.length > 0 ? (
            currentUsers.map((user, index) => (
              <TableRow key={index}>
                <TableCell>{user.numero_empleado || "Sin datos"}</TableCell>
                <TableCell>{user.nombre + " " + user.apellidos}</TableCell>
                <TableCell>{user.correo || "Usuario sin correo"}</TableCell>
                <TableCell>{user.nombre_dpto || "Sin datos"}</TableCell>
                <TableCell>{user.puesto || "Sin datos"}</TableCell>
                <TableCell>
                  {user.jefe_directo
                    ? (() => {
                        const jefe = users.find(
                          (u) => u.id === user.jefe_directo
                        );
                        return jefe
                          ? `${jefe.nombre} ${jefe.apellidos}`
                          : "Sin datos";
                      })()
                    : "Sin datos"}
                </TableCell>
                <TableCell>{user.rol}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openPermissionsDialog(user.id)}
                        >
                          Permisos
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            Editar permisos para:{" "}
                            {user.nombre + " " + user.apellidos}
                          </DialogTitle>
                          <DialogDescription>
                            Ajusta los permisos aquí.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="Editar"
                              onCheckedChange={() =>
                                handlePermissionChange("Editar")
                              }
                            />
                            <Label htmlFor="Editar">Asignar permisos</Label>
                          </div>
                          {/*<div className="flex items-center space-x-2">
                          <Checkbox id="Visualizar"  onCheckedChange={() => handlePermissionChange("Visualizar")}  />
                          <Label htmlFor="Visualizar">Visualizar 
                          </Label>
                        </div>*/}
                        </div>
                        <DialogFooter>
                          <Button type="submit">Guardar Cambios</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Cambiar contraseña
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            Cambiar contraseña de: {user.nombre}
                          </DialogTitle>
                          <DialogDescription>
                            Ingresa la nueva contraseña.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="new-password"
                              className="text-right"
                            >
                              Nueva contraseña
                            </Label>
                            <Input
                              id="new-password"
                              type="password"
                              className="col-span-3"
                              value={nuevaContraseña}
                              onChange={(e) =>
                                setNuevaContraseña(e.target.value)
                              }
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="confirm-password"
                              className="text-right"
                            >
                              Confirmar contraseña
                            </Label>
                            <Input
                              id="confirm-password"
                              type="password"
                              className="col-span-3"
                              value={confirmarContraseña}
                              onChange={(e) =>
                                setConfirmarContraseña(e.target.value)
                              }
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            type="submit"
                            onClick={() => handleChangePassword(user.id)}
                          >
                            Cambiar contraseña
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
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
                        className="border-none p-0 overflow-y-auto no-scrollbar"
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
                          <DialogTitle>Editar usuario</DialogTitle>
                          <DialogDescription>
                            Actualiza los detalles necesarios del usuario.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmitUpdate}>
                          <div
                            style={{ marginBottom: "15px" }}
                            className="grid grid-cols-2 gap-1"
                          >
                            <div className="space-y-2 col-span-1">
                              <Label htmlFor="name">Nombre(s)</Label>
                              <Input
                                id="name"
                                value={selectedUser?.nombre || ""}
                                onChange={(e) =>
                                  setSelectedUser({
                                    ...selectedUser,
                                    nombre: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2 col-span-1">
                              <Label htmlFor="lastName">Apellidos</Label>
                              <Input
                                id="lastName"
                                value={selectedUser?.apellidos || ""}
                                onChange={(e) =>
                                  setSelectedUser({
                                    ...selectedUser,
                                    apellidos: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                          <div
                            style={{ marginBottom: "15px" }}
                            className="grid grid-cols-2 gap-1"
                          >
                            <div className="space-y-2 col-span-1">
                              <Label htmlFor="email">Correo electrónico</Label>
                              <Input
                                id="email"
                                type="email"
                                value={selectedUser?.correo || ""}
                                onChange={(e) =>
                                  setSelectedUser({
                                    ...selectedUser,
                                    correo: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2 col-span-1">
                              <Label htmlFor="employeeNumber">
                                No. empleado
                              </Label>
                              <Input
                                id="employeeNumber"
                                type="number"
                                value={selectedUser?.numero_empleado || ""}
                                onChange={(e) =>
                                  setSelectedUser({
                                    ...selectedUser,
                                    numero_empleado: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                          <div
                            style={{ marginBottom: "15px" }}
                            className="grid grid-cols-3 gap-1"
                          >
                            <div className="space-y-2 col-span-1">
                              <Label htmlFor="position">Puesto</Label>
                              <Input
                                id="position"
                                value={selectedUser?.puesto || ""}
                                onChange={(e) =>
                                  setSelectedUser({
                                    ...selectedUser,
                                    puesto: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2 col-span-1">
                              <Label htmlFor="phoneNumber">Teléfono</Label>
                              <Input
                                id="phoneNumber"
                                type="number"
                                value={selectedUser?.telefono || ""}
                                onChange={(e) =>
                                  setSelectedUser({
                                    ...selectedUser,
                                    telefono: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2 col-span-1">
                              <Label htmlFor="entryDate">
                                Fecha de ingreso
                              </Label>
                              <Input
                                id="entryDate"
                                type="date"
                                value={selectedUser?.fecha_ingreso || ""}
                                onChange={(e) =>
                                  setSelectedUser({
                                    ...selectedUser,
                                    fecha_ingreso: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                          <div
                            style={{ marginBottom: "15px" }}
                            className="grid grid-cols-2 gap-1"
                          >
                            <div className="space-y-2 col-span-1">
                              <Label htmlFor="departamento">Departamento</Label>
                              <Select
                                value={
                                  selectedUser?.departamento_id?.toString() ||
                                  ""
                                }
                                onValueChange={(value) => {
                                  setSelectedUser((prevUser) => ({
                                    ...prevUser,
                                    departamento_id: value, // Actualizar el departamento del usuario seleccionado
                                    jefe_directo: "", // Reiniciar el jefe directo
                                  }));
                                  setSearchTermPass("");
                                }}
                                disabled={departamentos.length === 0} // Deshabilitar si no hay subcategorías
                              >
                                <SelectTrigger>
                                  {departamentos.find(
                                    (d) =>
                                      d.id === selectedUser?.departamento_id
                                  )?.nombre || "Seleccione el departamento"}
                                </SelectTrigger>
                                <SelectContent>
                                  {departamentos.length > 0 ? (
                                    departamentos.map((dep) => (
                                      <SelectItem key={dep.id} value={dep.id}>
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
                              <Label htmlFor="directBoss">Jefe Directo</Label>
                              <Select
                                value={
                                  selectedUser?.jefe_directo?.toString() || ""
                                }
                                onValueChange={(value) => {
                                  setSelectedUser((prevUser) => ({
                                    ...prevUser,
                                    jefe_directo: value, // Actualizar el jefe directo del usuario seleccionado
                                  }));
                                  setSearchTermPass("");
                                }}
                              >
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Seleccione el jefe directo" />
                                </SelectTrigger>
                                <SelectContent>
                                  {/* Input dentro del Select para filtrar, sin afectar la selección */}
                                  <div className="p-2">
                                    <Input
                                      ref={inputRef}
                                      placeholder="Buscar usuario..."
                                      value={searchTermPass}
                                      onChange={(e) =>
                                        setSearchTermPass(e.target.value)
                                      }
                                      onKeyDown={(e) => e.stopPropagation()} // Evitar selecciones accidentales con el teclado
                                    />
                                  </div>

                                  {/* Filtrado sin selección automática */}
                                  {users.filter(
                                    (user) =>
                                      user.nombre
                                        .toLowerCase()
                                        .includes(
                                          debouncedSearchTerm.toLowerCase()
                                        ) ||
                                      user.apellidos
                                        .toLowerCase()
                                        .includes(
                                          debouncedSearchTerm.toLowerCase()
                                        )
                                  ).length === 0 ? (
                                    <div className="p-2 text-center text-gray-500">
                                      No se encontraron usuarios
                                    </div>
                                  ) : (
                                    users
                                      .filter(
                                        (user) =>
                                          user.nombre
                                            .toLowerCase()
                                            .includes(
                                              debouncedSearchTerm.toLowerCase()
                                            ) ||
                                          user.apellidos
                                            .toLowerCase()
                                            .includes(
                                              debouncedSearchTerm.toLowerCase()
                                            )
                                      )
                                      .map((user) => (
                                        <SelectItem
                                          key={user.id.toString()}
                                          value={user.id.toString()}
                                        >
                                          {user.nombre} {user.apellidos}
                                        </SelectItem>
                                      ))
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div
                            style={{ marginBottom: "15px" }}
                            className="grid grid-cols-2 gap-1"
                          >
                            <div className="space-y-2 col-span-1">
                              <Label htmlFor="company">Empresa</Label>
                              <Select
                                value={
                                  selectedUser?.empresa_id.toString() || ""
                                }
                                onValueChange={(value) =>
                                  setSelectedUser((prevUser) => ({
                                    ...prevUser,
                                    empresa_id: value, // Actualizar el jefe directo del usuario seleccionado
                                  }))
                                }
                              >
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Seleccione la empresa" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">
                                    Asesoría y desarrollo...
                                  </SelectItem>
                                  <SelectItem value="2">Eren</SelectItem>
                                  <SelectItem value="3">Inik</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2 col-span-1">
                              <Label htmlFor="workPlant">Planta</Label>
                              <Select
                                value={selectedUser?.planta.toString() || ""}
                                onValueChange={(value) =>
                                  setSelectedUser((prevUser) => ({
                                    ...prevUser,
                                    planta: value, // Actualizar el jefe directo del usuario seleccionado
                                  }))
                                }
                              >
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Seleccione una opción" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="0">No</SelectItem>
                                  <SelectItem value="1">Sí</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div
                            style={{ marginBottom: "15px" }}
                            className="grid grid-cols-2 gap-1"
                          >
                            <div className="space-y-2 col-span-1">
                              <Label htmlFor="role" className="text-right">
                                Rol
                              </Label>
                              <Select
                                value={selectedUser?.rol || ""}
                                onValueChange={(value) =>
                                  setSelectedUser({
                                    ...selectedUser,
                                    rol: value,
                                  })
                                }
                              >
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Seleccione el rol para el usuario" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Máster">Máster</SelectItem>
                                  <SelectItem value="Administrador">
                                    Administrador
                                  </SelectItem>
                                  <SelectItem value="Estándar">
                                    Estándar
                                  </SelectItem>
                                  <SelectItem value="Dado de baja">
                                    Dado de baja
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2 col-span-1">
                              <Label htmlFor="platforms">Plataformas</Label>
                              <br />
                              <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                  <Button
                                    onClick={() => setOpen(true)}
                                    style={{
                                      backgroundColor: "white",
                                      color: "#000000e8",
                                      border: "1px solid lightgray",
                                    }}
                                    className="w-full"
                                  >
                                    Seleccionar plataformas
                                  </Button>
                                </DialogTrigger>
                                <DialogContent
                                  className=" overflow-y-auto no-scrollbar"
                                  onInteractOutside={(event) =>
                                    event.preventDefault()
                                  }
                                  style={{
                                    width: "100%",
                                    maxWidth: "500px",
                                    height: "29vh",
                                    maxHeight: "35vh",
                                    padding: "30px",
                                    marginLeft: "120px",
                                  }}
                                >
                                  <DialogHeader>
                                    <DialogTitle>
                                      Seleccionar plataformas
                                    </DialogTitle>
                                    <DialogDescription>
                                      Selecciona las plataformas que el usuario
                                      va a utilizar.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-2 col-span-1">
                                    {Object.keys(plataformas).map((key) => (
                                      <div
                                        key={key}
                                        className="flex items-center space-x-2"
                                      >
                                        <Checkbox
                                          id={key}
                                          checked={
                                            !!(typeof selectedUser?.plataformas ===
                                            "string"
                                              ? JSON.parse(
                                                  selectedUser.plataformas
                                                )[key]
                                              : selectedUser?.plataformas?.[
                                                  key
                                                ] || false)
                                          }
                                          onCheckedChange={() =>
                                            handleCheckboxChangeEdit(key)
                                          }
                                          className="cursor-pointer"
                                        />
                                        <Label
                                          htmlFor={key}
                                          className="cursor-pointer"
                                        >
                                          {plataformas[key]}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                  <DialogFooter>
                                    <Button onClick={() => setOpen(false)}>
                                      Aceptar
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit">Actualizar usuario</Button>
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
              <TableCell colSpan={8} className="text-center">
                No se encontraron usuarios
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Dialog
        open={isFormSectionsDialogOpen}
        onOpenChange={setIsFormSectionsDialogOpen}
      >
        <DialogContent
          className="overflow-y-auto no-scrollbar"
          style={{
            width: "30%", // Ajusta el ancho
            maxWidth: "900px", // Límite del ancho
            maxHeight: "82vh", // Límite de la altura
          }}
        >
          <DialogHeader>
            <DialogTitle>{selectedPermission}</DialogTitle>
            <DialogDescription>
              Elige la sección del formulario para editar.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedSections.map((sectionId) => {
                const section = formSections.find((s) => s.id === sectionId);
                return (
                  <span
                    key={sectionId}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground"
                  >
                    {section?.name}
                    <button
                      type="button"
                      onClick={() => removeSection(sectionId)}
                      className="flex-shrink-0 ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-primary-foreground hover:bg-primary-foreground hover:text-primary focus:outline-none focus:bg-primary-foreground focus:text-primary"
                    >
                      <span className="sr-only">
                        quitar {section?.name} opción
                      </span>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}
            </div>
            {formSections.map((section) => (
              <div key={section.id} className="flex items-center space-x-2">
                <Checkbox
                  id={section.id}
                  checked={selectedSections.includes(section.id)}
                  onCheckedChange={() => handleSectionSelection(section.id)}
                />
                <Label htmlFor={section.id}>{section.name}</Label>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={openChangeOptionsDialog}>Siguiente</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isChangeOptionsDialogOpen}
        onOpenChange={setIsChangeOptionsDialogOpen}
      >
        <DialogContent
          className="overflow-y-auto no-scrollbar"
          style={{
            width: "32%", // Ajusta el ancho
            maxWidth: "900px", // Límite del ancho
            maxHeight: "95vh", // Límite de la altura
          }}
        >
          <DialogHeader>
            <DialogTitle>Selecciona las opciones</DialogTitle>
            <DialogDescription>
              Estas opciones estarán disponibles para editar.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {selectedSections.map((sectionId) => {
              const section = formSections.find((s) => s.id === sectionId);
              return (
                <div key={sectionId}>
                  <h3 className="font-semibold mb-2">{section?.name}</h3>
                  <div className="grid gap-2">
                    {section?.changeOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${sectionId}-${option}`}
                          checked={selectedChanges[sectionId]?.includes(option)}
                          onCheckedChange={() =>
                            handleChangeOptionSelection(sectionId, option)
                          }
                        />
                        <Label htmlFor={`${sectionId}-${option}`}>
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button onClick={saveSelections}>Guardar valores</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
