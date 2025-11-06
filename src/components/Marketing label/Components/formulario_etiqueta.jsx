"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import styles from "../../../../public/CSS/spinner.css";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { useUserContext } from "@/utils/userContext";

export function DocumentSigningForm() {
  const { userData, loading } = useUserContext();
  const idUser = userData?.user?.id;
  const departamento = userData?.user?.departamento_id;
  const nombre = userData?.user?.nombre;
  const apellidos = userData?.user?.apellidos;
  const permisos = userData?.user?.permisos || {};
  const [formulario, setFormulario] = useState({
    selectedImages: Array(8).fill(false),
    tipo: "",
  });
  const [nowPdfPreview, setNowPdfPreview] = useState(null);

  useEffect(() => {
    return () => {
      if (nowPdfPreview) {
        URL.revokeObjectURL(nowPdfPreview); // Liberar la URL del objeto
      }
    };
  }, [nowPdfPreview]);

  const handleInputChange = (value, name) => {
    setFormulario((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDropdownChange = (value) => {
    setFormulario((prevState) => ({
      ...prevState,
      tipo: value,
    }));
  };

  const { data: session, status } = useSession();
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

  const tienePermiso = (seccion, campo) =>
    permisos?.campo?.[seccion]?.includes(campo) ?? false;

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

      // Añadir todos los datos del formulario
      for (const key in formulario) {
        if (Array.isArray(formulario[key])) {
          formData.append(key, JSON.stringify(formulario[key]));
          // Asegurarse de que los arrays se envíen como JSON
        } else {
          formData.append(key, formulario[key]);
        }
      }

      // Añadir el archivo PDF
      const fileInput = document.querySelector("#nowPdf");
      if (fileInput && fileInput.files.length > 0) {
        formData.append("nowPdf", fileInput.files[0]);
      }

      const guardarFormulario = fetch("/api/MarketingLabel/GuardarEtiquetas", {
        method: "POST",
        body: formData,
      });

      // 3. Enviar correos electrónicos
      const enviarCorreos = fetch("/api/Emails/send-mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emails:
            formulario.tipo === "Maquilas"
              ? [
                  "a.garcilita@aionsuplementos.com",
                  "b.solano@aionsuplementos.com",
                  "r.contreras@aionsuplementos.com",
                  "j.leyva@aionsuplementos.com",
                  "c.alvarez@aionsuplementos.com",
                  "t.alvarez@aionsuplementos.com",
                  "j.pérez@aionsuplementos.com",
                  "j.corona@aionsuplementos.com",
                  "p.gomez@aionsuplementos.com",
                  "o.rivera@aionsuplementos.com",
                  "r.barberena@aionsuplementos.com",
                  "k.bayardo@aionsuplementos.com",
                  "j.alvarado@aionsuplementos.com",
                  "f.cruz@aionsuplementos.com",
                  "r.castellanos@aionsuplementos.com",
                  "y.juarez@aionsuplementos.com",
                  "v.valenzuela@aionsuplementos.com",
                ]
              : [
                  "a.garcilita@aionsuplementos.com",
                  "b.solano@aionsuplementos.com",
                  "r.contreras@aionsuplementos.com",
                  "j.leyva@aionsuplementos.com",
                  "c.alvarez@aionsuplementos.com",
                  "t.alvarez@aionsuplementos.com",
                  "j.pérez@aionsuplementos.com",
                  "j.corona@aionsuplementos.com",
                  "p.gomez@aionsuplementos.com",
                  "o.rivera@aionsuplementos.com",
                  "k.bayardo@aionsuplementos.com",
                  "j.alvarado@aionsuplementos.com",
                  "f.cruz@aionsuplementos.com",
                  "r.castellanos@aionsuplementos.com",
                  "y.juarez@aionsuplementos.com",
                  "v.valenzuela@aionsuplementos.com",
                ],
          subject:
            formulario.tipo === "Maquilas"
              ? "Nueva etiqueta de maquilas"
              : "Nueva etiqueta interna",
          message: `Se ha guardado un nuevo formulario de etiqueta de tipo ${formulario.tipo}. Favor de revisarlo aquí: https://aionnet.vercel.app/marketing/etiquetas`,
        }),
      });

      // 4. Enviar notificación de alerta
      const enviarNotificacion = fetch("/api/Reminder/EnvioEvento", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData2: {
            tipo: "Alerta de nueva etiqueta",
            descripcion: `<strong>${
              nombre + " " + apellidos
            }</strong> ha subido una nueva etiqueta de tipo: <strong>${
              formulario.tipo
            }</strong>.<br>
              Puedes revisarla haciendo clic en este enlace: <a href="/marketing/etiquetas" style="color: blue; text-decoration: underline;">Revisar etiqueta</a>`,
            id: idUser,
            dpto: departamento,
          },
        }),
      });

      // Ejecutar todas las tareas en paralelo
      const [formResponse, emailResponse, notificationResponse] =
        await Promise.all([
          guardarFormulario,
          enviarCorreos,
          enviarNotificacion,
        ]);

      Swal.close();

      // Validar la respuesta de guardar el formulario
      if (formResponse.ok && emailResponse.ok && notificationResponse.ok) {
        Swal.fire({
          title: "Creada",
          text: "La etiqueta se ha creado correctamente",
          icon: "success",
          timer: 3000,
          showConfirmButton: false,
        }).then(() => {
          window.location.href = "/marketing/etiquetas";
        });
      } else {
        Swal.fire("Error", "Error al crear la etiqueta", "error");
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      Swal.close();
      Swal.fire("Error", "Error al procesar el formulario", "error");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      const allowedTypes = ["application/pdf"];
      const maxSize = 4 * 1024 * 1024; // 4MB

      if (!allowedTypes.includes(file.type)) {
        Swal.fire({
          title: "Tipo de archivo no permitido",
          text: "Solo se permiten archivos PDF.",
          icon: "error",
          timer: 3000,
          showConfirmButton: false,
        });
        e.target.value = ""; // Limpia el input
        return;
      }

      if (file.size > maxSize) {
        Swal.fire({
          title: "Archivo demasiado grande",
          text: "El tamaño máximo permitido es 4MB.",
          icon: "error",
          timer: 3000,
          showConfirmButton: false,
        });
        e.target.value = ""; // Limpia el input
        return;
      }

      // Crear URL de previsualización para el PDF
      const pdfUrl = URL.createObjectURL(file);
      setNowPdfPreview(pdfUrl);
    }
  };

  const formularioCompleto = () => {
    return formulario?.tipo && nowPdfPreview;
  };

  const modificacionesDiseñador = [
    "Tamaño de letra",
    "Logotipo",
    "Tipografía",
    "Colores",
  ];

  return (
    <div className="container mx-auto py-8 space-y-12">
      <h1 className="text-3xl font-bold text-center mb-8">Nueva etiqueta</h1>
      <form onSubmit={handleSubmit}>
        {/* PDF Section */}
        <Card className="mb-6">
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1">
              <div>
                <Label htmlFor="nowPdf">PDF</Label>
                <br />
                <Input
                  id="nowPdf"
                  type="file"
                  accept=".pdf"
                  name="pdf"
                  onChange={handleFileChange}
                  disabled={!tienePermiso("Verificación", "Diseñador gráfico")}
                />
                {nowPdfPreview && (
                  <div className="mt-2">
                    <embed
                      src={nowPdfPreview}
                      type="application/pdf"
                      width="100%"
                      height="700px"
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Select
                id="dropdown"
                value={formulario?.tipo}
                onValueChange={handleDropdownChange}
                disabled={!tienePermiso("Verificación", "Diseñador gráfico")}
              >
                <SelectTrigger id="dropdown">
                  <SelectValue placeholder="Seleccionar tipo de etiqueta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Interna">Interna</SelectItem>
                  <SelectItem value="Maquilas">Maquilas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/*diseño */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Diseñador gráfico</CardTitle>
            <CardDescription>
              Orlando Rivera o Alejandro Garcilita
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { id: "nombre_producto", label: "Nombre del producto" },
                { id: "proveedor", label: "Proveedor" },
                { id: "terminado", label: "Terminado" },
                { id: "articulo", label: "Artículo" },
                {
                  id: "fecha_elaboracion",
                  label: "Fecha de elaboración",
                  type: "date",
                },
                { id: "edicion", label: "Edición" },
                { id: "sustrato", label: "Sustrato" },
                { id: "dimensiones", label: "Dimensiones" },
                { id: "escala", label: "Escala" },
              ].map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id}>{field.label}</Label>
                  <Input
                    id={field.id}
                    name={field.id}
                    type={field.type || "text"}
                    value={formulario[field.id] || ""}
                    placeholder="..."
                    onChange={(e) =>
                      handleInputChange(e.target.value, e.target.name)
                    } // Usamos el manejador para actualizar los valores
                    readOnly={!tienePermiso("Diseño", field.id)}
                  />
                </div>
              ))}
              <div className="col-span-full space-y-2">
                <Label htmlFor="description">
                  Descripción de las modificaciones
                </Label>
                <Input
                  id="description"
                  name="description"
                  placeholder="..."
                  onChange={(e) =>
                    handleInputChange(e.target.value, e.target.name)
                  }
                  value={formulario?.description || ""}
                  readOnly={!tienePermiso("Diseño", "description")}
                />
              </div>
              {modificacionesDiseñador.map((item, index) => (
                <div key={item} className="space-y-2">
                  <Label>{item}</Label>
                  {/* Usamos la clave dinámica `miSelectX` para cada select */}
                  <Select
                    name={`miSelectDiseñador${index + 1}`}
                    value={formulario[`miSelectDiseñador${index + 1}`] || ""}
                    onValueChange={(value) =>
                      handleInputChange(value, `miSelectDiseñador${index + 1}`)
                    }
                    disabled={!tienePermiso("Diseño", item)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="si">Sí</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Button
          type="submit"
          className="w-full"
          disabled={!formularioCompleto()}
        >
          Guardar etiqueta
        </Button>
      </form>
    </div>
  );
}

function Spinner() {
  return <div className="spinner" />;
}
