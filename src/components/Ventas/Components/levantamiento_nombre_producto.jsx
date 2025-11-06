"use client";

import { useState, useEffect, useRef } from "react";
import styles from "../../../../public/CSS/spinner.css";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { CornerDownLeft, Upload } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RiResetLeftLine } from "react-icons/ri";

export function LevantamientoProducto(props) {
  const { id, emitUpdate } = props;
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const idLevantamiento = searchParams.get("id") || id;
  const [referencias, setReferencias] = useState([
    {
      id: "",
      nombre: "",
      estatus_nombre: "",
      comentarios_nombre: "",
      logo: null,
      estatus_logo: "",
      comentarios_logo: "",
    },
    {
      id: "",
      nombre: "",
      estatus_nombre: "",
      comentarios_nombre: "",
      logo: null,
      estatus_logo: "",
      comentarios_logo: "",
    },
    {
      id: "",
      nombre: "",
      estatus_nombre: "",
      comentarios_nombre: "",
      logo: null,
      estatus_logo: "",
      comentarios_logo: "",
    },
  ]);
  const [editar, setEditar] = useState(false);

  useEffect(() => {
    const fetchReferencias = async () => {
      try {
        const response = await axios.get(
          `/api/Sales/getNombreProducto?id=${idLevantamiento}`
        );
        if (
          response.data.success &&
          Array.isArray(response.data.referencias) &&
          response.data.referencias.length > 0
        ) {
          setReferencias(response.data.referencias);
          setEditar(true);
        }
      } catch (error) {
        console.error("Error al obtener las referencias:", error);
      }
    };

    fetchReferencias();
  }, [idLevantamiento]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className={styles.spinner} />
        <p className="ml-3">Cargando...</p>
      </div>
    );
  }

  if (status == "loading") {
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

  const handleChange = (index, campo, valor) => {
    setReferencias((prev) => {
      const copia = [...prev];
      copia[index][campo] = valor;
      return copia;
    });
  };

  const handleLogo = (index, file) => {
    const extensionesValidas = ["image/jpeg", "image/png"];
    const maxTamano = 4 * 1024 * 1024; // 4MB

    if (!file) return;

    if (!extensionesValidas.includes(file.type)) {
      Swal.fire({
        title: "Archivo no permitido",
        text: "Solo se permiten imágenes en formato JPG o PNG.",
        icon: "error",
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }

    if (file.size > maxTamano) {
      Swal.fire({
        title: "Archivo muy grande",
        text: "El archivo es demasiado grande. Máximo 4MB.",
        icon: "error",
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }

    setReferencias((prev) => {
      const copia = [...prev];
      copia[index].logo = file;
      return copia;
    });
  };

  const eliminarLogo = (index) => {
    setReferencias((prev) => {
      const copia = [...prev];
      copia[index].logo = null;
      return copia;
    });
  };

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

    try {
      const formData = new FormData();

      formData.append("idLevantamiento", idLevantamiento);

      referencias.forEach((ref, i) => {
        formData.append(`referencias[${i}][id]`, ref.id);
        formData.append(`referencias[${i}][nombre]`, ref.nombre);
        formData.append(
          `referencias[${i}][comentarios_nombre]`,
          ref.comentarios_nombre
        );
        formData.append(
          `referencias[${i}][comentarios_logo]`,
          ref.comentarios_logo
        );

        if (ref.estatus_nombre != null && ref.estatus_nombre !== "") {
          formData.append(
            `referencias[${i}][estatus_nombre]`,
            ref.estatus_nombre
          );
        }
        if (ref.estatus_logo != null && ref.estatus_logo !== "") {
          formData.append(`referencias[${i}][estatus_logo]`, ref.estatus_logo);
        }

        if (typeof ref.logo === "string") {
          formData.append(`referencias[${i}][logoExistente]`, ref.logo);
        } else if (ref.logo instanceof File) {
          formData.append(`referencias[${i}][logo]`, ref.logo);
        }
      });

      const res = await fetch("/api/Sales/guardarNombreProducto", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      Swal.close();

      if (!res.ok) {
        setError(data.message);
        Swal.fire({
          title: "Error",
          text: data.message,
          icon: "error",
          timer: 3000,
          showConfirmButton: false,
        });
        return;
      }

      if (res.ok) {
        Swal.fire({
          title: "Éxito",
          text: "Las propuestas se han guardado correctamente",
          icon: "success",
          timer: 3000,
          showConfirmButton: false,
        }).then(() => {
          emitUpdate();
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Error al guardar las propuestas",
          icon: "error",
          timer: 3000,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error("Error en el guardado de las propuestas:", err);
      Swal.close();
      Swal.fire({
        title: "Error",
        text: "Hubo un problema con el guardado de las propuestas",
        icon: "error",
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };

  const nuevasPropuestas = () => {
    setReferencias([
      {
        id: "",
        nombre: "",
        estatus_nombre: "",
        comentarios_nombre: "",
        logo: null,
        estatus_logo: "",
        comentarios_logo: "",
      },
      {
        id: "",
        nombre: "",
        estatus_nombre: "",
        comentarios_nombre: "",
        logo: null,
        estatus_logo: "",
        comentarios_logo: "",
      },
      {
        id: "",
        nombre: "",
        estatus_nombre: "",
        comentarios_nombre: "",
        logo: null,
        estatus_logo: "",
        comentarios_logo: "",
      },
    ]);
    setEditar(false);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-end items-center mb-4">
        {editar ? (
          <Button onClick={nuevasPropuestas}>
            <RiResetLeftLine className="h-4 w-4" />
            Nuevas propuestas
          </Button>
        ) : null}
      </div>
      {editar ? (
        <div className="flex justify-center mb-4">
          <form
            onSubmit={handleSubmit}
            className="w-full border border-gray-300 rounded-lg shadow-md p-6 bg-white"
          >
            {referencias.map((ref, index) => (
              <div key={index} className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h2 style={{ fontSize: "20px", fontWeight: "600" }}>
                    Propuesta nombre #{index + 1}
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      id="nombre"
                      name="nombre"
                      value={ref.nombre || ""}
                      onChange={(e) =>
                        handleChange(index, "nombre", e.target.value)
                      }
                      placeholder="..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estatus_nombre">Estatus</Label>
                    <Select
                      value={ref.estatus_nombre?.toString() || ""}
                      onValueChange={(e) =>
                        handleChange(index, "estatus_nombre", e)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estatus" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Rechazado</SelectItem>
                        <SelectItem value="2">Pendiente</SelectItem>
                        <SelectItem value="3">Aprobado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="comentarios_nombre">Comentarios</Label>
                    <Textarea
                      id="comentarios_nombre"
                      name="comentarios_nombre"
                      value={ref.comentarios_nombre || ""}
                      onChange={(e) =>
                        handleChange(
                          index,
                          "comentarios_nombre",
                          e.target.value
                        )
                      }
                      placeholder="..."
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <h2 style={{ fontSize: "20px", fontWeight: "600" }}>
                    Propuesta logo #{index + 1}
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div className="space-y-2">
                    <Label htmlFor="logo">Logo</Label>
                    <div>
                      <input
                        id={`logo-${index}`}
                        name={`logo-${index}`}
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => handleLogo(index, e.target.files[0])}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          document.getElementById(`logo-${index}`).click()
                        }
                        className="w-full"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Subir archivo (JPG, PNG) Max: 4MB
                      </Button>

                      {/* Vista previa de la imagen seleccionada */}
                      {ref.logo && (
                        <div className="relative w-full mt-2">
                          <img
                            src={
                              ref.logo instanceof File
                                ? URL.createObjectURL(ref.logo)
                                : `/api/Sales/obtenerImagenesPropuestas?rutaImagen=${encodeURIComponent(
                                    ref.logo
                                  )}`
                            }
                            alt={`Logo ${index + 1}`}
                            className="w-full max-h-[20vh] rounded-lg object-contain"
                          />
                          <button
                            type="button"
                            onClick={() => eliminarLogo(index)}
                            className="absolute top-0 right-0 bg-red-500 text-white p-1 text-xs rounded"
                          >
                            X
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estatus_logo">Estatus</Label>
                    <Select
                      value={ref.estatus_logo?.toString() || ""}
                      onValueChange={(e) =>
                        handleChange(index, "estatus_logo", e)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estatus" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Rechazado</SelectItem>
                        <SelectItem value="2">Pendiente</SelectItem>
                        <SelectItem value="3">Aprobado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="comentarios_logo">Comentarios</Label>
                    <Textarea
                      id="comentarios_logo"
                      name="comentarios_logo"
                      value={ref.comentarios_logo || ""}
                      onChange={(e) =>
                        handleChange(index, "comentarios_logo", e.target.value)
                      }
                      placeholder="..."
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button type="submit" className="w-full mt-4">
              Guardar propuestas
            </Button>
          </form>
        </div>
      ) : (
        <div className="flex justify-center mb-4">
          <form
            onSubmit={handleSubmit}
            className="w-[1400px] border border-gray-300 rounded-lg shadow-md p-6 bg-white"
          >
            {referencias.map((ref, index) => (
              <div key={index} className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h2 style={{ fontSize: "20px", fontWeight: "600" }}>
                    Propuesta #{index + 1}
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      id="nombre"
                      name="nombre"
                      value={ref.nombre || ""}
                      onChange={(e) =>
                        handleChange(index, "nombre", e.target.value)
                      }
                      placeholder="..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="logo">Logo</Label>
                    <div>
                      <input
                        id={`logo-${index}`}
                        name={`logo-${index}`}
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => handleLogo(index, e.target.files[0])}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          document.getElementById(`logo-${index}`).click()
                        }
                        className="w-full"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Subir archivo (JPG, PNG) Max: 4MB
                      </Button>

                      {/* Vista previa de la imagen seleccionada */}
                      {ref.logo && (
                        <div className="relative w-full mt-2">
                          <img
                            src={
                              ref.logo instanceof File
                                ? URL.createObjectURL(ref.logo)
                                : `/api/Sales/obtenerImagenesPropuestas?rutaImagen=${encodeURIComponent(
                                    ref.logo
                                  )}`
                            }
                            alt={`Logo ${index + 1}`}
                            className="w-full max-h-[20vh] rounded-lg object-contain"
                          />
                          <button
                            type="button"
                            onClick={() => eliminarLogo(index)}
                            className="absolute top-0 right-0 bg-red-500 text-white p-1 text-xs rounded"
                          >
                            X
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <Button type="submit" className="w-full mt-4">
              Guardar propuestas
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return <div className="spinner" />;
}
