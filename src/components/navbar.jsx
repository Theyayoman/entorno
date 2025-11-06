"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { PackageOpen, ShoppingBasket } from "lucide-react";
import "../../public/CSS/navbar.css";
import { useUser } from "@/pages/api/hooks";
import { Users, ClipboardList } from "lucide-react";
import { ImProfile } from "react-icons/im";
import { FaHome, FaRegLightbulb } from "react-icons/fa";
import { GrDocumentText } from "react-icons/gr";
import { FiUser, FiUserPlus, FiTarget } from "react-icons/fi";
import { FaBuildingUser, FaUsersRectangle } from "react-icons/fa6";
import { GrDocumentVerified } from "react-icons/gr";
import {
  RiMailSendLine,
  RiMegaphoneLine,
  RiShoppingBag3Line,
} from "react-icons/ri";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { HiOutlineDesktopComputer } from "react-icons/hi";
import { GoInbox } from "react-icons/go";
import { TiPen } from "react-icons/ti";
import {
  LuSquareTerminal,
  LuFileUser,
  LuCircleUserRound,
} from "react-icons/lu";
import { TfiTarget } from "react-icons/tfi";
import { BsBarChart } from "react-icons/bs";
import { useUserContext } from "@/utils/userContext";
import { TbSend } from "react-icons/tb";

export function Navbarv1() {
  const { userData, loading } = useUserContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [openSections, setOpenSections] = useState({});
  const {
    isMaster,
    isAdminMkt,
    isAdminGC,
    isITMember,
    isStandardMkt,
    isStandard,
    hasAccessPapeletas,
    hasAccessPapeletasEnviadas,
    hasAccessAutorizarPapeletas,
    hasAccessSolicitudes,
    hasAllAccessVacantes,
    hasAccessVacantes,
    isDadoDeBaja,
    hasAccessCMDProductos,
    hasAccessLevantamiento,
  } = useUser();
  // Función para abrir/cerrar secciones principales y submenús
  const toggleSection = (sectionId) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId], // Cambiar el estado de la sección actual
    }));
  };

  const { data: session } = useSession();

  if (!session || !session.user) {
    return null;
  }

  if (loading || !userData) return null;

  const { user } = userData;

  const categories = [
    { id: "principal", name: "Principal", href: "#", roles: ["*"] },
    {
      id: 2,
      name: "Inicio",
      href: "/inicio",
      icon: <FaHome className="h-6 w-6 text-gray-400" />,
      roles: ["*"],
    },
    {
      id: 3,
      name: "Perfil",
      href: "/perfil",
      icon: <ImProfile className="h-6 w-6 text-gray-400" />,
      roles: ["*"],
    },
    //{ id: 3, name: "Noticias", href: "#", icon: <NoticiasIcon className="h-6 w-6 text-gray-400" />, roles: ["*"] },
    {
      id: 4,
      name: "Ver mis papeletas",
      href: "/papeletas_usuario",
      icon: <GrDocumentText className="h-6 w-6 text-gray-400" />,
      roles: ["*"],
    },
    //{ id: 5, name: "Ayuda", href: "#", icon: <AyudaIcon className="h-6 w-6 text-gray-400" />, roles: ["*"] },

    {
      id: "departamentos",
      name: "Departamentos",
      href: "#",
      roles: [
        "master",
        "adminMkt",
        "adminGC",
        "itMember",
        "standardMkt",
        "hasAccessPapeletas",
        "hasAccessPapeletasEnviadas",
        "hasAccessAutorizarPapeletas",
        "hasAccessSolicitudes",
        "hasAllAccessVacantes",
        "hasAccessVacantes",
        "hasAccessCMDProductos",
      ],
    },
    {
      id: 7,
      name: "Gente y Cultura",
      href: "#",
      icon: <FiUser className="h-6 w-6 text-gray-400" />,
      roles: [
        "master",
        "adminGC",
        "hasAccessPapeletas",
        "hasAccessPapeletasEnviadas",
        "hasAccessAutorizarPapeletas",
        "hasAccessSolicitudes",
        "hasAllAccessVacantes",
        "hasAccessVacantes",
      ],
      subMenu: [
        {
          id: 1,
          name: "Papeletas RH",
          href: "/gente_y_cultura/todas_papeletas",
          icon: <LuFileUser className="h-6 w-6 text-gray-400" />,
          roles: ["master", "hasAccessPapeletas"],
        },
        {
          id: 2,
          name: "Autorizar papeletas",
          href: "/gente_y_cultura/autorizar_papeletas",
          icon: <GrDocumentVerified className="h-6 w-6 text-gray-400" />,
          roles: ["master", "hasAccessAutorizarPapeletas"],
        },
        {
          id: 3,
          name: "Papeletas enviadas",
          href: "/gente_y_cultura/papeletas_enviadas",
          icon: <TbSend className="h-6 w-6 text-gray-400" />,
          roles: ["master", "hasAccessPapeletasEnviadas"],
        },
        {
          id: 4,
          name: "Ver mis solicitudes",
          href: "/gente_y_cultura/solicitudes",
          icon: <RiMailSendLine className="h-6 w-6 text-gray-400" />,
          roles: ["master", "hasAccessSolicitudes"],
        },

        {
          id: 5,
          name: "Usuarios y empresas",
          href: "#",
          icon: <FaBuildingUser className="h-6 w-6 ml-1 text-gray-400" />,
          roles: ["master", "adminGC"],
          subMenu: [
            {
              id: 1,
              name: "Usuarios",
              href: "/usuario",
              icon: <FaUsersRectangle className="h-6 w-6 text-gray-400" />,
              roles: ["master", "adminGC"],
            },
            {
              id: 2,
              name: "Empresas",
              href: "/usuario/empresas",
              icon: (
                <HiOutlineBuildingOffice2 className="h-6 w-6 text-gray-400" />
              ),
              roles: ["master", "adminGC"],
            },
          ],
        },
        {
          id: 6,
          name: "Vacantes",
          href: "/gente_y_cultura/vacantes",
          icon: <FiUserPlus className="h-6 w-6 text-gray-400" />,
          roles: ["master", "hasAllAccessVacantes", "hasAccessVacantes"],
        },
      ],
    },
    {
      id: 8,
      name: "Marketing",
      href: "#",
      icon: <RiMegaphoneLine className="h-6 w-6 text-gray-400" />,
      roles: ["master", "adminMkt", "standardMkt"],
      subMenu: [
        {
          id: 1,
          name: "Estrategias",
          href: "/marketing/estrategias",
          icon: <FiTarget className="h-6 w-6 text-gray-400" />,
          roles: ["master", "adminMkt"],
        },
        {
          id: 2,
          name: "Firmas",
          href: "/marketing/etiquetas",
          icon: <TiPen className="h-6 w-6 text-gray-400" />,
          roles: ["master", "adminMkt", "standardMkt"],
        },
      ],
    },
    /*{
      id: 9,
      name: "Operaciones",
      href: "#",
      icon: <OperacionesIcon className="h-6 w-6 text-gray-400" />,
      roles: ["master"],
    },*/
    {
      id: 10,
      name: "TI",
      href: "#",
      icon: <HiOutlineDesktopComputer className="h-6 w-6 text-gray-400" />,
      roles: ["master", "itMember"],
      subMenu: [
        {
          id: 1,
          name: "Inventario",
          href: "/it/inventario",
          icon: <GoInbox className="h-6 w-6 text-gray-400" />,
          roles: ["master", "itMember"],
        },
      ],
    },
    {
      id: 11,
      name: "Ingeniería de nuevo producto",
      href: "#",
      icon: <FaRegLightbulb className="h-6 w-6 ml-1 mr-1 text-gray-400" />,
      roles: ["master", "hasAccessCMDProductos"],
      subMenu: [
        {
          id: 1,
          name: "Catálogo de productos",
          href: "/ingenieria_nuevo_producto",
          icon: <RiShoppingBag3Line className="h-8 w-8 text-gray-400" />,
          roles: ["master", "hasAccessCMDProductos"],
        },
        {
          id: 2,
          name: "CMD",
          href: "/ingenieria_nuevo_producto/catalogo_productos",
          icon: <LuSquareTerminal className="h-6 w-6 text-gray-400" />,
          roles: ["master", "hasAccessCMDProductos"],
        },
      ],
    },
    //{ id: 12, name: "Auditorias", href: "#", icon: <AuditoriasIcon className="h-6 w-6 text-gray-400" />, roles: ["master"] },
    {
      id: 13,
      name: "Ventas",
      href: "#",
      icon: <BsBarChart className="h-6 w-6 text-gray-400" />,
      roles: ["master", "hasAccessLevantamiento"],
      subMenu: [
        {
          id: 1,
          name: "Prospectos",
          href: "/ventas/prospectos",
          icon: <TfiTarget className="h-6 w-6 text-gray-400" />,
          roles: ["master", "hasAccessLevantamiento"],
        },
        {
          id: 2,
          name: "Levantamiento",
          href: "/ventas/levantamiento_requerimientos",
          icon: <ClipboardList className="h-6 w-6 text-gray-400" />,
          roles: ["master", "hasAccessLevantamiento"],
        },
      ],
    },
    //{ id: 14, name: "Contabilidad", href: "#", icon: <ContabilidadIcon className="h-6 w-6 text-gray-400" />, roles: ["master"] },
    //{ id: "cursos", name: "Cursos", href: "#", roles: ["master"]},
    //{ id: 16, name: "Capacitaciones", href: "#", icon: <CapacitacionesIcon className="h-6 w-6 text-gray-400" />, roles: ["master"] },
    {
      id: "configuraciones",
      name: "Configuraciones",
      href: "#",
      roles: ["master", "hasAccessCMDProductos"],
    },
    {
      id: 18,
      name: "CMD",
      href: "#",
      icon: <LuSquareTerminal className="h-6 w-6 text-gray-400" />,
      roles: ["master", "hasAccessCMDProductos"],
      subMenu: [
        {
          id: 1,
          name: "CMD Productos",
          href: "/configuraciones/cmd/Productos",
          icon: <ShoppingBasket className="h-6 w-6 text-gray-400" />,
          roles: ["master", "hasAccessCMDProductos"],
        },
        {
          id: 2,
          name: "CMD Proveedores",
          href: "/configuraciones/cmd/proveedores",
          icon: <PackageOpen className="h-6 w-6 text-gray-400" />,
          roles: ["master", "hasAccessCMDProductos"],
        },
        {
          id: 3,
          name: "CMD Actores",
          href: "/configuraciones/cmd/actores",
          icon: <Users className="h-6 w-6 text-gray-400" />,
          roles: ["master", "hasAccessCMDProductos"],
        },
      ],
    },
  ];

  const filteredCategories = categories.filter((category) => {
    const lowerSearch = searchTerm.toLowerCase();

    const matchesCategory = category.name.toLowerCase().includes(lowerSearch);

    const matchesSubMenu = category.subMenu?.some((item) =>
      item.name.toLowerCase().includes(lowerSearch)
    );

    return matchesCategory || matchesSubMenu;
  });

  const hasAccess = (category) => {
    if (category.includes("*")) return true;
    if (isMaster && category.includes("master")) return true;
    if (isDadoDeBaja && category.includes("baja")) return true;
    if (isAdminMkt && category.includes("adminMkt")) return true;
    if (isStandardMkt && category.includes("standardMkt")) return true;
    if (isStandard && category.includes("standard")) return true;
    if (isAdminGC && category.includes("adminGC")) return true;
    if (isITMember && category.includes("itMember")) return true;
    if (hasAccessPapeletas && category.includes("hasAccessPapeletas"))
      return true;
    if (
      hasAccessPapeletasEnviadas &&
      category.includes("hasAccessPapeletasEnviadas")
    )
      return true;
    if (
      hasAccessAutorizarPapeletas &&
      category.includes("hasAccessAutorizarPapeletas")
    )
      return true;
    if (hasAccessSolicitudes && category.includes("hasAccessSolicitudes"))
      return true;
    if (hasAllAccessVacantes && category.includes("hasAllAccessVacantes"))
      return true;
    if (hasAccessVacantes && category.includes("hasAccessVacantes"))
      return true;
    if (hasAccessCMDProductos && category.includes("hasAccessCMDProductos"))
      return true;
    if (hasAccessLevantamiento && category.includes("hasAccessLevantamiento"))
      return true;

    return false;
  };

  const hasSubMenuAccess = (subMenu) => {
    return subMenu.some((item) => hasAccess(item.roles || []));
  };

  return (
    <div className="flex flex-col w-64 h-screen min-h-screen bg-gray-800 text-white">
      <div
        style={{ borderBottomWidth: "2px", marginRight: "6px" }}
        className="flex items-center justify-between h-16 border-gray-700 px-4"
      >
        <div style={{ color: "white" }} className="flex items-center">
          <LuCircleUserRound className="h-10 w-10 ml-3 mr-4" />
          <span style={{ textAlign: "center" }} className="font-medium">
            {user.nombre} <br /> {user.apellidos}
          </span>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto no-scrollbar">
        <div className="relative mb-4">
          <SearchIcon className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Buscar..."
            className="w-full pl-12 pr-4 py-2 bg-gray-700 rounded-md text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <nav>
          {filteredCategories.map((category) => {
            if (!hasAccess(category.roles || [])) return null;
            return (
              <div key={category.id} className="group">
                {/* Secciones principales con IDs específicos */}
                {[
                  "principal",
                  "departamentos",
                  "cursos",
                  "configuraciones",
                ].includes(category.id) ? (
                  <div
                    className="text-gray-400 cursor-pointer flex items-center justify-between py-2"
                    onClick={() => toggleSection(category.id)}
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      textDecoration: "underline",
                    }}
                  >
                    {category.name}
                  </div>
                ) : (
                  <div>
                    {/* Menú principal */}
                    <div
                      className="flex items-center justify-between cursor-pointer py-2 px-4 hover:bg-gray-700"
                      onClick={() => toggleSection(category.id)}
                      style={{ color: "white" }}
                    >
                      <div className="flex items-center">
                        {category.icon}
                        <Link href={category.href} className="ml-2">
                          {category.name}
                        </Link>
                      </div>
                      {category.subMenu &&
                        hasSubMenuAccess(category.subMenu) && (
                          <span className="text-gray-400">
                            {openSections[category.id] ? "-" : "+"}
                          </span>
                        )}
                    </div>

                    {/* Submenús dinámicos */}
                    {openSections[category.id] && category.subMenu && (
                      <div className="pl-8">
                        {category.subMenu.map((subItem) => {
                          if (!hasAccess(subItem.roles || [])) return null;
                          return (
                            <div key={subItem.id}>
                              <div
                                className="flex items-center justify-between cursor-pointer py-2 px-4 hover:bg-gray-600"
                                onClick={() => toggleSection(subItem.id)}
                                style={{ color: "white" }}
                              >
                                <div className="flex items-center">
                                  {subItem.icon}
                                  <Link href={subItem.href} className="ml-2">
                                    {subItem.name}
                                  </Link>
                                </div>
                                {subItem.subMenu && (
                                  <span className="text-gray-400">
                                    {openSections[subItem.id] ? "-" : "+"}
                                  </span>
                                )}
                              </div>

                              {/* Segundo nivel de submenús */}
                              {openSections[subItem.id] && subItem.subMenu && (
                                <div className="pl-8">
                                  {subItem.subMenu.map((nestedItem) => (
                                    <Link
                                      key={nestedItem.id}
                                      href={nestedItem.href}
                                      className="block py-2 px-4 hover:bg-gray-500 flex items-center"
                                      style={{ color: "white" }}
                                    >
                                      <div style={{ marginRight: "10px" }}>
                                        {nestedItem.icon}
                                      </div>
                                      {nestedItem.name}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <div
        style={{ borderTopWidth: "2px", marginRight: "6px" }}
        className="mt-auto p-4 border-gray-700"
      >
        <Button
          onClick={() =>
            signOut({ callbackUrl: "https://aionnet.vercel.app/" })
          }
          className="w-full"
          style={{ color: "black", background: "white" }}
        >
          Cerrar sesión
          <LogOutIcon
            style={{ marginLeft: "0.5rem" }}
            className="h-4 w-4 text-gray-400"
          />
        </Button>
      </div>
    </div>
  );
}

function LogOutIcon(props) {
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
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
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
