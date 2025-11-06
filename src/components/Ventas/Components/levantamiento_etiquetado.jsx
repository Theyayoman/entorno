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
import {
  CornerDownLeft,
  SquareArrowOutUpRight,
  FileDown,
  FileCheck,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip } from "react-tippy";
import "react-tippy/dist/tippy.css";
import HelpIcon from "@mui/icons-material/Help";
import { BsFiletypeSvg, BsFiletypePdf } from "react-icons/bs";

export function LevantamientoEtiquetado(props) {
  const { id, emitUpdate } = props;
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const idLevantamiento = searchParams.get("id") || id;
  const [levantamiento, setLevantamiento] = useState(null);
  const [imagenSeleccionadaPreview, setImagenSeleccionadaPreview] =
    useState(null);
  const archivoSVGRef = useRef(null);
  const [nombreArchivo, setNombreArchivo] = useState("");

  useEffect(() => {
    const fetchLevantamiento = async () => {
      try {
        const response = await axios.get(
          `/api/Sales/getLevantamiento?id=${idLevantamiento}`
        );
        if (response.data.success) {
          setLevantamiento(response.data.levantamiento);
          fetchArchivo(response.data.levantamiento);
        } else {
          console.error(
            "Error al obtener el levantamiento:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Error al hacer fetch del levantamiento:", error);
      }
    };

    fetchLevantamiento();
  }, []);

  const fetchArchivo = async (levantamiento) => {
    const archivo = levantamiento?.codigo_barras;

    if (archivo) {
      const url = `/api/Sales/obtenerCodigoBarras?rutaImagen=${encodeURIComponent(
        archivo
      )}`;
      setImagenSeleccionadaPreview(url);
      setNombreArchivo(levantamiento?.codigo_barras.split("/").pop());
    }
  };

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
      const response = await axios.post("/api/Sales/guardarEtiquetado", {
        levantamiento,
        imagenSeleccionadaPreview,
      });

      Swal.close();

      if (!response.data.success) {
        Swal.fire({
          title: "Error",
          text: response.data.message,
          icon: "error",
          timer: 3000,
          showConfirmButton: false,
        });
        return;
      }

      if (response.data.success) {
        Swal.fire({
          title: "Éxito",
          text: "El etiquetado ha sido guardado correctamente",
          icon: "success",
          timer: 3000,
          showConfirmButton: false,
        }).then(() => {
          emitUpdate();
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Error al guardar el etiquetado",
          icon: "error",
          timer: 3000,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error("Error en el guardado del etiquetado:", err);
      Swal.close();
      Swal.fire({
        title: "Error",
        text: "Hubo un problema con el guardado del etiquetado",
        icon: "error",
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };

  const handleImagenSeleccionada = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Validar tipo archivo
    if (file.type !== "image/svg+xml" && !file.name.endsWith(".svg")) {
        Swal.fire({
            title: "Error",
            text: `El archivo "${file.name}" no tiene un formato permitido. Solo se permiten archivos SVG.`,
            icon: "error",
            timer: 3000,
            showConfirmButton: false,
        });
        if (archivoSVGRef.current) {
            archivoSVGRef.current.value = null;
        }
        return;
    }

    // Validar tamaño máximo (4MB)
    const maxSizeInBytes = 4 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      Swal.fire({
        title: "Error",
        text: `El archivo "${file.name}" es demasiado grande. Máximo 4MB.`,
        icon: "error",
        timer: 3000,
        showConfirmButton: false,
      });
      if (archivoSVGRef.current) {
        archivoSVGRef.current.value = null;
      }
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagenSeleccionadaPreview(reader.result); // Guardar base64
      setNombreArchivo(file.name);
    };
    reader.readAsDataURL(file);
  };

  const extension = nombreArchivo?.split(".").pop()?.toLowerCase();

  const getIconByExtension = (ext) => {
    switch (ext) {
      case "pdf":
        return (
          <BsFiletypePdf
            className="w-20 h-20 cursor-pointer"
            style={{ color: "red" }}
            role="button"
            onClick={() => abrirArchivo(imagenSeleccionadaPreview)}
            title="Abrir en nueva ventana"
          />
        );
      case "svg":
        return (
          <BsFiletypeSvg
            className="w-20 h-20 cursor-pointer"
            style={{ color: "rgb(31 41 55)" }}
            role="button"
            onClick={() => abrirArchivo(imagenSeleccionadaPreview)}
            title="Abrir en nueva ventana"
          />
        );
      default:
        return null;
    }
  };

  const abrirArchivo = (archivo) => {
    if (!archivo) return;

    // Caso 1: Subiendo el archivo
    if (archivo.startsWith("data:")) {
      const mimeMatch = archivo.match(/^data:(.*?);base64,/);
      if (!mimeMatch) return;

      const mimeType = mimeMatch[1];
      const base64Data = archivo.split(",")[1];

      const byteCharacters = atob(base64Data);
      const byteArray = new Uint8Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteArray[i] = byteCharacters.charCodeAt(i);
      }

      const blob = new Blob([byteArray], { type: mimeType });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
    }

    // Caso 2: Archivo ya existente en la BD
    else if (archivo.startsWith("http") || archivo.startsWith("/")) {
      window.open(archivo, "_blank");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-center mb-4">
        <form
          onSubmit={handleSubmit}
          className="w-full border border-gray-300 rounded-lg shadow-md p-6 bg-white"
        >
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="tipoEtiquetado">Tipo</Label>
              <Select
                onValueChange={(value) => {
                  setLevantamiento({
                    ...levantamiento,
                    etiqueta: value,
                    cofepris: "",
                    ecommerce: "",
                    codigo_barras: "",
                  });
                  setImagenSeleccionadaPreview(null);
                  if (archivoSVGRef.current) {
                    archivoSVGRef.current.value = null;
                  }
                  setNombreArchivo("");
                }}
                value={levantamiento?.etiqueta?.toString() || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un valor" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="1">Etiqueta consignada</SelectItem>
                  <SelectItem value="2">
                    Solicitud de servicio de diseño
                  </SelectItem>
                  <SelectItem value="3">Diseño consignado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="tipoCofepris">
                ¿Quiere que su producto cumpla con regulaciones COFEPRIS?
              </Label>
              <Select
                onValueChange={(value) => {
                  setLevantamiento({ ...levantamiento, cofepris: value });
                }}
                value={levantamiento?.cofepris?.toString() || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un valor" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="2">Sí</SelectItem>
                  <SelectItem value="1">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {levantamiento?.etiqueta?.toString() === "1" &&
          levantamiento?.cofepris ? (
            <div>
              <div
                style={{ backgroundColor: "rgb(31 41 55)" }}
                className="grid grid-cols-2 gap-4 mb-6"
              >
                <div className="space-y-2 col-span-2 text-center">
                  <Label style={{ fontSize: "20px", color: "white" }}>
                    Etiquetas consignadas
                  </Label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2 col-span-2 text-center">
                  <Button type="button">
                    <SquareArrowOutUpRight className="h-4 w-4" />
                    Ir al módulo de etiquetas consignadas
                  </Button>
                </div>
              </div>
            </div>
          ) : levantamiento?.etiqueta?.toString() === "2" &&
            levantamiento?.cofepris ? (
            <div>
              <div
                style={{ backgroundColor: "rgb(31 41 55)" }}
                className="grid grid-cols-2 gap-4 mb-6"
              >
                <div className="space-y-2 col-span-2 text-center">
                  <Label style={{ fontSize: "20px", color: "white" }}>
                    Diseño
                  </Label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="tipoEcommerce">
                    ¿Planea vender el producto vía e-commerce?
                  </Label>
                  <Select
                    onValueChange={(value) => {
                      setLevantamiento({
                        ...levantamiento,
                        ecommerce: value,
                        codigo_barras: "",
                      });
                      setImagenSeleccionadaPreview(null);
                      if (archivoSVGRef.current) {
                        archivoSVGRef.current.value = null;
                      }
                      setNombreArchivo("");
                    }}
                    value={levantamiento?.ecommerce?.toString() || ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un valor" />
                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="2">Sí</SelectItem>
                                        <SelectItem value="1">No</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        {levantamiento?.ecommerce?.toString() === "2" && (
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="space-y-2 col-span-2">
                                    <div
                                        style={{
                                            position: "relative",
                                            display: "inline-flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Label htmlFor="codigoBarras">Código de barras</Label>
                                        <div style={{ marginLeft: "10px" }}>
                                            <Tooltip
                                                title="La venta por e-commerce exige un código de barras que el cliente puede tramitar
                                                 con una licencia de GS1. Subir archivo en formato SVG."
                                                arrow
                                            >
                                                <HelpIcon
                                                    style={{ cursor: "pointer", fontSize: 18 }}
                                                />
                                            </Tooltip>
                                        </div>
                                    </div>
                                    <Input
                                        id="archivoSVG"
                                        name="archivoSVG"
                                        type="file"
                                        accept=".svg,image/svg+xml"
                                        onChange={(e) => handleImagenSeleccionada(e)}
                                        ref={archivoSVGRef}
                                        className="mx-auto"
                                    />
                                    {imagenSeleccionadaPreview && (
                                        <div>
                                            <div className="flex justify-center mt-2">
                                                {getIconByExtension(extension)}
                                            </div>
                                            <div className="flex justify-center mt-2">
                                                <span className="text-sm font-medium truncate max-w-[30vh]">{nombreArchivo}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ) : levantamiento?.etiqueta?.toString() === "3" && levantamiento?.cofepris ? (
                    <div>
                        <div style={{backgroundColor: "rgb(31 41 55)"}} className="grid grid-cols-2 gap-4 mb-6">
                            <div className="space-y-2 col-span-2 text-center">
                                <Label style={{fontSize: "20px", color: "white"}}>Guía de requerimientos de diseños consignados</Label>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2 col-span-2 text-center">
                                <Button type="button"><FileDown className="h-4 w-4" />Descargar guía</Button>
                            </div>
                        </div>
                    </div>
                ) : null}
                <Button type="submit" className="w-full mt-4">
                    Guardar etiquetado
                </Button>
            </form>
        </div>
    </div>
  );
}

function Spinner() {
  return <div className="spinner" />;
}
