"use client";

import { useState, useRef, useEffect } from "react";
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
import { Button as Button2 } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import axios from "axios";
import Swal from "sweetalert2";
import styles from "../../../../public/CSS/spinner.css";
import { useSession } from "next-auth/react";
import React from "react";
import { Tooltip } from "react-tippy";
import "react-tippy/dist/tippy.css"; // Asegúrate de importar los estilos
import HelpIcon from "@mui/icons-material/Help"; // Ícono de signo de interrogación
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Upload } from "lucide-react";
import { startOfDay, addDays, subDays, format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import "../../../../public/CSS/spinner.css";
import { PlusCircle, X } from "lucide-react";
import { useUserContext } from "@/utils/userContext";

export function TablaSolicitudes() {
  const { userData, loading } = useUserContext();
  const nombre = userData?.user?.nombre;
  const apellidos = userData?.user?.apellidos;
  const idUser = userData?.user?.id;
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [eventos, setEventos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [tipoFormulario, setTipoFormulario] = useState("todos"); // Estado para el tipo de formulario seleccionado
  const [tipoFormulario2, setTipoFormulario2] = useState(""); // Estado para el tipo de formulario seleccionado
  const [formularioAbierto, setFormularioAbierto] = useState(false); // Estado para abrir el formulario
  const [formularioPrincipalAbierto, setFormularioPrincipalAbierto] =
    useState(false); // Estado para abrir el formulario
  const [formularioPrincipalAbiertoEdit, setFormularioPrincipalAbiertoEdit] =
    useState(false); // Estado para abrir el formulario
  const [allUsers, setAllUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [usersBonos, setUsersBonos] = useState([]);
  const [fechaInicioPapeleta, setFechaInicio] = useState("");
  const [fechaFinPapeleta, setFechaFin] = useState("");
  const [ver, setVer] = useState(false);
  const [formularioNormalOExtemporaneo, setFormularioNormalOExtemporaneo] =
    useState(""); // Estado para abrir el formulario
  const [tipoFormularioAbierto, setTipoFormularioAbierto] = useState(false); // Estado para abrir el formulario
  const [isDisabled, setIsDisabled] = useState(false);
  const [idFormulario, setIDFormulario] = useState("");
  const [grupoFormulario, setGrupoFormulario] = useState("");
  const [formularioExt, setFormularioExt] = useState("");
  const [loadingFormat, setLoadingFormat] = useState(false);
  const [searchTermPass, setSearchTermPass] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const inputRef = useRef(null);
  const [searchTerms, setSearchTerms] = useState({});
  const [debouncedSearchTerms, setDebouncedSearchTerms] = useState({});

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const day = now.getDay(); // 0: Domingo, 1: Lunes, ..., 3: Miércoles, ..., 6: Sábado
      const hours = now.getHours();
      const minutes = now.getMinutes();

      // Deshabilitar los miércoles a las 12 PM (12:00 - 23:59)
      if (day === 3 && hours >= 12) {
        setIsDisabled(true);
      }
      // Habilitar el jueves a las 12 AM (00:00 en adelante)
      else if (day === 4 && hours === 0 && minutes === 0) {
        setIsDisabled(false);
      }
    };

    // Ejecutar al cargar el componente
    checkTime();

    // Verificar la hora cada minuto
    const interval = setInterval(async () => checkTime(), 60000);

    return () => clearInterval(interval);
  }, []);

  // Este useEffect se encarga del debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTermPass);
    }, 500);

    return () => {
      clearTimeout(handler); // limpia el timeout si se escribe antes de los 3s
    };
  }, [searchTermPass]);

  useEffect(() => {
    const timeouts = Object.entries(searchTerms).map(([index, term]) => {
      return setTimeout(() => {
        setDebouncedSearchTerms((prev) => ({
          ...prev,
          [index]: term,
        }));
      }, 500);
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [searchTerms]);

  const closeModalFormsEdit = () => {
    setFormularioPrincipalAbiertoEdit(false); // Cerrar el formulario
  };

  const openModal = () => {
    setFormData({
      dias: "",
      horas: "",
      fechaInicio: null,
      fechaFin: null,
      motivo: "",
      comprobante: null,
      justificada: "",
      pagada: "",
      conSueldo: "",
      horaFormulario: "",
      fechaFormulario: null,
      horaInicio: "",
      horaFin: "",
      noOrden: "",
      nombreProducto: "",
      cantidadProgramada: "",
      cantidadTerminada: "",
      noPersonal: "",
      nombrePersonal: "",
      area: "",
      nombreColaborador: "",
      puestoColaborador: "",
      comentarios: "",
      tipoSolicitud: "",
      noBono: "",
      nombreBono: "",
      bonoCantidad: "",
      comision: "",
      total: 0,
      totalFinal: 0,
      sueldoActual: "",
      nuevoSueldo: "",
      planTrabajo: {
        otros: [],
      },
      personal: {
        otros: [],
      },
      productos: {
        otros: [],
      },
      bonos: {
        otros: [],
      },
    });
    setFormularioAbierto(true); // Abrir el formulario
    setUsersBonos([]);
    setSearchTermPass("");
    setSearchTerms({});
    setDebouncedSearchTerm("");
    setDebouncedSearchTerms({});
  };

  const openModalType = () => {
    setTipoFormulario2("");
    setFormularioPrincipalAbierto(true); // Abrir el formulario
  };

  const openModalFormsType = () => {
    setFormularioNormalOExtemporaneo("");
    setTipoFormularioAbierto(true);
  };

  const closeModal = () => {
    setFormularioAbierto(false); // Cerrar el formulario
  };

  const closeModalEdit = () => {
    setFormularioPrincipalAbiertoEdit(false); // Cerrar el formulario
  };

  const closeModalForms = () => {
    setFormularioPrincipalAbierto(false); // Cerrar el formulario
  };

  const closeModalFormsType = () => {
    setTipoFormularioAbierto(false); // Cerrar el formulario
  };

  const [formData, setFormData] = useState({
    dias: "",
    horas: "",
    fechaInicio: null,
    fechaFin: null,
    motivo: "",
    comprobante: null,
    justificada: "",
    pagada: "",
    conSueldo: "",
    horaFormulario: "",
    fechaFormulario: null,
    horaInicio: "",
    horaFin: "",
    noOrden: "",
    nombreProducto: "",
    cantidadProgramada: "",
    cantidadTerminada: "",
    noPersonal: "",
    nombrePersonal: "",
    area: "",
    nombreColaborador: "",
    puestoColaborador: "",
    comentarios: "",
    tipoSolicitud: "",
    noBono: "",
    nombreBono: "",
    bonoCantidad: "",
    comision: "",
    total: 0,
    totalFinal: 0,
    sueldoActual: "",
    nuevoSueldo: "",
    planTrabajo: {
      otros: [],
    },
    personal: {
      otros: [],
    },
    productos: {
      otros: [],
    },
    bonos: {
      otros: [],
    },
  });

  useEffect(() => {
    const fetchUsers = async () => {
      if (!idUser) {
        // Si el idUser no está disponible, no hacemos la solicitud
        return;
      }

      try {
        const response = await axios.get(
          `/api/Users/getBossUsersRequests?id=${idUser}`
        );
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
  }, [idUser]);

  //Obtenemos los usuarios para el formulario de bonos y comisiones
  const obtenerUsuariosBonos = (value) => {
    const fetchUsers = async () => {
      if (value == "comisiones") {
        const departamentoBonos = 13;

        try {
          const response = await axios.get(
            `/api/Gente&CulturaAbsence/getUsersBonosRequests?departamento=${departamentoBonos}`
          );
          if (response.data.success) {
            setUsersBonos(response.data.users);
          } else {
            console.error(
              "Error al obtener los usuarios:",
              response.data.message
            );
          }
        } catch (error) {
          console.error("Error al hacer fetch de los usuarios:", error);
        }
      } else {
        try {
          const response = await axios.get(
            `/api/Gente&CulturaAbsence/getUsersBonosRequests`
          );
          if (response.data.success) {
            setUsersBonos(response.data.users);
          } else {
            console.error(
              "Error al obtener los usuarios:",
              response.data.message
            );
          }
        } catch (error) {
          console.error("Error al hacer fetch de los usuarios:", error);
        }
      }
    };

    fetchUsers();
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/Users/getUsers");
        if (response.data.success) {
          setAllUsers(response.data.users);
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

  const handleCheckboxChange = (value) => {
    setTipoFormulario2(value);
  };

  const handleCheckboxChangeTypeForm = (value) => {
    setFormularioNormalOExtemporaneo(value);
  };

  const handleSearchChange = (value, index = null) => {
    if (index === null) {
      setSearchTermPass(value); // para el bono principal
    } else {
      setSearchTerms((prev) => ({ ...prev, [index]: value }));
    }
  };

  const encabezadosSolicitudes = [
    "ID",
    "Tipo",
    "Número de empleado",
    "Nombre",
    "Departamento",
    "Puesto",
    "Jefe directo",
    "Fecha de subida",
    "Fecha de último movimiento",
    "Comentarios",
    "Estatus",
    "Acción",
  ];

  const fetchEventos = async () => {
    try {
      const response = await axios.get(
        `/api/Gente&CulturaAbsence/getSolicitudes?id=${idUser}`
      ); // Asegúrate de que esta ruta esté configurada en tu backend
      setEventos(response.data);
    } catch (error) {
      console.error("Error al obtener eventos:", error);
    }
  };

  // Obtener eventos desde el backend
  useEffect(() => {
    if (!idUser) {
      // Si el idUser no está disponible, no hacemos la solicitud
      return;
    }

    const fetchPapeletas = async () => {
      try {
        const response = await axios.get(
          `/api/Gente&CulturaAbsence/getSolicitudes?id=${idUser}`
        ); // Asegúrate de que esta ruta esté configurada en tu backend
        setEventos(response.data);
      } catch (error) {
        console.error("Error al obtener eventos:", error);
      }
    };
    fetchPapeletas();
  }, [idUser]);

  const handleEditForm = async (index) => {
    try {
      const response = await fetch(
        `/api/Gente&CulturaAbsence/obtenerFormularioFaltas?id=${index}`
      );
      const data = await response.json();
      setFormData(data.formulario);
      setTipoFormulario2(data.tipo);
      setFechaInicio(data.fecha_inicio);
      setFechaFin(data.fecha_fin);
      setFormularioPrincipalAbiertoEdit(true);
      obtenerUsuariosBonos(data.formulario.tipoSolicitud);
      setVer(true);
      setSearchTermPass("");
      setSearchTerms({});
      setDebouncedSearchTerm("");
      setDebouncedSearchTerms({});
    } catch (error) {
      console.error("Error al obtener el formulario:", error);
    }
  };

  const handleEditar = async (index) => {
    try {
      const response = await fetch(
        `/api/Gente&CulturaAbsence/obtenerFormularioFaltas?id=${index}`
      );
      const data = await response.json();
      setIDFormulario(data.id);
      setGrupoFormulario(data.formulario_id);
      setFormData(data.formulario);
      setTipoFormulario2(data.tipo);
      setFormularioExt(data.extemporanea);
      setFechaInicio(data.fecha_inicio);
      setFechaFin(data.fecha_fin);
      setFormularioPrincipalAbiertoEdit(true);
      obtenerUsuariosBonos(data.formulario.tipoSolicitud);
      setVer(false);
      setSearchTermPass("");
      setSearchTerms({});
      setDebouncedSearchTerm("");
      setDebouncedSearchTerms({});
    } catch (error) {
      console.error("Error al obtener el formulario:", error);
    }
  };

  const añadirPersonal = () => {
    setFormData((prevData) => ({
      ...prevData,
      personal: {
        otros: [
          ...prevData.personal.otros,
          {
            noPersonal: "",
            nombrePersonal: "",
            area: "",
          },
        ],
      },
    }));
  };

  const eliminarPersonal = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      personal: {
        otros: prevData.personal.otros.filter((_, i) => i !== index),
      },
    }));
  };

  const añadirProducto = () => {
    setFormData((prevData) => ({
      ...prevData,
      productos: {
        otros: [
          ...prevData.productos.otros,
          {
            noOrden: "",
            nombreProducto: "",
            cantidadProgramada: "",
            cantidadTerminada: "",
          },
        ],
      },
    }));
  };

  const eliminarProducto = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      productos: {
        otros: prevData.productos.otros.filter((_, i) => i !== index),
      },
    }));
  };

  const añadirBono = () => {
    setFormData((prevData) => ({
      ...prevData,
      bonos: {
        otros: [
          ...prevData.bonos.otros,
          {
            noBono: "",
            nombreBono: "",
            bonoCantidad: "",
            comision: "",
            comentarios: "",
            total: 0,
            totalFinal: 0,
          },
        ],
      },
    }));
  };

  const eliminarBono = (index) => {
    setFormData((prevData) => {
      // Eliminar el elemento en el índice indicado
      const updatedOtros = prevData.bonos.otros.filter((_, i) => i !== index);

      // Recalcular los totales después de eliminar el campo
      let totalFijo = parseFloat(prevData.total) || 0;
      let totalDinamico = updatedOtros.reduce((sum, item) => {
        const bono = parseFloat(item.bonoCantidad) || 0;
        const comision = parseFloat(item.comision) || 0;
        return sum + bono + comision;
      }, 0);

      // Total final es la suma de los totales fijos y dinámicos
      const totalFinal = totalFijo + totalDinamico;

      // Actualizar el estado con el array de bonos actualizado y el nuevo totalFinal
      return {
        ...prevData,
        bonos: { otros: updatedOtros },
        totalFinal,
      };
    });
  };

  // Función para extraer los datos relevantes
  const extractData = (evento) => {
    const handleDelete = async (index) => {
      try {
        // Mostrar alerta de confirmación
        const result = await Swal.fire({
          title: "¿Deseas eliminar la solicitud?",
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
            `/api/Gente&CulturaAbsence/eliminarFormularioFaltas?id=${index}`
          );
          if (response.status === 200) {
            fetchEventos();
            await Swal.fire(
              "Eliminada",
              "La solicitud ha sido eliminada correctamente",
              "success"
            );
          } else {
            Swal.fire("Error", "Error al eliminar la solicitud", "error");
          }
        }
      } catch (error) {
        console.error("Error al eliminar la solicitud:", error);
        Swal.fire(
          "Error",
          "Ocurrió un error al intentar eliminar la solicitud",
          "error"
        );
      }
    };

    return {
      id: evento.id,
      id_papeleta: evento.id_papeleta,
      tipo:
        evento.tipo === "Suspension"
          ? "Suspensión o castigo" +
            (evento.extemporanea === 1 ? " - Extemporánea" : "")
          : evento.tipo + (evento.extemporanea === 1 ? " - Extemporánea" : ""),
      nombre: evento.nombre + " " + evento.apellidos,
      departamento: evento.nombre_departamento,
      puesto: evento.puesto,
      numero_empleado: evento.numero_empleado,
      fecha_subida: evento.fecha_subida,
      fecha_actualizacion: evento.fecha_actualizacion,
      jefe_directo: evento.jefe_directo,
      comentarios: evento.comentarios,
      estatus: evento.estatus,
      accion: (index) => (
        <div style={{ display: "flex", gap: "1px" }}>
          <Button
            style={{ width: "1px", height: "40px" }}
            onClick={() => handleEditForm(index)}
          >
            <VisualizeIcon />
          </Button>
          <Button
            onClick={() => handleEditar(index)}
            style={{
              width: "1px",
              height: "40px",
              opacity: evento.estatus !== "Pendiente" ? "0.7" : "1",
            }}
            disabled={evento.estatus !== "Pendiente"}
          >
            <EditIcon />
          </Button>
          <Button
            onClick={() => handleDelete(index)}
            style={{
              width: "1px",
              height: "40px",
              opacity: evento.estatus !== "Pendiente" ? "0.7" : "1",
            }}
            disabled={evento.estatus !== "Pendiente"}
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
        </div>
      ),
    };
  };

  // Filtrar eventos según el término de búsqueda y estatus
  const filteredEventos = eventos.map(extractData).filter(
    (evento) =>
      (statusFilter === "todos" || evento.estatus === statusFilter) && // Filtro por estatus
      (tipoFormulario === "todos" ||
        evento.tipo.split(" - ")[0] === tipoFormulario) && // Filtro por tipo de formulario
      Object.values(evento)
        .filter((value) => value !== null && value !== undefined) // Filtra valores nulos o indefinidos
        .some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        ) // Filtro por término de búsqueda
  );

  const { data: session, status } = useSession();
  if (status === "loading" || loading) {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((formData) => ({
      ...formData,
      [name]: value,
    }));
  };

  const handleChange2 = ({ name, value }) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value, // Actualiza dinámicamente el campo según el `name`
    }));
  };

  const handleProductoChange = (e, index, field) => {
    const { name, value } = e.target;
    setFormData((prevState) => {
      const nuevosOtros = [...prevState.productos.otros];
      nuevosOtros[index] = {
        ...nuevosOtros[index],
        [field || name]: value,
      };
      return {
        ...prevState,
        productos: {
          otros: nuevosOtros,
        },
      };
    });
  };

  const handlePersonalChange = (e, index, field) => {
    const { name, value } = e.target;
    setFormData((prevState) => {
      const nuevosOtros = [...prevState.personal.otros];
      nuevosOtros[index] = {
        ...nuevosOtros[index],
        [field || name]: value,
      };
      return {
        ...prevState,
        personal: {
          otros: nuevosOtros,
        },
      };
    });
  };

  const handleChangeBonos = (e, index = null, field = null) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      let updatedData = { ...prevData };

      if (index !== null && field) {
        const updatedOtros = [...prevData.bonos.otros];

        updatedOtros[index] = {
          ...updatedOtros[index],
          [field]: value, // Guardamos el valor tal cual, sin convertir a número aún
        };

        // Solo si los campos son numéricos, los parseamos para calcular el total
        const bono = parseFloat(updatedOtros[index]?.bonoCantidad) || 0;
        const comision = parseFloat(updatedOtros[index]?.comision) || 0;
        updatedOtros[index].total = bono + comision;

        updatedData.bonos = { otros: updatedOtros };
      } else if (name) {
        updatedData[name] = value;

        const bono = parseFloat(updatedData.bonoCantidad) || 0;
        const comision = parseFloat(updatedData.comision) || 0;
        updatedData.total = bono + comision;
      }

      const totalFijo = parseFloat(updatedData.total) || 0;
      const totalDinamico = updatedData.bonos?.otros.reduce((sum, item) => {
        const bono = parseFloat(item.bonoCantidad) || 0;
        const comision = parseFloat(item.comision) || 0;
        return sum + bono + comision;
      }, 0);

      updatedData.totalFinal = totalFijo + totalDinamico;

      return updatedData;
    });
  };

  const handleChangeComentario = (index, value) => {
    const updatedBonos = [...formData.bonos.otros];
    updatedBonos[index] = {
      ...updatedBonos[index],
      comentarios: value,
    };
    setFormData({
      ...formData,
      bonos: {
        ...formData.bonos,
        otros: updatedBonos,
      },
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Tipo de archivo no permitido");
        return;
      }

      const maxSize = 4 * 1024 * 1024;

      if (file.size > maxSize) {
        Swal.fire({
          title: "Error",
          text: "El archivo es demasiado grande. El tamaño máximo permitido es 4MB.",
          icon: "error",
          timer: 3000, // La alerta desaparecerá después de 1.5 segundos
          showConfirmButton: false,
        });
        e.target.value = ""; // Limpia el input de archivo
        return;
      }

      setFormData((prev) => ({ ...prev, comprobante: file.name }));
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Cargando...",
      text: "Estamos procesando tu solicitud",
      showConfirmButton: false,
      allowOutsideClick: false, // Evita que se cierre haciendo clic fuera de la alerta
      willOpen: () => {
        Swal.showLoading(); // Muestra el indicador de carga (spinner)
      },
    });

    if (!session) {
      return;
    }

    try {
      const fileInput = document.getElementById("comprobante");
      if (fileInput && fileInput.files.length > 0) {
        const file = fileInput.files[0];

        // Crear FormData y agregar archivo
        const formDataFTP = new FormData();
        formDataFTP.append("comprobante", file); // "archivo" debe coincidir con formidable

        try {
          const ftpResponse = await fetch(
            "/api/Gente&CulturaPermission/subirPDFPapeletas",
            {
              method: "POST",
              body: formDataFTP, // No se define Content-Type manualmente, fetch lo hace
            }
          );

          const ftpResult = await ftpResponse.json();

          Swal.close();

          if (ftpResponse.ok) {
            // Asignar el nombre del archivo subido a formData.comprobante
            formData.comprobante = ftpResult.fileName;
          } else {
            console.error("Error al subir el archivo al FTP", ftpResult);
            Swal.fire({
              title: "Error",
              text: "Error al subir el archivo",
              icon: "error",
              timer: 3000,
              showConfirmButton: false,
            });
            return;
          }
        } catch (ftpError) {
          console.error("Error en la solicitud de FTP", ftpError);
          Swal.fire({
            title: "Error",
            text: "Error en la subida del archivo",
            icon: "error",
            timer: 3000,
            showConfirmButton: false,
          });
          return;
        }
      }

      // Luego de subir el archivo (o si no hay), enviar el resto del formulario
      await enviarFormulario();
    } catch (error) {
      console.error("Error en el formulario:", error);
      Swal.close();
      Swal.fire({
        title: "Error",
        text: "Error al enviar el formulario",
        icon: "error",
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };

  const enviarFormulario = async () => {
    const mensaje1 = `<strong>${
      nombre + " " + apellidos
    }</strong> ha subido una nueva solicitud de tipo: <strong>${tipoFormulario2}</strong>.<br>
      Puedes revisarla haciendo clic en este enlace: <a href="/gente_y_cultura/todas_papeletas" style="color: blue; text-decoration: underline;">Revisar solicitud</a>`;
    const mensaje2 = `<strong>${
      nombre + " " + apellidos
    }</strong> ha subido una nueva solicitud extemporánea de tipo: <strong>${tipoFormulario2}</strong>.<br>
      Puedes revisarla haciendo clic en este enlace: <a href="/gente_y_cultura/todas_papeletas" style="color: blue; text-decoration: underline;">Revisar solicitud</a>`;
    try {
      const response = await fetch(
        `/api/Gente&CulturaAbsence/guardarFormularioFaltas?id=${idUser}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            formData,
            tipoFormulario2,
            formularioNormalOExtemporaneo,
          }),
        }
      );

      if (response.ok) {
        const mensaje =
          formularioNormalOExtemporaneo === "Normal" ? mensaje1 : mensaje2;
        try {
          const enviarNotificacion = await fetch(
            "/api/Reminder/EnvioEventoSolicitudes",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                formData2: {
                  tipo: "Alerta de nueva solicitud",
                  descripcion: mensaje,
                  id: idUser,
                  dpto: null,
                },
              }),
            }
          );

          if (enviarNotificacion.ok) {
            closeModal();
            closeModalForms();
            closeModalFormsType();
            fetchEventos();
            Swal.fire({
              title: "Creado",
              text: "Se ha creado correctamente",
              icon: "success",
              timer: 3000,
              showConfirmButton: false,
            });
          } else {
            console.error("Error al enviar la notificación");
            Swal.fire("Error", "Error al enviar la notificación", "error");
          }
        } catch (error) {
          console.error("Error en la solicitud de notificación:", error);
          Swal.close();
          Swal.fire("Error", "Error en la notificación", "error");
        }
      } else {
        Swal.fire("Error", "Error al crear la solicitud", "error");
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      Swal.close();
      Swal.fire("Error", "Error al enviar el formulario", "error");
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Cargando...",
      text: "Estamos procesando tu solicitud",
      showConfirmButton: false,
      allowOutsideClick: false, // Evita que se cierre haciendo clic fuera de la alerta
      willOpen: () => {
        Swal.showLoading(); // Muestra el indicador de carga (spinner)
      },
    });

    if (!session) {
      return;
    }

    try {
      const fileInput = document.getElementById("comprobante");
      if (fileInput && fileInput.files.length > 0) {
        const file = fileInput.files[0];

        // Crear FormData y agregar archivo
        const formDataFTP = new FormData();
        formDataFTP.append("comprobante", file); // "archivo" debe coincidir con formidable

        try {
          const ftpResponse = await fetch(
            "/api/Gente&CulturaPermission/subirPDFPapeletas",
            {
              method: "POST",
              body: formDataFTP, // No se define Content-Type manualmente, fetch lo hace
            }
          );

          const ftpResult = await ftpResponse.json();

          Swal.close();

          if (ftpResponse.ok) {
            // Asignar el nombre del archivo subido a formData.comprobante
            formData.comprobante = ftpResult.fileName;
          } else {
            console.error("Error al subir el archivo al FTP", ftpResult);
            Swal.fire({
              title: "Error",
              text: "Error al subir el archivo",
              icon: "error",
              timer: 3000,
              showConfirmButton: false,
            });
            return;
          }
        } catch (ftpError) {
          console.error("Error en la solicitud de FTP", ftpError);
          Swal.fire({
            title: "Error",
            text: "Error en la subida del archivo",
            icon: "error",
            timer: 3000,
            showConfirmButton: false,
          });
          return;
        }
      }

      // Luego de subir el archivo (o si no hay), enviar el resto del formulario
      await actualizarFormulario();
    } catch (error) {
      console.error("Error en el formulario:", error);
      Swal.close();
      Swal.fire({
        title: "Error",
        text: "Error al actualizar el formulario",
        icon: "error",
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };

  const actualizarFormulario = async () => {
    try {
      const response = await fetch(
        `/api/Gente&CulturaAbsence/actualizarFormularioFaltas?id=${idUser}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            formData,
            tipoFormulario2,
            formularioExt,
            grupoFormulario,
          }),
        }
      );

      if (response.ok) {
        closeModalEdit();
        fetchEventos();
        Swal.fire({
          title: "Actualizada",
          text: "La solicitud ha sido actualizada correctamente",
          icon: "success",
          timer: 3000,
          showConfirmButton: false,
        });
      } else {
        console.error("Error al actualizar el formulario");
        Swal.fire({
          title: "Error",
          text: "Error al actualizar el formulario",
          icon: "error",
          timer: 3000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error(
        "Error en la solicitud de actualización de formulario:",
        error
      );
      Swal.close();
      Swal.fire({
        title: "Error",
        text: "Error en la actualización del formulario",
        icon: "error",
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };

  const handleDownload = async () => {
    setLoadingFormat(true); // Asegúrate que esta sea la misma usada en el botón

    Swal.fire({
      title: "Descargando...",
      text: "Estamos procesando el archivo, por favor espere...",
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const fileName = "formato_movi_personal.xlsx";
    const url = `/api/Gente&CulturaAbsence/descargarPDF?fileName=${encodeURIComponent(
      fileName
    )}`;

    // Puedes usar un timeout solo para asegurar la carga visual
    setTimeout(() => {
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      link.setAttribute("target", "_blank");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      Swal.close();
      setLoadingFormat(false);
    }, 1000);
  };

  const renderDatePicker = (
    label,
    date,
    handleChange,
    name,
    readOnly = false,
    removeSpacing = false,
    editMode = false
  ) => {
    // Obtener la fecha actual sin horas
    const hoy = startOfDay(new Date());
    const diaSemana = hoy.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado

    let juevesInicioNomina = null;
    let restringirDesdeJueves = false;

    // Si es creación y seleccionó "Normal"
    if (!editMode && formularioNormalOExtemporaneo === "Normal") {
      restringirDesdeJueves = true;
    }

    // Si es edición y el formulario NO es extemporáneo
    if (editMode && formularioExt === 0) {
      restringirDesdeJueves = true;
    }

    if (restringirDesdeJueves) {
      juevesInicioNomina = addDays(hoy, 4 - diaSemana);
      if (diaSemana <= 3) {
        juevesInicioNomina = subDays(juevesInicioNomina, 7);
      }
    }

    return (
      <div className={removeSpacing ? "" : "space-y-2"}>
        <Label>{label}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button2
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
              disabled={readOnly}
            >
              <CalendarIcon className="h-4 w-4" />
              {date ? (
                format(date, "PP", { locale: es })
              ) : (
                <span className="truncate">Selecciona una fecha</span>
              )}
            </Button2>
          </PopoverTrigger>
          {!readOnly && (
            <PopoverContent className="p-4 min-w-[320px]">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(selectedDate) => {
                  handleChange({ target: { name, value: selectedDate } });
                }}
                initialFocus
                className="grid grid-cols-7 gap-1"
                locale={es}
                fromDate={restringirDesdeJueves ? juevesInicioNomina : null}
                toDate={null} // Hasta el miércoles siguiente
                render={{
                  header: () => (
                    <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-700">
                      <span>D</span>
                      <span>L</span>
                      <span>M</span>
                      <span>MI</span>
                      <span>J</span>
                      <span>V</span>
                      <span>S</span>
                    </div>
                  ),
                }}
              />
            </PopoverContent>
          )}
        </Popover>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-center items-center text-center mb-4">
        <CardTitle className="text-3xl font-bold">Mis solicitudes</CardTitle>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
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
          onClick={openModalFormsType}
        >
          <PermisosIcon className="h-4 w-4" />
          AGREGAR SOLICITUD
        </Button>
      </div>
      <br />
      {tipoFormularioAbierto && (
        <Dialog open={tipoFormularioAbierto} onOpenChange={closeModalFormsType}>
          <DialogContent
            className="border-none p-0 overflow-y-auto w-full max-w-[32.5vw] max-h-[30vh] shadow-lg ml-[6vw] mt-auto"
            onInteractOutside={(event) => event.preventDefault()}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                  Nueva solicitud
                </CardTitle>
                <DialogDescription className="text-center">
                  Selecciona el tipo de solicitud
                </DialogDescription>
              </CardHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="Normal"
                    checked={formularioNormalOExtemporaneo === "Normal"}
                    onCheckedChange={(checked) => {
                      handleCheckboxChangeTypeForm(checked ? "Normal" : "");
                      if (checked) openModalType(); // Abrir el modal después de actualizar el estado
                    }}
                    style={{ marginLeft: "30px" }}
                    disabled={isDisabled}
                  />
                  <Label htmlFor="Normal">Normal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="Extemporánea"
                    checked={formularioNormalOExtemporaneo === "Extemporánea"}
                    onCheckedChange={(checked) => {
                      handleCheckboxChangeTypeForm(
                        checked ? "Extemporánea" : ""
                      );
                      if (checked) openModalType(); // Abrir el modal después de actualizar el estado
                    }}
                    style={{ marginLeft: "30px" }}
                  />
                  <Label htmlFor="Extemporánea">
                    Extemporánea (Omisiones o aclaraciones de nómina)
                  </Label>
                </div>
              </div>
            </Card>
          </DialogContent>
        </Dialog>
      )}
      {formularioPrincipalAbierto && (
        <Dialog
          open={formularioPrincipalAbierto}
          onOpenChange={closeModalForms}
        >
          <DialogContent
            className="border-none p-0 overflow-y-auto w-full max-w-[32.5vw] max-h-[40vh] shadow-lg ml-[6vw] mt-auto"
            onInteractOutside={(event) => event.preventDefault()}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                  Nueva solicitud
                </CardTitle>
                <DialogDescription className="text-center">
                  Selecciona el tipo de solicitud
                </DialogDescription>
              </CardHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="Faltas"
                    checked={tipoFormulario2 === "Faltas"}
                    onCheckedChange={(checked) => {
                      handleCheckboxChange(checked ? "Faltas" : "");
                      if (checked) openModal(); // Abrir el modal después de actualizar el estado
                    }}
                    style={{ marginLeft: "30px" }}
                  />
                  <Label htmlFor="Faltas">Faltas</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="Suspension"
                    checked={tipoFormulario2 === "Suspension"}
                    onCheckedChange={(checked) => {
                      handleCheckboxChange(checked ? "Suspension" : "");
                      if (checked) openModal(); // Abrir el modal después de actualizar el estado
                    }}
                    style={{ marginLeft: "30px" }}
                  />
                  <Label htmlFor="Suspension">Suspensión o castigo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="Horas extras"
                    checked={tipoFormulario2 === "Horas extras"}
                    onCheckedChange={(checked) => {
                      handleCheckboxChange(checked ? "Horas extras" : "");
                      if (checked) openModal(); // Abrir el modal después de actualizar el estado
                    }}
                    style={{ marginLeft: "30px" }}
                  />
                  <Label htmlFor="Horas extras">Horas extras</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="Bonos / Comisiones"
                    checked={tipoFormulario2 === "Bonos / Comisiones"}
                    onCheckedChange={(checked) => {
                      handleCheckboxChange(checked ? "Bonos / Comisiones" : "");
                      if (checked) openModal(); // Abrir el modal después de actualizar el estado
                    }}
                    style={{ marginLeft: "30px" }}
                  />
                  <Label htmlFor="Bonos / Comisiones">Bonos / Comisiones</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="Aumento sueldo"
                    checked={tipoFormulario2 === "Aumento sueldo"}
                    onCheckedChange={(checked) => {
                      handleCheckboxChange(checked ? "Aumento sueldo" : "");
                      if (checked) openModal(); // Abrir el modal después de actualizar el estado
                    }}
                    style={{ marginLeft: "30px" }}
                  />
                  <Label htmlFor="Aumento sueldo">
                    Aumentos de sueldo / Cambio de puesto / Cambio de área
                  </Label>
                </div>
              </div>
            </Card>
          </DialogContent>
        </Dialog>
      )}

      {/* Mostrar formulario basado en el tipo seleccionado */}
      {formularioAbierto && tipoFormulario2 && (
        <div>
          {tipoFormulario2 === "Faltas" && (
            <Dialog open={formularioAbierto} onOpenChange={closeModal}>
              <DialogContent
                className="border-none p-0 overflow-y-auto w-full max-w-[35vw] max-h-[80vh] shadow-lg ml-[6vw] mt-auto"
                onInteractOutside={(event) => event.preventDefault()}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                      Faltas
                    </CardTitle>
                  </CardHeader>
                  <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label>Tipo de falta</Label>
                        <RadioGroup
                          onValueChange={(value) =>
                            handleChange2({ name: "justificada", value })
                          }
                          className="flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="si" id="justificada-si" />
                            <Label htmlFor="justificada-si">Justificada</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="justificada-no" />
                            <Label htmlFor="justificada-no">
                              Injustificada
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nombreColaborador">
                          Nombre del colaborador
                        </Label>
                        <Select
                          value={formData.nombreColaborador || ""}
                          onValueChange={(value) => {
                            const selectedUser = users.find(
                              (user) => user.id === value
                            );
                            if (selectedUser) {
                              setFormData({
                                ...formData,
                                nombreColaborador: selectedUser.id,
                              });
                            }
                            setSearchTermPass("");
                          }}
                          disabled={users.length === 0}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Seleccione el colaborador..." />
                          </SelectTrigger>
                          <SelectContent>
                            {/* Input dentro del Select para filtrar, sin afectar la selección */}
                            <div className="p-2">
                              <Input
                                ref={inputRef}
                                placeholder="Buscar colaborador..."
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
                                  <SelectItem key={user.id} value={user.id}>
                                    {user.nombre} {user.apellidos}
                                  </SelectItem>
                                ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="motivo">Días</Label>
                        <Input
                          id="dias"
                          name="dias"
                          type="number"
                          onChange={handleChange}
                          required
                          placeholder="Dias..."
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderDatePicker(
                          "Fecha de inicio",
                          formData.fechaInicio,
                          handleChange,
                          "fechaInicio"
                        )}
                        {renderDatePicker(
                          "Fecha de fin",
                          formData.fechaFin,
                          handleChange,
                          "fechaFin"
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="motivo">Observaciones</Label>
                        <Textarea
                          id="motivo"
                          name="motivo"
                          onChange={handleChange}
                          required
                          className="min-h-[100px]"
                          placeholder="Coloca tus observaciones aquí..."
                        />
                      </div>
                      <div className="space-y-2">
                        <div
                          style={{
                            position: "relative",
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                        >
                          <Label htmlFor="comprobante">Justificante</Label>
                          <div style={{ marginLeft: "10px" }}>
                            <Tooltip
                              title={`<p style="margin:0;padding:5px;text-align:justify;">Sube tu justificante. Si el justificante es del IMSS, 
                        entonces la falta es justificada y se pagan 4 horas, de lo contrario no se paga, pero si se justifica.</p>`}
                              arrow
                            >
                              <HelpIcon
                                style={{ cursor: "pointer", fontSize: 18 }}
                              />
                            </Tooltip>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            id="comprobante"
                            name="comprobante" // Asegúrate que sea "comprobante"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <Button2
                            type="button"
                            variant="outline"
                            onClick={() =>
                              document.getElementById("comprobante").click()
                            }
                            className="w-full"
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Subir archivo (PDF, JPG, PNG) Max: 4MB
                          </Button2>
                          {formData.comprobante && (
                            <p className="text-sm text-muted-foreground break-all max-w-full">
                              {formData.comprobante}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button2
                        type="submit"
                        className="w-full"
                        disabled={
                          !formData.justificada ||
                          !formData.nombreColaborador ||
                          !formData.dias ||
                          !formData.fechaInicio ||
                          !formData.fechaFin ||
                          !formData.motivo.trim() ||
                          (!formData.comprobante &&
                            formData.justificada === "si")
                        }
                      >
                        Enviar
                      </Button2>
                    </CardFooter>
                  </form>
                </Card>
              </DialogContent>
            </Dialog>
          )}
          {tipoFormulario2 === "Suspension" && (
            <Dialog open={formularioAbierto} onOpenChange={closeModal}>
              <DialogContent
                className="border-none p-0 overflow-y-auto w-full max-w-[35vw] max-h-[80vh] shadow-lg ml-[6vw] mt-auto"
                onInteractOutside={(event) => event.preventDefault()}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                      Suspensión o castigo
                    </CardTitle>
                    <DialogDescription className="text-center">
                      Las suspensiones son de 1 a 7 días como máximo
                    </DialogDescription>
                  </CardHeader>
                  <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="nombreColaborador">
                          Nombre del colaborador
                        </Label>
                        <Select
                          value={formData.nombreColaborador || ""}
                          onValueChange={(value) => {
                            const selectedUser = users.find(
                              (user) => user.id === value
                            );
                            if (selectedUser) {
                              setFormData({
                                ...formData,
                                nombreColaborador: selectedUser.id,
                              });
                            }
                            setSearchTermPass("");
                          }}
                          disabled={users.length === 0}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Seleccione el colaborador..." />
                          </SelectTrigger>
                          <SelectContent>
                            {/* Input dentro del Select para filtrar, sin afectar la selección */}
                            <div className="p-2">
                              <Input
                                ref={inputRef}
                                placeholder="Buscar colaborador..."
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
                                  <SelectItem key={user.id} value={user.id}>
                                    {user.nombre} {user.apellidos}
                                  </SelectItem>
                                ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="motivo">Días</Label>
                        <Input
                          id="dias"
                          name="dias"
                          type="number"
                          onChange={handleChange}
                          required
                          placeholder="Dias..."
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderDatePicker(
                          "Fecha de inicio",
                          formData.fechaInicio,
                          handleChange,
                          "fechaInicio"
                        )}
                        {renderDatePicker(
                          "Fecha de fin",
                          formData.fechaFin,
                          handleChange,
                          "fechaFin"
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="motivo">
                          Observaciones (causa o motivo)
                        </Label>
                        <Textarea
                          id="motivo"
                          name="motivo"
                          onChange={handleChange}
                          required
                          className="min-h-[100px]"
                          placeholder="Coloca tus observaciones aquí..."
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button2
                        type="submit"
                        className="w-full"
                        disabled={
                          !formData.nombreColaborador ||
                          !formData.dias ||
                          !formData.fechaInicio ||
                          !formData.fechaFin ||
                          !formData.motivo.trim()
                        }
                      >
                        Enviar
                      </Button2>
                    </CardFooter>
                  </form>
                </Card>
              </DialogContent>
            </Dialog>
          )}
          {tipoFormulario2 === "Horas extras" && (
            <Dialog open={formularioAbierto} onOpenChange={closeModal}>
              <DialogContent
                onInteractOutside={(event) => event.preventDefault()}
                className="border-none p-0 overflow-y-auto w-full max-w-[60vw] max-h-[70vh] shadow-lg ml-[6.5vw]"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                      Horas extras
                    </CardTitle>
                  </CardHeader>
                  <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderDatePicker(
                          "Fecha de inicio",
                          formData.fechaInicio,
                          handleChange,
                          "fechaInicio"
                        )}
                        {renderDatePicker(
                          "Fecha de fin",
                          formData.fechaFin,
                          handleChange,
                          "fechaFin"
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div
                            style={{
                              position: "relative",
                              display: "inline-flex",
                              alignItems: "center",
                            }}
                          >
                            <Label htmlFor="horaInicio">Hora de inicio</Label>
                          </div>
                          <Input
                            id="horaInicio"
                            name="horaInicio"
                            type="time"
                            value={formData.horaInicio}
                            onChange={handleChange}
                            required
                            placeholder="Hora de inicio..."
                          />
                        </div>
                        <div className="space-y-2">
                          <div
                            style={{
                              position: "relative",
                              display: "inline-flex",
                              alignItems: "center",
                            }}
                          >
                            <Label htmlFor="horaFin">Hora de fin</Label>
                          </div>
                          <Input
                            id="horaFin"
                            name="horaFin"
                            type="time"
                            value={formData.horaFin}
                            onChange={handleChange}
                            required
                            placeholder="Hora de fin..."
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div
                          style={{
                            position: "relative",
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                        >
                          <Label htmlFor="motivo">
                            Motivo del tiempo extra
                          </Label>
                        </div>
                        <Textarea
                          id="motivo"
                          name="motivo"
                          value={formData.motivo}
                          onChange={handleChange}
                          required
                          className="min-h-[100px]"
                          placeholder="Coloca el motivo del tiempo extra aquí..."
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="space-y-2">
                          <div
                            style={{
                              position: "relative",
                              display: "inline-flex",
                              alignItems: "center",
                            }}
                          >
                            <Label htmlFor="noOrden">No. de orden</Label>
                          </div>
                          <Input
                            id="noOrden"
                            name="noOrden"
                            type="number"
                            value={formData.noOrden}
                            onChange={handleChange}
                            placeholder="No."
                            required
                          />
                        </div>
                        <div className="space-y-2 col-span-2">
                          <div
                            style={{
                              position: "relative",
                              display: "inline-flex",
                              alignItems: "center",
                            }}
                          >
                            <Label htmlFor="nombreProducto">
                              Nombre del producto
                            </Label>
                          </div>
                          <Input
                            id="nombreProducto"
                            name="nombreProducto"
                            type="text"
                            value={formData.nombreProducto}
                            onChange={handleChange}
                            placeholder="Nombre del producto..."
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <div
                            style={{
                              position: "relative",
                              display: "inline-flex",
                              alignItems: "center",
                            }}
                          >
                            <Label htmlFor="cantidadProgramada">
                              Cantidad programada
                            </Label>
                          </div>
                          <Input
                            id="cantidadProgramada"
                            name="cantidadProgramada"
                            type="number"
                            value={formData.cantidadProgramada}
                            onChange={handleChange}
                            placeholder="Cantidad..."
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <div
                            style={{
                              position: "relative",
                              display: "inline-flex",
                              alignItems: "center",
                            }}
                          >
                            <Label htmlFor="cantidadTerminada">
                              Cantidad terminada
                            </Label>
                          </div>
                          <Input
                            id="cantidadTerminada"
                            name="cantidadTerminada"
                            type="number"
                            value={formData.cantidadTerminada}
                            onChange={handleChange}
                            placeholder="Cantidad..."
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        {formData.productos.otros.map((otro, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-1 md:grid-cols-5 gap-4"
                          >
                            <div>
                              <Input
                                id={`noOrden-${index}`}
                                name={`noOrden-${index}`}
                                value={otro.noOrden}
                                type="number"
                                onChange={(e) =>
                                  handleProductoChange(e, index, "noOrden")
                                }
                                placeholder="No."
                                required
                              />
                            </div>
                            <div className="col-span-2">
                              <Input
                                id={`nombreProducto-${index}`}
                                name={`nombreProducto-${index}`}
                                value={otro.nombreProducto}
                                type="text"
                                onChange={(e) =>
                                  handleProductoChange(
                                    e,
                                    index,
                                    "nombreProducto"
                                  )
                                }
                                placeholder="Nombre del producto..."
                                required
                              />
                            </div>
                            <div>
                              <Input
                                id={`cantidadProgramada-${index}`}
                                name={`cantidadProgramada-${index}`}
                                value={otro.cantidadProgramada}
                                type="number"
                                onChange={(e) =>
                                  handleProductoChange(
                                    e,
                                    index,
                                    "cantidadProgramada"
                                  )
                                }
                                placeholder="Cantidad..."
                                required
                              />
                            </div>
                            <div>
                              <div className="flex items-center">
                                <Input
                                  id={`cantidadTerminada-${index}`}
                                  name={`cantidadTerminada-${index}`}
                                  value={otro.cantidadTerminada}
                                  type="number"
                                  onChange={(e) =>
                                    handleProductoChange(
                                      e,
                                      index,
                                      "cantidadTerminada"
                                    )
                                  }
                                  placeholder="Cantidad..."
                                  required
                                />
                                <Button2
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="w-6"
                                  onClick={() => eliminarProducto(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button2>
                              </div>
                            </div>
                          </div>
                        ))}
                        <Button
                          style={{
                            background: "rgb(31 41 55)",
                            color: "white",
                          }}
                          type="button"
                          variant="outline"
                          onClick={añadirProducto}
                          className="mt-2"
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Agregar
                        </Button>
                      </div>
                      <div>
                        <Label style={{ fontSize: 17 }}>
                          Personal que se autoriza
                        </Label>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="space-y-2">
                          <div
                            style={{
                              position: "relative",
                              display: "inline-flex",
                              alignItems: "center",
                            }}
                          >
                            <Label htmlFor="noPersonal">No.</Label>
                          </div>
                          <Input
                            id="noPersonal"
                            name="noPersonal"
                            type="number"
                            value={formData.noPersonal}
                            onChange={handleChange}
                            placeholder="No."
                            required
                          />
                        </div>
                        <div className="space-y-2 col-span-2">
                          <div
                            style={{
                              position: "relative",
                              display: "inline-flex",
                              alignItems: "center",
                            }}
                          >
                            <Label htmlFor="nombrePersonal">Nombre</Label>
                          </div>
                          <Input
                            id="nombrePersonal"
                            name="nombrePersonal"
                            type="text"
                            value={formData.nombrePersonal}
                            onChange={handleChange}
                            placeholder="Nombre del personal..."
                            required
                          />
                        </div>
                        <div className="space-y-2 col-span-2">
                          <div
                            style={{
                              position: "relative",
                              display: "inline-flex",
                              alignItems: "center",
                            }}
                          >
                            <Label htmlFor="area">Área</Label>
                          </div>
                          <Input
                            id="area"
                            name="area"
                            type="text"
                            value={formData.area}
                            onChange={handleChange}
                            placeholder="Área..."
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        {formData.personal.otros.map((otro, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-1 md:grid-cols-5 gap-4"
                          >
                            <div>
                              <Input
                                id={`noPersonal-${index}`}
                                name={`noPersonal-${index}`}
                                value={otro.noPersonal}
                                type="number"
                                onChange={(e) =>
                                  handlePersonalChange(e, index, "noPersonal")
                                }
                                placeholder="No."
                                required
                              />
                            </div>
                            <div className="col-span-2">
                              <Input
                                id={`nombrePersonal-${index}`}
                                name={`nombrePersonal-${index}`}
                                value={otro.nombrePersonal}
                                type="text"
                                onChange={(e) =>
                                  handlePersonalChange(
                                    e,
                                    index,
                                    "nombrePersonal"
                                  )
                                }
                                placeholder="Nombre del personal..."
                                required
                              />
                            </div>
                            <div className="col-span-2">
                              <div className="flex items-center">
                                <Input
                                  id={`area-${index}`}
                                  name={`area-${index}`}
                                  value={otro.area}
                                  type="text"
                                  onChange={(e) =>
                                    handlePersonalChange(e, index, "area")
                                  }
                                  placeholder="Área..."
                                  required
                                />
                                <Button2
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="w-6"
                                  onClick={() => eliminarPersonal(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button2>
                              </div>
                            </div>
                          </div>
                        ))}
                        <Button
                          style={{
                            background: "rgb(31 41 55)",
                            color: "white",
                          }}
                          type="button"
                          variant="outline"
                          onClick={añadirPersonal}
                          className="mt-2"
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Agregar
                        </Button>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button2
                        type="submit"
                        className="w-full"
                        disabled={
                          !formData.fechaInicio ||
                          !formData.fechaFin ||
                          !formData.horaInicio ||
                          !formData.horaFin ||
                          !formData.motivo.trim() ||
                          !formData.noOrden ||
                          !formData.nombreProducto.trim() ||
                          !formData.cantidadProgramada ||
                          !formData.cantidadTerminada ||
                          !formData.noPersonal ||
                          !formData.nombrePersonal.trim() ||
                          !formData.area.trim() ||
                          formData.productos.otros.some(
                            (otro, index) =>
                              !otro.noOrden ||
                              !otro.nombreProducto.trim() ||
                              !otro.cantidadProgramada ||
                              !otro.cantidadTerminada
                          ) ||
                          formData.personal.otros.some(
                            (otro, index) =>
                              !otro.noPersonal ||
                              !otro.nombrePersonal.trim() ||
                              !otro.area.trim()
                          )
                        }
                      >
                        Enviar
                      </Button2>
                    </CardFooter>
                  </form>
                </Card>
              </DialogContent>
            </Dialog>
          )}
          {tipoFormulario2 === "Bonos / Comisiones" && (
            <Dialog open={formularioAbierto} onOpenChange={closeModal}>
              <DialogContent
                onInteractOutside={(event) => event.preventDefault()}
                className="border-none p-0 overflow-y-auto w-full max-w-[60vw] max-h-[70vh] shadow-lg ml-[6.5vw]"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                      Bonos / Comisiones
                    </CardTitle>
                  </CardHeader>
                  <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="tipoSolicitud">
                            Tipo de solicitud
                          </Label>
                          <Select
                            value={formData.tipoSolicitud || ""}
                            onValueChange={(value) => {
                              obtenerUsuariosBonos(value);
                              setFormData({
                                ...formData,
                                tipoSolicitud: value,
                                noBono: "",
                                nombreBono: "",
                                bonoCantidad: "",
                                comision: "",
                                comentarios: "",
                                total: 0,
                                totalFinal: 0,
                                bonos: {
                                  otros: [],
                                },
                              });
                            }}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Seleccione el tipo de solicitud..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bonos">Bonos</SelectItem>
                              <SelectItem value="comisiones">
                                Comisiones
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="mes">Mes</Label>
                          <Select
                            value={formData.mes || ""}
                            onValueChange={(value) => {
                              setFormData({
                                ...formData,
                                mes: value,
                              });
                            }}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Seleccione el mes..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="enero">Enero</SelectItem>
                              <SelectItem value="febrero">Febrero</SelectItem>
                              <SelectItem value="marzo">Marzo</SelectItem>
                              <SelectItem value="abril">Abril</SelectItem>
                              <SelectItem value="mayo">Mayo</SelectItem>
                              <SelectItem value="junio">Junio</SelectItem>
                              <SelectItem value="julio">Julio</SelectItem>
                              <SelectItem value="agosto">Agosto</SelectItem>
                              <SelectItem value="septiembre">
                                Septiembre
                              </SelectItem>
                              <SelectItem value="octubre">Octubre</SelectItem>
                              <SelectItem value="noviembre">
                                Noviembre
                              </SelectItem>
                              <SelectItem value="diciembre">
                                Diciembre
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dias">Días</Label>
                          <Input
                            id="dias"
                            name="dias"
                            type="number"
                            onChange={handleChange}
                            placeholder="Dias..."
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        <div className="space-y-2">
                          <Label htmlFor="noBono">No.</Label>
                          <Input
                            id="noBono"
                            name="noBono"
                            value={formData.noBono}
                            type="number"
                            onChange={handleChange}
                            placeholder="No."
                            readOnly={true}
                          />
                        </div>
                        <div className="space-y-2 col-span-2">
                          <Label htmlFor="nombreBono">Nombre</Label>
                          <Select
                            id={"nombreBono"}
                            name={"nombreBono"}
                            value={formData.nombreBono || ""}
                            onValueChange={(value) => {
                              const selectedUser = usersBonos.find(
                                (user) => user.id === value
                              );
                              if (selectedUser) {
                                setFormData({
                                  ...formData,
                                  noBono: selectedUser.numero_empleado,
                                  nombreBono: selectedUser.id,
                                });
                              }
                              setSearchTermPass("");
                              setDebouncedSearchTerm("");
                            }}
                            disabled={usersBonos.length === 0}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Seleccione el colaborador..." />
                            </SelectTrigger>
                            <SelectContent>
                              {/* Input dentro del Select para filtrar, sin afectar la selección */}
                              <div className="p-2">
                                <Input
                                  ref={inputRef}
                                  placeholder="Buscar colaborador..."
                                  value={searchTermPass}
                                  onChange={(e) =>
                                    handleSearchChange(e.target.value)
                                  }
                                  onKeyDown={(e) => e.stopPropagation()} // Evitar selecciones accidentales con el teclado
                                />
                              </div>

                              {/* Filtrado sin selección automática */}
                              {usersBonos.filter(
                                (user) =>
                                  user.nombre
                                    .toLowerCase()
                                    .includes(
                                      debouncedSearchTerm.toLowerCase()
                                    ) ||
                                  user.apellidos
                                    .toLowerCase()
                                    .includes(debouncedSearchTerm.toLowerCase())
                              ).length === 0 ? (
                                <div className="p-2 text-center text-gray-500">
                                  No se encontraron usuarios
                                </div>
                              ) : (
                                usersBonos
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
                                    <SelectItem key={user.id} value={user.id}>
                                      {user.nombre} {user.apellidos}
                                    </SelectItem>
                                  ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bonoCantidad">Bono</Label>
                          <Input
                            id="bonoCantidad"
                            name="bonoCantidad"
                            type="number"
                            value={formData.bonoCantidad}
                            onChange={handleChangeBonos}
                            placeholder="Bono..."
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="comision">Comisión</Label>
                          <Input
                            id="comision"
                            name="comision"
                            type="number"
                            onChange={handleChangeBonos}
                            value={formData.comision}
                            placeholder="Comisión..."
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="comentarios">Comentarios</Label>
                          <Input
                            id="comentarios"
                            name="comentarios"
                            type="text"
                            value={formData.comentarios}
                            onChange={handleChange}
                            placeholder="Comentarios..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="total">Total</Label>
                          <Input
                            id="total"
                            name="total"
                            type="number"
                            value={formData.total || 0}
                            onChange={handleChangeBonos}
                            placeholder="Total..."
                            readOnly={true}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        {formData.bonos.otros.map((otro, index) => (
                          <div key={index} className="grid grid-cols-7 gap-1">
                            <div className="space-y-2">
                              <Input
                                id={`noBono-${index}`}
                                name={`noBono-${index}`}
                                value={otro.noBono || ""}
                                type="number"
                                onChange={(e) =>
                                  handleChange(e, index, "noBono")
                                }
                                placeholder="No."
                                readOnly={true}
                              />
                            </div>
                            <div className="space-y-2 col-span-2">
                              <Select
                                id={"nombreBono"}
                                name={"nombreBono"}
                                onValueChange={(value) => {
                                  const selectedUser = usersBonos.find(
                                    (user) => user.id === value
                                  );
                                  if (selectedUser) {
                                    const updatedBonos = [
                                      ...formData.bonos.otros,
                                    ];
                                    updatedBonos[index] = {
                                      ...updatedBonos[index],
                                      noBono: selectedUser.numero_empleado,
                                      nombreBono: selectedUser.id,
                                    };
                                    setFormData({
                                      ...formData,
                                      bonos: {
                                        ...formData.bonos,
                                        otros: updatedBonos,
                                      },
                                    });
                                  }

                                  setSearchTerms((prevTerms) => ({
                                    ...prevTerms,
                                    [index]: "",
                                  }));

                                  setDebouncedSearchTerms((prevDebounced) => ({
                                    ...prevDebounced,
                                    [index]: "",
                                  }));
                                }}
                                value={otro.nombreBono || ""}
                                disabled={usersBonos.length === 0}
                              >
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Seleccione el colaborador..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {/* Input dentro del Select para filtrar, sin afectar la selección */}
                                  <div className="p-2">
                                    <Input
                                      ref={inputRef}
                                      placeholder="Buscar colaborador..."
                                      value={searchTerms[index] || ""}
                                      onChange={(e) =>
                                        handleSearchChange(
                                          e.target.value,
                                          index
                                        )
                                      }
                                      onKeyDown={(e) => e.stopPropagation()} // Evitar selecciones accidentales con el teclado
                                    />
                                  </div>

                                  {/* Filtrado sin selección automática */}
                                  {usersBonos.filter(
                                    (user) =>
                                      user.nombre
                                        .toLowerCase()
                                        .includes(
                                          (
                                            debouncedSearchTerms[index] || ""
                                          ).toLowerCase()
                                        ) ||
                                      user.apellidos
                                        .toLowerCase()
                                        .includes(
                                          (
                                            debouncedSearchTerms[index] || ""
                                          ).toLowerCase()
                                        )
                                  ).length === 0 ? (
                                    <div className="p-2 text-center text-gray-500">
                                      No se encontraron usuarios
                                    </div>
                                  ) : (
                                    usersBonos
                                      .filter(
                                        (user) =>
                                          user.nombre
                                            .toLowerCase()
                                            .includes(
                                              (
                                                debouncedSearchTerms[index] ||
                                                ""
                                              ).toLowerCase()
                                            ) ||
                                          user.apellidos
                                            .toLowerCase()
                                            .includes(
                                              (
                                                debouncedSearchTerms[index] ||
                                                ""
                                              ).toLowerCase()
                                            )
                                      )
                                      .map((user) => (
                                        <SelectItem
                                          key={user.id}
                                          value={user.id}
                                        >
                                          {user.nombre} {user.apellidos}
                                        </SelectItem>
                                      ))
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Input
                                id={`bonoCantidad-${index}`}
                                name={`bonoCantidad-${index}`}
                                value={otro.bonoCantidad || ""}
                                type="number"
                                onChange={(e) =>
                                  handleChangeBonos(e, index, "bonoCantidad")
                                }
                                placeholder="Bono..."
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Input
                                id={`comision-${index}`}
                                name={`comision-${index}`}
                                value={otro.comision || ""}
                                type="number"
                                onChange={(e) =>
                                  handleChangeBonos(e, index, "comision")
                                }
                                placeholder="Comisión..."
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Input
                                id={`comentarios-${index}`}
                                name={`comentarios-${index}`}
                                value={otro.comentarios || ""}
                                type="text"
                                onChange={(e) =>
                                  handleChangeComentario(index, e.target.value)
                                }
                                placeholder="Comentarios..."
                              />
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <Input
                                  id={`total-${index}`}
                                  name={`total-${index}`}
                                  type="number"
                                  value={otro.total || 0}
                                  onChange={(e) =>
                                    handleChangeBonos(e, index, "total")
                                  }
                                  placeholder="Total..."
                                  readOnly={true}
                                />
                                <Button2
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="w-6"
                                  onClick={() => eliminarBono(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button2>
                              </div>
                            </div>
                          </div>
                        ))}
                        <div className="grid grid-cols-7 gap-1">
                          <div className="col-start-7">
                            <Input
                              id="totalFinal"
                              name="totalFinal"
                              type="number"
                              value={formData.totalFinal || 0}
                              placeholder="Total final..."
                              readOnly={true}
                            />
                          </div>
                        </div>
                        <Button
                          style={{
                            background: "rgb(31 41 55)",
                            color: "white",
                          }}
                          type="button"
                          onClick={añadirBono}
                          variant="outline"
                          className="mt-2"
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Agregar
                        </Button>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button2
                        type="submit"
                        className="w-full"
                        disabled={
                          !formData.tipoSolicitud ||
                          !formData.mes ||
                          !formData.dias ||
                          !formData.nombreBono ||
                          !formData.bonoCantidad ||
                          !formData.comision ||
                          !formData.comentarios.trim() ||
                          formData.bonos.otros.some(
                            (otro, index) =>
                              !otro.nombreBono ||
                              !otro.bonoCantidad ||
                              !otro.comision ||
                              !otro.comentarios.trim()
                          )
                        }
                      >
                        Enviar
                      </Button2>
                    </CardFooter>
                  </form>
                </Card>
              </DialogContent>
            </Dialog>
          )}
          {tipoFormulario2 === "Aumento sueldo" && (
            <Dialog open={formularioAbierto} onOpenChange={closeModal}>
              <DialogContent
                onInteractOutside={(event) => event.preventDefault()}
                className="border-none p-0 overflow-y-auto w-full max-w-[35vw] max-h-[80vh] shadow-lg ml-[6vw] mt-auto"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                      Aumento de sueldo / Cambio de puesto / Cambio de área
                    </CardTitle>
                  </CardHeader>
                  <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="nombreColaborador">
                          Nombre del colaborador a aplicar ajuste
                        </Label>
                        <Select
                          value={formData.nombreColaborador || ""}
                          onValueChange={(value) => {
                            const selectedUser = users.find(
                              (user) => user.id === value
                            );
                            if (selectedUser) {
                              setFormData({
                                ...formData,
                                nombreColaborador: selectedUser.id,
                                puestoColaborador: selectedUser.puesto || "",
                              });
                            }
                            setSearchTermPass("");
                          }}
                          disabled={users.length === 0}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Seleccione el colaborador..." />
                          </SelectTrigger>
                          <SelectContent>
                            {/* Input dentro del Select para filtrar, sin afectar la selección */}
                            <div className="p-2">
                              <Input
                                ref={inputRef}
                                placeholder="Buscar colaborador..."
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
                                  <SelectItem key={user.id} value={user.id}>
                                    {user.nombre} {user.apellidos}
                                  </SelectItem>
                                ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <div
                          style={{
                            position: "relative",
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                        >
                          <Label htmlFor="motivo">Aplica por</Label>
                        </div>
                        <Select
                          id="motivo"
                          name="motivo"
                          value={formData.motivo || ""}
                          onValueChange={(value) => {
                            setFormData({
                              ...formData,
                              motivo: value,
                            });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar motivo..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="puesto">
                              Cambio de puesto
                            </SelectItem>
                            <SelectItem value="sueldo">
                              Cambio de sueldo
                            </SelectItem>
                            <SelectItem value="area">Cambio de área</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        {renderDatePicker(
                          "Fecha requerida de ajuste",
                          formData.fechaInicio,
                          handleChange,
                          "fechaInicio"
                        )}
                      </div>
                      <div className="space-y-2">
                        <div
                          style={{
                            position: "relative",
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                        >
                          <Label htmlFor="comentarios">
                            Comentarios adicionales
                          </Label>
                        </div>
                        <Textarea
                          id="comentarios"
                          name="comentarios"
                          onChange={handleChange}
                          required
                          className="min-h-[100px]"
                          placeholder="Coloca tus comentarios adicionales aquí..."
                        />
                      </div>
                      <div className="space-y-2">
                        <div
                          style={{
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <Label htmlFor="comprobante">
                            Formato de movimiento de personal
                          </Label>

                          <Tooltip
                            title={`<p style="margin:0;padding:5px;text-align:justify;">Descarga el formato con el botón de "Descargar formato", después
                              llénalo completamente y súbelo en este apartado en cualquiera de los formatos permitidos.</p>`}
                            arrow
                          >
                            <HelpIcon
                              style={{ cursor: "pointer", fontSize: 18 }}
                            />
                          </Tooltip>
                          <Button2
                            variant="outline"
                            onClick={() => handleDownload()}
                            disabled={loadingFormat}
                          >
                            {loadingFormat
                              ? "Descargando..."
                              : "Descargar formato"}
                          </Button2>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            id="comprobante"
                            name="comprobante"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls"
                            onChange={handleFileChange}
                            required
                            className="hidden"
                          />
                          <Button2
                            type="button"
                            variant="outline"
                            onClick={() =>
                              document.getElementById("comprobante").click()
                            }
                            className="w-full"
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Subir archivo (PDF, JPG, PNG, XLSX) Max: 4MB
                          </Button2>
                          {formData.comprobante && (
                            <p className="text-sm text-muted-foreground break-all max-w-full">
                              {formData.comprobante}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button2
                        type="submit"
                        className="w-full"
                        disabled={
                          !formData.nombreColaborador ||
                          !formData.motivo ||
                          !formData.fechaInicio ||
                          !formData.comentarios.trim() ||
                          !formData.comprobante
                        }
                      >
                        Enviar
                      </Button2>
                    </CardFooter>
                  </form>
                </Card>
              </DialogContent>
            </Dialog>
          )}
        </div>
      )}

      {formularioPrincipalAbiertoEdit && (
        <Dialog
          open={formularioPrincipalAbiertoEdit}
          onOpenChange={closeModalFormsEdit}
        >
          <DialogContent className="border-none p-0">
            <Card className="w-full max-w-lg" hidden>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                  {tipoFormulario2}
                </CardTitle>
                <DialogDescription className="text-center">
                  Formulario para: {tipoFormulario2}
                </DialogDescription>
              </CardHeader>
              <div className="grid gap-4 py-4">
                {tipoFormulario2 === "Faltas" && (
                  <Dialog
                    open={formularioPrincipalAbiertoEdit}
                    onOpenChange={closeModalEdit}
                  >
                    <DialogContent
                      className="border-none p-0 overflow-y-auto w-full max-w-[35vw] max-h-[80vh] shadow-lg ml-[6vw] mt-auto"
                      onInteractOutside={(event) => event.preventDefault()}
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-2xl font-bold text-center">
                            Faltas
                          </CardTitle>
                        </CardHeader>
                        <form onSubmit={handleSubmitEdit}>
                          <CardContent className="space-y-6">
                            <div className="space-y-2">
                              <Label>Tipo de falta</Label>
                              <RadioGroup
                                value={formData.justificada}
                                onValueChange={(value) =>
                                  handleChange2({ name: "justificada", value })
                                }
                                disabled={ver ? true : false}
                                className="flex space-x-4"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="si"
                                    id="justificada-si"
                                  />
                                  <Label htmlFor="justificada-si">
                                    Justificada
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="no"
                                    id="justificada-no"
                                  />
                                  <Label htmlFor="justificada-no">
                                    Injustificada
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="nombreColaborador">
                                Nombre del colaborador
                              </Label>
                              <Select
                                value={formData.nombreColaborador || ""}
                                onValueChange={(value) => {
                                  const selectedUser = users.find(
                                    (user) => user.id === value
                                  );
                                  if (selectedUser) {
                                    setFormData({
                                      ...formData,
                                      nombreColaborador: selectedUser.id,
                                    });
                                  }
                                  setSearchTermPass("");
                                }}
                                disabled={
                                  users.length === 0 || ver ? true : false
                                }
                              >
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Seleccione el colaborador..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {/* Input dentro del Select para filtrar, sin afectar la selección */}
                                  <div className="p-2">
                                    <Input
                                      ref={inputRef}
                                      placeholder="Buscar colaborador..."
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
                                          key={user.id}
                                          value={user.id}
                                        >
                                          {user.nombre} {user.apellidos}
                                        </SelectItem>
                                      ))
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="motivo">Días</Label>
                              <Input
                                id="dias"
                                name="dias"
                                type="number"
                                value={formData.dias}
                                onChange={handleChange}
                                readOnly={ver ? true : false}
                                placeholder="Dias que faltó"
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {renderDatePicker(
                                "Fecha de inicio",
                                ver
                                  ? fechaInicioPapeleta
                                  : formData.fechaInicio,
                                handleChange,
                                "fechaInicio",
                                ver ? true : false,
                                false,
                                true
                              )}
                              {renderDatePicker(
                                "Fecha de fin",
                                ver ? fechaFinPapeleta : formData.fechaFin,
                                handleChange,
                                "fechaFin",
                                ver ? true : false,
                                false,
                                true
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="motivo">Observaciones</Label>
                              <Textarea
                                id="motivo"
                                name="motivo"
                                value={formData.motivo}
                                onChange={handleChange}
                                className="min-h-[100px]"
                                placeholder="Coloca tus observaciones aquí..."
                                readOnly={ver ? true : false}
                              />
                            </div>
                            <div className="space-y-2">
                              <div
                                style={{
                                  position: "relative",
                                  display: "inline-flex",
                                  alignItems: "center",
                                }}
                              >
                                <Label htmlFor="comprobante">
                                  Justificante
                                </Label>
                                <div style={{ marginLeft: "10px" }}>
                                  <Tooltip
                                    title={`<p style="margin:0;padding:5px;text-align:justify;">Si el justificante es del IMSS, 
                        entonces la falta es justificada y se pagan 4 horas, de lo contrario no se paga, pero si se justifica.</p>`}
                                    arrow
                                  >
                                    <HelpIcon
                                      style={{
                                        cursor: "pointer",
                                        fontSize: 18,
                                      }}
                                    />
                                  </Tooltip>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {formData.comprobante && ver ? (
                                  <a
                                    href={`/api/Gente&CulturaAbsence/descargarPDF?fileName=${encodeURIComponent(
                                      formData.comprobante
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:underline"
                                  >
                                    Descargar {formData.comprobante}
                                  </a>
                                ) : (
                                  <>
                                    {ver ? (
                                      <span style={{ fontSize: 14 }}>
                                        Sin justificante agregado
                                      </span>
                                    ) : (
                                      <>
                                        <input
                                          id="comprobante"
                                          name="comprobante" // Asegúrate que sea "comprobante"
                                          type="file"
                                          accept=".pdf,.jpg,.jpeg,.png"
                                          onChange={handleFileChange}
                                          className="hidden"
                                        />
                                        <Button2
                                          type="button"
                                          variant="outline"
                                          onClick={() =>
                                            document
                                              .getElementById("comprobante")
                                              .click()
                                          }
                                          className="w-full"
                                        >
                                          <Upload className="mr-2 h-4 w-4" />
                                          Subir archivo (PDF, JPG, PNG) Max: 4MB
                                        </Button2>
                                        {formData.comprobante && (
                                          <p className="text-sm text-muted-foreground break-all max-w-full">
                                            {formData.comprobante}
                                          </p>
                                        )}
                                      </>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          </CardContent>
                          {ver ? (
                            <div hidden></div>
                          ) : (
                            <CardFooter>
                              <Button2
                                type="submit"
                                className="w-full"
                                disabled={
                                  !formData.justificada ||
                                  !formData.nombreColaborador ||
                                  !formData.dias ||
                                  !formData.fechaInicio ||
                                  !formData.fechaFin ||
                                  !formData.motivo.trim() ||
                                  (!formData.comprobante &&
                                    formData.justificada === "si")
                                }
                              >
                                Actualizar
                              </Button2>
                            </CardFooter>
                          )}
                        </form>
                      </Card>
                    </DialogContent>
                  </Dialog>
                )}
                {tipoFormulario2 === "Suspension" && (
                  <Dialog
                    open={formularioPrincipalAbiertoEdit}
                    onOpenChange={closeModalEdit}
                  >
                    <DialogContent
                      className="border-none p-0 overflow-y-auto w-full max-w-[35vw] max-h-[80vh] shadow-lg ml-[6vw] mt-auto"
                      onInteractOutside={(event) => event.preventDefault()}
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-2xl font-bold text-center">
                            Suspensión o castigo
                          </CardTitle>
                          <DialogDescription className="text-center">
                            Las suspensiones son de 1 a 7 días como máximo
                          </DialogDescription>
                        </CardHeader>
                        <form onSubmit={handleSubmitEdit}>
                          <CardContent className="space-y-6">
                            <div className="space-y-2">
                              <Label htmlFor="nombreColaborador">
                                Nombre del colaborador
                              </Label>
                              <Select
                                value={formData.nombreColaborador || ""}
                                onValueChange={(value) => {
                                  const selectedUser = users.find(
                                    (user) => user.id === value
                                  );
                                  if (selectedUser) {
                                    setFormData({
                                      ...formData,
                                      nombreColaborador: selectedUser.id,
                                    });
                                  }
                                  setSearchTermPass("");
                                }}
                                disabled={
                                  users.length === 0 || ver ? true : false
                                }
                              >
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Seleccione el colaborador..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {/* Input dentro del Select para filtrar, sin afectar la selección */}
                                  <div className="p-2">
                                    <Input
                                      ref={inputRef}
                                      placeholder="Buscar colaborador..."
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
                                          key={user.id}
                                          value={user.id}
                                        >
                                          {user.nombre} {user.apellidos}
                                        </SelectItem>
                                      ))
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="motivo">Días</Label>
                              <Input
                                id="dias"
                                name="dias"
                                type="number"
                                value={formData.dias}
                                onChange={handleChange}
                                readOnly={ver ? true : false}
                                placeholder="Dias..."
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {renderDatePicker(
                                "Fecha de inicio",
                                ver
                                  ? fechaInicioPapeleta
                                  : formData.fechaInicio,
                                handleChange,
                                "fechaInicio",
                                ver ? true : false,
                                false,
                                true
                              )}
                              {renderDatePicker(
                                "Fecha de fin",
                                ver ? fechaFinPapeleta : formData.fechaFin,
                                handleChange,
                                "fechaFin",
                                ver ? true : false,
                                false,
                                true
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="motivo">
                                Observaciones (causa o motivo)
                              </Label>
                              <Textarea
                                id="motivo"
                                name="motivo"
                                value={formData.motivo}
                                onChange={handleChange}
                                readOnly={ver ? true : false}
                                className="min-h-[100px]"
                                placeholder="Coloca tus observaciones aquí..."
                              />
                            </div>
                          </CardContent>
                          {ver ? (
                            <div hidden></div>
                          ) : (
                            <CardFooter>
                              <Button2
                                type="submit"
                                className="w-full"
                                disabled={
                                  !formData.nombreColaborador ||
                                  !formData.dias ||
                                  !formData.fechaInicio ||
                                  !formData.fechaFin ||
                                  !formData.motivo.trim()
                                }
                              >
                                Actualizar
                              </Button2>
                            </CardFooter>
                          )}
                        </form>
                      </Card>
                    </DialogContent>
                  </Dialog>
                )}
                {tipoFormulario2 === "Horas extras" && (
                  <Dialog
                    open={formularioPrincipalAbiertoEdit}
                    onOpenChange={closeModalEdit}
                  >
                    <DialogContent
                      onInteractOutside={(event) => event.preventDefault()}
                      className="border-none p-0 overflow-y-auto w-full max-w-[60vw] max-h-[70vh] shadow-lg ml-[6.5vw]"
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-2xl font-bold text-center">
                            Horas extras
                          </CardTitle>
                        </CardHeader>
                        <form onSubmit={handleSubmitEdit}>
                          <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {renderDatePicker(
                                "Fecha de inicio",
                                ver
                                  ? fechaInicioPapeleta
                                  : formData.fechaInicio,
                                handleChange,
                                "fechaInicio",
                                ver ? true : false,
                                false,
                                true
                              )}
                              {renderDatePicker(
                                "Fecha de fin",
                                ver ? fechaFinPapeleta : formData.fechaFin,
                                handleChange,
                                "fechaFin",
                                ver ? true : false,
                                false,
                                true
                              )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div
                                  style={{
                                    position: "relative",
                                    display: "inline-flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <Label htmlFor="horaInicio">
                                    Hora de inicio
                                  </Label>
                                </div>
                                <Input
                                  id="horaInicio"
                                  name="horaInicio"
                                  type="time"
                                  value={formData.horaInicio}
                                  readOnly={ver ? true : false}
                                  onChange={handleChange}
                                  required
                                  placeholder="Hora de inicio..."
                                />
                              </div>
                              <div className="space-y-2">
                                <div
                                  style={{
                                    position: "relative",
                                    display: "inline-flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <Label htmlFor="horaFin">Hora de fin</Label>
                                </div>
                                <Input
                                  id="horaFin"
                                  name="horaFin"
                                  type="time"
                                  value={formData.horaFin}
                                  readOnly={ver ? true : false}
                                  onChange={handleChange}
                                  required
                                  placeholder="Hora de fin..."
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div
                                style={{
                                  position: "relative",
                                  display: "inline-flex",
                                  alignItems: "center",
                                }}
                              >
                                <Label htmlFor="motivo">
                                  Motivo del tiempo extra
                                </Label>
                              </div>
                              <Textarea
                                id="motivo"
                                name="motivo"
                                value={formData.motivo}
                                onChange={handleChange}
                                readOnly={ver ? true : false}
                                className="min-h-[100px]"
                                placeholder="Coloca el motivo del tiempo extra aquí..."
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                              <div className="space-y-2">
                                <div
                                  style={{
                                    position: "relative",
                                    display: "inline-flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <Label htmlFor="noOrden">No. de orden</Label>
                                </div>
                                <Input
                                  id="noOrden"
                                  name="noOrden"
                                  type="number"
                                  value={formData.noOrden}
                                  readOnly={ver ? true : false}
                                  onChange={handleChange}
                                  placeholder="No."
                                  required
                                />
                              </div>
                              <div className="space-y-2 col-span-2">
                                <div
                                  style={{
                                    position: "relative",
                                    display: "inline-flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <Label htmlFor="nombreProducto">
                                    Nombre del producto
                                  </Label>
                                </div>
                                <Input
                                  id="nombreProducto"
                                  name="nombreProducto"
                                  type="text"
                                  value={formData.nombreProducto}
                                  readOnly={ver ? true : false}
                                  onChange={handleChange}
                                  placeholder="Nombre del producto..."
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <div
                                  style={{
                                    position: "relative",
                                    display: "inline-flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <Label htmlFor="cantidadProgramada">
                                    Cantidad programada
                                  </Label>
                                </div>
                                <Input
                                  id="cantidadProgramada"
                                  name="cantidadProgramada"
                                  type="number"
                                  value={formData.cantidadProgramada}
                                  readOnly={ver ? true : false}
                                  onChange={handleChange}
                                  placeholder="Cantidad..."
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <div
                                  style={{
                                    position: "relative",
                                    display: "inline-flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <Label htmlFor="cantidadTerminada">
                                    Cantidad terminada
                                  </Label>
                                </div>
                                <Input
                                  id="cantidadTerminada"
                                  name="cantidadTerminada"
                                  type="number"
                                  value={formData.cantidadTerminada}
                                  readOnly={ver ? true : false}
                                  onChange={handleChange}
                                  placeholder="Cantidad..."
                                  required
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              {formData.productos.otros.map((otro, index) => (
                                <div
                                  key={index}
                                  className="grid grid-cols-1 md:grid-cols-5 gap-4"
                                >
                                  <div>
                                    <Input
                                      id={`noOrden-${index}`}
                                      name={`noOrden-${index}`}
                                      value={otro.noOrden}
                                      readOnly={ver ? true : false}
                                      type="number"
                                      onChange={(e) =>
                                        handleProductoChange(
                                          e,
                                          index,
                                          "noOrden"
                                        )
                                      }
                                      placeholder="No."
                                      required
                                    />
                                  </div>
                                  <div className="col-span-2">
                                    <Input
                                      id={`nombreProducto-${index}`}
                                      name={`nombreProducto-${index}`}
                                      value={otro.nombreProducto}
                                      readOnly={ver ? true : false}
                                      type="text"
                                      onChange={(e) =>
                                        handleProductoChange(
                                          e,
                                          index,
                                          "nombreProducto"
                                        )
                                      }
                                      placeholder="Nombre del producto..."
                                      required
                                    />
                                  </div>
                                  <div>
                                    <Input
                                      id={`cantidadProgramada-${index}`}
                                      name={`cantidadProgramada-${index}`}
                                      value={otro.cantidadProgramada}
                                      type="number"
                                      readOnly={ver ? true : false}
                                      onChange={(e) =>
                                        handleProductoChange(
                                          e,
                                          index,
                                          "cantidadProgramada"
                                        )
                                      }
                                      placeholder="Cantidad..."
                                      required
                                    />
                                  </div>
                                  <div>
                                    <div className="flex items-center">
                                      <Input
                                        id={`cantidadTerminada-${index}`}
                                        name={`cantidadTerminada-${index}`}
                                        value={otro.cantidadTerminada}
                                        readOnly={ver ? true : false}
                                        type="number"
                                        onChange={(e) =>
                                          handleProductoChange(
                                            e,
                                            index,
                                            "cantidadTerminada"
                                          )
                                        }
                                        placeholder="Cantidad..."
                                        required
                                      />
                                      {ver ? (
                                        <div hidden></div>
                                      ) : (
                                        <Button2
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          className="w-6"
                                          onClick={() =>
                                            eliminarProducto(index)
                                          }
                                        >
                                          <X className="h-4 w-4" />
                                        </Button2>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {ver ? (
                                <div hidden></div>
                              ) : (
                                <Button
                                  style={{
                                    background: "rgb(31 41 55)",
                                    color: "white",
                                  }}
                                  type="button"
                                  variant="outline"
                                  onClick={añadirProducto}
                                  className="mt-2"
                                >
                                  <PlusCircle className="h-4 w-4 mr-2" />
                                  Agregar
                                </Button>
                              )}
                            </div>
                            <div>
                              <Label style={{ fontSize: 17 }}>
                                Personal que se autoriza
                              </Label>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                              <div className="space-y-2">
                                <div
                                  style={{
                                    position: "relative",
                                    display: "inline-flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <Label htmlFor="noPersonal">No.</Label>
                                </div>
                                <Input
                                  id="noPersonal"
                                  name="noPersonal"
                                  type="number"
                                  value={formData.noPersonal}
                                  readOnly={ver ? true : false}
                                  onChange={handleChange}
                                  placeholder="No."
                                  required
                                />
                              </div>
                              <div className="space-y-2 col-span-2">
                                <div
                                  style={{
                                    position: "relative",
                                    display: "inline-flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <Label htmlFor="nombrePersonal">Nombre</Label>
                                </div>
                                <Input
                                  id="nombrePersonal"
                                  name="nombrePersonal"
                                  type="text"
                                  value={formData.nombrePersonal}
                                  readOnly={ver ? true : false}
                                  onChange={handleChange}
                                  placeholder="Nombre del personal..."
                                  required
                                />
                              </div>
                              <div className="space-y-2 col-span-2">
                                <div
                                  style={{
                                    position: "relative",
                                    display: "inline-flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <Label htmlFor="area">Área</Label>
                                </div>
                                <Input
                                  id="area"
                                  name="area"
                                  type="text"
                                  value={formData.area}
                                  readOnly={ver ? true : false}
                                  onChange={handleChange}
                                  placeholder="Área..."
                                  required
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              {formData.personal.otros.map((otro, index) => (
                                <div
                                  key={index}
                                  className="grid grid-cols-1 md:grid-cols-5 gap-4"
                                >
                                  <div>
                                    <Input
                                      id={`noPersonal-${index}`}
                                      name={`noPersonal-${index}`}
                                      value={otro.noPersonal}
                                      type="number"
                                      onChange={(e) =>
                                        handlePersonalChange(
                                          e,
                                          index,
                                          "noPersonal"
                                        )
                                      }
                                      placeholder="No."
                                      required
                                      readOnly={ver ? true : false}
                                    />
                                  </div>
                                  <div className="col-span-2">
                                    <Input
                                      id={`nombrePersonal-${index}`}
                                      name={`nombrePersonal-${index}`}
                                      value={otro.nombrePersonal}
                                      type="text"
                                      onChange={(e) =>
                                        handlePersonalChange(
                                          e,
                                          index,
                                          "nombrePersonal"
                                        )
                                      }
                                      placeholder="Nombre del personal..."
                                      required
                                      readOnly={ver ? true : false}
                                    />
                                  </div>
                                  <div className="col-span-2">
                                    <div className="flex items-center">
                                      <Input
                                        id={`area-${index}`}
                                        name={`area-${index}`}
                                        value={otro.area}
                                        type="text"
                                        onChange={(e) =>
                                          handlePersonalChange(e, index, "area")
                                        }
                                        placeholder="Área..."
                                        required
                                        readOnly={ver ? true : false}
                                      />
                                      {ver ? (
                                        <div hidden></div>
                                      ) : (
                                        <Button2
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          className="w-6"
                                          onClick={() =>
                                            eliminarPersonal(index)
                                          }
                                        >
                                          <X className="h-4 w-4" />
                                        </Button2>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {ver ? (
                                <div hidden></div>
                              ) : (
                                <Button
                                  style={{
                                    background: "rgb(31 41 55)",
                                    color: "white",
                                  }}
                                  type="button"
                                  variant="outline"
                                  onClick={añadirPersonal}
                                  className="mt-2"
                                >
                                  <PlusCircle className="h-4 w-4 mr-2" />
                                  Agregar
                                </Button>
                              )}
                            </div>
                          </CardContent>
                          {ver ? (
                            <div hidden></div>
                          ) : (
                            <CardFooter>
                              <Button2
                                type="submit"
                                className="w-full"
                                disabled={
                                  !formData.fechaInicio ||
                                  !formData.fechaFin ||
                                  !formData.horaInicio ||
                                  !formData.horaFin ||
                                  !formData.motivo.trim() ||
                                  !formData.noOrden ||
                                  !formData.nombreProducto.trim() ||
                                  !formData.cantidadProgramada ||
                                  !formData.cantidadTerminada ||
                                  !formData.noPersonal ||
                                  !formData.nombrePersonal.trim() ||
                                  !formData.area.trim() ||
                                  formData.productos.otros.some(
                                    (otro, index) =>
                                      !otro.noOrden ||
                                      !otro.nombreProducto.trim() ||
                                      !otro.cantidadProgramada ||
                                      !otro.cantidadTerminada
                                  ) ||
                                  formData.personal.otros.some(
                                    (otro, index) =>
                                      !otro.noPersonal ||
                                      !otro.nombrePersonal.trim() ||
                                      !otro.area.trim()
                                  )
                                }
                              >
                                Actualizar
                              </Button2>
                            </CardFooter>
                          )}
                        </form>
                      </Card>
                    </DialogContent>
                  </Dialog>
                )}
                {tipoFormulario2 === "Bonos / Comisiones" && (
                  <Dialog
                    open={formularioPrincipalAbiertoEdit}
                    onOpenChange={closeModalEdit}
                  >
                    <DialogContent
                      onInteractOutside={(event) => event.preventDefault()}
                      className="border-none p-0 overflow-y-auto w-full max-w-[60vw] max-h-[70vh] shadow-lg ml-[6.5vw]"
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-2xl font-bold text-center">
                            Bonos / Comisiones
                          </CardTitle>
                        </CardHeader>
                        <form onSubmit={handleSubmitEdit}>
                          <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="tipoSolicitud">
                                  Tipo de solicitud
                                </Label>
                                <Select
                                  value={formData.tipoSolicitud || ""}
                                  disabled={ver ? true : false}
                                  onValueChange={(value) => {
                                    obtenerUsuariosBonos(value);
                                    setFormData({
                                      ...formData,
                                      tipoSolicitud: value,
                                      noBono: "",
                                      nombreBono: "",
                                      bonoCantidad: "",
                                      comision: "",
                                      comentarios: "",
                                      total: 0,
                                      totalFinal: 0,
                                      bonos: {
                                        otros: [],
                                      },
                                    });
                                  }}
                                >
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Seleccione el tipo de solicitud..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="bonos">Bonos</SelectItem>
                                    <SelectItem value="comisiones">
                                      Comisiones
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="mes">Mes</Label>
                                <Select
                                  value={formData.mes || ""}
                                  onValueChange={(value) => {
                                    setFormData({
                                      ...formData,
                                      mes: value,
                                    });
                                  }}
                                  disabled={ver ? true : false}
                                >
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Seleccione el mes..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="enero">Enero</SelectItem>
                                    <SelectItem value="febrero">
                                      Febrero
                                    </SelectItem>
                                    <SelectItem value="marzo">Marzo</SelectItem>
                                    <SelectItem value="abril">Abril</SelectItem>
                                    <SelectItem value="mayo">Mayo</SelectItem>
                                    <SelectItem value="junio">Junio</SelectItem>
                                    <SelectItem value="julio">Julio</SelectItem>
                                    <SelectItem value="agosto">
                                      Agosto
                                    </SelectItem>
                                    <SelectItem value="septiembre">
                                      Septiembre
                                    </SelectItem>
                                    <SelectItem value="octubre">
                                      Octubre
                                    </SelectItem>
                                    <SelectItem value="noviembre">
                                      Noviembre
                                    </SelectItem>
                                    <SelectItem value="diciembre">
                                      Diciembre
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="dias">Días</Label>
                                <Input
                                  id="dias"
                                  name="dias"
                                  type="number"
                                  value={formData.dias}
                                  onChange={handleChange}
                                  placeholder="Dias..."
                                  readOnly={ver ? true : false}
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                              <div className="space-y-2">
                                <Label htmlFor="noBono">No.</Label>
                                <Input
                                  id="noBono"
                                  name="noBono"
                                  value={formData.noBono}
                                  type="number"
                                  onChange={handleChange}
                                  placeholder="No."
                                  readOnly={true}
                                />
                              </div>
                              <div className="space-y-2 col-span-2">
                                <Label htmlFor="nombreBono">Nombre</Label>
                                <Select
                                  id={"nombreBono"}
                                  name={"nombreBono"}
                                  value={formData.nombreBono || ""}
                                  onValueChange={(value) => {
                                    const selectedUser = usersBonos.find(
                                      (user) => user.id === value
                                    );
                                    if (selectedUser) {
                                      setFormData({
                                        ...formData,
                                        noBono: selectedUser.numero_empleado,
                                        nombreBono: selectedUser.id,
                                      });
                                    }
                                    setSearchTermPass("");
                                    setDebouncedSearchTerm("");
                                  }}
                                  disabled={
                                    usersBonos.length === 0 || ver
                                      ? true
                                      : false
                                  }
                                >
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Seleccione el colaborador..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {/* Input dentro del Select para filtrar, sin afectar la selección */}
                                    <div className="p-2">
                                      <Input
                                        ref={inputRef}
                                        placeholder="Buscar colaborador..."
                                        value={searchTermPass}
                                        onChange={(e) =>
                                          handleSearchChange(e.target.value)
                                        }
                                        onKeyDown={(e) => e.stopPropagation()} // Evitar selecciones accidentales con el teclado
                                      />
                                    </div>

                                    {/* Filtrado sin selección automática */}
                                    {usersBonos.filter(
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
                                      usersBonos
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
                                            key={user.id}
                                            value={user.id}
                                          >
                                            {user.nombre} {user.apellidos}
                                          </SelectItem>
                                        ))
                                    )}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="bonoCantidad">Bono</Label>
                                <Input
                                  id="bonoCantidad"
                                  name="bonoCantidad"
                                  type="number"
                                  value={formData.bonoCantidad}
                                  readOnly={ver ? true : false}
                                  onChange={handleChangeBonos}
                                  placeholder="Bono..."
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="comision">Comisión</Label>
                                <Input
                                  id="comision"
                                  name="comision"
                                  type="number"
                                  onChange={handleChangeBonos}
                                  value={formData.comision}
                                  readOnly={ver ? true : false}
                                  placeholder="Comisión..."
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="comentarios">Comentarios</Label>
                                <Input
                                  id="comentarios"
                                  name="comentarios"
                                  type="text"
                                  value={formData.comentarios}
                                  readOnly={ver ? true : false}
                                  onChange={handleChange}
                                  placeholder="Comentarios..."
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="total">Total</Label>
                                <Input
                                  id="total"
                                  name="total"
                                  type="number"
                                  value={formData.total || 0}
                                  onChange={handleChangeBonos}
                                  placeholder="Total..."
                                  readOnly={true}
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              {formData.bonos.otros.map((otro, index) => (
                                <div
                                  key={index}
                                  className="grid grid-cols-7 gap-1"
                                >
                                  <div className="space-y-2">
                                    <Input
                                      id={`noBono-${index}`}
                                      name={`noBono-${index}`}
                                      value={otro.noBono || ""}
                                      type="number"
                                      onChange={(e) =>
                                        handleChange(e, index, "noBono")
                                      }
                                      placeholder="No."
                                      readOnly={true}
                                    />
                                  </div>
                                  <div className="space-y-2 col-span-2">
                                    <Select
                                      id={"nombreBono"}
                                      name={"nombreBono"}
                                      onValueChange={(value) => {
                                        const selectedUser = usersBonos.find(
                                          (user) => user.id === value
                                        );
                                        if (selectedUser) {
                                          const updatedBonos = [
                                            ...formData.bonos.otros,
                                          ];
                                          updatedBonos[index] = {
                                            ...updatedBonos[index],
                                            noBono:
                                              selectedUser.numero_empleado,
                                            nombreBono: selectedUser.id,
                                          };
                                          setFormData({
                                            ...formData,
                                            bonos: {
                                              ...formData.bonos,
                                              otros: updatedBonos,
                                            },
                                          });
                                        }

                                        setSearchTerms((prevTerms) => ({
                                          ...prevTerms,
                                          [index]: "",
                                        }));

                                        setDebouncedSearchTerms(
                                          (prevDebounced) => ({
                                            ...prevDebounced,
                                            [index]: "",
                                          })
                                        );
                                      }}
                                      value={otro.nombreBono || ""}
                                      disabled={
                                        usersBonos.length === 0 || ver
                                          ? true
                                          : false
                                      }
                                    >
                                      <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Seleccione el colaborador..." />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {/* Input dentro del Select para filtrar, sin afectar la selección */}
                                        <div className="p-2">
                                          <Input
                                            ref={inputRef}
                                            placeholder="Buscar colaborador..."
                                            value={searchTerms[index] || ""}
                                            onChange={(e) =>
                                              handleSearchChange(
                                                e.target.value,
                                                index
                                              )
                                            }
                                            onKeyDown={(e) =>
                                              e.stopPropagation()
                                            } // Evitar selecciones accidentales con el teclado
                                          />
                                        </div>

                                        {/* Filtrado sin selección automática */}
                                        {usersBonos.filter(
                                          (user) =>
                                            user.nombre
                                              .toLowerCase()
                                              .includes(
                                                (
                                                  debouncedSearchTerms[index] ||
                                                  ""
                                                ).toLowerCase()
                                              ) ||
                                            user.apellidos
                                              .toLowerCase()
                                              .includes(
                                                (
                                                  debouncedSearchTerms[index] ||
                                                  ""
                                                ).toLowerCase()
                                              )
                                        ).length === 0 ? (
                                          <div className="p-2 text-center text-gray-500">
                                            No se encontraron usuarios
                                          </div>
                                        ) : (
                                          usersBonos
                                            .filter(
                                              (user) =>
                                                user.nombre
                                                  .toLowerCase()
                                                  .includes(
                                                    (
                                                      debouncedSearchTerms[
                                                        index
                                                      ] || ""
                                                    ).toLowerCase()
                                                  ) ||
                                                user.apellidos
                                                  .toLowerCase()
                                                  .includes(
                                                    (
                                                      debouncedSearchTerms[
                                                        index
                                                      ] || ""
                                                    ).toLowerCase()
                                                  )
                                            )
                                            .map((user) => (
                                              <SelectItem
                                                key={user.id}
                                                value={user.id}
                                              >
                                                {user.nombre} {user.apellidos}
                                              </SelectItem>
                                            ))
                                        )}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Input
                                      id={`bonoCantidad-${index}`}
                                      name={`bonoCantidad-${index}`}
                                      value={otro.bonoCantidad || ""}
                                      readOnly={ver ? true : false}
                                      type="number"
                                      onChange={(e) =>
                                        handleChangeBonos(
                                          e,
                                          index,
                                          "bonoCantidad"
                                        )
                                      }
                                      placeholder="Bono..."
                                      required
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Input
                                      id={`comision-${index}`}
                                      name={`comision-${index}`}
                                      value={otro.comision || ""}
                                      readOnly={ver ? true : false}
                                      type="number"
                                      onChange={(e) =>
                                        handleChangeBonos(e, index, "comision")
                                      }
                                      placeholder="Comisión..."
                                      required
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Input
                                      id={`comentarios-${index}`}
                                      name={`comentarios-${index}`}
                                      value={otro.comentarios || ""}
                                      readOnly={ver ? true : false}
                                      type="text"
                                      onChange={(e) =>
                                        handleChangeComentario(
                                          index,
                                          e.target.value
                                        )
                                      }
                                      placeholder="Comentarios..."
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex items-center">
                                      <Input
                                        id={`total-${index}`}
                                        name={`total-${index}`}
                                        type="number"
                                        value={otro.total || 0}
                                        onChange={(e) =>
                                          handleChangeBonos(e, index, "total")
                                        }
                                        placeholder="Total..."
                                        readOnly={true}
                                      />
                                      {ver ? (
                                        <div hidden></div>
                                      ) : (
                                        <Button2
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          className="w-6"
                                          onClick={() => eliminarBono(index)}
                                        >
                                          <X className="h-4 w-4" />
                                        </Button2>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                              <div className="grid grid-cols-7 gap-1">
                                <div className="col-start-7">
                                  <Input
                                    id="totalFinal"
                                    name="totalFinal"
                                    type="number"
                                    value={formData.totalFinal || 0}
                                    placeholder="Total final..."
                                    readOnly={true}
                                  />
                                </div>
                              </div>
                              {ver ? (
                                <div hidden></div>
                              ) : (
                                <Button
                                  style={{
                                    background: "rgb(31 41 55)",
                                    color: "white",
                                  }}
                                  type="button"
                                  onClick={añadirBono}
                                  variant="outline"
                                  className="mt-2"
                                >
                                  <PlusCircle className="h-4 w-4 mr-2" />
                                  Agregar
                                </Button>
                              )}
                            </div>
                          </CardContent>
                          {ver ? (
                            <div hidden></div>
                          ) : (
                            <CardFooter>
                              <Button2
                                type="submit"
                                className="w-full"
                                disabled={
                                  !formData.tipoSolicitud ||
                                  !formData.mes ||
                                  !formData.dias ||
                                  !formData.nombreBono ||
                                  !formData.bonoCantidad ||
                                  !formData.comision ||
                                  !formData.comentarios.trim() ||
                                  formData.bonos.otros.some(
                                    (otro, index) =>
                                      !otro.nombreBono ||
                                      !otro.bonoCantidad ||
                                      !otro.comision ||
                                      !otro.comentarios.trim()
                                  )
                                }
                              >
                                Actualizar
                              </Button2>
                            </CardFooter>
                          )}
                        </form>
                      </Card>
                    </DialogContent>
                  </Dialog>
                )}
                {tipoFormulario2 === "Aumento sueldo" && (
                  <Dialog
                    open={formularioPrincipalAbiertoEdit}
                    onOpenChange={closeModalEdit}
                  >
                    <DialogContent
                      onInteractOutside={(event) => event.preventDefault()}
                      className="border-none p-0 overflow-y-auto w-full max-w-[35vw] max-h-[80vh] shadow-lg ml-[6vw] mt-auto"
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-2xl font-bold text-center">
                            Aumento de sueldo / Cambio de puesto / Cambio de
                            área
                          </CardTitle>
                        </CardHeader>
                        <form onSubmit={handleSubmitEdit}>
                          <CardContent className="space-y-6">
                            <div className="space-y-2">
                              <Label htmlFor="nombreColaborador">
                                Nombre del colaborador a aplicar ajuste
                              </Label>
                              <Select
                                value={formData.nombreColaborador || ""}
                                onValueChange={(value) => {
                                  const selectedUser = users.find(
                                    (user) => user.id === value
                                  );
                                  if (selectedUser) {
                                    setFormData({
                                      ...formData,
                                      nombreColaborador: selectedUser.id,
                                      puestoColaborador: selectedUser.puesto,
                                    });
                                  }
                                  setSearchTermPass("");
                                }}
                                disabled={
                                  users.length === 0 || ver ? true : false
                                }
                              >
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Seleccione el colaborador..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {/* Input dentro del Select para filtrar, sin afectar la selección */}
                                  <div className="p-2">
                                    <Input
                                      ref={inputRef}
                                      placeholder="Buscar colaborador..."
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
                                          key={user.id}
                                          value={user.id}
                                        >
                                          {user.nombre} {user.apellidos}
                                        </SelectItem>
                                      ))
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <div
                                style={{
                                  position: "relative",
                                  display: "inline-flex",
                                  alignItems: "center",
                                }}
                              >
                                <Label htmlFor="motivo">Aplica por</Label>
                              </div>
                              <Select
                                value={formData.motivo || ""}
                                onValueChange={(value) => {
                                  setFormData({
                                    ...formData,
                                    motivo: value,
                                  });
                                }}
                                disabled={ver ? true : false}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar motivo..." />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="puesto">
                                    Cambio de puesto
                                  </SelectItem>
                                  <SelectItem value="sueldo">
                                    Cambio de sueldo
                                  </SelectItem>
                                  <SelectItem value="area">
                                    Cambio de área
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                              {renderDatePicker(
                                "Fecha requerida de ajuste",
                                ver
                                  ? fechaInicioPapeleta
                                  : formData.fechaInicio,
                                handleChange,
                                "fechaInicio",
                                ver ? true : false,
                                false,
                                true
                              )}
                            </div>
                            <div className="space-y-2">
                              <div
                                style={{
                                  position: "relative",
                                  display: "inline-flex",
                                  alignItems: "center",
                                }}
                              >
                                <Label htmlFor="comentarios">
                                  Comentarios adicionales
                                </Label>
                              </div>
                              <Textarea
                                id="comentarios"
                                name="comentarios"
                                onChange={handleChange}
                                value={formData.comentarios}
                                readOnly={ver ? true : false}
                                className="min-h-[100px]"
                                placeholder="Coloca tus comentarios adicionales aquí..."
                              />
                            </div>
                            <div className="space-y-2">
                              <div
                                style={{
                                  position: "relative",
                                  display: "inline-flex",
                                  alignItems: "center",
                                }}
                              >
                                <Label htmlFor="comprobante">
                                  Formato de movimiento de personal
                                </Label>
                                <div style={{ marginLeft: "10px" }}>
                                  <Tooltip
                                    title={`<p style="margin:0;padding:5px;text-align:justify;">Descarga el formato con el botón de "Descargar formato", después
                              llénalo completamente y súbelo en este apartado en cualquiera de los formatos permitidos.</p>`}
                                    arrow
                                  >
                                    <HelpIcon
                                      style={{
                                        cursor: "pointer",
                                        fontSize: 18,
                                      }}
                                    />
                                  </Tooltip>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {formData.comprobante ? (
                                  <a
                                    href={`/api/Gente&CulturaAbsence/descargarPDF?fileName=${encodeURIComponent(
                                      formData.comprobante
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:underline"
                                  >
                                    Descargar {formData.comprobante}
                                  </a>
                                ) : (
                                  <>
                                    <span style={{ fontSize: 14 }}>
                                      Sin formato agregado
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </CardContent>
                          {ver ? (
                            <div hidden></div>
                          ) : (
                            <CardFooter>
                              <Button2
                                type="submit"
                                className="w-full"
                                disabled={
                                  !formData.nombreColaborador ||
                                  !formData.motivo ||
                                  !formData.fechaInicio ||
                                  !formData.comentarios.trim()
                                }
                              >
                                Actualizar
                              </Button2>
                            </CardFooter>
                          )}
                        </form>
                      </Card>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </Card>
          </DialogContent>
        </Dialog>
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
            Filtrar por tipo
          </Label>
          <Select
            onValueChange={setTipoFormulario}
            defaultValue={tipoFormulario}
          >
            <SelectTrigger id="status-filter">
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="Faltas">Faltas</SelectItem>
              <SelectItem value="Suspensión o castigo">
                Suspensión o castigo
              </SelectItem>
              <SelectItem value="Horas extras">Horas extras</SelectItem>
              <SelectItem value="Bonos / Comisiones">
                Bonos / Comisiones
              </SelectItem>
              <SelectItem value="Aumento sueldo">
                Aumentos de sueldo / Cambio de puesto / Cambio de área
              </SelectItem>
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
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="Autorizada por RH">Autorizada</SelectItem>
              <SelectItem value="Pendiente">Pendiente</SelectItem>
              <SelectItem value="No autorizada por RH">
                No autorizada
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableCaption>Solicitudes generadas</TableCaption>
          <TableHeader>
            <TableRow>
              {encabezadosSolicitudes.map((encabezado, index) => (
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
                  <TableCell>{evento.id || "Sin ID especificado"}</TableCell>
                  <TableCell>
                    {evento.tipo === "Suspension"
                      ? "Suspensión o castigo"
                      : evento.tipo || "Sin tipo especificado"}
                  </TableCell>
                  <TableCell>
                    {evento.numero_empleado ||
                      "Sin número de empleado especificado"}
                  </TableCell>
                  <TableCell>
                    {evento.nombre || "Sin nombre de empleado especificado"}
                  </TableCell>
                  <TableCell>
                    {evento.departamento || "Sin departamento especificado"}
                  </TableCell>
                  <TableCell>
                    {evento.puesto || "Sin puesto especificado"}
                  </TableCell>
                  <TableCell>
                    {evento.jefe_directo
                      ? (() => {
                          const jefe = allUsers.find(
                            (u) => u.id === evento.jefe_directo
                          );
                          return jefe
                            ? `${jefe.nombre} ${jefe.apellidos}`
                            : "Sin datos";
                        })()
                      : "Sin datos"}
                  </TableCell>
                  <TableCell>
                    {evento.fecha_subida
                      ? `${new Date(evento.fecha_subida).toLocaleDateString(
                          "es-ES",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )} ${new Date(evento.fecha_subida).toLocaleTimeString(
                          "es-ES",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false, // Cambiar a true si prefieres formato de 12 horas
                          }
                        )}`
                      : "Sin datos"}
                  </TableCell>
                  <TableCell>
                    {evento.fecha_actualizacion
                      ? `${new Date(
                          evento.fecha_actualizacion
                        ).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })} ${new Date(
                          evento.fecha_actualizacion
                        ).toLocaleTimeString("es-ES", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: false, // Cambiar a true si prefieres formato de 12 horas
                        })}`
                      : "Sin datos"}
                  </TableCell>
                  <TableCell>
                    {evento.comentarios || "Sin comentarios"}
                  </TableCell>

                  <TableCell
                    style={{
                      color: (() => {
                        if (evento.estatus.startsWith("Autorizada"))
                          return "green";
                        if (evento.estatus.startsWith("No autorizada"))
                          return "red";
                        switch (evento.estatus) {
                          case "Pendiente":
                            return "orange";
                          default:
                            return "black"; // color por defecto
                        }
                      })(),
                    }}
                  >
                    {evento.estatus}
                  </TableCell>
                  <TableCell>
                    {evento.accion ? evento.accion(evento.id_papeleta) : "N/A"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={12} className="text-center">
                  No se encontraron solicitudes
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

function VisualizeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 64 64"
      aria-labelledby="title"
      role="img"
    >
      <path
        d="M32 12C16 12 4 32 4 32s12 20 28 20 28-20 28-20S48 12 32 12z"
        fill="none"
        stroke="rgb(31 41 55)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle
        cx="32"
        cy="32"
        r="10"
        fill="none"
        stroke="rgb(31 41 55)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle cx="32" cy="32" r="4" fill="rgb(31 41 55)" />
    </svg>
  );
}

function Spinner() {
  return <div className="spinner" />;
}

function PermisosIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="h-6 w-6 text-gray-400"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 2h8l5 5v10a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 3v4h4M9 13l2 2 4-4"
      />
    </svg>
  );
}

function EditIcon(props) {
  return (
    <svg
      {...props}
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
  );
}
