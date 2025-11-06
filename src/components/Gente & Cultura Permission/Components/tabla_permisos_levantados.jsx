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

export function TablaPermisosLevantados() {
	const { loading } = useUserContext();
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("todos");
	const [eventos, setEventos] = useState([]);
	const [departamentos, setDepartamentos] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	const [users, setUsers] = useState([]);
	const [formularioPrincipalAbiertoEdit, setFormularioPrincipalAbiertoEdit] =
		useState(false); // Estado para abrir el formulario
	const [tipoFormulario, setTipoFormulario] = useState("todos");
	const [departamento, setDepartamento] = useState("todos"); // Estado para el tipo de formulario seleccionado
	const [tipoFormulario2, setTipoFormulario2] = useState("");
	const [index, setIndex] = useState(0);
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
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
				"/api/Gente&CulturaAbsence/getPapeletasEnviadas"
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
			setFechaInicio(data.fecha_inicio);
			setFechaFin(data.fecha_fin);
		} catch (error) {
			console.error("Error al obtener el formulario:", error);
		}
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
			tipo: evento.tipo + (evento.extemporanea === 1 ? " - Extemporánea" : ""),
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
							: evento.estatus === "No autorizada por tu jefe directo"
							? "No autorizada por el departamento"
							: evento.estatus || "Sin datos",
				};
			})
		);

		const workbook = XLSX.utils.book_new();
		const nombreHoja = "Papeletas enviadas";
		const nombreArchivo = "papeletas_enviadas.xlsx";

		XLSX.utils.book_append_sheet(workbook, worksheet, nombreHoja);
		XLSX.writeFile(workbook, nombreArchivo);
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
				<CardTitle className="text-3xl font-bold">Papeletas enviadas</CardTitle>
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
							<SelectItem value="Autorizada por RH">
								Autorizada por RH
							</SelectItem>
							<SelectItem value="Autorizada por tu jefe directo">
								Autorizada por el departamento
							</SelectItem>
							<SelectItem value="Pendiente">Pendiente</SelectItem>
							<SelectItem value="No autorizada por tu jefe directo">
								No autorizada por el departamento
							</SelectItem>
							<SelectItem value="No autorizada por RH">
								No autorizada por RH
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
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
														Autorización para no descontar por Omisión de
														checada
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
					<TableCaption>Papeletas enviadas</TableCaption>
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
										{evento.tipo || "Sin tipo especificado"}
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
										}}>
										{evento.estatus === "Autorizada por tu jefe directo"
											? "Autorizada por el departamento"
											: evento.estatus === "No autorizada por tu jefe directo"
											? "No autorizada por el departamento"
											: evento.estatus}
									</TableCell>
									<TableCell>
										{evento.accion ? evento.accion(evento.id_papeleta) : "N/A"}
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={13} className="text-center">
									No se encontraron papeletas
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
