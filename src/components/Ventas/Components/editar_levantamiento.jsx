"use client"

import { useState, useEffect, useRef } from "react";
import styles from '../../../../public/CSS/spinner.css';
import { useSession } from "next-auth/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Swal from 'sweetalert2';
import { Button } from "@/components/ui/button";
import { CornerDownLeft } from 'lucide-react';
import Link from "next/link";
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import { Textarea } from "@/components/ui/textarea";

export function EditarLevantamiento() {
  const {data: session, status} = useSession();
  const searchParams = useSearchParams();
  const idLevantamiento = searchParams.get("id");
  const [levantamiento, setLevantamiento] = useState(null);
  const [imagenSeleccionadaPreview, setImagenSeleccionadaPreview] = useState(null);

  const fetchArchivo = async (levantamiento) => {
    const archivo = levantamiento?.constancia_prospecto;
  
    if (archivo) {
      const url = `/api/Sales/obtenerConstancia?rutaDocumento=${encodeURIComponent(archivo)}`;
      setImagenSeleccionadaPreview(url);
    }
  };

  useEffect(() => {
    const fetchLevantamiento = async () => {
        try {
            const response = await axios.get(`/api/Sales/getLevantamiento?id=${idLevantamiento}`);
            if (response.data.success) {
                setLevantamiento(response.data.levantamiento);
                fetchArchivo(response.data.levantamiento);
            } else {
                console.error("Error al obtener el levantamiento:", response.data.message);
            }
        } catch (error) {
            console.error("Error al hacer fetch del levantamiento:", error);
        }
    };

    fetchLevantamiento();
  }, []);

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
        const response = await axios.post("/api/Sales/actualizarLevantamiento", 
            {levantamiento, imagenSeleccionadaPreview},
        );

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
                text: "Se ha actualizado correctamente",
                icon: "success",
                timer: 3000,
                showConfirmButton: false,
            }).then(() => {
                window.location.href = "/ventas/levantamiento_requerimientos";
            });  
        } else {
            Swal.fire({
                title: "Error",
                text: "Error al actualizar el registro",
                icon: "error",
                timer: 3000,
                showConfirmButton: false,
            });
        }
    } catch (err) {
        console.error("Error en la actualización:", err);
        Swal.close();
        Swal.fire({
            title: "Error",
            text: "Hubo un problema con la actualización",
            icon: "error",
            timer: 3000,
            showConfirmButton: false,
        });
    }
  };

  const handleImagenSeleccionada = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Validar tipo MIME
    if (file.type !== "application/pdf") {
        Swal.fire({
            title: "Error",
            text: `El archivo "${file.name}" no tiene un formato permitido. Solo se permiten archivos PDF.`,
            icon: "error",
            timer: 3000,
            showConfirmButton: false,
        });
        document.getElementById("archivoPDF").value = null;
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
        document.getElementById("archivoPDF").value = null;
        return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
        setImagenSeleccionadaPreview(reader.result); // Guardar base64
    };
    reader.readAsDataURL(file);
  };

  const formularioCompleto = () => {
    return (
      levantamiento?.nombre_prospecto &&
      levantamiento?.correo_prospecto &&
      levantamiento?.marca_prospecto
    );
  };

  return (
    <div className="container mx-auto p-6">
        <div>
            <Link href="/ventas/levantamiento_requerimientos"><Button><CornerDownLeft className="h-4 w-4" />Regresar</Button></Link>
        </div>
        <div className="flex justify-center items-center text-center mb-8">
            <CardTitle className="text-3xl font-bold">Editar levantamiento</CardTitle>
        </div>
        <div className="flex justify-center mb-4">
            <form  
                onSubmit={handleSubmit}
                className="w-[1400px] border border-gray-300 rounded-lg shadow-md p-6 bg-white"
            >
                <div style={{backgroundColor: "rgb(31 41 55)"}} className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2 col-span-2 text-center">
                        <Label style={{fontSize: "20px", color: "white"}}>Datos del cliente</Label>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre completo</Label>
                    <Input id="nombre" name="nombre" type="text" value={levantamiento?.nombre_prospecto || ''} onChange={(e) => setLevantamiento({...levantamiento, nombre_prospecto: e.target.value})} placeholder="Nombre del prospecto..." />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="no_telefono">Número de teléfono</Label>
                    <Input id="no_telefono" name="no_telefono" type="number" value={levantamiento?.telefono_prospecto || ''} onChange={(e) => setLevantamiento({...levantamiento, telefono_prospecto: e.target.value})} placeholder="3333333333" />
                </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2 col-span-2">
                    <Label htmlFor="correo">Correo</Label>
                    <Input id="correo" name="correo" type="email" value={levantamiento?.correo_prospecto || ''} onChange={(e) => setLevantamiento({...levantamiento, correo_prospecto: e.target.value})} placeholder="7K2Wb@example.com" />
                </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                    <Label htmlFor="marca">Marca</Label>
                    <Input id="marca" name="marca" type="text" value={levantamiento?.marca_prospecto || ''} onChange={(e) => setLevantamiento({...levantamiento, marca_prospecto: e.target.value})} placeholder="Marca..." />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="redes_sociales">Redes sociales</Label>
                    <Input id="redes_sociales" name="redes_sociales" type="text" value={levantamiento?.redes_sociales_prospecto || ''} onChange={(e) => setLevantamiento({...levantamiento, redes_sociales_prospecto: e.target.value})} placeholder="Facebook, Instagram, etc..." />
                </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-2 col-span-2">
                    <Label>Constancia de situación fiscal</Label>
                    <Input
                      id="archivoPDF"
                      name="archivoPDF"
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => handleImagenSeleccionada(e)}
                      className="mx-auto"
                    />
                    {imagenSeleccionadaPreview && (
                      <iframe
                        src={imagenSeleccionadaPreview}
                        alt="Vista previa del PDF"
                        className="mx-auto mt-2 w-full h-[45vh] rounded-md"
                      ></iframe>
                    )}
                </div>
                </div>
                <div style={{backgroundColor: "rgb(31 41 55)"}} className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2 col-span-2 text-center">
                        <Label style={{fontSize: "20px", color: "white"}}>Otros datos</Label>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                    <Label htmlFor="publico_objetivo">Público objetivo</Label>
                    <Textarea id="publico_objetivo" name="publico_objetivo" value={levantamiento?.publico_objetivo || ''} onChange={(e) => setLevantamiento({...levantamiento, publico_objetivo: e.target.value})} placeholder="..." />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="canales_distribucion">Canales de distribución</Label>
                    <Textarea id="canales_distribucion" name="canales_distribucion" value={levantamiento?.canales_distribucion || ''} onChange={(e) => setLevantamiento({...levantamiento, canales_distribucion: e.target.value})} placeholder="..." />
                </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2 col-span-2">
                    <Label htmlFor="monto_inversion">Monto de inversión</Label>
                    <Input id="monto_inversion" name="monto_inversion" type="number" value={levantamiento?.monto_inversion || ''} onChange={(e) => setLevantamiento({...levantamiento, monto_inversion: e.target.value})} placeholder="$" />
                </div>
                </div>
                <Button type="submit" className="w-full mt-4" disabled={!formularioCompleto()}>
                    Editar levantamiento
                </Button>
            </form>
        </div>
    </div>
  )
}

function Spinner() {
  return (
    <div className="spinner" />
  );
}