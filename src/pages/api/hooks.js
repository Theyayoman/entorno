import { useUserContext } from "@/utils/userContext";

export function useUser() {
  const { userData, loading } = useUserContext();
  const rol = userData?.user?.rol;
  const departamento = userData?.departamento?.nombre;
  const idPermiso = userData?.user?.id_permiso;
  const permisos = userData?.user?.permisos || {};

  // Función para verificar si el usuario tiene permiso en la sección y campo específicos
  const tienePermiso = (seccion, campo) =>
    permisos?.campo?.[seccion]?.includes(campo) ?? false;

  return {
    loading,
    user: userData?.user || null,
    rol,
    isMaster: rol === "Máster",
    isDadoDeBaja: rol === "Dado de baja",
    isAdminMkt:
      rol === "Administrador" && !!idPermiso && departamento === "Marketing",
    isAdminGC: rol === "Administrador" && departamento === "Gente y Cultura",
    isITMember: rol !== "Máster" && departamento === "IT",
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
      departamento === "Gente y Cultura" &&
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
}
