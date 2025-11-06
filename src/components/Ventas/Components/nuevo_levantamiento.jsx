"use client";

import { useState, useEffect, useRef } from "react";
import styles from "../../../../public/CSS/spinner.css";
import { useSession } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { CornerDownLeft } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";
import { useUserContext } from "@/utils/userContext";

export function NuevoLevantamiento() {
  const { userData, loading } = useUserContext();
  const idUser = userData?.user?.id;
  const { data: session, status } = useSession();
  const [idProspecto, setIDProspecto] = useState(null);
  const [prospecto, setProspecto] = useState(null);
  const [imagenSeleccionadaPreview, setImagenSeleccionadaPreview] =
    useState(null);
  const [searchTermPass, setSearchTermPass] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [prospectos, setProspectos] = useState([]);
  const inputRef = useRef(null);
  const [selectedProspecto, setSelectedProspecto] = useState(null);
  const [publico_objetivo, setPublicoObjetivo] = useState(null);
  const [canales_distribucion, setCanalesDistribucion] = useState(null);
  const [monto_inversion, setMontoInversion] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTermPass);
    }, 500);

    return () => {
      clearTimeout(handler); // limpia el timeout si se escribe antes de los 3s
    };
  }, [searchTermPass]);

  const fetchArchivo = async (prospecto) => {
    const archivo = prospecto?.constancia;

    if (archivo) {
      const url = `/api/Sales/obtenerConstancia?rutaDocumento=${encodeURIComponent(
        archivo
      )}`;
      setImagenSeleccionadaPreview(url);
    } else {
      document.getElementById("archivoPDF").value = null;
      setImagenSeleccionadaPreview(null);
    }
  };

  useEffect(() => {
    const fetchProspectos = async () => {
      try {
        const response = await axios.get("/api/Sales/getProspectos");
        if (response.data.success) {
          setProspectos(response.data.prospectos);
        } else {
          console.error(
            "Error al obtener los prospectos:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Error al hacer fetch de los prospectos:", error);
      }
    };

    fetchProspectos();
  }, []);

  const fetchProspecto = async (id) => {
    try {
      const response = await axios.get(`/api/Sales/getProspecto?id=${id}`);
      if (response.data.success) {
        setProspecto(response.data.prospecto);
        fetchArchivo(response.data.prospecto);
        setIDProspecto(response.data.prospecto.id);
      } else {
        console.error("Error al obtener el prospecto:", response.data.message);
      }
    } catch (error) {
      console.error("Error al hacer fetch del prospecto:", error);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className={styles.spinner} />
        <p className="ml-3">Cargando...</p>
      </div>
    );
  }

  if (status == "loading" || loading) {
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
      const response = await axios.post("/api/Sales/guardarLevantamiento", {
        idUser,
        idProspecto,
        prospecto,
        publico_objetivo,
        canales_distribucion,
        monto_inversion,
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
          text: "Se ha creado correctamente",
          icon: "success",
          timer: 3000,
          showConfirmButton: false,
        }).then(() => {
          window.location.href = "/ventas/levantamiento_requerimientos";
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Error al crear el registro",
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

  const handleSelectProspecto = (prospectoId) => {
    fetchProspecto(prospectoId);
    const seleccionado = prospectos.find(
      (prospecto) => prospecto.id.toString() === prospectoId
    );
    setSelectedProspecto(seleccionado);
    setSearchTermPass(""); // Resetea la búsqueda después de seleccionar un usuario
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
      <div>
        <Link href="/ventas/levantamiento_requerimientos">
          <Button>
            <CornerDownLeft className="h-4 w-4" />
            Regresar
          </Button>
        </Link>
      </div>
      <div className="flex justify-center items-center text-center mb-8">
        <CardTitle className="text-3xl font-bold">
          Levantamiento de requerimientos
        </CardTitle>
      </div>
      <div className="flex justify-center mb-4">
        <form
          onSubmit={handleSubmit}
          className="w-[1400px] border border-gray-300 rounded-lg shadow-md p-6 bg-white"
        >
          {/* Selección de usuarios con búsqueda manual */}
          <div className="mb-4">
            <div className="space-y-2">
              <Label>Prospecto</Label>
              <Select
                onValueChange={handleSelectProspecto}
                value={selectedProspecto?.id.toString() || ""}
              >
                <SelectTrigger>
                  <div className="truncate">
                    {selectedProspecto?.nombre || "Seleccionar prospecto"}
                  </div>
                </SelectTrigger>

                <SelectContent>
                  <div className="p-2">
                    <Input
                      ref={inputRef}
                      placeholder="Buscar prospecto..."
                      value={searchTermPass}
                      onChange={(e) => setSearchTermPass(e.target.value)}
                      onKeyDown={(e) => e.stopPropagation()}
                    />
                  </div>

                  {prospectos.filter((p) =>
                    p.nombre
                      .toLowerCase()
                      .includes(debouncedSearchTerm.toLowerCase())
                  ).length === 0 ? (
                    <div className="p-2 text-center text-gray-500">
                      No se encontraron prospectos
                    </div>
                  ) : (
                    prospectos
                      .filter((p) =>
                        p.nombre
                          .toLowerCase()
                          .includes(debouncedSearchTerm.toLowerCase())
                      )
                      .map((p) => (
                        <SelectItem
                          key={p.id.toString()}
                          value={p.id.toString()}
                        >
                          {p.nombre}
                        </SelectItem>
                      ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div
            style={{ backgroundColor: "rgb(31 41 55)" }}
            className="grid grid-cols-2 gap-4 mb-6"
          >
            <div className="space-y-2 col-span-2 text-center">
              <Label style={{ fontSize: "20px", color: "white" }}>
                Datos del cliente
              </Label>
            </div>
          </div>
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
          <div
            style={{ backgroundColor: "rgb(31 41 55)" }}
            className="grid grid-cols-2 gap-4 mb-6"
          >
            <div className="space-y-2 col-span-2 text-center">
              <Label style={{ fontSize: "20px", color: "white" }}>
                Otros datos
              </Label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="publico_objetivo">Público objetivo</Label>
              <Textarea
                id="publico_objetivo"
                name="publico_objetivo"
                value={publico_objetivo || ""}
                onChange={(e) => setPublicoObjetivo(e.target.value)}
                placeholder="..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="canales_distribucion">
                Canales de distribución
              </Label>
              <Textarea
                id="canales_distribucion"
                name="canales_distribucion"
                value={canales_distribucion || ""}
                onChange={(e) => setCanalesDistribucion(e.target.value)}
                placeholder="..."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="monto_inversion">Monto de inversión</Label>
              <Input
                id="monto_inversion"
                name="monto_inversion"
                type="number"
                value={monto_inversion || ""}
                onChange={(e) => setMontoInversion(e.target.value)}
                placeholder="$"
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full mt-4"
            disabled={!formularioCompleto()}
          >
            Terminar levantamiento
          </Button>
        </form>
      </div>
    </div>
  );
}

function Spinner() {
  return <div className="spinner" />;
}
