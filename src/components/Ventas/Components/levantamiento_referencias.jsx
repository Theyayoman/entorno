"use client";

import { useState, useEffect, useRef } from "react";
import styles from "../../../../public/CSS/spinner.css";
import { useSession } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { getSession } from "next-auth/react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

export function LevantamientoReferencias(props) {
  const { id, emitUpdate } = props;
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const idLevantamiento = searchParams.get("id") || id;
  const [referencias, setReferencias] = useState([
    { id: "", nombre: "", link: "", notas: "", tipo: "", imagenes: [] },
  ]);

  useEffect(() => {
    const fetchReferencias = async () => {
      try {
        const response = await axios.get(
          `/api/Sales/getReferencias?id=${idLevantamiento}`
        );

        if (response.data.success && Array.isArray(response.data.referencias)) {
          const referenciasConImagenes = response.data.referencias.map(
            (ref) => {
              const imagenes = [ref.img1, ref.img2, ref.img3, ref.img4]
                .filter(Boolean)
                .map((img) => ({
                  id: crypto.randomUUID(), // ID único por imagen
                  file: img,
                }));

              return {
                id: ref.id || "",
                nombre: ref.nombre || "",
                link: ref.link || "",
                notas: ref.notas || "",
                tipo: ref.tipo || "",
                imagenes,
              };
            }
          );

          setReferencias(referenciasConImagenes);
        } else {
          // Si no hay referencias, puedes inicializar con una vacía (opcional)
          setReferencias([
            {
              id: "",
              nombre: "",
              link: "",
              notas: "",
              tipo: "",
              imagenes: [],
            },
          ]);
        }
      } catch (error) {
        console.error("Error al hacer fetch de las referencias:", error);
      }
    };

    fetchReferencias();
  }, []);

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

  const agregarReferencia = () => {
    setReferencias((prev) => [
      ...prev,
      { id: "", nombre: "", link: "", notas: "", tipo: "", imagenes: [] },
    ]);
  };

  const eliminarReferencia = (index) => {
    setReferencias((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (index, campo, valor) => {
    setReferencias((prev) => {
      const copia = [...prev];
      copia[index][campo] = valor;
      return copia;
    });
  };

  const handleImages = (index, files) => {
    const archivos = Array.from(files);
    const extensionesValidas = ["image/jpeg", "image/png"];
    const maxTamano = 4 * 1024 * 1024; // 4MB

    const archivosInvalidos = archivos.filter(
      (file) => !extensionesValidas.includes(file.type)
    );

    const archivosGrandes = archivos.filter((file) => file.size > maxTamano);

    if (archivosInvalidos.length > 0) {
      Swal.fire({
        title: "Archivo no permitido",
        text: "Solo se permiten imágenes en formato JPG o PNG.",
        icon: "error",
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }

    if (archivosGrandes.length > 0) {
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
      const actuales = copia[index].imagenes || [];

      const nuevasNoRepetidas = archivos.filter(
        (newFile) =>
          !actuales.some(
            (img) =>
              img.file?.name === newFile.name && img.file?.size === newFile.size
          )
      );

      const archivosConId = nuevasNoRepetidas.map((file) => ({
        id: crypto.randomUUID(),
        file,
      }));

      if (actuales.length + archivosConId.length > 4) {
        Swal.fire({
          title: "Límite alcanzado",
          text: "Solo puedes subir un máximo de 4 imágenes por referencia.",
          icon: "warning",
          timer: 3000,
          showConfirmButton: false,
        });
        return prev;
      }

      copia[index].imagenes = [...actuales, ...archivosConId];
      return copia;
    });
  };

  const eliminarImagen = (refIndex, imagenId) => {
    setReferencias((prev) => {
      const copia = [...prev];
      copia[refIndex].imagenes = copia[refIndex].imagenes.filter(
        (img) => img.id !== imagenId
      );
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
        formData.append(`referencias[${i}][link]`, ref.link);
        formData.append(`referencias[${i}][notas]`, ref.notas);
        formData.append(`referencias[${i}][tipo]`, ref.tipo);

        ref.imagenes?.forEach((img, j) => {
          if (typeof img.file === "string") {
            formData.append(
              `referencias[${i}][imagenesExistentes][${j}]`,
              img.file
            );
          } else {
            formData.append(`referencias[${i}][imagenes][${j}]`, img.file);
          }
        });
      });

      const res = await fetch("/api/Sales/guardarReferencias", {
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
          text: "Se han creado correctamente",
          icon: "success",
          timer: 3000,
          showConfirmButton: false,
        }).then(() => {
          emitUpdate();
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Error al crear el producto",
          icon: "error",
          timer: 3000,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error("Error en el registro:", err);
      setError(
        "Hubo un problema con el registro. Por favor, intenta nuevamente."
      );
      Swal.close();
      Swal.fire({
        title: "Error",
        text: "Hubo un problema con el registro",
        icon: "error",
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };

  const formularioCompleto = () => {
    return referencias.every((ref) => ref.nombre.trim() !== "");
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-center items-center text-center mb-8">
        <CardTitle className="text-3xl font-bold">Referencias</CardTitle>
      </div>
      <div className="flex justify-center mb-4">
        <form
          onSubmit={handleSubmit}
          className="w-[1400px] border border-gray-300 rounded-lg shadow-md p-6 bg-white"
        >
          {referencias.map((ref, index) => (
            <div key={index} className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 style={{ fontSize: "20px", fontWeight: "600" }}>
                  Referencia #{index + 1}
                </h2>
                {index > 0 && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => eliminarReferencia(index)}
                  >
                    Eliminar
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor={`tipo-${index}`}>Tipo</Label>
                  <RadioGroup
                    id={`tipo-${index}`}
                    value={ref.tipo.toString() || ""}
                    onValueChange={(value) =>
                      handleChange(index, "tipo", value)
                    }
                    className="flex space-x-8"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" id={`igualar-${index}`} />
                      <Label htmlFor={`igualar-${index}`}>Igualar a</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2" id={`competencia-${index}`} />
                      <Label htmlFor={`competencia-${index}`}>
                        Competencia directa
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
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
                  <Label htmlFor="link">Enlace</Label>
                  <Input
                    id="link"
                    name="link"
                    value={ref.link || ""}
                    onChange={(e) =>
                      handleChange(index, "link", e.target.value)
                    }
                    placeholder="..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="notas">Notas</Label>
                  <Textarea
                    id="notas"
                    name="notas"
                    value={ref.notas || ""}
                    onChange={(e) =>
                      handleChange(index, "notas", e.target.value)
                    }
                    placeholder="..."
                  />
                </div>
              </div>

              <div
                style={{ marginBottom: "15px" }}
                className="space-y-2 col-span-2"
              >
                <Label htmlFor="imagenes">Imágenes</Label>
                <div className="flex flex-col space-y-2">
                  <input
                    id={`imagenes-${index}`}
                    name={`imagenes-${index}`}
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => handleImages(index, e.target.files)}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById(`imagenes-${index}`).click()
                    }
                    className="w-full"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Subir archivo (JPG, PNG) Max: 4MB y 4 imágenes
                  </Button>

                  {/* Vista previa de archivos seleccionados */}
                  {ref.imagenes.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                      {ref.imagenes.map((img, i) => (
                        <div key={img.id} className="relative">
                          <img
                            src={
                              img.file instanceof File
                                ? URL.createObjectURL(img.file)
                                : `/api/Sales/obtenerImagenesReferencias?rutaImagen=${encodeURIComponent(
                                    img.file
                                  )}`
                            }
                            alt={`Imagen ${i + 1}`}
                            className="w-full max-h-[20vh] rounded-lg"
                            style={{ objectFit: "contain" }}
                          />
                          <button
                            type="button"
                            onClick={() => eliminarImagen(index, img.id)}
                            className="absolute top-0 right-0 bg-red-500 text-white p-1 text-xs rounded"
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <Button onClick={agregarReferencia} type="button" className="mb-4">
            + Añadir referencia
          </Button>
          <Button
            type="submit"
            className="w-full mt-4"
            disabled={!formularioCompleto() || referencias.length === 0}
          >
            Guardar referencias
          </Button>
        </form>
      </div>
    </div>
  );
}

function Spinner() {
  return <div className="spinner" />;
}
