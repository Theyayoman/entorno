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
import * as XLSX from "xlsx";
import styles from "../../../../public/CSS/spinner.css";
import { useSession } from "next-auth/react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
} from "@/components/ui/dialog";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button as Button2 } from "@/components/ui/button";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip } from "react-tippy";
import "react-tippy/dist/tippy.css"; // Asegúrate de importar los estilos
import HelpIcon from "@mui/icons-material/Help"; // Ícono de signo de interrogación
import { useUserContext } from "@/utils/userContext";

export function TablaPermisosFalta() {
	const { userData, loading } = useUserContext();
	const nombre = userData?.user?.nombre;
	const apellidos = userData?.user?.apellidos;
	const idUser = userData?.user?.id;
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("todos");
	const [eventos, setEventos] = useState([]);
	const [departamentos, setDepartamentos] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	const [users, setUsers] = useState([]);
	const [formularioPrincipalAbiertoEdit, setFormularioPrincipalAbiertoEdit] =
		useState(false); // Estado para abrir el formulario
	const [tipoFormulario, setTipoFormulario] = useState("todos"); // Estado para el tipo de formulario seleccionado
	const [tipoPeticion, setTipoPeticion] = useState("todos"); // Estado para el tipo de petición seleccionada
	const [departamento, setDepartamento] = useState("todos"); // Estado para el tipo de formulario seleccionado
	const [tipoFormulario2, setTipoFormulario2] = useState("");
	const [autorizar, setAutorizar] = useState(false);
	const [verPeticiones, setVerPeticiones] = useState("Papeletas semana");
	const [usersBonos, setUsersBonos] = useState([]);
	const [debouncedSearchTerms, setDebouncedSearchTerms] = useState({});
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
	const [index, setIndex] = useState(0);
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [comentarios, setComentarios] = useState("");
	const [modalOpenStatus, setModalOpenStatus] = useState(false);
	const [modalDataStatus, setModalDataStatus] = useState({
		id: null,
		estatus: "",
	});
	const [idFormulario, setIDFormulario] = useState("");
	const [estatusFormulario, setEstatus] = useState(""); // Estado para abrir el formulario
	const [fechaInicioPapeleta, setFechaInicio] = useState("");
	const [fechaFinPapeleta, setFechaFin] = useState("");
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
		estatus: "",
		horaFormulario: "",
	});

	const encabezados = [
		"ID",
		"Tipo",
		"Número de empleado",
		"Nombre",
		"Departamento",
		"Puesto",
		"Jefe directo",
		"Empresa",
		"Fecha de subida",
		"Fecha requerida",
		"Comentarios",
		"Estatus",
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

	const fetchEventos = async () => {
		try {
			const response = await axios.get(
				"/api/Gente&CulturaAbsence/getFaltasTabla"
			); // Asegúrate de que esta ruta esté configurada en tu backend
			setEventos(response.data);
		} catch (error) {
			console.error("Error al obtener eventos:", error);
		}
	};

	useEffect(() => {
		fetchEventos();
	}, []);

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

	const closeModalEdit = () => {
		setFormularioPrincipalAbiertoEdit(false); // Cerrar el formulario
	};

	const closeModalFormsEdit = () => {
		setFormularioPrincipalAbiertoEdit(false); // Cerrar el formulario
	};

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

	const handleEditForm = async (index) => {
		try {
			const response = await fetch(
				`/api/Gente&CulturaAbsence/obtenerFormularioFaltas?id=${index}`
			);
			const data = await response.json();
			setFormData(data.formulario);
			setTipoFormulario2(data.tipo);
			setFormularioPrincipalAbiertoEdit(true);
			setIndex(index);
			setIDFormulario(data.id);
			setEstatus(data.estatus);
			obtenerUsuariosBonos(data.formulario.tipoSolicitud);
			setFechaInicio(data.fecha_inicio);
			setFechaFin(data.fecha_fin);
		} catch (error) {
			console.error("Error al obtener el formulario:", error);
		}
	};

	const handleOpenModalStatus = (id_papeleta, nuevoEstatus, tipoPeticion) => {
		setModalDataStatus({
			id: id_papeleta,
			estatus: nuevoEstatus,
			tipo: tipoPeticion,
		});
		setModalOpenStatus(true);
		setComentarios("");
	};

	const handleCloseModalStatus = () => {
		setModalOpenStatus(false);
		setModalDataStatus({ id: null, estatus: "", tipo: "" });
	};

	const handleChangeStatus = async (
		index,
		nuevoEstatus,
		comentarios,
		tipo = null
	) => {
		const solicitudesTipos = [
			"Horas extras",
			"Bonos / Comisiones",
			"Aumento sueldo",
			"Faltas",
			"Suspensión o castigo",
		];
		const papeletasTipos = [
			"Llegada tarde / Salida antes",
			"Tiempo por tiempo",
			"Permiso",
			"Home Office",
			"Vacaciones",
			"Omisión de Checada",
		];

		// Determinar el tipo a utilizar
		const tipoSeleccionado = tipo || modalDataStatus.tipo || tipoFormulario2;

		if (!index || !nuevoEstatus) {
			console.error("Error: Falta un valor en handleChangeStatus", {
				index,
				nuevoEstatus,
				comentarios,
			});
			Swal.fire({
				title: "Error",
				text: "Faltan valores para actualizar el estatus",
				icon: "error",
				timer: 3000,
				showConfirmButton: false,
			});
			return;
		}

		try {
			const response = await axios.post(
				`/api/Gente&CulturaAbsence/actualizarEstatusPapeletas`,
				{ id: index, estatus: nuevoEstatus, comentarios: comentarios || null } // Asegura que no sea undefined
			);

			if (response.status === 200) {
				// Enviar notificación después de actualizar el estatus
				if (tipoSeleccionado) {
					// Determinar el tipo de notificación
					const esPapeleta = papeletasTipos.some((tipo) =>
						tipoSeleccionado.startsWith(tipo)
					);
					const esSolicitud = solicitudesTipos.some((tipo) =>
						tipoSeleccionado.startsWith(tipo)
					);

					const tipoNotificacion = esSolicitud
						? "Alerta de actualización de solicitud"
						: "Alerta de actualización de papeleta";

					const mensaje = esSolicitud
						? `<strong>${nombre} ${apellidos}</strong> ha actualizado el estatus de la solicitud con el id ${index} a: <strong>${nuevoEstatus}</strong>.<br>
                       Puedes revisarla haciendo clic en este enlace: <a href="/gente_y_cultura/solicitudes" style="color: blue; text-decoration: underline;">Revisar solicitud</a>`
						: `<strong>${nombre} ${apellidos}</strong> ha actualizado el estatus de la papeleta con el id ${index} a: <strong>${nuevoEstatus}</strong>.<br>
                       Puedes revisarla haciendo clic en este enlace: <a href="/papeletas_usuario" style="color: blue; text-decoration: underline;">Revisar papeleta</a>`;

					// Enviar la notificación
					try {
						const enviarNotificacion = await fetch(
							"/api/Reminder/EnvioEventoAutorizarPapeletas",
							{
								method: "POST",
								headers: {
									"Content-Type": "application/json",
								},
								body: JSON.stringify({
									formData2: {
										tipo: tipoNotificacion,
										descripcion: mensaje,
										id: idUser,
										dpto: null,
										idPapeleta: index,
									},
								}),
							}
						);

						if (!enviarNotificacion.ok) {
							console.error("Error al enviar la notificación");
							Swal.fire("Error", "Error al enviar la notificación", "error");
						}
					} catch (notiError) {
						console.error("Error en la solicitud de notificación:", notiError);
						Swal.fire("Error", "Error en la notificación", "error");
					}
				}

				// Actualizar la vista después de cambiar el estado
				if (verPeticiones === "Todas las solicitudes") {
					verTSolicitudes();
				} else if (verPeticiones === "Todas las papeletas") {
					verTPapeletas();
				} else if (verPeticiones === "Papeletas extemporaneas") {
					verPSExtemporaneas();
				} else {
					fetchEventos();
				}

				Swal.fire({
					title: "Actualizado",
					text: "El estatus de la papeleta ha sido actualizado correctamente",
					icon: "success",
					timer: 3000,
					showConfirmButton: false,
				});

				setComentarios("");
				handleCloseModalStatus();
				closeModalEdit();
			} else {
				Swal.fire({
					title: "Error",
					text: "Error al actualizar el estatus de la papeleta",
					icon: "error",
					timer: 3000,
					showConfirmButton: false,
				});
			}
		} catch (error) {
			console.error("Error al actualizar el estatus de la papeleta:", error);
			Swal.fire({
				title: "Error",
				text: "Ocurrió un error al intentar actualizar el estatus de la papeleta",
				icon: "error",
				timer: 3000,
				showConfirmButton: false,
			});
		}
	};

	//Obtenemos los usuarios para el formulario de bonos y comisiones
	const obtenerUsuariosBonos = (value) => {
		const fetchUsers = async () => {
			if (value == "comisiones") {
				const departamentoBonos = 13;

				try {
					const response = await axios.get(
						`/api/Gente&CulturaAbsence/getUsersBonos?departamento=${departamentoBonos}`
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
						`/api/Gente&CulturaAbsence/getUsersBonos`
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

	const handleCommentsChange = (value) => {
		setComentarios(value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!session) {
			return;
		}
		try {
			const response = await fetch(
				`/api/Gente&CulturaAbsence/actualizarFormularioFaltas?id=${index}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ formData, estatus }), // Enviar todo el objeto formData como JSON
				}
			);
			if (response.ok) {
				Swal.fire({
					title: "Actualizado",
					text: "Se ha actualizado correctamente",
					icon: "success",
					timer: 3000, // La alerta desaparecerá después de 1.5 segundos
					showConfirmButton: false,
				}).then(() => {
					window.location.href = "/gente_y_cultura/faltas";
				});
			} else {
				Swal.fire("Error", "Error al actualizar la papeleta", "error");
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	const renderDatePicker = (
		label,
		date,
		handleChange,
		name,
		readOnly = false,
		removeSpacing = false
	) => (
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
						disabled={readOnly} // Desactiva el botón si es readOnly
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
					<PopoverContent className="w-auto p-0">
						<Calendar
							mode="single"
							selected={date}
							onSelect={(selectedDate) =>
								handleChange({ target: { name, value: selectedDate } })
							}
							initialFocus
						/>
					</PopoverContent>
				)}
			</Popover>
		</div>
	);

	// Función para extraer los datos relevantes
	const extractData = (evento) => {
		return {
			id_papeleta: evento.id_papeleta,
			tipo:
				evento.tipo === "Suspension"
					? "Suspensión o castigo" +
					  (evento.extemporanea === 1 ? " - Extemporánea" : "")
					: evento.tipo + (evento.extemporanea === 1 ? " - Extemporánea" : ""),
			nombre: evento.nombre + " " + evento.apellidos,
			fecha_subida: evento.fecha_subida,
			fecha_requerida: evento.fecha_inicio,
			numero_empleado: evento.numero_empleado,
			departamento: evento.nombre_departamento,
			puesto: evento.puesto,
			jefe_directo: evento.jefe_directo,
			empresa: evento.empresa_usuario,
			comentarios: evento.comentarios,
			estatus: evento.estatus,
			accion: (index) => (
				<div style={{ display: "flex", gap: "1px" }}>
					<Button onClick={() => handleEditForm(index)}>
						<VisualizeIcon />
					</Button>
				</div>
			),
		};
	};

	const filteredEventos = eventos.map(extractData).filter((evento) => {
		const solicitudesTipos = [
			"Horas extras",
			"Bonos / Comisiones",
			"Aumento sueldo",
			"Faltas",
			"Suspensión o castigo",
		];
		const papeletasTipos = [
			"Llegada tarde / Salida antes",
			"Tiempo por tiempo",
			"Permiso",
			"Home Office",
			"Vacaciones",
			"Omisión de Checada",
		];

		// Filtrar por tipo de petición
		if (
			tipoPeticion !== "todos" &&
			!(
				(tipoPeticion === "solicitudes" &&
					solicitudesTipos.includes(evento.tipo.split(" - ")[0])) ||
				(tipoPeticion === "papeletas" &&
					papeletasTipos.includes(evento.tipo.split(" - ")[0]))
			)
		) {
			return false;
		}

		// Filtrar por tipo de formulario
		if (
			tipoFormulario !== "todos" &&
			evento.tipo.split(" - ")[0] !== tipoFormulario
		) {
			return false;
		}

		if (statusFilter !== "todos" && evento.estatus !== statusFilter) {
			return false;
		}

		// Filtrar por departamento
		if (departamento !== "todos" && evento.departamento !== departamento) {
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

		if (!evento.fecha_requerida) return true;

		const fechaEvento = new Date(evento.fecha_requerida.replace(" ", "T")); // 🔹 Reemplaza espacio por "T" para evitar errores en Safari
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

	const exportToExcel = () => {
		const timezoneFormatter = new Intl.DateTimeFormat("es-ES", {
			timeZone: "America/Mexico_City", // Cambia a tu zona horaria
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: false, // Cambia a true si prefieres formato de 12 horas
		});

		const worksheet = XLSX.utils.json_to_sheet(
			filteredEventos.map((evento) => {
				let nombreEmpresa = "Sin datos";
				let nombreJefe = "Sin datos";

				// Buscar jefe directo
				const jefe = users.find((u) => u.id === evento.jefe_directo);
				if (jefe) {
					nombreJefe = `${jefe.nombre} ${jefe.apellidos}`;
				}

				// Manejar evento.empresa si es JSON o texto
				if (typeof evento.empresa === "object" && evento.empresa !== null) {
					nombreEmpresa = evento.empresa.nombre || "Sin datos";
				} else if (typeof evento.empresa === "string") {
					try {
						const empresaData = JSON.parse(evento.empresa);
						nombreEmpresa = empresaData.nombre || "Sin datos";
					} catch (error) {
						console.error("Error al parsear empresa:", error);
					}
				}

				return {
					ID: evento.id_papeleta || "Sin datos",
					Tipo: evento.tipo || "Sin datos",
					Numero_empleado: evento.numero_empleado || "Sin datos",
					Nombre_completo:
						`${evento.nombre ?? ""} ${evento.apellidos ?? ""}`.trim() ||
						"Sin datos",
					Departamento: evento.departamento || "Sin datos",
					Puesto: evento.puesto || "Sin datos",
					Jefe_directo: nombreJefe,
					Empresa: nombreEmpresa,
					Fecha_subida: evento.fecha_subida
						? timezoneFormatter.format(new Date(evento.fecha_subida))
						: "Sin datos",
					Fecha_requerida: evento.fecha_requerida
						? new Date(evento.fecha_requerida).toLocaleDateString("es-ES", {
								day: "2-digit",
								month: "2-digit",
								year: "numeric",
						  })
						: "Sin datos",
					Comentarios: evento.comentarios || "Sin datos",
					Estatus:
						evento.estatus === "Autorizada por tu jefe directo"
							? "Autorizada por el departamento"
							: evento.estatus === "Pendiente"
							? "Autorizada por el departamento"
							: evento.estatus || "Sin datos",
				};
			})
		);

		const workbook = XLSX.utils.book_new();
		const nombreHoja =
			verPeticiones === "Todas las solicitudes"
				? "Solicitudes"
				: verPeticiones === "Todas las papeletas"
				? "Papeletas"
				: verPeticiones === "Papeletas extemporaneas"
				? "Papeletas y solicitudes ext"
				: "Papeletas y solicitudes";

		const nombreArchivo =
			verPeticiones === "Todas las solicitudes"
				? "solicitudes.xlsx"
				: verPeticiones === "Todas las papeletas"
				? "papeletas.xlsx"
				: verPeticiones === "Papeletas extemporaneas"
				? "papeletas_y_solicitudes_ex.xlsx"
				: "papeletas_y_solicitudes.xlsx";

		XLSX.utils.book_append_sheet(workbook, worksheet, nombreHoja);
		XLSX.writeFile(workbook, nombreArchivo);
	};

	const verTPapeletas = () => {
		const fetchPapeletas = async () => {
			try {
				const response = await axios.get(
					"/api/Gente&CulturaAbsence/getTodasPapeletas"
				); // Asegúrate de que esta ruta esté configurada en tu backend
				setEventos(response.data);
				setAutorizar(false);
				setVerPeticiones("Todas las papeletas");
			} catch (error) {
				console.error("Error al obtener eventos:", error);
			}
		};

		fetchPapeletas();
	};

	const verTSolicitudes = () => {
		const fetchSolicitudes = async () => {
			try {
				const response = await axios.get(
					"/api/Gente&CulturaAbsence/getTodasSolicitudes"
				); // Asegúrate de que esta ruta esté configurada en tu backend
				setEventos(response.data);
				setAutorizar(true);
				setVerPeticiones("Todas las solicitudes");
			} catch (error) {
				console.error("Error al obtener eventos:", error);
			}
		};

		fetchSolicitudes();
	};

	const verPapeletasSemana = () => {
		const fetchPapeletasSemana = async () => {
			try {
				const response = await axios.get(
					"/api/Gente&CulturaAbsence/getFaltasTabla"
				); // Asegúrate de que esta ruta esté configurada en tu backend
				setEventos(response.data);
				setAutorizar(true);
				setVerPeticiones("Papeletas semana");
			} catch (error) {
				console.error("Error al obtener eventos:", error);
			}
		};

		fetchPapeletasSemana();
	};

	const verPSExtemporaneas = () => {
		const fetchPapeletasSolicitudesExtemp = async () => {
			try {
				const response = await axios.get(
					"/api/Gente&CulturaAbsence/getFaltasExtemporaneas"
				); // Asegúrate de que esta ruta esté configurada en tu backend
				setEventos(response.data);
				setAutorizar(true);
				setVerPeticiones("Papeletas extemporaneas");
			} catch (error) {
				console.error("Error al obtener eventos:", error);
			}
		};

		fetchPapeletasSolicitudesExtemp();
	};

	const handleSelectChange = (value) => {
		setVerPeticiones(value);
		switch (value) {
			case "Todas las papeletas":
				setEventos([]);
				verTPapeletas();
				break;
			case "Todas las solicitudes":
				setEventos([]);
				verTSolicitudes();
				break;
			case "Papeletas semana":
				setEventos([]);
				verPapeletasSemana();
				break;
			case "Papeletas extemporaneas":
				setEventos([]);
				verPSExtemporaneas();
				break;
			default:
				break;
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

	return (
		<div className="container mx-auto">
			<div className="flex justify-center items-center text-center mb-4">
				{verPeticiones === "Todas las papeletas" ? (
					<CardTitle className="text-3xl font-bold">
						Todas las papeletas
					</CardTitle>
				) : verPeticiones === "Todas las solicitudes" ? (
					<CardTitle className="text-3xl font-bold">
						Todas las solicitudes
					</CardTitle>
				) : verPeticiones === "Papeletas extemporaneas" ? (
					<CardTitle className="text-3xl font-bold">
						Papeletas y solicitudes extemporáneas pendientes por revisar
					</CardTitle>
				) : (
					<CardTitle className="text-3xl font-bold">
						Papeletas y solicitudes pendientes por revisar
					</CardTitle>
				)}
			</div>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					width: "100%",
				}}>
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
					onClick={exportToExcel}>
					<ExportIcon className="h-4 w-4" /> EXPORTAR A EXCEL
				</Button>
				<div>
					<Label htmlFor="search" className="mb-2 block">
						Vista
					</Label>
					<Select
						onValueChange={handleSelectChange}
						defaultValue={verPeticiones}>
						<SelectTrigger id="status-filter" className="w-[350px]">
							<SelectValue placeholder="Seleccionar vista" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="Papeletas semana">
								Ver papeletas y solicitudes de la semana
							</SelectItem>
							<SelectItem value="Todas las papeletas">
								Ver todas las papeletas
							</SelectItem>
							<SelectItem value="Todas las solicitudes">
								Ver todas las solicitudes
							</SelectItem>
							<SelectItem value="Papeletas extemporaneas">
								Ver papeletas y solicitudes extemporáneas
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
			<br />
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
				{verPeticiones === "Papeletas semana" ||
				verPeticiones === "Papeletas extemporaneas" ? (
					<>
						<div className="w-full sm:w-1/3">
							<Label htmlFor="status-filter" className="mb-2 block">
								Filtrar por tipo de petición
							</Label>
							<Select
								onValueChange={setTipoPeticion}
								defaultValue={tipoPeticion}>
								<SelectTrigger id="status-filter">
									<SelectValue placeholder="Seleccionar tipo de petición" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="todos">Papeletas y solicitudes</SelectItem>
									<SelectItem value="papeletas">Solo papeletas</SelectItem>
									<SelectItem value="solicitudes">Solo solicitudes</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="w-full sm:w-1/3">
							<Label htmlFor="status-filter" className="mb-2 block">
								Filtrar por tipo de solicitud
							</Label>
							<Select
								onValueChange={setTipoFormulario}
								defaultValue={tipoFormulario}>
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
					</>
				) : (
					<div hidden></div>
				)}
				{verPeticiones === "Todas las solicitudes" ? (
					<div className="w-full sm:w-1/3">
						<Label htmlFor="status-filter" className="mb-2 block">
							Filtrar por tipo de solicitud
						</Label>
						<Select
							onValueChange={setTipoFormulario}
							defaultValue={tipoFormulario}>
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
				) : (
					<div className="w-full sm:w-1/3">
						<Label htmlFor="status-filter" className="mb-2 block">
							Filtrar por tipo de papeleta
						</Label>
						<Select
							onValueChange={setTipoFormulario}
							defaultValue={tipoFormulario}>
							<SelectTrigger id="status-filter">
								<SelectValue placeholder="Seleccionar tipo" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="todos">Todos</SelectItem>
								<SelectItem value="Llegada tarde / Salida antes">
									Llegada tarde / Salida antes
								</SelectItem>
								<SelectItem value="Tiempo por tiempo">
									Tiempo por tiempo
								</SelectItem>
								<SelectItem value="Permiso">Permiso</SelectItem>
								<SelectItem value="Home Office">Home Office</SelectItem>
								<SelectItem value="Vacaciones">Vacaciones</SelectItem>
								<SelectItem value="Omisión de Checada">
									Omisión de Checada
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
				)}
				<div className="w-full sm:w-1/3">
					<Label htmlFor="status-filter" className="mb-2 block">
						Filtrar por departamento
					</Label>
					<Select onValueChange={setDepartamento} defaultValue={departamento}>
						<SelectTrigger id="status-filter">
							<SelectValue placeholder="Seleccionar departamento" />
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
				{verPeticiones !== "Papeletas semana" &&
				verPeticiones !== "Papeletas extemporaneas" ? (
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
								{verPeticiones === "Todas las papeletas" ? (
									<SelectItem value="Autorizada por tu jefe directo">
										Autorizada por el departamento
									</SelectItem>
								) : (
									<SelectItem value="Pendiente">
										Autorizada por el departamento
									</SelectItem>
								)}
								<SelectItem value="No autorizada por RH">
									No autorizada
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
				) : (
					<div hidden></div>
				)}
			</div>
			{formularioPrincipalAbiertoEdit && (
				<Dialog
					open={formularioPrincipalAbiertoEdit}
					onOpenChange={closeModalFormsEdit}>
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
										onOpenChange={closeModalEdit}>
										<DialogContent
											className="border-none p-0 overflow-y-auto w-full max-w-[35vw] max-h-[80vh] shadow-lg ml-[6vw] mt-auto"
											onInteractOutside={(event) => event.preventDefault()}>
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
																value={formData.justificada}
																onValueChange={(value) =>
																	handleChange2({ name: "justificada", value })
																}
																disabled={true}
																className="flex space-x-4">
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
																}}
																disabled={true}>
																<SelectTrigger className="col-span-3">
																	<SelectValue placeholder="Seleccione el colaborador..." />
																</SelectTrigger>
																<SelectContent>
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
																					value={user.id}>
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
																readOnly={true}
																placeholder="Dias que faltó"
															/>
														</div>
														<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
															{renderDatePicker(
																"Fecha de inicio",
																fechaInicioPapeleta,
																handleChange,
																"fechaInicio",
																true
															)}
															{renderDatePicker(
																"Fecha de fin",
																fechaFinPapeleta,
																handleChange,
																"fechaFin",
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
																readOnly={true}
															/>
														</div>
														<div className="space-y-2">
															<div
																style={{
																	position: "relative",
																	display: "inline-flex",
																	alignItems: "center",
																}}>
																<Label htmlFor="comprobante">
																	Justificante
																</Label>
																<div style={{ marginLeft: "10px" }}>
																	<Tooltip
																		title={`<p style="margin:0;padding:5px;text-align:justify;">Si el justificante es del IMSS, 
                        entonces la falta es justificada y se pagan 4 horas, de lo contrario no se paga, pero si se justifica.</p>`}
																		arrow>
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
																		className="text-sm text-blue-600 hover:underline">
																		Descargar {formData.comprobante}
																	</a>
																) : (
																	<span style={{ fontSize: 14 }}>
																		Sin justificante agregado
																	</span>
																)}
															</div>
														</div>
														<div
															className="space-y-2"
															style={{
																color: (() => {
																	if (
																		estatusFormulario.startsWith("Autorizada")
																	)
																		return "green";
																	if (
																		estatusFormulario.startsWith(
																			"No autorizada"
																		)
																	)
																		return "red";
																	switch (estatusFormulario) {
																		case "Pendiente":
																			return "orange";
																		default:
																			return "black"; // color por defecto
																	}
																})(),
															}}>
															<Label
																htmlFor="estatus"
																style={{ color: "black" }}>
																Estatus
															</Label>
															<Select
																value={estatusFormulario}
																onValueChange={(value) => {
																	if (
																		value.startsWith("Autorizada por RH") ||
																		value.startsWith("No autorizada")
																	) {
																		handleOpenModalStatus(
																			idFormulario,
																			value,
																			tipoFormulario2
																		);
																	} else {
																		handleChangeStatus(
																			idFormulario,
																			value,
																			null,
																			tipoFormulario2
																		);
																	}
																}}>
																<SelectTrigger>
																	<SelectValue placeholder="Selecciona una opción" />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value="Autorizada por RH">
																		Autorizada
																	</SelectItem>
																	<SelectItem value="Pendiente">
																		Autorizada por el departamento
																	</SelectItem>
																	<SelectItem value="No autorizada por RH">
																		No autorizada
																	</SelectItem>
																</SelectContent>
															</Select>
														</div>
													</CardContent>
												</form>
											</Card>
										</DialogContent>
									</Dialog>
								)}

								{tipoFormulario2 === "Llegada tarde / Salida antes" && (
									<Dialog
										open={formularioPrincipalAbiertoEdit}
										onOpenChange={closeModalEdit}>
										<DialogContent
											className="border-none p-0 overflow-y-auto w-full max-w-[35vw] max-h-[80vh] shadow-lg ml-[6vw] mt-auto"
											onInteractOutside={(event) => event.preventDefault()}>
											<Card>
												<CardHeader>
													<CardTitle className="text-2xl font-bold text-center">
														Llegada tarde / Salida antes
													</CardTitle>
													<DialogDescription className="text-center">
														Autorización para llegar tarde o salir temprano
													</DialogDescription>
												</CardHeader>
												<form onSubmit={handleSubmit}>
													<CardContent className="space-y-6">
														<div className="space-y-2">
															<Label htmlFor="horaFormulario">Hora</Label>
															<Input
																id="horaFormulario"
																name="horaFormulario"
																type="time"
																value={formData.horaFormulario}
																onChange={handleChange}
																readOnly={true}
															/>
														</div>
														<div className="grid grid-cols-1 gap-4">
															{renderDatePicker(
																"Fecha",
																fechaInicioPapeleta,
																handleChange,
																"fechaInicio",
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
																readOnly={true}
															/>
														</div>
														<div
															className="space-y-2"
															style={{
																color: (() => {
																	if (
																		estatusFormulario.startsWith(
																			"Autorizada por RH"
																		)
																	)
																		return "green";
																	if (
																		estatusFormulario.startsWith(
																			"No autorizada"
																		)
																	)
																		return "red";
																	switch (estatusFormulario) {
																		case "Autorizada por tu jefe directo":
																			return "orange";
																		default:
																			return "black"; // color por defecto
																	}
																})(),
															}}>
															<Label
																htmlFor="estatus"
																style={{ color: "black" }}>
																Estatus
															</Label>
															<Select
																value={estatusFormulario}
																onValueChange={(value) => {
																	if (
																		value.startsWith("Autorizada por RH") ||
																		value.startsWith("No autorizada")
																	) {
																		handleOpenModalStatus(
																			idFormulario,
																			value,
																			tipoFormulario2
																		);
																	} else {
																		handleChangeStatus(
																			idFormulario,
																			value,
																			null,
																			tipoFormulario2
																		);
																	}
																}}>
																<SelectTrigger>
																	<SelectValue placeholder="Selecciona una opción" />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value="Autorizada por RH">
																		Autorizada
																	</SelectItem>
																	<SelectItem value="Autorizada por tu jefe directo">
																		Autorizada por el departamento
																	</SelectItem>
																	<SelectItem value="No autorizada por RH">
																		No autorizada
																	</SelectItem>
																</SelectContent>
															</Select>
														</div>
													</CardContent>
												</form>
											</Card>
										</DialogContent>
									</Dialog>
								)}
								{tipoFormulario2 === "Tiempo por tiempo" && (
									<Dialog
										open={formularioPrincipalAbiertoEdit}
										onOpenChange={closeModalEdit}>
										<DialogContent
											className="border-none p-0 overflow-y-auto w-full max-w-[35vw] max-h-[80vh] shadow-lg ml-[6vw] mt-auto"
											onInteractOutside={(event) => event.preventDefault()}>
											<Card>
												<CardHeader>
													<CardTitle className="text-2xl font-bold text-center">
														Tiempo por tiempo
													</CardTitle>
													<DialogDescription className="text-center">
														Tiempo que puedes reponer llegando temprano o
														saliendo tarde
													</DialogDescription>
												</CardHeader>
												<form onSubmit={handleSubmit}>
													<CardContent className="space-y-6">
														<div className="space-y-2">
															<div
																style={{
																	position: "relative",
																	display: "inline-flex",
																	alignItems: "center",
																}}>
																<Label htmlFor="motivo">Días</Label>
																<div style={{ marginLeft: "10px" }}>
																	<Tooltip
																		title="1 día de trabajo equivale a 8 horas de trabajo."
																		arrow>
																		<HelpIcon
																			style={{
																				cursor: "pointer",
																				fontSize: 18,
																			}}
																		/>
																	</Tooltip>
																</div>
															</div>
															<Input
																id="dias"
																name="dias"
																type="number"
																value={formData.dias}
																onChange={handleChange}
																readOnly={true}
																placeholder="Dias..."
															/>
														</div>
														<div className="space-y-2">
															<Label htmlFor="horas">Horas</Label>
															<Input
																id="horas"
																name="horas"
																type="number"
																value={formData.horas}
																onChange={handleChange}
																readOnly={true}
																placeholder="Horas..."
															/>
														</div>
														<div className="space-y-2">
															<Label htmlFor="minutos">Minutos</Label>
															<Input
																id="minutos"
																name="minutos"
																type="number"
																value={formData.minutos}
																onChange={handleChange}
																readOnly={true}
																placeholder="Minutos..."
															/>
														</div>
														<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
															{renderDatePicker(
																"Fecha de inicio",
																fechaInicioPapeleta,
																handleChange,
																"fechaInicio",
																true
															)}
															{renderDatePicker(
																"Fecha de fin",
																fechaFinPapeleta,
																handleChange,
																"fechaFin",
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
																readOnly={true}
																className="min-h-[100px]"
																placeholder="Coloca tus observaciones aquí..."
															/>
														</div>
														<div className="space-y-2">
															<Label htmlFor="comprobante">Comprobante</Label>
															<div className="flex items-center space-x-2">
																{formData.comprobante ? (
																	<a
																		href={`/api/Gente&CulturaAbsence/descargarPDF?fileName=${encodeURIComponent(
																			formData.comprobante
																		)}`}
																		target="_blank"
																		rel="noopener noreferrer"
																		className="text-sm text-blue-600 hover:underline">
																		Descargar {formData.comprobante}
																	</a>
																) : (
																	<>
																		<span style={{ fontSize: 14 }}>
																			Sin comprobante agregado
																		</span>
																	</>
																)}
															</div>
														</div>
														<div
															className="space-y-2"
															style={{
																color: (() => {
																	if (
																		estatusFormulario.startsWith(
																			"Autorizada por RH"
																		)
																	)
																		return "green";
																	if (
																		estatusFormulario.startsWith(
																			"No autorizada"
																		)
																	)
																		return "red";
																	switch (estatusFormulario) {
																		case "Autorizada por tu jefe directo":
																			return "orange";
																		default:
																			return "black"; // color por defecto
																	}
																})(),
															}}>
															<Label
																htmlFor="estatus"
																style={{ color: "black" }}>
																Estatus
															</Label>
															<Select
																value={estatusFormulario}
																onValueChange={(value) => {
																	if (
																		value.startsWith("Autorizada por RH") ||
																		value.startsWith("No autorizada")
																	) {
																		handleOpenModalStatus(
																			idFormulario,
																			value,
																			tipoFormulario2
																		);
																	} else {
																		handleChangeStatus(
																			idFormulario,
																			value,
																			null,
																			tipoFormulario2
																		);
																	}
																}}>
																<SelectTrigger>
																	<SelectValue placeholder="Selecciona una opción" />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value="Autorizada por RH">
																		Autorizada
																	</SelectItem>
																	<SelectItem value="Autorizada por tu jefe directo">
																		Autorizada por el departamento
																	</SelectItem>
																	<SelectItem value="No autorizada por RH">
																		No autorizada
																	</SelectItem>
																</SelectContent>
															</Select>
														</div>
													</CardContent>
												</form>
											</Card>
										</DialogContent>
									</Dialog>
								)}
								{tipoFormulario2 === "Permiso" && (
									<Dialog
										open={formularioPrincipalAbiertoEdit}
										onOpenChange={closeModalEdit}>
										<DialogContent
											className="border-none p-0 overflow-y-auto w-full max-w-[35vw] max-h-[80vh] shadow-lg ml-[6vw] mt-auto"
											onInteractOutside={(event) => event.preventDefault()}>
											<Card>
												<CardHeader>
													<CardTitle className="text-2xl font-bold text-center">
														Permiso
													</CardTitle>
													<DialogDescription className="text-center">
														Permiso con goce o sin goce de sueldo
													</DialogDescription>
												</CardHeader>
												<form onSubmit={handleSubmit}>
													<CardContent className="space-y-6">
														<div className="space-y-2">
															<div
																style={{
																	position: "relative",
																	display: "inline-flex",
																	alignItems: "center",
																}}>
																<Label>Tipo de permiso</Label>
																<div style={{ marginLeft: "10px" }}>
																	<Tooltip
																		title={`<p style="margin:0;padding:5px;text-align:justify;">La empresa concederá a los trabajadores permiso con goce de sueldo en los siguientes casos:</p>
                        <ul style="margin:0;padding:5px;text-align:justify;">
                          <li style="margin-bottom:5px;"><strong>Muerte de algún familiar consanguíneo en línea recta:</strong> Padre, Madre, Cónyuge e Hijos (5 días). Adjuntar copia simple del acta de defunción.</li>
                          <li style="margin-bottom:5px;"><strong>Muerte de algún familiar en segundo grado:</strong> Abuelos, hermanos, suegros (2 días). Adjuntar copia simple del acta de defunción.</li>
                          <li style="margin-bottom:5px;"><strong>Permiso por paternidad:</strong> 5 días por nacimiento o adopción. Ajuntar copia simple del acta de nacimiento de su hijo.</li>
                          <li><strong>Permiso por matrimonio:</strong> Civil o religioso, 3 días. Adjuntar copia simple del acta de matrimonio.</li>
                        </ul>`}
																		arrow>
																		<HelpIcon
																			style={{
																				cursor: "pointer",
																				fontSize: 18,
																			}}
																		/>
																	</Tooltip>
																</div>
															</div>
															<RadioGroup
																onValueChange={(value) =>
																	handleChange2({ name: "conSueldo", value })
																}
																value={formData.conSueldo}
																disabled={true}
																className="flex space-x-4">
																<div className="flex items-center space-x-2">
																	<RadioGroupItem
																		value="si"
																		id="justificada-si"
																	/>
																	<Label htmlFor="justificada-si">
																		Con goce de sueldo
																	</Label>
																</div>
																<div className="flex items-center space-x-2">
																	<RadioGroupItem
																		value="no"
																		id="justificada-no"
																	/>
																	<Label htmlFor="justificada-no">
																		Sin goce de sueldo
																	</Label>
																</div>
															</RadioGroup>
														</div>
														<div className="space-y-2">
															<Label htmlFor="motivo">Días</Label>
															<Input
																id="dias"
																name="dias"
																type="number"
																value={formData.dias}
																onChange={handleChange}
																readOnly={true}
																placeholder="Dias..."
															/>
														</div>
														<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
															{renderDatePicker(
																"Fecha de inicio",
																fechaInicioPapeleta,
																handleChange,
																"fechaInicio",
																true
															)}
															{renderDatePicker(
																"Fecha de fin",
																fechaFinPapeleta,
																handleChange,
																"fechaFin",
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
																readOnly={true}
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
																}}>
																<Label htmlFor="comprobante">Comprobante</Label>
																<div style={{ marginLeft: "10px" }}>
																	<Tooltip
																		title={`<p style="margin:0;padding:5px;text-align:justify;">Sube aquí tu documento correspondiente al tipo de permiso requerido.</p>`}
																		arrow>
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
																		className="text-sm text-blue-600 hover:underline">
																		Descargar {formData.comprobante}
																	</a>
																) : (
																	<>
																		<span style={{ fontSize: 14 }}>
																			Sin comprobante agregado
																		</span>
																	</>
																)}
															</div>
														</div>
														<div
															className="space-y-2"
															style={{
																color: (() => {
																	if (
																		estatusFormulario.startsWith(
																			"Autorizada por RH"
																		)
																	)
																		return "green";
																	if (
																		estatusFormulario.startsWith(
																			"No autorizada"
																		)
																	)
																		return "red";
																	switch (estatusFormulario) {
																		case "Autorizada por tu jefe directo":
																			return "orange";
																		default:
																			return "black"; // color por defecto
																	}
																})(),
															}}>
															<Label
																htmlFor="estatus"
																style={{ color: "black" }}>
																Estatus
															</Label>
															<Select
																value={estatusFormulario}
																onValueChange={(value) => {
																	if (
																		value.startsWith("Autorizada por RH") ||
																		value.startsWith("No autorizada")
																	) {
																		handleOpenModalStatus(
																			idFormulario,
																			value,
																			tipoFormulario2
																		);
																	} else {
																		handleChangeStatus(
																			idFormulario,
																			value,
																			null,
																			tipoFormulario2
																		);
																	}
																}}>
																<SelectTrigger>
																	<SelectValue placeholder="Selecciona una opción" />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value="Autorizada por RH">
																		Autorizada
																	</SelectItem>
																	<SelectItem value="Autorizada por tu jefe directo">
																		Autorizada por el departamento
																	</SelectItem>
																	<SelectItem value="No autorizada por RH">
																		No autorizada
																	</SelectItem>
																</SelectContent>
															</Select>
														</div>
													</CardContent>
												</form>
											</Card>
										</DialogContent>
									</Dialog>
								)}
								{tipoFormulario2 === "Home Office" && (
									<Dialog
										open={formularioPrincipalAbiertoEdit}
										onOpenChange={closeModalEdit}>
										<DialogContent
											onInteractOutside={(event) => event.preventDefault()}
											className="border-none p-0 overflow-y-auto w-full max-w-[60vw] max-h-[70vh] shadow-lg ml-[6.5vw]">
											<Card>
												<CardHeader>
													<CardTitle className="text-2xl font-bold text-center">
														Home Office
													</CardTitle>
													<DialogDescription className="text-center">
														Solicitar permiso para realizar home office
													</DialogDescription>
												</CardHeader>
												<form onSubmit={handleSubmit}>
													<CardContent className="space-y-6">
														<div>
															<Label style={{ fontSize: 17 }}>Periodo</Label>
														</div>
														<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
															{renderDatePicker(
																"Fecha de inicio",
																fechaInicioPapeleta,
																handleChange,
																"fechaInicio",
																true
															)}
															{renderDatePicker(
																"Fecha de fin",
																fechaFinPapeleta,
																handleChange,
																"fechaFin",
																true
															)}
														</div>
														<div
															style={{
																position: "relative",
																display: "inline-flex",
																alignItems: "center",
															}}>
															<Label style={{ fontSize: 17 }}>
																Plan de trabajo
															</Label>
															<div style={{ marginLeft: "10px" }}>
																<Tooltip
																	title={`<p style="margin:0;padding:5px;text-align:justify;">INSTRUCCIONES PARA EL LLENADO DEL FORMULARIO:</p>
                      <ul style="margin:0;padding:5px;text-align:justify;">
                        <li style="margin-bottom:5px;"><strong>FECHA:</strong> Fecha de actividad, se debe seguir un consecutivo.</li>
                        <li style="margin-bottom:5px;"><strong>ACTIVIDAD:</strong> Corresponde al nombre corto que el proponente le designe a la actividad.</li>
                        <li style="margin-bottom:5px;"><strong>DESCRIPCIÓN DE ACTIVIDAD ELABORADA:</strong> Describa las actividades requeridas para el cumplimiento del objetivo del proyecto.</li>
                        <li style="margin-bottom:5px;"><strong>PERSONA A LA QUE SE LE DIÓ RESPUESTA (SOLO DE DAR SEGUIMIENTO A PETICIÓN):</strong> Indique el nombre del miembro del equipo de trabajo quien se le dió respuesta con la actividad. Solo en caso de que se tenga, puesto que si es una actividad individual sin relación a otra área, este espacio se deja en blanco.</li>
                        <li style="margin-bottom:5px;"><strong>TIEMPO DE RESPUESTA:</strong> Indique el tiempo de respuesta que se requirió para las actividades.</li>
                        <li style="margin-bottom:5px;"><strong>COMENTARIOS (SI SE DEJA PENDIENTE, SE REQUIERE APOYO DE ALGÚN OTRA ÁREA, ETC.):</strong> Son observaciones, pendientes que pueden quedar en otra área, o en la nuestra.</li>
                        <li><strong>RECUERDE:</strong> Las actividades propuestas deben estar orientadas al cumplimiento del objeto de la convocatoria.</li>
                      </ul>`}
																	arrow>
																	<HelpIcon
																		style={{ cursor: "pointer", fontSize: 20 }}
																	/>
																</Tooltip>
															</div>
														</div>
														<div className="grid grid-cols-6 gap-1">
															<div className="flex flex-col justify-end min-w-0">
																{renderDatePicker(
																	"Fecha",
																	formData.fechaFormulario,
																	handleChange,
																	"fechaFormulario",
																	true
																)}
															</div>
															<div className="flex flex-col justify-end min-w-0 space-y-3">
																<Label
																	htmlFor="actividad"
																	className="truncate block">
																	Actividad
																</Label>
																<Input
																	id="actividad"
																	name="actividad"
																	type="text"
																	value={formData.actividad}
																	onChange={handleChange}
																	readOnly={true}
																/>
															</div>
															<div className="flex flex-col justify-end min-w-0 space-y-3">
																<Label
																	htmlFor="descripcion"
																	className="truncate block">
																	Descripción
																</Label>
																<Input
																	id="descripcion"
																	name="descripcion"
																	type="text"
																	value={formData.descripcion}
																	onChange={handleChange}
																	readOnly={true}
																/>
															</div>
															<div className="flex flex-col justify-end min-w-0 space-y-3">
																<Label
																	htmlFor="persona"
																	className="truncate block">
																	Persona respuesta
																</Label>
																<Input
																	id="persona"
																	name="persona"
																	type="text"
																	value={formData.persona}
																	onChange={handleChange}
																	readOnly={true}
																/>
															</div>
															<div className="flex flex-col justify-end min-w-0 space-y-3">
																<Label
																	htmlFor="tiempoRespuesta"
																	className="truncate block">
																	Tiempo de respuesta
																</Label>
																<Input
																	id="tiempoRespuesta"
																	name="tiempoRespuesta"
																	type="text"
																	value={formData.tiempoRespuesta}
																	onChange={handleChange}
																	readOnly={true}
																/>
															</div>
															<div className="flex flex-col justify-end min-w-0 space-y-3">
																<Label
																	htmlFor="comentarios"
																	className="truncate block">
																	Comentarios
																</Label>
																<Input
																	id="comentarios"
																	name="comentarios"
																	type="text"
																	value={formData.comentarios}
																	onChange={handleChange}
																	readOnly={true}
																/>
															</div>
														</div>
														<div className="space-y-2">
															{formData.planTrabajo.otros.map((otro, index) => (
																<div
																	key={index}
																	className="grid grid-cols-6 gap-1">
																	<div>
																		{renderDatePicker(
																			"",
																			otro.fechaActividad,
																			(e) =>
																				handleTrabajoChange(
																					e,
																					index,
																					"fechaActividad"
																				),
																			"fechaActividad",
																			true,
																			true
																		)}
																	</div>
																	<div>
																		<Input
																			id={`actividad-${index}`}
																			name={`actividad-${index}`}
																			type="text"
																			value={otro.actividad}
																			onChange={(e) =>
																				handleChange(e, index, "actividad")
																			}
																			readOnly={true}
																		/>
																	</div>
																	<div>
																		<Input
																			id={`descripcion-${index}`}
																			name={`descripcion-${index}`}
																			type="text"
																			value={otro.descripcion}
																			onChange={(e) =>
																				handleChange(e, index, "descripcion")
																			}
																			readOnly={true}
																		/>
																	</div>
																	<div>
																		<Input
																			id={`persona-${index}`}
																			name={`persona-${index}`}
																			type="text"
																			value={otro.persona}
																			onChange={(e) =>
																				handleChange(e, index, "persona")
																			}
																			readOnly={true}
																		/>
																	</div>
																	<div>
																		<Input
																			id={`tiempoRespuesta-${index}`}
																			name={`tiempoRespuesta-${index}`}
																			type="text"
																			value={otro.tiempoRespuesta}
																			onChange={(e) =>
																				handleChange(
																					e,
																					index,
																					"tiempoRespuesta"
																				)
																			}
																			readOnly={true}
																		/>
																	</div>
																	<div>
																		<div>
																			<Input
																				id={`comentarios-${index}`}
																				name={`comentarios-${index}`}
																				type="text"
																				className="w-full"
																				value={otro.comentarios}
																				onChange={(e) =>
																					handleChange(e, index, "comentarios")
																				}
																				readOnly={true}
																			/>
																		</div>
																	</div>
																</div>
															))}
														</div>
														<div
															className="space-y-2"
															style={{
																color: (() => {
																	if (
																		estatusFormulario.startsWith(
																			"Autorizada por RH"
																		)
																	)
																		return "green";
																	if (
																		estatusFormulario.startsWith(
																			"No autorizada"
																		)
																	)
																		return "red";
																	switch (estatusFormulario) {
																		case "Autorizada por tu jefe directo":
																			return "orange";
																		default:
																			return "black"; // color por defecto
																	}
																})(),
															}}>
															<Label
																htmlFor="estatus"
																style={{ color: "black" }}>
																Estatus
															</Label>
															<Select
																value={estatusFormulario}
																onValueChange={(value) => {
																	if (
																		value.startsWith("Autorizada por RH") ||
																		value.startsWith("No autorizada")
																	) {
																		handleOpenModalStatus(
																			idFormulario,
																			value,
																			tipoFormulario2
																		);
																	} else {
																		handleChangeStatus(
																			idFormulario,
																			value,
																			null,
																			tipoFormulario2
																		);
																	}
																}}>
																<SelectTrigger>
																	<SelectValue placeholder="Selecciona una opción" />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value="Autorizada por RH">
																		Autorizada
																	</SelectItem>
																	<SelectItem value="Autorizada por tu jefe directo">
																		Autorizada por el departamento
																	</SelectItem>
																	<SelectItem value="No autorizada por RH">
																		No autorizada
																	</SelectItem>
																</SelectContent>
															</Select>
														</div>
													</CardContent>
												</form>
											</Card>
										</DialogContent>
									</Dialog>
								)}
								{tipoFormulario2 === "Suspension" && (
									<Dialog
										open={formularioPrincipalAbiertoEdit}
										onOpenChange={closeModalEdit}>
										<DialogContent
											className="border-none p-0 overflow-y-auto w-full max-w-[35vw] max-h-[80vh] shadow-lg ml-[6vw] mt-auto"
											onInteractOutside={(event) => event.preventDefault()}>
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
																}}
																disabled={true}>
																<SelectTrigger className="col-span-3">
																	<SelectValue placeholder="Seleccione el colaborador..." />
																</SelectTrigger>
																<SelectContent>
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
																					value={user.id}>
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
																readOnly={true}
																placeholder="Dias..."
															/>
														</div>
														<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
															{renderDatePicker(
																"Fecha de inicio",
																fechaInicioPapeleta,
																handleChange,
																"fechaInicio",
																true
															)}
															{renderDatePicker(
																"Fecha de fin",
																fechaFinPapeleta,
																handleChange,
																"fechaFin",
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
																readOnly={true}
																className="min-h-[100px]"
																placeholder="Coloca tus observaciones aquí..."
															/>
														</div>
														<div
															className="space-y-2"
															style={{
																color: (() => {
																	if (
																		estatusFormulario.startsWith("Autorizada")
																	)
																		return "green";
																	if (
																		estatusFormulario.startsWith(
																			"No autorizada"
																		)
																	)
																		return "red";
																	switch (estatusFormulario) {
																		case "Pendiente":
																			return "orange";
																		default:
																			return "black"; // color por defecto
																	}
																})(),
															}}>
															<Label
																htmlFor="estatus"
																style={{ color: "black" }}>
																Estatus
															</Label>
															<Select
																value={estatusFormulario}
																onValueChange={(value) => {
																	if (
																		value.startsWith("Autorizada por RH") ||
																		value.startsWith("No autorizada")
																	) {
																		handleOpenModalStatus(
																			idFormulario,
																			value,
																			"Suspensión o castigo"
																		);
																	} else {
																		handleChangeStatus(
																			idFormulario,
																			value,
																			null,
																			"Suspensión o castigo"
																		);
																	}
																}}>
																<SelectTrigger>
																	<SelectValue placeholder="Selecciona una opción" />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value="Autorizada por RH">
																		Autorizada
																	</SelectItem>
																	<SelectItem value="Pendiente">
																		Autorizada por el departamento
																	</SelectItem>
																	<SelectItem value="No autorizada por RH">
																		No autorizada
																	</SelectItem>
																</SelectContent>
															</Select>
														</div>
													</CardContent>
												</form>
											</Card>
										</DialogContent>
									</Dialog>
								)}
								{tipoFormulario2 === "Vacaciones" && (
									<Dialog
										open={formularioPrincipalAbiertoEdit}
										onOpenChange={closeModalEdit}>
										<DialogContent
											className="border-none p-0 overflow-y-auto w-full max-w-[35vw] max-h-[80vh] shadow-lg ml-[6vw] mt-auto"
											onInteractOutside={(event) => event.preventDefault()}>
											<Card>
												<CardHeader>
													<CardTitle className="text-2xl font-bold text-center">
														Vacaciones
													</CardTitle>
												</CardHeader>
												<form onSubmit={handleSubmit}>
													<CardContent className="space-y-6">
														<div className="space-y-2">
															<Label htmlFor="puestoVacaciones">Puesto</Label>
															<Input
																id="puestoVacaciones"
																name="puestoVacaciones"
																type="text"
																value={formData.puestoVacaciones}
																onChange={handleChange}
																readOnly={true}
																placeholder="Puesto..."
															/>
														</div>
														<div className="space-y-2">
															<Label htmlFor="motivo">Días</Label>
															<Input
																id="dias"
																name="dias"
																type="number"
																value={formData.dias}
																onChange={handleChange}
																readOnly={true}
																placeholder="Dias..."
															/>
														</div>
														<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
															{renderDatePicker(
																"Fecha de inicio",
																fechaInicioPapeleta,
																handleChange,
																"fechaInicio",
																true
															)}
															{renderDatePicker(
																"Fecha de fin",
																fechaFinPapeleta,
																handleChange,
																"fechaFin",
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
																readOnly={true}
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
																}}>
																<Label htmlFor="comprobante">Formato</Label>
																<div style={{ marginLeft: "10px" }}>
																	<Tooltip
																		title={`<p style="margin:0;padding:5px;text-align:justify;">Llena el formulario completamente y después haz clic en 
                    "Descargar formato". Imprime el PDF, fírmalo y súbelo en este apartado en cualquiera de los formatos permitidos.</p>`}
																		arrow>
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
																		className="text-sm text-blue-600 hover:underline">
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
														<div
															className="space-y-2"
															style={{
																color: (() => {
																	if (
																		estatusFormulario.startsWith(
																			"Autorizada por RH"
																		)
																	)
																		return "green";
																	if (
																		estatusFormulario.startsWith(
																			"No autorizada"
																		)
																	)
																		return "red";
																	switch (estatusFormulario) {
																		case "Autorizada por tu jefe directo":
																			return "orange";
																		default:
																			return "black"; // color por defecto
																	}
																})(),
															}}>
															<Label
																htmlFor="estatus"
																style={{ color: "black" }}>
																Estatus
															</Label>
															<Select
																value={estatusFormulario}
																onValueChange={(value) => {
																	if (
																		value.startsWith("Autorizada por RH") ||
																		value.startsWith("No autorizada")
																	) {
																		handleOpenModalStatus(
																			idFormulario,
																			value,
																			tipoFormulario2
																		);
																	} else {
																		handleChangeStatus(
																			idFormulario,
																			value,
																			null,
																			tipoFormulario2
																		);
																	}
																}}>
																<SelectTrigger>
																	<SelectValue placeholder="Selecciona una opción" />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value="Autorizada por RH">
																		Autorizada
																	</SelectItem>
																	<SelectItem value="Autorizada por tu jefe directo">
																		Autorizada por el departamento
																	</SelectItem>
																	<SelectItem value="No autorizada por RH">
																		No autorizada
																	</SelectItem>
																</SelectContent>
															</Select>
														</div>
													</CardContent>
												</form>
											</Card>
										</DialogContent>
									</Dialog>
								)}
								{tipoFormulario2 === "Omisión de Checada" && (
									<Dialog
										open={formularioPrincipalAbiertoEdit}
										onOpenChange={closeModalEdit}>
										<DialogContent
											className="border-none p-0 overflow-y-auto w-full max-w-[35vw] max-h-[80vh] shadow-lg ml-[6vw] mt-auto"
											onInteractOutside={(event) => event.preventDefault()}>
											<Card>
												<CardHeader>
													<CardTitle className="text-2xl font-bold text-center">
														Omisión de Checada
													</CardTitle>
													<DialogDescription className="text-center">
														Autorización para no afectar Omision de Checada
													</DialogDescription>
												</CardHeader>
												<form onSubmit={handleSubmit}>
													<CardContent className="space-y-6">
														<div className="space-y-2">
															<Label htmlFor="horaFormulario">Hora</Label>
															<Input
																id="horaFormulario"
																name="horaFormulario"
																type="time"
																value={formData.horaFormulario}
																onChange={handleChange}
																readOnly={true}
															/>
														</div>
														<div className="grid grid-cols-1 gap-4">
															{renderDatePicker(
																"Fecha",
																fechaInicioPapeleta,
																handleChange,
																"fechaInicio",
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
																readOnly={true}
															/>
														</div>
														<div
															className="space-y-2"
															style={{
																color: (() => {
																	if (
																		estatusFormulario.startsWith(
																			"Autorizada por RH"
																		)
																	)
																		return "green";
																	if (
																		estatusFormulario.startsWith(
																			"No autorizada"
																		)
																	)
																		return "red";
																	switch (estatusFormulario) {
																		case "Autorizada por tu jefe directo":
																			return "orange";
																		default:
																			return "black"; // color por defecto
																	}
																})(),
															}}>
															<Label
																htmlFor="estatus"
																style={{ color: "black" }}>
																Estatus
															</Label>
															<Select
																value={estatusFormulario}
																onValueChange={(value) => {
																	if (
																		value.startsWith("Autorizada por RH") ||
																		value.startsWith("No autorizada")
																	) {
																		handleOpenModalStatus(
																			idFormulario,
																			value,
																			tipoFormulario2
																		);
																	} else {
																		handleChangeStatus(
																			idFormulario,
																			value,
																			null,
																			tipoFormulario2
																		);
																	}
																}}>
																<SelectTrigger>
																	<SelectValue placeholder="Selecciona una opción" />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value="Autorizada por RH">
																		Autorizada
																	</SelectItem>
																	<SelectItem value="Autorizada por tu jefe directo">
																		Autorizada por el departamento
																	</SelectItem>
																	<SelectItem value="No autorizada por RH">
																		No autorizada
																	</SelectItem>
																</SelectContent>
															</Select>
														</div>
													</CardContent>
												</form>
											</Card>
										</DialogContent>
									</Dialog>
								)}
								{tipoFormulario2 === "Horas extras" && (
									<Dialog
										open={formularioPrincipalAbiertoEdit}
										onOpenChange={closeModalEdit}>
										<DialogContent
											onInteractOutside={(event) => event.preventDefault()}
											className="border-none p-0 overflow-y-auto w-full max-w-[60vw] max-h-[70vh] shadow-lg ml-[6.5vw]">
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
																fechaInicioPapeleta,
																handleChange,
																"fechaInicio",
																true
															)}
															{renderDatePicker(
																"Fecha de fin",
																fechaFinPapeleta,
																handleChange,
																"fechaFin",
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
																	}}>
																	<Label htmlFor="horaInicio">
																		Hora de inicio
																	</Label>
																</div>
																<Input
																	id="horaInicio"
																	name="horaInicio"
																	type="time"
																	value={formData.horaInicio}
																	readOnly={true}
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
																	}}>
																	<Label htmlFor="horaFin">Hora de fin</Label>
																</div>
																<Input
																	id="horaFin"
																	name="horaFin"
																	type="time"
																	value={formData.horaFin}
																	readOnly={true}
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
																}}>
																<Label htmlFor="motivo">
																	Motivo del tiempo extra
																</Label>
															</div>
															<Textarea
																id="motivo"
																name="motivo"
																value={formData.motivo}
																onChange={handleChange}
																readOnly={true}
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
																	}}>
																	<Label htmlFor="noOrden">No. de orden</Label>
																</div>
																<Input
																	id="noOrden"
																	name="noOrden"
																	type="number"
																	value={formData.noOrden}
																	readOnly={true}
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
																	}}>
																	<Label htmlFor="nombreProducto">
																		Nombre del producto
																	</Label>
																</div>
																<Input
																	id="nombreProducto"
																	name="nombreProducto"
																	type="text"
																	value={formData.nombreProducto}
																	readOnly={true}
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
																	}}>
																	<Label htmlFor="cantidadProgramada">
																		Cantidad programada
																	</Label>
																</div>
																<Input
																	id="cantidadProgramada"
																	name="cantidadProgramada"
																	type="number"
																	value={formData.cantidadProgramada}
																	readOnly={true}
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
																	}}>
																	<Label htmlFor="cantidadTerminada">
																		Cantidad terminada
																	</Label>
																</div>
																<Input
																	id="cantidadTerminada"
																	name="cantidadTerminada"
																	type="number"
																	value={formData.cantidadTerminada}
																	readOnly={true}
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
																	className="grid grid-cols-1 md:grid-cols-5 gap-4">
																	<div>
																		<Input
																			id={`noOrden-${index}`}
																			name={`noOrden-${index}`}
																			value={otro.noOrden}
																			readOnly={true}
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
																			readOnly={true}
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
																			readOnly={true}
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
																				readOnly={true}
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
																		</div>
																	</div>
																</div>
															))}
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
																	}}>
																	<Label htmlFor="noPersonal">No.</Label>
																</div>
																<Input
																	id="noPersonal"
																	name="noPersonal"
																	type="number"
																	value={formData.noPersonal}
																	readOnly={true}
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
																	}}>
																	<Label htmlFor="nombrePersonal">Nombre</Label>
																</div>
																<Input
																	id="nombrePersonal"
																	name="nombrePersonal"
																	type="text"
																	value={formData.nombrePersonal}
																	readOnly={true}
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
																	}}>
																	<Label htmlFor="area">Área</Label>
																</div>
																<Input
																	id="area"
																	name="area"
																	type="text"
																	value={formData.area}
																	readOnly={true}
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
																	className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
																			readOnly={true}
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
																			readOnly={true}
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
																				readOnly={true}
																			/>
																		</div>
																	</div>
																</div>
															))}
														</div>
														<div
															className="space-y-2"
															style={{
																color: (() => {
																	if (
																		estatusFormulario.startsWith("Autorizada")
																	)
																		return "green";
																	if (
																		estatusFormulario.startsWith(
																			"No autorizada"
																		)
																	)
																		return "red";
																	switch (estatusFormulario) {
																		case "Pendiente":
																			return "orange";
																		default:
																			return "black"; // color por defecto
																	}
																})(),
															}}>
															<Label
																htmlFor="estatus"
																style={{ color: "black" }}>
																Estatus
															</Label>
															<Select
																value={estatusFormulario}
																onValueChange={(value) => {
																	if (
																		value.startsWith("Autorizada por RH") ||
																		value.startsWith("No autorizada")
																	) {
																		handleOpenModalStatus(
																			idFormulario,
																			value,
																			tipoFormulario2
																		);
																	} else {
																		handleChangeStatus(
																			idFormulario,
																			value,
																			null,
																			tipoFormulario2
																		);
																	}
																}}>
																<SelectTrigger>
																	<SelectValue placeholder="Selecciona una opción" />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value="Autorizada por RH">
																		Autorizada
																	</SelectItem>
																	<SelectItem value="Pendiente">
																		Autorizada por el departamento
																	</SelectItem>
																	<SelectItem value="No autorizada por RH">
																		No autorizada
																	</SelectItem>
																</SelectContent>
															</Select>
														</div>
													</CardContent>
												</form>
											</Card>
										</DialogContent>
									</Dialog>
								)}
								{tipoFormulario2 === "Bonos / Comisiones" && (
									<Dialog
										open={formularioPrincipalAbiertoEdit}
										onOpenChange={closeModalEdit}>
										<DialogContent
											onInteractOutside={(event) => event.preventDefault()}
											className="border-none p-0 overflow-y-auto w-full max-w-[60vw] max-h-[70vh] shadow-lg ml-[6.5vw]">
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
																	disabled={true}
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
																	}}>
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
																	disabled={true}>
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
																	readOnly={true}
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
																		const selectedUser = users.find(
																			(user) => user.id === value
																		);
																		if (selectedUser) {
																			setFormData({
																				...formData,
																				noBono: selectedUser.numero_empleado,
																				nombreBono: selectedUser.id,
																			});
																		}
																	}}
																	disabled={true}>
																	<SelectTrigger className="col-span-3">
																		<SelectValue placeholder="Seleccione el colaborador..." />
																	</SelectTrigger>
																	<SelectContent>
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
																						value={user.id}>
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
																	readOnly={true}
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
																	readOnly={true}
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
																	readOnly={true}
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
																	className="grid grid-cols-7 gap-1">
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
																				const selectedUser = users.find(
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

																				setDebouncedSearchTerms(
																					(prevDebounced) => ({
																						...prevDebounced,
																						[index]: "",
																					})
																				);
																			}}
																			value={otro.nombreBono || ""}
																			disabled={true}>
																			<SelectTrigger className="col-span-3">
																				<SelectValue placeholder="Seleccione el colaborador..." />
																			</SelectTrigger>
																			<SelectContent>
																				{/* Filtrado sin selección automática */}
																				{users.filter(
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
																					users
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
																								value={user.id}>
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
																			readOnly={true}
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
																			readOnly={true}
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
																			readOnly={true}
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
														</div>
														<div
															className="space-y-2"
															style={{
																color: (() => {
																	if (
																		estatusFormulario.startsWith("Autorizada")
																	)
																		return "green";
																	if (
																		estatusFormulario.startsWith(
																			"No autorizada"
																		)
																	)
																		return "red";
																	switch (estatusFormulario) {
																		case "Pendiente":
																			return "orange";
																		default:
																			return "black"; // color por defecto
																	}
																})(),
															}}>
															<Label
																htmlFor="estatus"
																style={{ color: "black" }}>
																Estatus
															</Label>
															<Select
																value={estatusFormulario}
																onValueChange={(value) => {
																	if (
																		value.startsWith("Autorizada por RH") ||
																		value.startsWith("No autorizada")
																	) {
																		handleOpenModalStatus(
																			idFormulario,
																			value,
																			tipoFormulario2
																		);
																	} else {
																		handleChangeStatus(
																			idFormulario,
																			value,
																			null,
																			tipoFormulario2
																		);
																	}
																}}>
																<SelectTrigger>
																	<SelectValue placeholder="Selecciona una opción" />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value="Autorizada por RH">
																		Autorizada
																	</SelectItem>
																	<SelectItem value="Pendiente">
																		Autorizada por el departamento
																	</SelectItem>
																	<SelectItem value="No autorizada por RH">
																		No autorizada
																	</SelectItem>
																</SelectContent>
															</Select>
														</div>
													</CardContent>
												</form>
											</Card>
										</DialogContent>
									</Dialog>
								)}
								{tipoFormulario2 === "Aumento sueldo" && (
									<Dialog
										open={formularioPrincipalAbiertoEdit}
										onOpenChange={closeModalEdit}>
										<DialogContent
											onInteractOutside={(event) => event.preventDefault()}
											className="border-none p-0 overflow-y-auto w-full max-w-[35vw] max-h-[80vh] shadow-lg ml-[6vw] mt-auto">
											<Card>
												<CardHeader>
													<CardTitle className="text-2xl font-bold text-center">
														Aumento de sueldo / Cambio de puesto / Cambio de
														área
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
																			puestoColaborador: selectedUser.puesto,
																		});
																	}
																}}
																disabled={true}>
																<SelectTrigger className="col-span-3">
																	<SelectValue placeholder="Seleccione el colaborador..." />
																</SelectTrigger>
																<SelectContent>
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
																					value={user.id}>
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
																}}>
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
																disabled={true}>
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
																fechaInicioPapeleta,
																handleChange,
																"fechaInicio",
																true
															)}
														</div>
														<div className="space-y-2">
															<div
																style={{
																	position: "relative",
																	display: "inline-flex",
																	alignItems: "center",
																}}>
																<Label htmlFor="comentarios">
																	Comentarios adicionales
																</Label>
															</div>
															<Textarea
																id="comentarios"
																name="comentarios"
																onChange={handleChange}
																value={formData.comentarios}
																readOnly={true}
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
																}}>
																<Label htmlFor="comprobante">
																	Formato de movimiento de personal
																</Label>
																<div style={{ marginLeft: "10px" }}>
																	<Tooltip
																		title={`<p style="margin:0;padding:5px;text-align:justify;">Descarga el formato con el botón de "Descargar formato", después
                                                          llénalo completamente y súbelo en este apartado en cualquiera de los formatos permitidos.</p>`}
																		arrow>
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
																		className="text-sm text-blue-600 hover:underline">
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
														<div
															className="space-y-2"
															style={{
																color: (() => {
																	if (
																		estatusFormulario.startsWith("Autorizada")
																	)
																		return "green";
																	if (
																		estatusFormulario.startsWith(
																			"No autorizada"
																		)
																	)
																		return "red";
																	switch (estatusFormulario) {
																		case "Pendiente":
																			return "orange";
																		default:
																			return "black"; // color por defecto
																	}
																})(),
															}}>
															<Label
																htmlFor="estatus"
																style={{ color: "black" }}>
																Estatus
															</Label>
															<Select
																value={estatusFormulario}
																onValueChange={(value) => {
																	if (
																		value.startsWith("Autorizada por RH") ||
																		value.startsWith("No autorizada")
																	) {
																		handleOpenModalStatus(
																			idFormulario,
																			value,
																			tipoFormulario2
																		);
																	} else {
																		handleChangeStatus(
																			idFormulario,
																			value,
																			null,
																			tipoFormulario2
																		);
																	}
																}}>
																<SelectTrigger>
																	<SelectValue placeholder="Selecciona una opción" />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value="Autorizada por RH">
																		Autorizada
																	</SelectItem>
																	<SelectItem value="Pendiente">
																		Autorizada por el departamento
																	</SelectItem>
																	<SelectItem value="No autorizada por RH">
																		No autorizada
																	</SelectItem>
																</SelectContent>
															</Select>
														</div>
													</CardContent>
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
			<div className="overflow-x-auto">
				<Table>
					{verPeticiones === "Todas las solicitudes" ? (
						<TableCaption>Todas las solicitudes existentes</TableCaption>
					) : verPeticiones === "Todas las papeletas" ? (
						<TableCaption>Todas las papeletas existentes</TableCaption>
					) : verPeticiones === "Papeletas extemporaneas" ? (
						<TableCaption>
							Papeletas y solicitudes extemporáneas pendientes por revisar
						</TableCaption>
					) : (
						<TableCaption>
							Papeletas y solicitudes pendientes por revisar
						</TableCaption>
					)}
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
										{evento.id_papeleta || "Sin ID especificado"}
									</TableCell>
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
										{evento.nombre || "Sin nombre especificado"}
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
													const jefe = users.find(
														(u) => u.id === evento.jefe_directo
													);
													return jefe
														? `${jefe.nombre} ${jefe.apellidos}`
														: "Sin jefe directo especificado";
											  })()
											: "Sin jefe directo especificado"}
									</TableCell>
									<TableCell>
										{(() => {
											if (!evento.empresa) return "Sin empresa especificada";

											let empresaData;

											// Si evento.empresa ya es un objeto, usarlo directamente
											if (typeof evento.empresa === "object") {
												empresaData = evento.empresa;
											} else {
												// Si es una cadena, intentar parsearla como JSON
												try {
													empresaData = JSON.parse(evento.empresa);
												} catch (error) {
													console.error("Error al parsear empresa:", error);
													return evento.empresa; // Mostrar el texto tal cual si no es JSON válido
												}
											}

											// Verificar si empresaData es un objeto válido y tiene la propiedad 'nombre'
											return empresaData && empresaData.nombre
												? empresaData.nombre
												: "Sin empresa especificada";
										})()}
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
											: "Sin fecha de subida especificada"}
									</TableCell>
									<TableCell>
										{evento.fecha_requerida &&
										evento.fecha_requerida !== "Sin fecha"
											? new Date(evento.fecha_requerida).toLocaleDateString(
													"es-ES",
													{
														day: "2-digit",
														month: "2-digit",
														year: "numeric",
													}
											  )
											: "Sin fecha requerida especificada"}
									</TableCell>
									<TableCell>
										{evento.comentarios || "Sin comentarios especificados"}
									</TableCell>
									<>
										<TableCell
											style={{
												color: (() => {
													if (evento.estatus.startsWith("Autorizada por RH"))
														return "green";
													if (evento.estatus.startsWith("No autorizada"))
														return "red";
													switch (evento.estatus) {
														case "Pendiente":
															return "orange";
														case "Autorizada por tu jefe directo":
															return "orange";
														default:
															return "black"; // color por defecto
													}
												})(),
											}}>
											<Select
												className="w-full min-w-[270px]"
												value={evento.estatus}
												onValueChange={(value) => {
													if (
														value.startsWith("Autorizada por RH") ||
														value.startsWith("No autorizada")
													) {
														handleOpenModalStatus(
															evento.id_papeleta,
															value,
															evento.tipo
														);
													} else {
														handleChangeStatus(
															evento.id_papeleta,
															value,
															null,
															evento.tipo
														);
													}
												}}>
												<SelectTrigger className="w-full min-w-[270px]">
													<SelectValue placeholder="Selecciona una opción" />
												</SelectTrigger>
												<SelectContent className="w-full min-w-[270px]">
													{verPeticiones === "Todas las solicitudes" ? (
														<>
															<SelectItem value="Autorizada por RH">
																Autorizada
															</SelectItem>
															<SelectItem value="Pendiente">
																Autorizada por el departamento
															</SelectItem>
															<SelectItem value="No autorizada por RH">
																No autorizada
															</SelectItem>
														</>
													) : verPeticiones === "Todas las papeletas" ? (
														<>
															<SelectItem value="Autorizada por RH">
																Autorizada
															</SelectItem>
															<SelectItem value="Autorizada por tu jefe directo">
																Autorizada por el departamento
															</SelectItem>
															<SelectItem value="No autorizada por RH">
																No autorizada
															</SelectItem>
														</>
													) : (
														<>
															<SelectItem value="Autorizada por RH">
																Autorizada
															</SelectItem>
															{evento.estatus ===
															"Autorizada por tu jefe directo" ? (
																<SelectItem value="Autorizada por tu jefe directo">
																	Autorizada por el departamento
																</SelectItem>
															) : (
																<SelectItem value="Pendiente">
																	Autorizada por el departamento
																</SelectItem>
															)}
															<SelectItem value="No autorizada por RH">
																No autorizada
															</SelectItem>
														</>
													)}
												</SelectContent>
											</Select>
										</TableCell>
										{modalOpenStatus && (
											<Dialog
												open={modalOpenStatus}
												onOpenChange={handleCloseModalStatus}>
												<DialogContent
													className="border-none p-0 overflow-y-auto w-full max-w-[80vh] max-h-[60vh] shadow-none ml-[13vh] mt-auto"
													onInteractOutside={(event) => event.preventDefault()}>
													<Card>
														<CardHeader>
															{modalDataStatus?.estatus?.startsWith(
																"Autorizada"
															) ? (
																<CardTitle
																	style={{ color: "green" }}
																	className="text-2xl font-bold text-center">
																	{[
																		"Horas extras",
																		"Bonos / Comisiones",
																		"Aumento sueldo",
																		"Faltas",
																		"Suspensión o castigo",
																	].some((tipo) =>
																		modalDataStatus.tipo?.startsWith(tipo)
																	)
																		? "Agregar comentario - Sí se autoriza la solicitud"
																		: "Agregar comentario - Sí se autoriza la papeleta"}
																</CardTitle>
															) : (
																<CardTitle
																	style={{ color: "red" }}
																	className="text-2xl font-bold text-center">
																	{[
																		"Horas extras",
																		"Bonos / Comisiones",
																		"Aumento sueldo",
																		"Faltas",
																		"Suspensión o castigo",
																	].some((tipo) =>
																		modalDataStatus.tipo?.startsWith(tipo)
																	)
																		? "Agregar comentario - No se autoriza la solicitud"
																		: "Agregar comentario - No se autoriza la papeleta"}
																</CardTitle>
															)}
														</CardHeader>
														<CardContent className="space-y-6">
															<div className="space-y-2">
																<div
																	style={{
																		position: "relative",
																		display: "inline-flex",
																		alignItems: "center",
																	}}>
																	<Label htmlFor="comentariosEstatus">
																		Comentarios
																	</Label>
																</div>
																<Textarea
																	id="comentariosEstatus"
																	name="comentariosEstatus"
																	onChange={(e) =>
																		handleCommentsChange(e.target.value)
																	}
																	value={comentarios}
																	className="min-h-[100px]"
																	placeholder="Coloca tus comentarios aquí..."
																/>
															</div>
														</CardContent>
														<CardFooter>
															{modalDataStatus.estatus.startsWith(
																"Autorizada"
															) ? (
																<Button2
																	className="w-full"
																	onClick={() =>
																		handleChangeStatus(
																			modalDataStatus.id,
																			modalDataStatus.estatus,
																			comentarios
																		)
																	}>
																	Enviar
																</Button2>
															) : (
																<Button2
																	className="w-full"
																	disabled={!comentarios}
																	onClick={() =>
																		handleChangeStatus(
																			modalDataStatus.id,
																			modalDataStatus.estatus,
																			comentarios
																		)
																	}>
																	Enviar
																</Button2>
															)}
														</CardFooter>
													</Card>
												</DialogContent>
											</Dialog>
										)}
									</>
									<TableCell>
										{evento.accion ? evento.accion(evento.id_papeleta) : "N/A"}
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								{verPeticiones === "Todas las solicitudes" ? (
									<TableCell colSpan={13} className="text-center">
										No se encontraron solicitudes
									</TableCell>
								) : verPeticiones === "Todas las papeletas" ? (
									<TableCell colSpan={13} className="text-center">
										No se encontraron papeletas
									</TableCell>
								) : verPeticiones === "Papeletas extemporaneas" ? (
									<TableCell colSpan={13} className="text-center">
										No se encontraron papeletas ni solicitudes extemporáneas
									</TableCell>
								) : (
									<TableCell colSpan={13} className="text-center">
										No se encontraron papeletas ni solicitudes
									</TableCell>
								)}
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Paginación */}
			<div className="flex justify-center mt-4 mb-4">
				<button
					onClick={() => paginate(currentPage - 1)}
					disabled={currentPage === 1}>
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
							style={{ marginLeft: "1rem", marginRight: "1rem" }}>
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
					disabled={currentPage === totalPages}>
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
			strokeLinejoin="round">
			<circle cx="11" cy="11" r="8" />
			<path d="m21 21-4.3-4.3" />
		</svg>
	);
}

function ExportIcon(props) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			width="20"
			height="20">
			<path d="M3 12v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
			<polyline points="8 6 12 2 16 6" />
			<line x1="12" y1="2" x2="12" y2="15" />
		</svg>
	);
}

function PermisosIcon(props) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth="1.5"
			stroke="currentColor"
			className="h-6 w-6 text-gray-400">
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

function Spinner() {
	return <div className="spinner" />;
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
			role="img">
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

function VisualizeIcon2(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="23"
			height="23"
			viewBox="0 0 64 64"
			aria-labelledby="title"
			role="img">
			<path
				d="M32 12C16 12 4 32 4 32s12 20 28 20 28-20 28-20S48 12 32 12z"
				fill="none"
				stroke="rgb(255 255 255)"
				strokeWidth="4"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>

			<circle
				cx="32"
				cy="32"
				r="10"
				fill="none"
				stroke="rgb(255 255 255)"
				strokeWidth="4"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>

			<circle cx="32" cy="32" r="4" fill="rgb(255 255 255)" />
		</svg>
	);
}
