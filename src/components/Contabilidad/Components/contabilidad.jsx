"use client"
import { useSession,  signOut } from "next-auth/react";
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import styles from '../../../../public/CSS/spinner.css';

export function Contabilidad() {
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

  const contabilidad = "contabilidad";

  return (
    (<div className="w-full max-w-4xl mx-auto py-12 px-4 md:px-6">
      <Link href={`/explorador_archivos?id=${contabilidad}`}>
        <Button variant="outline" size="sm" className="fixed h-9 gap-2 right-4 top-10 bg-blue-500 text-white p-2 rounded-lg shadow-lg">
          <div className="h-3.5 w-3.5" />
          <FolderIcon className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Explorador de archivos</span>
        </Button>
      </Link>
      <div className="grid gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Módulo de Contabilidad</h1>
          <p className="mt-4 text-muted-foreground">
            El departamento de contabilidad es responsable de registrar, procesar y analizar la información financiera
            de la empresa. Sus principales funciones incluyen:
          </p>
        </div>
        <div className="space-y-6">
          <div className="p-6 bg-muted rounded-lg">
            <h2 className="text-xl font-semibold">Registro de Transacciones</h2>
            <p className="mt-2 text-muted-foreground">
              El equipo de contabilidad se encarga de registrar todas las transacciones comerciales, como ventas,
              compras, pagos y cobros. Esto implica mantener un registro preciso de la actividad financiera de la
              empresa.
            </p>
          </div>
          <div className="p-6 bg-muted rounded-lg">
            <h2 className="text-xl font-semibold">Preparación de Estados Financieros</h2>
            <p className="mt-2 text-muted-foreground">
              A partir de los registros contables, el departamento prepara los estados financieros clave, como el
              balance general, el estado de resultados y el estado de flujos de efectivo. Estos informes proporcionan
              una imagen completa de la situación financiera de la empresa.
            </p>
          </div>
          <div className="p-6 bg-muted rounded-lg">
            <h2 className="text-xl font-semibold">Análisis de Costos</h2>
            <p className="mt-2 text-muted-foreground">
              El equipo de contabilidad realiza un análisis detallado de los costos de la empresa, incluyendo los costos
              de producción, gastos operativos y otros gastos. Esto ayuda a la gerencia a tomar decisiones informadas
              sobre la asignación de recursos y la optimización de los costos.
            </p>
          </div>
          <div className="p-6 bg-muted rounded-lg">
            <h2 className="text-xl font-semibold">Gestión Tributaria</h2>
            <p className="mt-2 text-muted-foreground">
              El departamento de contabilidad es responsable de asegurar el cumplimiento fiscal de la empresa, lo que
              incluye la preparación y presentación de declaraciones de impuestos, así como el cálculo y pago de los
              impuestos correspondientes.
            </p>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Informes y Métricas Clave</h2>
          <p className="mt-2 text-muted-foreground">
            El departamento de contabilidad genera una variedad de informes y métricas que ayudan a la gerencia a tomar
            decisiones informadas. Algunos de los informes y métricas más importantes incluyen:
          </p>
          <div className="mt-4 space-y-2 list-disc pl-6 bg-muted p-6 rounded-lg">
            <div>Balance General</div>
            <div>Estado de Resultados</div>
            <div>Estado de Flujos de Efectivo</div>
            <div>Análisis de Rentabilidad</div>
            <div>Ratios Financieros Clave</div>
            <div>Presupuestos y Proyecciones</div>
            <div>Informes de Auditoría</div>
          </div>
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