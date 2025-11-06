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
import { CalendarIcon } from "lucide-react";
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
import "../../../../public/CSS/spinner.css";
import { useUserContext } from "@/utils/userContext";

export function AutorizarPapeletas() {
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
	const [formularioPrincipalAbiertoEdit, setFormularioPrincipalAbiertoEdit] =
		useState(false); // Estado para abrir el formulario
	const [allUsers, setAllUsers] = useState([]);
	const [users, setUsers] = useState([]);
	const [autorizar, setAutorizar] = useState(false);
	const [usersBonos, setUsersBonos] = useState([]);
	const [comentarios, setComentarios] = useState("");
	const [modalOpenStatus, setModalOpenStatus] = useState(false);
	const [modalDataStatus, setModalDataStatus] = useState({
		id: null,
		estatus: "",
	});
	const [fechaInicioPapeleta, setFechaInicio] = useState("");
	const [fechaFinPapeleta, setFechaFin] = useState("");
	const [formularioNormalOExtemporaneo, setFormularioNormalOExtemporaneo] =
		useState(""); // Estado para abrir el formulario
	const [idFormulario, setIDFormulario] = useState("");
	const [estatusFormulario, setEstatus] = useState("");

	const closeModalEdit = () => {
		setFormularioPrincipalAbiertoEdit(false); // Cerrar el formulario
	};

	const closeModalFormsEdit = () => {
		setFormularioPrincipalAbiertoEdit(false); // Cerrar el formulario
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
		setModalDataStatus({ id: null, estatus: "" });
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
					`/api/Users/getBossUsers?id=${idUser}`
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

	const fetchEventos = async () => {
		try {
			const response = await axios.get(
				`/api/Gente&CulturaAbsence/autorizarPapeletas?id=${idUser}`
			); // Asegúrate de que esta ruta esté configurada en tu backend
			setEventos(response.data);
		} catch (error) {
			console.error("Error al obtener eventos:", error);
		}
	};

	const encabezados = [
		"ID",
		"Tipo",
		"Número de empleado",
		"Nombre",
		"Departamento",
		"Puesto",
		"Jefe directo",
		"Fecha de subida",
		"Fecha de último movimiento",
		"Estatus",
		"Acción",
	];

	// Obtener eventos desde el backend
	useEffect(() => {
		const fetchPapeletas = async () => {
			if (!idUser) {
				// Si el idUser no está disponible, no hacemos la solicitud
				return;
			}

			if (users.length > 0) {
				try {
					const response = await axios.get(
						`/api/Gente&CulturaAbsence/autorizarPapeletas?id=${idUser}`
					); // Asegúrate de que esta ruta esté configurada en tu backend
					setEventos(response.data);
				} catch (error) {
					console.error("Error al obtener eventos:", error);
				}
			}
		};
		fetchPapeletas();
	}, [idUser, users]);

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
			setIDFormulario(data.id);
			setEstatus(data.estatus);
		} catch (error) {
			console.error("Error al obtener el formulario:", error);
		}
	};

	// Función para extraer los datos relevantes
	const extractData = (evento) => {
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
						onClick={() => handleEditForm(index)}>
						<VisualizeIcon />
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

	const handleCommentsChange = (value) => {
		setComentarios(value);
	};

	const handleChangeStatus = async (index, nuevoEstatus, comentarios) => {
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
				timer: 3000, // La alerta desaparecerá después de 1.5 segundos
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
									tipo: "Alerta de actualización de papeleta",
									descripcion: `<strong>${
										nombre + " " + apellidos
									}</strong> ha actualizado el estatus de la papeleta con el id ${index} a: <strong>${nuevoEstatus}</strong>.<br>
                          Puedes revisarla haciendo clic en este enlace: <a href="/papeletas_usuario" style="color: blue; text-decoration: underline;">Revisar papeleta</a>`,
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

				if (nuevoEstatus.startsWith("Autorizada")) {
					const mensaje = `<strong>${
						nombre + " " + apellidos
					}</strong> ha autorizado una nueva papeleta con el id: <strong>${index}</strong>.<br>
            Puedes revisarla haciendo clic en este enlace: <a href="/gente_y_cultura/todas_papeletas" style="color: blue; text-decoration: underline;">Revisar papeleta</a>`;

					try {
						const enviarNotificacionPapeleta = await fetch(
							"/api/Reminder/EnvioEventoSolicitudes",
							{
								method: "POST",
								headers: { "Content-Type": "application/json" },
								body: JSON.stringify({
									formData2: {
										tipo: "Alerta de nueva papeleta autorizada",
										descripcion: mensaje,
										id: idUser,
										dpto: null,
									},
								}),
							}
						);

						if (!enviarNotificacionPapeleta.ok) {
							console.error(
								"Error al enviar la notificación de la papeleta autorizada"
							);
							Swal.fire(
								"Error",
								"Error al enviar la notificación de la papeleta autorizada",
								"error"
							);
						}
					} catch (error) {
						console.error(
							"Error en la solicitud de notificación de papeleta autorizada:",
							error
						);
						Swal.fire(
							"Error",
							"Error en la notificación de la papeleta autorizada",
							"error"
						);
					}
				}
				fetchEventos();
				Swal.fire({
					title: "Actualizado",
					text: "El estatus de la papeleta ha sido actualizado correctamente",
					icon: "success",
					timer: 3000, // La alerta desaparecerá después de 1.5 segundos
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
					timer: 3000, // La alerta desaparecerá después de 1.5 segundos
					showConfirmButton: false,
				});
			}
		} catch (error) {
			console.error("Error al actualizar el estatus de la papeleta:", error);
			Swal.fire({
				title: "Error",
				text: "Ocurrió un error al intentar actualizar el estatus de la papeleta",
				icon: "error",
				timer: 3000, // La alerta desaparecerá después de 1.5 segundos
				showConfirmButton: false,
			});
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!session) {
			return;
		}

		try {
			// Subir el formulario
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
				Swal.fire({
					title: "Creado",
					text: "Se ha creado correctamente",
					icon: "success",
					timer: 3000,
					showConfirmButton: false,
				}).then(() => {
					window.location.href = "/gente_y_cultura/faltasUsuario";
				});
			} else {
				Swal.fire("Error", "Error al crear la papeleta", "error");
				return;
			}

			// Subir el archivo al FTP solo si hay un archivo seleccionado
			const fileInput = document.getElementById("comprobante");
			if (fileInput && fileInput.files.length > 0) {
				const file = fileInput.files[0];
				const reader = new FileReader();

				reader.onload = async (e) => {
					const base64File = e.target.result.split(",")[1]; // Obtener solo el contenido en base64

					try {
						const ftpResponse = await fetch(
							"/api/Gente&CulturaPermission/subirPDFPapeletas",
							{
								method: "POST",
								headers: {
									"Content-Type": "application/json",
								},
								body: JSON.stringify({
									fileName: file.name,
									fileContent: base64File, // Enviar el archivo en Base64
								}),
							}
						);

						const ftpResult = await ftpResponse.json();
						if (ftpResponse.ok) {
							console.log("Archivo subido al FTP exitosamente", ftpResult);
						} else {
							console.error("Error al subir el archivo al FTP", ftpResult);
						}
					} catch (ftpError) {
						console.error("Error en la solicitud de FTP", ftpError);
					}
				};

				reader.readAsDataURL(file); // Leer el archivo como base64
			}
		} catch (error) {
			console.error("Error en el formulario:", error);
		}
	};

	const renderDatePicker = (
		label,
		date,
		handleChange,
		name,
		readOnly = false,
		removeSpacing = false
	) => {
		// Obtener la fecha actual sin horas
		const hoy = startOfDay(new Date());
		const diaSemana = hoy.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado

		let juevesInicioNomina = null;

		// Si es "Normal", calcular el jueves de nómina
		if (formularioNormalOExtemporaneo === "Normal") {
			juevesInicioNomina = addDays(hoy, 4 - diaSemana);

			// Si hoy es lunes (1), martes (2) o miércoles (3), restamos 7 días
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
							disabled={readOnly}>
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
								fromDate={
									formularioNormalOExtemporaneo === "Normal"
										? juevesInicioNomina
										: null
								} // Si es "Normal", restringimos desde el jueves
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
		<div>
			<div className="flex justify-center items-center text-center mb-4">
				<CardTitle className="text-3xl font-bold">
					Autorizar papeletas
				</CardTitle>
			</div>
			<br />
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
											className="border-none p-0 overflow-y-auto w-full max-w-[70vh] max-h-[80vh] shadow-lg ml-[12vh] mt-auto"
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
																		value.startsWith("Autorizada") ||
																		value.startsWith("No autorizada")
																	) {
																		handleOpenModalStatus(
																			idFormulario,
																			value,
																			tipoFormulario2
																		);
																	} else {
																		handleChangeStatus(idFormulario, value);
																	}
																}}>
																<SelectTrigger>
																	<SelectValue placeholder="Selecciona una opción" />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value="Autorizada por tu jefe directo">
																		Autorizada
																	</SelectItem>
																	<SelectItem value="Pendiente">
																		Pendiente
																	</SelectItem>
																	<SelectItem value="No autorizada por tu jefe directo">
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
											className="border-none p-0 overflow-y-auto w-full max-w-[70vh] max-h-[80vh] shadow-lg ml-[12vh] mt-auto"
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
																		value.startsWith("Autorizada") ||
																		value.startsWith("No autorizada")
																	) {
																		handleOpenModalStatus(
																			idFormulario,
																			value,
																			tipoFormulario2
																		);
																	} else {
																		handleChangeStatus(idFormulario, value);
																	}
																}}>
																<SelectTrigger>
																	<SelectValue placeholder="Selecciona una opción" />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value="Autorizada por tu jefe directo">
																		Autorizada
																	</SelectItem>
																	<SelectItem value="Pendiente">
																		Pendiente
																	</SelectItem>
																	<SelectItem value="No autorizada por tu jefe directo">
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
											className="border-none p-0 overflow-y-auto w-full max-w-[70vh] max-h-[80vh] shadow-lg ml-[12vh] mt-auto"
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
																		value.startsWith("Autorizada") ||
																		value.startsWith("No autorizada")
																	) {
																		handleOpenModalStatus(
																			idFormulario,
																			value,
																			tipoFormulario2
																		);
																	} else {
																		handleChangeStatus(idFormulario, value);
																	}
																}}>
																<SelectTrigger>
																	<SelectValue placeholder="Selecciona una opción" />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value="Autorizada por tu jefe directo">
																		Autorizada
																	</SelectItem>
																	<SelectItem value="Pendiente">
																		Pendiente
																	</SelectItem>
																	<SelectItem value="No autorizada por tu jefe directo">
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
											className="border-none p-0 overflow-y-auto w-full max-w-[120vh] max-h-[70vh] shadow-lg ml-[13vh]">
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
																			value={otro.actividad}
																			type="text"
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
																			value={otro.descripcion}
																			type="text"
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
																			value={otro.persona}
																			type="text"
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
																			value={otro.tiempoRespuesta}
																			type="text"
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
																				value={otro.comentarios}
																				type="text"
																				className="w-full"
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
																		value.startsWith("Autorizada") ||
																		value.startsWith("No autorizada")
																	) {
																		handleOpenModalStatus(
																			idFormulario,
																			value,
																			tipoFormulario2
																		);
																	} else {
																		handleChangeStatus(idFormulario, value);
																	}
																}}>
																<SelectTrigger>
																	<SelectValue placeholder="Selecciona una opción" />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value="Autorizada por tu jefe directo">
																		Autorizada
																	</SelectItem>
																	<SelectItem value="Pendiente">
																		Pendiente
																	</SelectItem>
																	<SelectItem value="No autorizada por tu jefe directo">
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
											className="border-none p-0 overflow-y-auto w-full max-w-[70vh] max-h-[80vh] shadow-lg ml-[12vh] mt-auto"
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
																		value.startsWith("Autorizada") ||
																		value.startsWith("No autorizada")
																	) {
																		handleOpenModalStatus(
																			idFormulario,
																			value,
																			tipoFormulario2
																		);
																	} else {
																		handleChangeStatus(idFormulario, value);
																	}
																}}>
																<SelectTrigger>
																	<SelectValue placeholder="Selecciona una opción" />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value="Autorizada por tu jefe directo">
																		Autorizada
																	</SelectItem>
																	<SelectItem value="Pendiente">
																		Pendiente
																	</SelectItem>
																	<SelectItem value="No autorizada por tu jefe directo">
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
											className="border-none p-0 overflow-y-auto w-full max-w-[70vh] max-h-[80vh] shadow-lg ml-[12vh] mt-auto"
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
																		value.startsWith("Autorizada") ||
																		value.startsWith("No autorizada")
																	) {
																		handleOpenModalStatus(
																			idFormulario,
																			value,
																			tipoFormulario2
																		);
																	} else {
																		handleChangeStatus(idFormulario, value);
																	}
																}}>
																<SelectTrigger>
																	<SelectValue placeholder="Selecciona una opción" />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value="Autorizada por tu jefe directo">
																		Autorizada
																	</SelectItem>
																	<SelectItem value="Pendiente">
																		Pendiente
																	</SelectItem>
																	<SelectItem value="No autorizada por tu jefe directo">
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
			</div>
			<div className="overflow-x-auto">
				<Table>
					{autorizar ? (
						<TableCaption>Solicitudes generadas</TableCaption>
					) : (
						<TableCaption>Papeletas pendientes por revisar</TableCaption>
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
										{evento.id_papeleta || "Sin ID de papeleta especificado"}
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
									{autorizar ? (
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
											{evento.estatus}
										</TableCell>
									) : (
										<>
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
												{/* Select de estatus */}
												<Select
													className="w-full min-w-[200px] max-w-[300px]"
													value={evento.estatus}
													onValueChange={(value) => {
														if (
															value.startsWith("Autorizada") ||
															value.startsWith("No autorizada")
														) {
															handleOpenModalStatus(
																evento.id_papeleta,
																value,
																evento.tipo
															);
														} else {
															handleChangeStatus(evento.id_papeleta, value);
														}
													}}>
													<SelectTrigger className="w-full min-w-[200px] max-w-[300px]">
														<SelectValue placeholder="Selecciona una opción" />
													</SelectTrigger>
													<SelectContent className="w-full min-w-[200px] max-w-[300px]">
														<SelectItem value="Autorizada por tu jefe directo">
															Autorizada
														</SelectItem>
														<SelectItem value="Pendiente">Pendiente</SelectItem>
														<SelectItem value="No autorizada por tu jefe directo">
															No autorizada
														</SelectItem>
													</SelectContent>
												</Select>
											</TableCell>
											{modalOpenStatus && (
												<Dialog
													open={modalOpenStatus}
													onOpenChange={handleCloseModalStatus}>
													<DialogContent
														className="border-none p-0 overflow-y-auto w-full max-w-[80vh] max-h-[60vh] shadow-none ml-[13vh] mt-auto"
														onInteractOutside={(event) =>
															event.preventDefault()
														}>
														<Card>
															<CardHeader>
																{modalDataStatus.estatus.startsWith(
																	"Autorizada"
																) ? (
																	<CardTitle
																		style={{ color: "green" }}
																		className="text-2xl font-bold text-center">
																		Agregar comentario - Sí se autoriza la
																		papeleta
																	</CardTitle>
																) : (
																	<CardTitle
																		style={{ color: "red" }}
																		className="text-2xl font-bold text-center">
																		Agregar comentario - No se autoriza la
																		papeleta
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
									)}
									<TableCell>
										{evento.accion ? evento.accion(evento.id_papeleta) : "N/A"}
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={11} className="text-center">
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
