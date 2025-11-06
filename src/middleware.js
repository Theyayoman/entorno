import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

function matchRoute(pattern, path) {
	// Quita el query string
	const cleanPath = path.split("?")[0].replace(/\/$/, "");
	const cleanPattern = pattern.replace(/\/$/, "");

	// Convierte :param en expresión regular
	const regex = new RegExp(
		"^" + cleanPattern.replace(/:[^/]+/g, "[^/]+") + "$"
	);
	return regex.test(cleanPath);
}

export async function middleware(req) {
	const token = await getToken({ req, secret: process.env.AUTH_SECRET });

	if (!token) {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	const url = req.nextUrl.clone();
	const currentPath = url.pathname;

	const rol = token.rol;
	const idUser = token.id; // Asegúrate de que el token contenga idUser
	const idPermiso = token.idPermiso || null;
	const departamento = token.departamento || null;

	// Obtener permisos del usuario desde la API
	let permisos = {};
	try {
		const res = await fetch(
			`https://aionnet2.vercel.app/api/MarketingLabel/permiso?userId=${idUser}`
		);
		if (res.ok) {
			permisos = await res.json();
		}
	} catch (error) {
		console.error("Error al obtener permisos:", error);
	}

	// Función para verificar permisos
	const tienePermiso = (seccion, campo) => {
		if (!permisos.campo || !permisos.campo[seccion]) {
			return false;
		}
		return permisos.campo[seccion].includes(campo);
	};

	// Definir roles
	const roles = {
		isMaster: rol === "Máster",
		isDadoDeBaja: rol === "Dado de baja",
		isAdminMkt: rol === "Administrador" && !!idPermiso && departamento === 2,
		isAdminGC: rol === "Administrador" && departamento === 5,
		isITMember: rol !== "Máster" && departamento === 1,
		isStandardMkt: rol !== "Máster" && tienePermiso("Marketing", "Firmas"),
		isStandard: rol === "Estándar",
		hasAccessPapeletas:
			rol !== "Máster" && tienePermiso("Papeletas", "Modulo papeletas"),
		hasAccessPapeletasEnviadas:
			rol !== "Máster" && tienePermiso("Papeletas", "Papeletas enviadas"),
		hasAccessAutorizarPapeletas:
			rol !== "Máster" && tienePermiso("Papeletas", "Autorizar"),
		hasAccessSolicitudes:
			rol !== "Máster" && tienePermiso("Papeletas", "Solicitudes"),
		hasAllAccessVacantes:
			rol === "Administrador" &&
			departamento === 5 &&
			tienePermiso("Gente y Cultura", "Vacantes"),
		hasAccessVacantes:
			rol !== "Máster" &&
			tienePermiso("Gente y Cultura", "Vacantes sin sueldo"),
		hasAccessCMDProductos:
			rol !== "Máster" && tienePermiso("Ing. Productos", "CMD Productos"),
		hasAccessLevantamiento:
			rol !== "Máster" &&
			tienePermiso("Ventas", "Levantamiento requerimientos"),
		hasAccessFormulas: rol !== "Máster" && tienePermiso("Ventas", "Formulas"),
		hasAccessCostos: rol !== "Máster" && tienePermiso("Ventas", "Costos"),
	};

	// Rutas permitidas por rol
	const roleRoutes = {
		isMaster: "*",
		isDadoDeBaja: ["/inicio", "/perfil", "/papeletas_usuario"],
		isAdminMkt: [
			"/inicio",
			"/perfil",
			"/papeletas_usuario",
			"/marketing/estrategias",
			"/marketing/estrategias/formulario",
			"/marketing/estrategias/editar_formulario",
			"/marketing/etiquetas",
			"/marketing/etiquetas/formulario",
			"/marketing/etiquetas/Editar",
		],
		isAdminGC: [
			"/inicio",
			"/perfil",
			"/papeletas_usuario",
			"/usuario",
			"/usuario/empresas",
		],
		isITMember: ["/inicio", "/perfil", "/papeletas_usuario", "/it/inventario"],
		isStandardMkt: [
			"/inicio",
			"/perfil",
			"/papeletas_usuario",
			"/marketing/etiquetas",
			"/marketing/etiquetas/formulario",
			"/marketing/etiquetas/Editar",
		],
		isStandard: ["/inicio", "/perfil", "/papeletas_usuario"],
		hasAccessPapeletas: [
			"/inicio",
			"/perfil",
			"/papeletas_usuario",
			"/gente_y_cultura/todas_papeletas",
		],
		hasAccessPapeletasEnviadas: [
			"/inicio",
			"/perfil",
			"/papeletas_usuario",
			"/gente_y_cultura/papeletas_enviadas",
		],
		hasAccessAutorizarPapeletas: [
			"/inicio",
			"/perfil",
			"/papeletas_usuario",
			"/gente_y_cultura/autorizar_papeletas",
		],
		hasAccessSolicitudes: [
			"/inicio",
			"/perfil",
			"/papeletas_usuario",
			"/gente_y_cultura/solicitudes",
		],
		hasAllAccessVacantes: [
			"/inicio",
			"/perfil",
			"/papeletas_usuario",
			"/gente_y_cultura/vacantes",
		],
		hasAccessVacantes: [
			"/inicio",
			"/perfil",
			"/papeletas_usuario",
			"/gente_y_cultura/vacantes",
		],
		hasAccessCMDProductos: [
			"/inicio",
			"/perfil",
			"/papeletas_usuario",
			"/ingenieria_nuevo_producto/catalogo_productos",
			"/ingenieria_nuevo_producto",
			"/configuraciones/cmd/Productos",
			"/configuraciones/cmd/Productos/generar_ficha_tecnica",
			"/configuraciones/cmd/Productos/validar_producto",
			"/configuraciones/cmd/Productos/validar_producto_formula",
			"/configuraciones/cmd/proveedores",
			"/configuraciones/cmd/actores",
		],
		hasAccessLevantamiento: [
			"/inicio",
			"/perfil",
			"/papeletas_usuario",
			"/ventas/prospectos",
			"/ventas/prospectos/nuevo_prospecto",
			"/ventas/prospectos/editar_prospecto/:id",
			"/ventas/levantamiento_requerimientos",
			"/ventas/levantamiento_requerimientos/nuevo_levantamiento",
			"/ventas/levantamiento_requerimientos/editar_levantamiento",
			"/ventas/levantamiento_requerimientos/detalle_levantamiento/:id",
		],
	};

	// Máster puede acceder a todas las rutas
	if (roles.isMaster) {
		return NextResponse.next();
	}

	const allowedRoutes = Object.entries(roleRoutes)
		.filter(([key]) => roles[key])
		.flatMap(([, routes]) =>
			Array.isArray(routes) ? routes.map((r) => r.replace(/\/$/, "")) : []
		);

	const isAuthorized =
		allowedRoutes.includes("*") ||
		allowedRoutes.some((route) => matchRoute(route, currentPath));

	if (!isAuthorized) {
		return NextResponse.redirect(new URL("/paginas_error", req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/capacitacion/:path*",
		"/configuraciones/:path*",
		"/contabilidad/:path*",
		"/cursos/:path*",
		"/explorador_archivos/:path*",
		"/formularioIncidencias/:path*",
		"/gente_y_cultura/:path*",
		"/ingenieria_nuevo_producto/:path*",
		"/inicio/:path*",
		"/it/:path*",
		"/marketing/:path*",
		"/perfil/:path*",
		"/permisos/:path*",
		"/usuario/:path*",
		"/ventas/:path*",
	],
};
