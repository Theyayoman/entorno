"use client"

import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useSession,  signOut } from "next-auth/react";
import styles from '../../../../public/CSS/spinner.css';
import {useUser} from "@/pages/api/hooks";
import { useRouter } from 'next/router';
export function Principal() {
  const { user, isLoading, isMaster } = useUser();
  const [currentIndex, setCurrentIndex] = useState(0)
  const images = [
    {
      src: "/certificacion.jpg?height=400&width=800",
      title: "Certificación",
      description: "Certificaciones constantes para mejor desempeño de las áreas",
    },
    {
      src: "/brigada.jpg?height=400&width=800",
      title: "Brigada de primeros auxilios",
      description: "Actividades extracurriculares para el personal",
    },
    {
      src: "/estandar.jpg?height=400&width=800",
      title: "Estándar de trabajo",
      description: "Mejora en nuestras actividades diarias como colaboradores",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [images.length])

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

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

  return (
    <main className="grid flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div>
          <section>
          <div className="relative w-full mx-auto"> 
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)`, height: "550px" }}>
          {images.map((image, index) => (
            <div key={index} className="shrink-0 w-full relative" style={{ height: "550px" }}>
              <img
                src={image.src}
                alt={image.title}
                className="w-full h-full object-cover"
                style={{ height: "550px", objectFit: "cover" }} />
              {/* Texto centrado */}
              <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/50 p-4">
                <h3 className="text-white text-4xl font-bold text-center" style={{ textShadow: "2px 2px 5px black", color: "white" }}>
                  {image.title}
                </h3>
                <p className="text-white text-lg text-center mt-2" style={{ textShadow: "2px 2px 5px black", color: "white" }}>
                  {image.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute inset-y-1/2 left-4 -translate-y-1/2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevious}
          className="rounded-full bg-white/50 hover:bg-white">
          <ChevronLeftIcon className="w-6 h-6" />
          <span className="sr-only">Previous</span>
        </Button>
      </div>
      <div className="absolute inset-y-1/2 right-4 -translate-y-1/2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNext}
          className="rounded-full bg-white/50 hover:bg-white">
          <ChevronRightIcon className="w-6 h-6" />
          <span className="sr-only">Next</span>
        </Button>
      </div>
    </div>
          </section>
        
          <section hidden>
            <Card>
              <CardHeader>
                <CardTitle>Cursos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex items-start gap-4">
                    <img
                      src="/placeholder.svg"
                      width="100"
                      height="100"
                      alt="Product Image"
                      className="aspect-square overflow-hidden rounded-lg object-cover object-center" />
                    <div className="grid gap-1">
                      <h3 className="text-lg font-medium">Certificaciones</h3>
                      <p className="text-muted-foreground">
                       Mejora continua con cursos adecuados
                      </p>
                      <Link href="#" className="text-primary" prefetch={false}>
                        Ver más
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <img
                      src="/placeholder.svg"
                      width="100"
                      height="100"
                      alt="Event Image"
                      className="aspect-square overflow-hidden rounded-lg object-cover object-center" />
                    <div className="grid gap-1">
                      <h3 className="text-lg font-medium">Eventos próximos</h3>
                      <p className="text-muted-foreground">
                        Conoce más de nuestros próximos eventos de mejora continua
                      </p>
                      <Link href="#" className="text-primary" prefetch={false}>
                        Ingresa
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <img
                      src="/placeholder.svg"
                      width="100"
                      height="100"
                      alt="Announcement Image"
                      className="aspect-square overflow-hidden rounded-lg object-cover object-center" />
                    <div className="grid gap-1">
                      <h3 className="text-lg font-medium">Más sobre nuestros valores</h3>
                      <p className="text-muted-foreground">
                        Lo hacemos posible 
                      </p>
                      <Link href="#" className="text-primary" prefetch={false}>
                        Ver más
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
          <section className="mt-2">
            <Card>
              <CardHeader>
                <CardTitle>Nuestros departamentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Gente y Cultura</h3>
                      <UsersIcon className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">
                      Equipo de RH que brinda apoyo a cada uno de nuestros empleados.
                    </p>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Ingeniería de nuevo producto</h3>
                      <ActivityIcon className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">
                    Implementación de nuevo producto.
                    </p>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Marketing</h3>
                      <MegaphoneIcon className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">
                      La imagen de la empresa.
                    </p>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4" hidden>
                    <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Operaciones</h3>
                      <DollarSignIcon className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">
                      Llevamos las finanzas de cada razón social.
                    </p>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">TI</h3>
                      <ServerIcon className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">
                      Departamento centrado para soporte a usuario y brindar asistencia.
                    </p>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Ventas</h3>
                      <BriefcaseIcon className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">
                      Prospectar con clientes para venta.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
          </div>
        </main>
  );
}

function ActivityIcon(props) {
  return (
    (<svg
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
      <path
        d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
    </svg>)
  );
}


function BriefcaseIcon(props) {
  return (
    (<svg
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
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <rect width="20" height="14" x="2" y="6" rx="2" />
    </svg>)
  );
}


function DollarSignIcon(props) {
  return (
    (<svg
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
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>)
  );
}


function FileTextIcon(props) {
  return (
    (<svg
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
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>)
  );
}


function MegaphoneIcon(props) {
  return (
    (<svg
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
      <path d="m3 11 18-5v12L3 14v-3z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>)
  );
}


function ServerIcon(props) {
  return (
    (<svg
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
      <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
      <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
      <line x1="6" x2="6.01" y1="6" y2="6" />
      <line x1="6" x2="6.01" y1="18" y2="18" />
    </svg>)
  );
}


function UserIcon(props) {
  return (
    (<svg
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
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>)
  );
}


function UsersIcon(props) {
  return (
    (<svg
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>)
  );
}


function XIcon(props) {
  return (
    (<svg
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>)
  );
}
function PowerIcon(props) {
  return (
    (<svg
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
      <path d="M12 2v10" />
      <path d="M18.4 6.6a9 9 0 1 1-12.77.04" />
    </svg>)
  );
}

function ChevronLeftIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function Spinner() {
  return (
    <div className="spinner" />
  );
}