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
import { CornerDownLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";
import {
  BsFiletypeSvg,
  BsFiletypePdf,
  BsFiletypeJpg,
  BsFiletypePng,
} from "react-icons/bs";

export function LevantamientoDistribuidores(props) {
  const { id, emitUpdate } = props;
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const idLevantamiento = searchParams.get("id") || id;
  const [distribuidor, setDistribuidor] = useState(null);
  const [imagenSeleccionadaPreview, setImagenSeleccionadaPreview] =
    useState(null);
  const qr = useRef(null);
  const [nombreArchivo, setNombreArchivo] = useState("");

  useEffect(() => {
    const fetchDistribuidores = async () => {
      try {
        const response = await axios.get(
          `/api/Sales/getDistribuidores?id=${idLevantamiento}`
        );

        if (response.data.success) {
          setDistribuidor(response.data.distribuidores);
          fetchArchivo(response.data.distribuidores);
        } else {
          console.error(
            "Error al obtener los distribuidores:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Error al hacer fetch de los distribuidores:", error);
      }
    };

    fetchDistribuidores();
  }, []);

  const fetchArchivo = async (distribuidor) => {
    const archivo = distribuidor?.qr;

    if (archivo) {
      const url = `/api/Sales/obtenerCodigoQR?rutaImagen=${encodeURIComponent(
        archivo
      )}`;
      setImagenSeleccionadaPreview(url);
      setNombreArchivo(distribuidor?.qr.split("/").pop());
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

  const extension = nombreArchivo?.split(".").pop()?.toLowerCase();

  const handleImagenSeleccionada = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Validar tipo archivo
    const tiposPermitidos = [
        "image/svg+xml",
        "image/png",
        "image/jpeg",
    ];
    const extensionesPermitidas = [".svg", ".png", ".jpg", ".jpeg"];

    const extension = file.name
      .toLowerCase()
      .substring(file.name.lastIndexOf("."));

    if (!tiposPermitidos.includes(file.type) && !extensionesPermitidas.includes(extension)) {
        Swal.fire({
            title: "Error",
            text: `El archivo "${file.name}" no tiene un formato permitido. Solo se permiten archivos SVG, JPG y PNG.`,
            icon: "error",
            timer: 3000,
            showConfirmButton: false,
        });
        if (qr.current) {
            qr.current.value = null;
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
      if (qr.current) {
        qr.current.value = null;
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
      const response = await axios.post("/api/Sales/guardarDistribuidores", {
        idLevantamiento,
        distribuidor,
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
          text: "Los distribuidores se han guardado correctamente",
          icon: "success",
          timer: 3000,
          showConfirmButton: false,
        }).then(() => {
          emitUpdate();
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Error al guardar los distribuidores",
          icon: "error",
          timer: 3000,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error("Error en el guardado de los distribuidores:", err);
      Swal.close();
      Swal.fire({
        title: "Error",
        text: "Hubo un problema con el guardado de los distribuidores",
        icon: "error",
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };

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
      case "jpg":
        return (
          <BsFiletypeJpg
            className="w-20 h-20 cursor-pointer"
            style={{ color: "blue" }}
            role="button"
            onClick={() => abrirArchivo(imagenSeleccionadaPreview)}
            title="Abrir en nueva ventana"
          />
        );
      case "jpeg":
        return (
          <BsFiletypeJpg
            className="w-20 h-20 cursor-pointer"
            style={{ color: "blue" }}
            role="button"
            onClick={() => abrirArchivo(imagenSeleccionadaPreview)}
            title="Abrir en nueva ventana"
          />
        );
      case "png":
        return (
          <BsFiletypePng
            className="w-20 h-20 cursor-pointer"
            style={{ color: "rgb(142 68 173)" }}
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

  const formularioCompleto = () => {
    return (
      distribuidor?.nombre && distribuidor?.direccion && distribuidor?.telefono
    );
  };

  return (
    <div className="container mx-auto p-6">
        <div>
            <Link href="/ventas/levantamiento_requerimientos"><Button><CornerDownLeft className="h-4 w-4" />Regresar</Button></Link>
        </div>
        <div className="flex justify-center items-center text-center mb-8">
            <CardTitle className="text-3xl font-bold">Distribuidores</CardTitle>
        </div>
        <div className="flex justify-center mb-4">
            <form  
                onSubmit={handleSubmit}
                className="w-[1400px] border border-gray-300 rounded-lg shadow-md p-6 bg-white"
            >
                <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2 col-span-2">
                    <Label htmlFor="nombrePersona">Nombre de la persona/empresa</Label>
                    <Input id="nombrePersona" name="nombrePersona" value={distribuidor?.nombre || ''} onChange={(e) => setDistribuidor({...distribuidor, nombre: e.target.value})} placeholder="..." />
                </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                    <Label htmlFor="direccion">Dirección</Label>
                    <Input id="direccion" name="direccion" value={distribuidor?.direccion || ''} onChange={(e) => setDistribuidor({...distribuidor, direccion: e.target.value})} placeholder="..." />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="telefono">Número telefónico</Label>
                    <Input id="telefono" name="telefono" type="number" value={distribuidor?.telefono || ''} onChange={(e) => setDistribuidor({...distribuidor, telefono: e.target.value})} placeholder="3333333333" />
                </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                    <Label htmlFor="paginasEcommerce">Páginas de e-commerce</Label>
                    <Textarea id="paginasEcommerce" name="paginasEcommerce" value={distribuidor?.ecommerce || ''} onChange={(e) => setDistribuidor({...distribuidor, ecommerce: e.target.value})} placeholder="..." />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="correos">Correos de contacto</Label>
                    <Textarea id="correos" name="correos" value={distribuidor?.correo || ''} onChange={(e) => setDistribuidor({...distribuidor, correo: e.target.value})} placeholder="..." />
                </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2 col-span-2">
                    <Label htmlFor="redesSociales">Redes sociales</Label>
                    <Textarea id="redesSociales" name="redesSociales" value={distribuidor?.redes || ''} onChange={(e) => setDistribuidor({...distribuidor, redes: e.target.value})} placeholder="..." />
                </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2 col-span-2">
                    <div
                        style={{
                            position: "relative",
                            display: "inline-flex",
                            alignItems: "center",
                        }}
                    >
                    <Label htmlFor="qr">QR</Label>
                    </div>
                    <Input
                        id="qr"
                        name="qr"
                        type="file"
                        accept=".svg,.jpg,.jpeg,.png"
                        onChange={(e) => handleImagenSeleccionada(e)}
                        ref={qr}
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
                <Button type="submit" className="w-full mt-4" disabled={!formularioCompleto()}>
                    Guardar distribuidores
                </Button>
            </form>
        </div>
    </div>
  );
}

function Spinner() {
  return <div className="spinner" />;
}
