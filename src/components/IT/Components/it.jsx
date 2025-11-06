"use client"
import { useSession,  signOut } from "next-auth/react";
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import styles from '../../../../public/CSS/spinner.css';

export function It() {
  const [openSection, setOpenSection] = useState(null)
  
  const {data: session,status}=useSession ();
  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section)
  }
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className={styles.spinner} />
        <p className="ml-3">Cargando...</p>
      </div>
    );
  }
  if (status=="loading") {
    return <p>cargando...</p>;
  }
  if (!session || !session.user) {
    return (
      window.location.href = "/",
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className={styles.spinner} />
        <p className="ml-3">No has iniciado sesión</p>
      </div>
    );
  }

  const it = "it";

  return (
    (<div className="relative w-full max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <Link href={`/explorador_archivos?id=${it}`}>
        <Button variant="outline" size="sm" className="fixed h-9 gap-2 right-4 top-10 bg-blue-500 text-white p-2 rounded-lg shadow-lg">
          <div className="h-3.5 w-3.5" />
          <FolderIcon className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Explorador de archivos</span>
        </Button>
      </Link>
      <h1 className="text-4xl font-bold mb-8">Roles y Responsabilidades en un Equipo de TI</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Desarrollo de Software</h2>
          <p className="text-muted-foreground mb-4">
            El equipo de desarrollo de software es responsable de diseñar, codificar, probar y mantener las aplicaciones
            y sistemas que utilizan los usuarios de la organización. Esto incluye tareas como análisis de requisitos,
            diseño de arquitectura, programación, pruebas unitarias y de integración, y despliegue en producción.
          </p>
          <img
            src="/placeholder.svg"
            width={600}
            height={400}
            alt="Software Development"
            className="rounded-lg"
            style={{ aspectRatio: "600/400", objectFit: "cover" }} />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Administración de Sistemas</h2>
          <p className="text-muted-foreground mb-4">
            El equipo de administración de sistemas es responsable de mantener la infraestructura tecnológica de la
            organización, incluyendo servidores, redes, almacenamiento y sistemas operativos. Esto incluye tareas como
            instalación, configuración, monitoreo, respaldo y recuperación de datos, y resolución de problemas.
          </p>
          <img
            src="/placeholder.svg"
            width={600}
            height={400}
            alt="System Administration"
            className="rounded-lg"
            style={{ aspectRatio: "600/400", objectFit: "cover" }} />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Seguridad Informática</h2>
          <p className="text-muted-foreground mb-4">
            El equipo de seguridad informática es responsable de proteger los sistemas y datos de la organización contra
            amenazas como malware, ataques cibernéticos y accesos no autorizados. Esto incluye tareas como
            implementación de firewalls, gestión de identidades y accesos, análisis de vulnerabilidades, y respuesta a
            incidentes de seguridad.
          </p>
          <img
            src="/placeholder.svg"
            width={600}
            height={400}
            alt="Cybersecurity"
            className="rounded-lg"
            style={{ aspectRatio: "600/400", objectFit: "cover" }} />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Soporte Técnico</h2>
          <p className="text-muted-foreground mb-4">
            El equipo de soporte técnico es responsable de asistir a los usuarios finales con problemas o consultas
            relacionadas con la tecnología. Esto incluye tareas como resolución de problemas de hardware y software,
            instalación y configuración de equipos, y capacitación a los usuarios.
          </p>
          <img
            src="/placeholder.svg"
            width={600}
            height={400}
            alt="Technical Support"
            className="rounded-lg"
            style={{ aspectRatio: "600/400", objectFit: "cover" }} />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Proyectos de Transformación Digital</h2>
          <p className="text-muted-foreground mb-4">
            El equipo de proyectos de transformación digital es responsable de liderar iniciativas que buscan mejorar
            los procesos y servicios de la organización mediante el uso de tecnología. Esto incluye tareas como análisis
            de procesos, diseño de soluciones, gestión de cambio y medición de resultados.
          </p>
          <img
            src="/placeholder.svg"
            width={600}
            height={400}
            alt="Digital Transformation"
            className="rounded-lg"
            style={{ aspectRatio: "600/400", objectFit: "cover" }} />
        </div>
      </div>
    </div>)
  );
}

function FolderIcon(props) {
  return(
    <svg
      className="h-4 w-4 text-gray-600"
      fill="none"
      stroke="black"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V8l-6-4z"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <div className="spinner" />
  );
}