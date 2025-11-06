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
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useUserContext } from "@/utils/userContext";

export function TablaPermisosFaltaUsuario() {
	const { userData, loading: userLoading } = useUserContext();
	const nombre = userData?.user?.nombre;
	const apellidos = userData?.user?.apellidos;
	const idUser = userData?.user?.id;
	const departamento = userData?.departamento?.nombre;
	const jefe_directo = userData?.user?.jefe_directo;
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
	const [tipoFormularioAbierto, setTipoFormularioAbierto] = useState(false); // Estado para abrir el formulario
	const [formularioPrincipalAbiertoEdit, setFormularioPrincipalAbiertoEdit] =
		useState(false); // Estado para abrir el formulario
	const [formularioNormalOExtemporaneo, setFormularioNormalOExtemporaneo] =
		useState(""); // Estado para abrir el formulario
	const [ver, setVer] = useState(false);
	const [fechaInicioPapeleta, setFechaInicio] = useState("");
	const [fechaFinPapeleta, setFechaFin] = useState("");
	const [idFormulario, setIDFormulario] = useState("");
	const [grupoFormulario, setGrupoFormulario] = useState("");
	const [formularioExt, setFormularioExt] = useState("");
	const [allUsers, setAllUsers] = useState([]);
	const [isDisabled, setIsDisabled] = useState(false);
	const [loading, setLoading] = useState(false);

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
			actividad: "",
			descripcion: "",
			tiempoRespuesta: "",
			comentarios: "",
			puestoVacaciones: "",
			planTrabajo: {
				otros: [],
			},
		});
		setFormularioAbierto(true); // Abrir el formulario
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

	const closeModalFormsEdit = () => {
		setFormularioPrincipalAbiertoEdit(false); // Cerrar el formulario
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
		actividad: "",
		descripcion: "",
		tiempoRespuesta: "",
		comentarios: "",
		puestoVacaciones: "",
		planTrabajo: {
			otros: [],
		},
	});

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
		"Comentarios",
		"Estatus",
		"Acción",
	];

	// Obtener eventos desde el backend
	useEffect(() => {
		const fetchEventos = async () => {
			if (!idUser) {
				// Si el idUser no está disponible, no hacemos la solicitud
				return;
			}

			try {
				const response = await axios.get(
					`/api/Gente&CulturaAbsence/getFaltas?id=${idUser}`
				); // Asegúrate de que esta ruta esté configurada en tu backend
				setEventos(response.data);
			} catch (error) {
				console.error("Error al obtener eventos:", error);
			}
		};
		fetchEventos();
	}, [idUser]);

	const fetchPapeletas = async () => {
		try {
			const response = await axios.get(
				`/api/Gente&CulturaAbsence/getFaltas?id=${idUser}`
			); // Asegúrate de que esta ruta esté configurada en tu backend
			setEventos(response.data);
		} catch (error) {
			console.error("Error al obtener eventos:", error);
		}
	};

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
			setVer(true);
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
			setVer(false);
		} catch (error) {
			console.error("Error al obtener el formulario:", error);
		}
	};

	const handleDownload = (formData, nombre, apellido, departamento) => {
		setLoading(true);

		// Mostrar alerta de carga
		Swal.fire({
			title: "Descargando...",
			text: "Estamos procesando el archivo, por favor espere...",
			showConfirmButton: false,
			allowOutsideClick: false,
			willOpen: () => {
				Swal.showLoading();
			},
		});

		setTimeout(() => {
			const doc = new jsPDF();

			doc.addImage("/logo.png", "JPEG", 50, 7, 50, 20, undefined, "MEDIUM");

			// Título
			doc.setFontSize(14);
			doc.text("Solicitud de Vacaciones", 130, 20, { align: "center" });

			// Función para formatear fecha dd/mm/yyyy
			const formatDate = (date) => {
				if (!date) return "";
				const d = new Date(date);
				const day = String(d.getDate()).padStart(2, "0");
				const month = String(d.getMonth() + 1).padStart(2, "0");
				const year = d.getFullYear();
				return `${day}/${month}/${year}`;
			};

			const today = formatDate(new Date());
			const fechaInicio = formatDate(formData.fechaInicio);
			const fechaFin = formatDate(formData.fechaFin);

			// Tabla de datos clave
			const tableData = [
				["Fecha de solicitud", today],
				["Nombre", `${nombre} ${apellido}`],
				["Departamento", departamento],
				["Puesto", formData.puestoVacaciones || "Sin puesto especificado"],
				[
					"Vacaciones",
					`Días: ${
						formData.dias || ""
					}    Del: ${fechaInicio}    Al: ${fechaFin}`,
				],
				["Observaciones", formData.motivo || "Ninguna"],
			];

			autoTable(doc, {
				startY: 45,
				body: tableData,
				styles: { fontSize: 11, cellPadding: 4 },
				headStyles: { fillColor: [200, 200, 200], textColor: 0 },
				alternateRowStyles: { fillColor: [245, 245, 245] },
				columnStyles: {
					0: { cellWidth: 60 },
					1: { cellWidth: 120 },
				},
			});

			// Firma centrada al final
			const finalY = doc.lastAutoTable.finalY + 40;
			const pageWidth = doc.internal.pageSize.getWidth();
			const lineWidth = 80;
			const lineX = (pageWidth - lineWidth) / 2;

			doc.line(lineX, finalY, lineX + lineWidth, finalY);
			doc.setFontSize(12);
			doc.text("Firma del empleado", pageWidth / 2, finalY + 7, {
				align: "center",
			});

			doc.save(`Formato vacaciones - ${nombre} ${apellido}.pdf`);

			// Cerrar alerta y resetear loading
			Swal.close();
			setLoading(false);
		}, 100);
	};

	// Función para extraer los datos relevantes
	const extractData = (evento) => {
		const handleDelete = async (index) => {
			try {
				// Mostrar alerta de confirmación
				const result = await Swal.fire({
					title: "¿Deseas eliminar la papeleta?",
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
						fetchPapeletas();
						await Swal.fire(
							"Eliminada",
							"La papeleta ha sido eliminada correctamente",
							"success"
						);
					} else {
						Swal.fire("Error", "Error al eliminar la papeleta", "error");
					}
				}
			} catch (error) {
				console.error("Error al eliminar la papeleta:", error);
				Swal.fire(
					"Error",
					"Ocurrió un error al intentar eliminar la papeleta",
					"error"
				);
			}
		};

		return {
			id: evento.id,
			id_papeleta: evento.id_papeleta,
			tipo: evento.tipo + (evento.extemporanea === 1 ? " - Extemporánea" : ""),
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
					<Button
						onClick={() => handleEditar(index)}
						style={{
							width: "1px",
							height: "40px",
							opacity: evento.estatus !== "Pendiente" ? "0.7" : "1",
						}}
						disabled={evento.estatus !== "Pendiente"}>
						<EditIcon />
					</Button>
					<Button
						onClick={() => handleDelete(index)}
						style={{
							width: "1px",
							height: "40px",
							opacity: evento.estatus !== "Pendiente" ? "0.7" : "1",
						}}
						disabled={evento.estatus !== "Pendiente"}>
						<svg
							width="25px"
							height="25px"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
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
	if (status === "loading" || userLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Spinner className={styles.spinner} />
				<p className="ml-3">Cargando...</p>
			</div>
		);
	}
	if (status == "loading" || userLoading) {
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

	const handleFileChange = (e) => {
		const file = e.target.files?.[0];

		if (file) {
			const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
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

	const añadirTrabajo = () => {
		setFormData((prevData) => ({
			...prevData,
			planTrabajo: {
				otros: [
					...prevData.planTrabajo.otros,
					{
						fechaActividad: null,
						actividad: "",
						descripcion: "",
						persona: "",
						tiempoRespuesta: "",
						comentarios: "",
					},
				],
			},
		}));
	};

	const eliminarTrabajo = (index) => {
		setFormData((prevData) => ({
			...prevData,
			planTrabajo: {
				otros: prevData.planTrabajo.otros.filter((_, i) => i !== index),
			},
		}));
	};

	const handleTrabajoChange = (e, index, field) => {
		const { name, value } = e.target;
		setFormData((prevState) => {
			const nuevosOtros = [...prevState.planTrabajo.otros];
			nuevosOtros[index] = {
				...nuevosOtros[index],
				[field || name]: value,
			};
			return {
				...prevState,
				planTrabajo: {
					otros: nuevosOtros,
				},
			};
		});
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
		}</strong> ha subido una nueva papeleta de tipo: <strong>${tipoFormulario2}</strong>.<br>
      Puedes revisarla haciendo clic en este enlace: <a href="/gente_y_cultura/autorizar_papeletas" style="color: blue; text-decoration: underline;">Revisar papeleta</a>`;
		const mensaje2 = `<strong>${
			nombre + " " + apellidos
		}</strong> ha subido una nueva papeleta extemporánea de tipo: <strong>${tipoFormulario2}</strong>.<br>
      Puedes revisarla haciendo clic en este enlace: <a href="/gente_y_cultura/autorizar_papeletas" style="color: blue; text-decoration: underline;">Revisar papeleta</a>`;
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
						"/api/Reminder/EnvioEventoPapeletas",
						{
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								formData2: {
									tipo: "Alerta de nueva papeleta",
									descripcion: mensaje,
									id: idUser,
									dpto: null,
									jefe_directo: jefe_directo,
								},
							}),
						}
					);

					if (enviarNotificacion.ok) {
						closeModal();
						closeModalForms();
						closeModalFormsType();
						fetchPapeletas();
						Swal.fire({
							title: "Creado",
							text: "Se ha creado correctamente",
							icon: "success",
							timer: 3000,
							showConfirmButton: false,
						});
					} else {
						console.error("Error al enviar la notificación");
						Swal.fire({
							title: "Error",
							text: "Error al enviar la notificación",
							icon: "error",
							timer: 3000,
							showConfirmButton: false,
						});
					}
				} catch (error) {
					console.error("Error en la solicitud de notificación:", error);
					Swal.close();
					Swal.fire({
						title: "Error",
						text: "Error en la notificación",
						icon: "error",
						timer: 3000,
						showConfirmButton: false,
					});
				}
			} else {
				Swal.fire({
					title: "Error",
					text: "Error al crear la papeleta",
					icon: "error",
					timer: 3000,
					showConfirmButton: false,
				});
			}
		} catch (error) {
			console.error("Error al enviar el formulario:", error);
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
				fetchPapeletas();
				Swal.fire({
					title: "Actualizada",
					text: "La papeleta ha sido actualizada correctamente",
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
				<CardTitle className="text-3xl font-bold">Mis papeletas</CardTitle>
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
					onClick={openModalFormsType}>
					<PermisosIcon className="h-4 w-4" /> AGREGAR PAPELETA
				</Button>
			</div>
			<br />
			{tipoFormularioAbierto && (
				<Dialog open={tipoFormularioAbierto} onOpenChange={closeModalFormsType}>
					<DialogContent
						className="border-none p-0 overflow-y-auto w-full max-w-[32.5vw] max-h-[30vh] shadow-lg ml-[6vw] mt-auto"
						onInteractOutside={(event) => event.preventDefault()}>
						<Card>
							<CardHeader>
								<CardTitle className="text-2xl font-bold text-center">
									Nueva papeleta
								</CardTitle>
								<DialogDescription className="text-center">
									Selecciona el tipo de papeleta
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
					onOpenChange={closeModalForms}>
					<DialogContent
						className="border-none p-0 overflow-y-auto w-full max-w-[32.5vw] max-h-[40vh] shadow-lg ml-[6vw] mt-auto"
						onInteractOutside={(event) => event.preventDefault()}>
						<Card>
							<CardHeader>
								<CardTitle className="text-2xl font-bold text-center">
									Nueva papeleta
								</CardTitle>
								<DialogDescription className="text-center">
									Selecciona el tipo de papeleta
								</DialogDescription>
							</CardHeader>
							<div className="grid gap-4 py-4">
								<div className="flex items-center space-x-2">
									<Checkbox
										id="Llegada tarde / Salida antes"
										checked={tipoFormulario2 === "Llegada tarde / Salida antes"}
										onCheckedChange={(checked) => {
											handleCheckboxChange(
												checked ? "Llegada tarde / Salida antes" : ""
											);
											if (checked) openModal(); // Abrir el modal después de actualizar el estado
										}}
										style={{ marginLeft: "30px" }}
									/>
									<Label htmlFor="Llegada tarde / Salida antes">
										Llegada tarde / Salida antes
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<Checkbox
										id="Tiempo por tiempo"
										checked={tipoFormulario2 === "Tiempo por tiempo"}
										onCheckedChange={(checked) => {
											handleCheckboxChange(checked ? "Tiempo por tiempo" : "");
											if (checked) openModal(); // Abrir el modal después de actualizar el estado
										}}
										style={{ marginLeft: "30px" }}
									/>
									<Label htmlFor="Tiempo por tiempo">Tiempo por tiempo</Label>
								</div>
								<div className="flex items-center space-x-2">
									<Checkbox
										id="Permiso"
										checked={tipoFormulario2 === "Permiso"}
										onCheckedChange={(checked) => {
											handleCheckboxChange(checked ? "Permiso" : "");
											if (checked) openModal(); // Abrir el modal después de actualizar el estado
										}}
										style={{ marginLeft: "30px" }}
									/>
									<Label htmlFor="Permiso">Permiso</Label>
								</div>
								<div className="flex items-center space-x-2">
									<Checkbox
										id="Home Office"
										checked={tipoFormulario2 === "Home Office"}
										onCheckedChange={(checked) => {
											handleCheckboxChange(checked ? "Home Office" : "");
											if (checked) openModal(); // Abrir el modal después de actualizar el estado
										}}
										style={{ marginLeft: "30px" }}
									/>
									<Label htmlFor="Home Office">Home Office</Label>
								</div>
								<div className="flex items-center space-x-2">
									<Checkbox
										id="Vacaciones"
										checked={tipoFormulario2 === "Vacaciones"}
										onCheckedChange={(checked) => {
											handleCheckboxChange(checked ? "Vacaciones" : "");
											if (checked) openModal(); // Abrir el modal después de actualizar el estado
										}}
										style={{ marginLeft: "30px" }}
									/>
									<Label htmlFor="Vacaciones">Vacaciones</Label>
								</div>
								<div className="flex items-center space-x-2">
									<Checkbox
										id="Omisión de Checada"
										checked={tipoFormulario2 === "Omisión de Checada"}
										onCheckedChange={(checked) => {
											handleCheckboxChange(checked ? "Omisión de Checada" : "");
											if (checked) openModal(); // Abrir el modal después de actualizar el estado
										}}
										style={{ marginLeft: "30px" }}
									/>
									<Label htmlFor="Omisión de Checada">Omisión de Checada</Label>
								</div>
							</div>
						</Card>
					</DialogContent>
				</Dialog>
			)}

			{/* Mostrar formulario basado en el tipo seleccionado */}
			{formularioAbierto && tipoFormulario2 && (
				<div>
					{tipoFormulario2 === "Llegada tarde / Salida antes" && (
						<Dialog open={formularioAbierto} onOpenChange={closeModal}>
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
												<Label htmlFor="motivo">Hora</Label>
												<Input
													id="horaFormulario"
													name="horaFormulario"
													type="time"
													onChange={handleChange}
													required
												/>
											</div>
											<div className="grid grid-cols-1 gap-4">
												{renderDatePicker(
													"Fecha",
													formData.fechaInicio,
													handleChange,
													"fechaInicio"
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
										</CardContent>
										<CardFooter>
											<Button2
												type="submit"
												className="w-full"
												disabled={
													!formData.horaFormulario ||
													!formData.fechaInicio ||
													!formData.motivo.trim()
												}>
												Enviar
											</Button2>
										</CardFooter>
									</form>
								</Card>
							</DialogContent>
						</Dialog>
					)}
					{tipoFormulario2 === "Tiempo por tiempo" && (
						<Dialog open={formularioAbierto} onOpenChange={closeModal}>
							<DialogContent
								className="border-none p-0 overflow-y-auto w-full max-w-[35vw] max-h-[80vh] shadow-lg ml-[6vw] mt-auto"
								onInteractOutside={(event) => event.preventDefault()}>
								<Card>
									<CardHeader>
										<CardTitle className="text-2xl font-bold text-center">
											Tiempo por tiempo
										</CardTitle>
										<DialogDescription className="text-center">
											Tiempo que puedes reponer llegando temprano o saliendo
											tarde
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
																style={{ cursor: "pointer", fontSize: 18 }}
															/>
														</Tooltip>
													</div>
												</div>
												<Input
													id="dias"
													name="dias"
													type="number"
													onChange={handleChange}
													required
													placeholder="Dias..."
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="horas">Horas</Label>
												<Input
													id="horas"
													name="horas"
													type="number"
													onChange={handleChange}
													required
													placeholder="Horas..."
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="minutos">Minutos</Label>
												<Input
													id="minutos"
													name="minutos"
													type="number"
													onChange={handleChange}
													required
													placeholder="Minutos..."
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
												<Label htmlFor="comprobante">Comprobante</Label>
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
														className="w-full">
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
													!formData.dias ||
													!formData.horas ||
													!formData.minutos ||
													!formData.fechaInicio ||
													!formData.fechaFin ||
													!formData.motivo.trim()
												}>
												Enviar
											</Button2>
										</CardFooter>
									</form>
								</Card>
							</DialogContent>
						</Dialog>
					)}
					{tipoFormulario2 === "Permiso" && (
						<Dialog open={formularioAbierto} onOpenChange={closeModal}>
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
																style={{ cursor: "pointer", fontSize: 18 }}
															/>
														</Tooltip>
													</div>
												</div>
												<RadioGroup
													onValueChange={(value) =>
														handleChange2({ name: "conSueldo", value })
													}
													className="flex space-x-2">
													<div className="flex items-center space-x-2">
														<RadioGroupItem value="si" id="justificada-si" />
														<Label htmlFor="justificada-si">
															Con goce de sueldo
														</Label>
													</div>
													<div className="flex items-center space-x-2">
														<RadioGroupItem value="no" id="justificada-no" />
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
													}}>
													<Label htmlFor="comprobante">Comprobante</Label>
													<div style={{ marginLeft: "10px" }}>
														<Tooltip
															title={`<p style="margin:0;padding:5px;text-align:justify;">Sube aquí tu documento correspondiente al tipo de permiso requerido.</p>`}
															arrow>
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
														className="w-full">
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
													!formData.conSueldo ||
													!formData.dias ||
													!formData.fechaInicio ||
													!formData.fechaFin ||
													!formData.motivo.trim()
												}>
												Enviar
											</Button2>
										</CardFooter>
									</form>
								</Card>
							</DialogContent>
						</Dialog>
					)}
					{tipoFormulario2 === "Home Office" && (
						<Dialog open={formularioAbierto} onOpenChange={closeModal}>
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
											<div
												style={{
													position: "relative",
													display: "inline-flex",
													alignItems: "center",
												}}>
												<Label style={{ fontSize: 17 }}>Plan de trabajo</Label>
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
														"fechaFormulario"
													)}
												</div>
												<div className="flex flex-col justify-end min-w-0 space-y-3">
													<Label htmlFor="actividad" className="truncate block">
														Actividad
													</Label>
													<Input
														id="actividad"
														name="actividad"
														type="text"
														onChange={handleChange}
														placeholder="Actividad..."
														required
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
														onChange={handleChange}
														placeholder="Descripción de la actividad elaborada..."
														required
													/>
												</div>
												<div className="flex flex-col justify-end min-w-0 space-y-3">
													<Label htmlFor="persona" className="truncate block">
														Persona respuesta
													</Label>
													<Input
														id="persona"
														name="persona"
														type="text"
														onChange={handleChange}
														placeholder="Persona..."
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
														onChange={handleChange}
														placeholder="Tiempo de respuesta..."
														required
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
														onChange={handleChange}
														placeholder="Comentarios..."
														required
													/>
												</div>
											</div>
											<div className="space-y-2">
												{formData.planTrabajo.otros.map((otro, index) => (
													<div key={index} className="grid grid-cols-6 gap-1">
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
																false,
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
																	handleTrabajoChange(e, index, "actividad")
																}
																placeholder="Actividad..."
																required
															/>
														</div>
														<div>
															<Input
																id={`descripcion-${index}`}
																name={`descripcion-${index}`}
																value={otro.descripcion}
																type="text"
																onChange={(e) =>
																	handleTrabajoChange(e, index, "descripcion")
																}
																placeholder="Descripción de la actividad elaborada..."
																required
															/>
														</div>
														<div>
															<Input
																id={`persona-${index}`}
																name={`persona-${index}`}
																value={otro.persona}
																type="text"
																onChange={(e) =>
																	handleTrabajoChange(e, index, "persona")
																}
																placeholder="Persona..."
															/>
														</div>
														<div>
															<Input
																id={`tiempoRespuesta-${index}`}
																name={`tiempoRespuesta-${index}`}
																value={otro.tiempoRespuesta}
																type="text"
																onChange={(e) =>
																	handleTrabajoChange(
																		e,
																		index,
																		"tiempoRespuesta"
																	)
																}
																placeholder="Tiempo de respuesta..."
																required
															/>
														</div>
														<div>
															<div className="flex items-center">
																<Input
																	id={`comentarios-${index}`}
																	name={`comentarios-${index}`}
																	value={otro.comentarios}
																	type="text"
																	className="w-full"
																	onChange={(e) =>
																		handleTrabajoChange(e, index, "comentarios")
																	}
																	placeholder="Comentarios..."
																	required
																/>
																<Button2
																	type="button"
																	variant="ghost"
																	size="icon"
																	className="w-6"
																	onClick={() => eliminarTrabajo(index)}>
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
													onClick={añadirTrabajo}
													className="mt-2">
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
													!formData.fechaFormulario ||
													!formData.actividad.trim() ||
													!formData.descripcion.trim() ||
													!formData.tiempoRespuesta.trim() ||
													!formData.comentarios.trim() ||
													// Validar otros campos dinámicos
													formData.planTrabajo.otros.some(
														(otro, index) =>
															!otro.fechaActividad ||
															!otro.actividad.trim() ||
															!otro.descripcion.trim() ||
															!otro.tiempoRespuesta.trim() ||
															!otro.comentarios.trim()
													)
												}>
												Enviar
											</Button2>
										</CardFooter>
									</form>
								</Card>
							</DialogContent>
						</Dialog>
					)}
					{tipoFormulario2 === "Vacaciones" && (
						<Dialog open={formularioAbierto} onOpenChange={closeModal}>
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
													onChange={handleChange}
													placeholder="Puesto..."
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="motivo">Días</Label>
												<Input
													id="dias"
													name="dias"
													type="number"
													onChange={handleChange}
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
													className="min-h-[100px]"
													placeholder="Coloca tus observaciones aquí..."
												/>
											</div>
											<div className="space-y-2">
												<div
													style={{
														position: "relative",
														display: "flex",
														alignItems: "center",
														gap: "10px",
													}}>
													<Label htmlFor="comprobante">Formato</Label>

													<Tooltip
														title={`<p style="margin:0;padding:5px;text-align:justify;">Llena el formulario completamente y después haz clic en 
                    "Descargar formato". Imprime el PDF, fírmalo y súbelo en este apartado en cualquiera de los formatos permitidos.</p>`}
														arrow>
														<HelpIcon
															style={{ cursor: "pointer", fontSize: 18 }}
														/>
													</Tooltip>

													{/* Botón personalizado para descargar el PDF */}
													<Button2
														variant="outline"
														onClick={() =>
															handleDownload(
																formData,
																nombre,
																apellidos,
																departamento
															)
														}
														disabled={loading}>
														{loading ? "Descargando..." : "Descargar formato"}
													</Button2>
												</div>
												<div className="flex items-center space-x-2">
													<input
														id="comprobante"
														name="comprobante"
														type="file"
														accept=".pdf,.jpg,.jpeg,.png"
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
														className="w-full">
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
													!formData.puestoVacaciones.trim() ||
													!formData.dias ||
													!formData.fechaInicio ||
													!formData.fechaFin ||
													!formData.motivo.trim() ||
													!formData.comprobante
												}>
												Enviar
											</Button2>
										</CardFooter>
									</form>
								</Card>
							</DialogContent>
						</Dialog>
					)}
					{tipoFormulario2 === "Omisión de Checada" && (
						<Dialog open={formularioAbierto} onOpenChange={closeModal}>
							<DialogContent
								className="border-none p-0 overflow-y-auto w-full max-w-[35vw] max-h-[80vh] shadow-lg ml-[6vw] mt-auto"
								onInteractOutside={(event) => event.preventDefault()}>
								<Card>
									<CardHeader>
										<CardTitle className="text-2xl font-bold text-center">
											Omisión de Checada
										</CardTitle>
										<DialogDescription className="text-center">
											Autorización para Omisión de Checada
										</DialogDescription>
									</CardHeader>
									<form onSubmit={handleSubmit}>
										<CardContent className="space-y-6">
											<div className="space-y-2">
												<Label htmlFor="motivo">Hora</Label>
												<Input
													id="horaFormulario"
													name="horaFormulario"
													type="time"
													onChange={handleChange}
													required
												/>
											</div>
											<div className="grid grid-cols-1 gap-4">
												{renderDatePicker(
													"Fecha",
													formData.fechaInicio,
													handleChange,
													"fechaInicio"
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
										</CardContent>
										<CardFooter>
											<Button2
												type="submit"
												className="w-full"
												disabled={
													!formData.horaFormulario ||
													!formData.fechaInicio ||
													!formData.motivo.trim()
												}>
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
												<form onSubmit={handleSubmitEdit}>
													<CardContent className="space-y-6">
														<div className="space-y-2">
															<Label htmlFor="horaFormulario">Hora</Label>
															<Input
																id="horaFormulario"
																name="horaFormulario"
																type="time"
																value={formData.horaFormulario}
																onChange={handleChange}
																readOnly={ver ? true : false}
															/>
														</div>
														<div className="grid grid-cols-1 gap-4">
															{renderDatePicker(
																"Fecha",
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
													</CardContent>
													{ver ? (
														<div hidden></div>
													) : (
														<CardFooter>
															<Button2
																type="submit"
																className="w-full"
																disabled={
																	!formData.horaFormulario ||
																	!formData.fechaInicio ||
																	!formData.motivo.trim()
																}>
																Actualizar
															</Button2>
														</CardFooter>
													)}
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
												<form onSubmit={handleSubmitEdit}>
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
																readOnly={ver ? true : false}
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
																readOnly={ver ? true : false}
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
																readOnly={ver ? true : false}
																placeholder="Minutos..."
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
																readOnly={ver ? true : false}
																className="min-h-[100px]"
																placeholder="Coloca tus observaciones aquí..."
															/>
														</div>
														<div className="space-y-2">
															<Label htmlFor="comprobante">Comprobante</Label>
															<div className="flex items-center space-x-2">
																{formData.comprobante && ver ? (
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
																		{ver ? (
																			<span style={{ fontSize: 14 }}>
																				Sin comprobante agregado
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
																					className="w-full">
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
																	!formData.dias ||
																	!formData.horas ||
																	!formData.minutos ||
																	!formData.fechaInicio ||
																	!formData.fechaFin ||
																	!formData.motivo.trim()
																}>
																Actualizar
															</Button2>
														</CardFooter>
													)}
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
												<form onSubmit={handleSubmitEdit}>
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
																disabled={ver ? true : false}
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
															<Label htmlFor="motivo">Observaciones</Label>
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
																{formData.comprobante && ver ? (
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
																		{ver ? (
																			<span style={{ fontSize: 14 }}>
																				Sin comprobante agregado
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
																					className="w-full">
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
																	!formData.conSueldo ||
																	!formData.dias ||
																	!formData.fechaInicio ||
																	!formData.fechaFin ||
																	!formData.motivo.trim()
																}>
																Actualizar
															</Button2>
														</CardFooter>
													)}
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
												<form onSubmit={handleSubmitEdit}>
													<CardContent className="space-y-6">
														<div>
															<Label style={{ fontSize: 17 }}>Periodo</Label>
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
																	ver ? true : false,
																	false,
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
																	placeholder="Actividad..."
																	onChange={handleChange}
																	readOnly={ver ? true : false}
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
																	placeholder="Descripción de la actividad elaborada..."
																	onChange={handleChange}
																	readOnly={ver ? true : false}
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
																	placeholder={ver ? "" : "Persona..."}
																	onChange={handleChange}
																	readOnly={ver ? true : false}
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
																	placeholder="Tiempo de respuesta..."
																	onChange={handleChange}
																	readOnly={ver ? true : false}
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
																	placeholder="Comentarios..."
																	onChange={handleChange}
																	readOnly={ver ? true : false}
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
																			ver ? true : false,
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
																			placeholder="Actividad..."
																			onChange={(e) =>
																				handleTrabajoChange(
																					e,
																					index,
																					"actividad"
																				)
																			}
																			readOnly={ver ? true : false}
																		/>
																	</div>
																	<div>
																		<Input
																			id={`descripcion-${index}`}
																			name={`descripcion-${index}`}
																			type="text"
																			value={otro.descripcion}
																			placeholder="Descripción de la actividad elaborada..."
																			onChange={(e) =>
																				handleTrabajoChange(
																					e,
																					index,
																					"descripcion"
																				)
																			}
																			readOnly={ver ? true : false}
																		/>
																	</div>
																	<div>
																		<Input
																			id={`persona-${index}`}
																			name={`persona-${index}`}
																			type="text"
																			value={otro.persona}
																			placeholder={ver ? "" : "Persona..."}
																			onChange={(e) =>
																				handleTrabajoChange(e, index, "persona")
																			}
																			readOnly={ver ? true : false}
																		/>
																	</div>
																	<div>
																		<Input
																			id={`tiempoRespuesta-${index}`}
																			name={`tiempoRespuesta-${index}`}
																			type="text"
																			value={otro.tiempoRespuesta}
																			placeholder="Tiempo de respuesta..."
																			onChange={(e) =>
																				handleTrabajoChange(
																					e,
																					index,
																					"tiempoRespuesta"
																				)
																			}
																			readOnly={ver ? true : false}
																		/>
																	</div>
																	<div>
																		<div className="flex items-center">
																			<Input
																				id={`comentarios-${index}`}
																				name={`comentarios-${index}`}
																				type="text"
																				className="w-full"
																				value={otro.comentarios}
																				placeholder="Comentarios..."
																				onChange={(e) =>
																					handleTrabajoChange(
																						e,
																						index,
																						"comentarios"
																					)
																				}
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
																						eliminarTrabajo(index)
																					}>
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
																	onClick={añadirTrabajo}
																	className="mt-2">
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
																	!formData.fechaFormulario ||
																	!formData.actividad.trim() ||
																	!formData.descripcion.trim() ||
																	!formData.tiempoRespuesta.trim() ||
																	!formData.comentarios.trim() ||
																	// Validar otros campos dinámicos
																	formData.planTrabajo.otros.some(
																		(otro, index) =>
																			!otro.fechaActividad ||
																			!otro.actividad.trim() ||
																			!otro.descripcion.trim() ||
																			!otro.tiempoRespuesta.trim() ||
																			!otro.comentarios.trim()
																	)
																}>
																Actualizar
															</Button2>
														</CardFooter>
													)}
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
												<form onSubmit={handleSubmitEdit}>
													<CardContent className="space-y-6">
														<div className="space-y-2">
															<Label htmlFor="puestoVacaciones">Puesto</Label>
															<Input
																id="puestoVacaciones"
																name="puestoVacaciones"
																type="text"
																value={formData.puestoVacaciones}
																onChange={handleChange}
																readOnly={ver ? true : false}
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
															<Label htmlFor="motivo">Observaciones</Label>
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
													{ver ? (
														<div hidden></div>
													) : (
														<CardFooter>
															<Button2
																type="submit"
																className="w-full"
																disabled={
																	!formData.puestoVacaciones.trim() ||
																	!formData.dias ||
																	!formData.fechaInicio ||
																	!formData.fechaFin ||
																	!formData.motivo.trim()
																}>
																Actualizar
															</Button2>
														</CardFooter>
													)}
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
														Autorización para Omisión de Checada
													</DialogDescription>
												</CardHeader>
												<form onSubmit={handleSubmitEdit}>
													<CardContent className="space-y-6">
														<div className="space-y-2">
															<Label htmlFor="horaFormulario">Hora</Label>
															<Input
																id="horaFormulario"
																name="horaFormulario"
																type="time"
																value={formData.horaFormulario}
																onChange={handleChange}
																readOnly={ver ? true : false}
															/>
														</div>
														<div className="grid grid-cols-1 gap-4">
															{renderDatePicker(
																"Fecha",
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
													</CardContent>
													{ver ? (
														<div hidden></div>
													) : (
														<CardFooter>
															<Button2
																type="submit"
																className="w-full"
																disabled={
																	!formData.horaFormulario ||
																	!formData.fechaInicio ||
																	!formData.motivo.trim()
																}>
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
								Autorizada por tu jefe directo
							</SelectItem>
							<SelectItem value="Pendiente">Pendiente</SelectItem>
							<SelectItem value="No autorizada por tu jefe directo">
								No autorizada por tu jefe directo
							</SelectItem>
							<SelectItem value="No autorizada por RH">
								No autorizada por RH
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
			<div className="overflow-x-auto">
				<Table>
					<TableCaption>Papeletas generadas</TableCaption>
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
											? "Suspensión"
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
										}}>
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

function EditIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			stroke="rgb(31 41 55)"
			fill="rgb(31 41 55)"
			width="20px"
			height="20px">
			<path d="M21,11.5V15H18a3,3,0,0,0-3,3v3H4.5A1.5,1.5,0,0,1,3,19.5V4.5A1.5,1.5,0,0,1,4.5,3h9A1.5,1.5,0,0,0,15,1.5h0A1.5,1.5,0,0,0,13.5,0h-9A4.5,4.5,0,0,0,0,4.5v15A4.5,4.5,0,0,0,4.5,24H16.484a4.5,4.5,0,0,0,3.181-1.317l3.017-3.017A4.5,4.5,0,0,0,24,16.485V11.5A1.5,1.5,0,0,0,22.5,10h0A1.5,1.5,0,0,0,21,11.5Z" />
			<path d="M17.793,1.793l-12.5,12.5A1,1,0,0,0,5,15v3a1,1,0,0,0,1,1H9a1,1,0,0,0,.707-.293L22.038,6.376a3.379,3.379,0,0,0,.952-3.17A3.118,3.118,0,0,0,17.793,1.793Z" />
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
