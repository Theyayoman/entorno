"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSession,  signOut } from "next-auth/react";
import styles from '../../../../public/CSS/spinner.css';

export function Cursos() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const courses = [
    {
      id: 1,
      image: "/placeholder.svg",
      title: "Introducción a la Programación",
      description: "Aprende los conceptos básicos de la programación.",
      category: "Programación",
    },
    {
      id: 2,
      image: "/placeholder.svg",
      title: "Diseño Web Responsivo",
      description: "Crea sitios web adaptables a diferentes dispositivos.",
      category: "Diseño",
    },
    {
      id: 3,
      image: "/placeholder.svg",
      title: "Análisis de Datos con Python",
      description: "Aprende a procesar y analizar datos utilizando Python.",
      category: "Datos",
    },
    {
      id: 4,
      image: "/placeholder.svg",
      title: "Desarrollo de Aplicaciones Móviles",
      description: "Crea aplicaciones para dispositivos móviles.",
      category: "Programación",
    },
    {
      id: 5,
      image: "/placeholder.svg",
      title: "Introducción al Marketing Digital",
      description: "Aprende estrategias efectivas de marketing en línea.",
      category: "Negocios",
    },
    {
      id: 6,
      image: "/placeholder.svg",
      title: "Fotografía Creativa",
      description: "Desarrolla tus habilidades fotográficas.",
      category: "Creatividad",
    },
  ]
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      if (selectedCategory === "all") {
        return course.title.toLowerCase().includes(searchTerm.toLowerCase());
      } else {
        return (course.category.toLowerCase() === selectedCategory.toLowerCase() && course.title.toLowerCase().includes(searchTerm.toLowerCase()));
      }
    });
  }, [searchTerm, selectedCategory])

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
    (<div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-full max-w-md">
          <div
            className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="w-5 h-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Buscar cursos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <span>Categoría</span>
              <ChevronDownIcon className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuCheckboxItem
              checked={selectedCategory === "all"}
              onCheckedChange={() => setSelectedCategory("all")}>
              Todos
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={selectedCategory === "Programaci\u00F3n"}
              onCheckedChange={() => setSelectedCategory("Programaci\u00F3n")}>
              Programación
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedCategory === "Dise\u00F1o"}
              onCheckedChange={() => setSelectedCategory("Dise\u00F1o")}>
              Diseño
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedCategory === "Datos"}
              onCheckedChange={() => setSelectedCategory("Datos")}>
              Datos
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedCategory === "Negocios"}
              onCheckedChange={() => setSelectedCategory("Negocios")}>
              Negocios
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedCategory === "Creatividad"}
              onCheckedChange={() => setSelectedCategory("Creatividad")}>
              Creatividad
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src="/placeholder.svg"
              alt={course.title}
              width={400}
              height={225}
              className="w-full h-48 object-cover"
              style={{ aspectRatio: "400/225", objectFit: "cover" }} />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <Link
                style={{ color: "white" }}
                href="#"
                className="inline-block bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                prefetch={false}>
                Ver más
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>)
  );
}

function ChevronDownIcon(props) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>)
  );
}


function SearchIcon(props) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>)
  );
}

function Spinner() {
  return (
    <div className="spinner" />
  );
}