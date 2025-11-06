"use client"

import { useState, useEffect } from "react";
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
import { set } from "date-fns";

export function NuevoProspecto() {
  const {data: session, status} = useSession();
  const [nombre, setNombre] = useState(null);
  const [numero, setNumero] = useState(null);
  const [correo, setCorreo] = useState(null);
  const [marca, setMarca] = useState(null);
  const [redes_sociales, setRedesSociales] = useState(null);
  const [imagenSeleccionadaPreview, setImagenSeleccionadaPreview] = useState(null);

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
        const response = await axios.post("/api/Sales/guardarProspecto", 
            {nombre, numero, correo, marca, redes_sociales, imagenSeleccionadaPreview},
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
                text: "El prospecto ha sido guardado correctamente",
                icon: "success",
                timer: 3000,
                showConfirmButton: false,
            }).then(() => {
                window.location.href = "/ventas/prospectos";
            });  
        } else {
            Swal.fire({
                title: "Error",
                text: "Error al guardar al prospecto",
                icon: "error",
                timer: 3000,
                showConfirmButton: false,
            });
        }
    } catch (err) {
        console.error("Error en el registro:", err);
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
      nombre &&
      correo &&
      marca
    );
  };

  return (
    <div className="container mx-auto p-6">
        <div>
            <Link href="/ventas/prospectos"><Button><CornerDownLeft className="h-4 w-4" />Regresar</Button></Link>
        </div>
        <div className="flex justify-center items-center text-center mb-8">
            <CardTitle className="text-3xl font-bold">Nuevo prospecto</CardTitle>
        </div>
        <div className="flex justify-center mb-4">
            <form 
                onSubmit={handleSubmit} 
                className="w-[1400px] border border-gray-300 rounded-lg shadow-md p-6 bg-white"
            >
                <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre completo</Label>
                    <Input id="nombre" name="nombre" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre del prospecto..." />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="no_telefono">Número de teléfono</Label>
                    <Input id="no_telefono" name="no_telefono" type="number" value={numero} onChange={(e) => setNumero(e.target.value)} placeholder="3333333333" />
                </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2 col-span-2">
                    <Label htmlFor="correo">Correo</Label>
                    <Input id="correo" name="correo" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="7K2Wb@example.com" />
                </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                    <Label htmlFor="marca">Marca</Label>
                    <Input id="marca" name="marca" type="text" value={marca} onChange={(e) => setMarca(e.target.value)} placeholder="Marca..." />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="redes_sociales">Redes sociales</Label>
                    <Input id="redes_sociales" name="redes_sociales" type="text" value={redes_sociales} onChange={(e) => setRedesSociales(e.target.value)} placeholder="Facebook, Instagram, etc..." />
                </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
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
                <Button type="submit" className="w-full mt-4" disabled={!formularioCompleto()}>
                    Agregar prospecto
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