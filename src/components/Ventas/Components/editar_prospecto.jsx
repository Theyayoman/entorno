"use client";

import { useState, useEffect } from "react";
import styles from "../../../../public/CSS/spinner.css";
import { useSession } from "next-auth/react";
import { CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { CornerDownLeft } from "lucide-react";
import Link from "next/link";
import axios from "axios";

export function EditarProspecto(props) {
  const { id, EmitUpdate } = props;
  const { data: session, status } = useSession();
  const [prospecto, setProspecto] = useState(null);
  const [nombre, setNombre] = useState(null);
  const [numero, setNumero] = useState(null);
  const [correo, setCorreo] = useState(null);
  const [marca, setMarca] = useState(null);
  const [redes_sociales, setRedesSociales] = useState(null);
  const [imagenSeleccionadaPreview, setImagenSeleccionadaPreview] =
    useState(null);

  const fetchArchivo = async (prospecto) => {
    const archivo = prospecto?.constancia;

    if (archivo) {
      const url = `/api/Sales/obtenerConstancia?rutaDocumento=${encodeURIComponent(
        archivo
      )}`;
      setImagenSeleccionadaPreview(url);
    }
  };

  useEffect(() => {
    const fetchProspecto = async () => {
      try {
        const response = await axios.get(`/api/Sales/getProspecto?id=${id}`);
        if (response.data.success) {
          setProspecto(response.data.prospecto);
          fetchArchivo(response.data.prospecto);
        } else {
          console.error(
            "Error al obtener el prospecto:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Error al hacer fetch del prospecto:", error);
      }
    };

    fetchProspecto();
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
      const response = await axios.post("/api/Sales/actualizarProspecto", {
        id,
        prospecto,
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
          text: "El prospecto ha sido actualizado correctamente",
          icon: "success",
          timer: 3000,
          showConfirmButton: false,
        }).then(() => {
          EmitUpdate(true);
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Error al actualizar al prospecto",
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
    return prospecto?.nombre && prospecto?.correo && prospecto?.marca;
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-center mb-4">
        <form
          onSubmit={handleSubmit}
          className="w-[1400px] border border-gray-300 rounded-lg shadow-md p-6 bg-white"
        >
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre completo</Label>
              <Input
                id="nombre"
                name="nombre"
                type="text"
                value={prospecto?.nombre || ""}
                onChange={(e) =>
                  setProspecto({ ...prospecto, nombre: e.target.value })
                }
                placeholder="Nombre del prospecto..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="no_telefono">Número de teléfono</Label>
              <Input
                id="no_telefono"
                name="no_telefono"
                type="number"
                value={prospecto?.telefono || ""}
                onChange={(e) =>
                  setProspecto({ ...prospecto, telefono: e.target.value })
                }
                placeholder="3333333333"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="correo">Correo</Label>
              <Input
                id="correo"
                name="correo"
                type="email"
                value={prospecto?.correo || ""}
                onChange={(e) =>
                  setProspecto({ ...prospecto, correo: e.target.value })
                }
                placeholder="7K2Wb@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="marca">Marca</Label>
              <Input
                id="marca"
                name="marca"
                type="text"
                value={prospecto?.marca || ""}
                onChange={(e) =>
                  setProspecto({ ...prospecto, marca: e.target.value })
                }
                placeholder="Marca..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="redes_sociales">Redes sociales</Label>
              <Input
                id="redes_sociales"
                name="redes_sociales"
                type="text"
                value={prospecto?.redes_sociales || ""}
                onChange={(e) =>
                  setProspecto({ ...prospecto, redes_sociales: e.target.value })
                }
                placeholder="Facebook, Instagram, etc..."
              />
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
          <Button
            type="submit"
            className="w-full mt-4"
            disabled={!formularioCompleto()}
          >
            Actualizar datos del prospecto
          </Button>
        </form>
      </div>
    </div>
  );
}

function Spinner() {
  return <div className="spinner" />;
}
