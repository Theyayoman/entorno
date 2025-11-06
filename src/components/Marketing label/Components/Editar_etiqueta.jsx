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
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Textarea } from "@/components/ui/textarea";
import styles from "../../../../public/CSS/spinner.css";
import Swal from "sweetalert2";
import { useUserContext } from "@/utils/userContext";

export function EditarEtiqueta() {
  const { userData, loading: userLoading } = useUserContext();
  const idUser = userData?.user?.id;
  const correoUser = userData?.user?.correo;
  const departamento = userData?.user?.departamento_id;
  const nombre = userData?.user?.nombre;
  const apellidos = userData?.user?.apellidos;
  const permisos = userData?.user?.permisos || {};
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [formulario, setFormulario] = useState({
    selectedImages: Array(8).fill(false),
    estatus: "",
    tipo: "",
    firmas: 0,
  });
  const [loading, setLoading] = useState(true);
  const [contadorFirmas, setContadorFirmas] = useState(0);

  const verifiers = [
    "Directora de marketing",
    "Gerente de maquilas y desarrollo de nuevo productos",
    "Investigación y desarrollo de nuevos productos",
    "Ingeniería de productos",
    "Gerente de marketing",
    "Diseñador gráfico",
    "Gerente o supervisor de calidad",
    "Gerente o coordinador de auditorías",
    "Químico o formulador",
    "Planeación",
  ];

  const modificacionesDiseñador = [
    "Tamaño de letra",
    "Logotipo",
    "Tipografía",
    "Colores",
  ];

  const modificacionesIYDNP = [
    "Código QR",
    "Código de barras",
    "Cambio estético",
    "Cambio crítico",
    "Distribuido y elaborado por",
    "Tabla nutrimental",
    "Lista de ingredientes",
  ];

  const modificacionesCalidad = ["Información", "Ortografía"];

  const modificacionesAuditorias = ["Auditable"];

  const modificacionesQuimico = ["Fórmula"];

  const modificacionesIngenieíaNProducto = [
    "Dimensiones",
    "Sustrato",
    "Impresión",
    "Acabado",
    "Rollo",
  ];

  const modificacionesGerenteMkt = ["Teléfono", "Mail/email"];

  useEffect(() => {
    async function fetchData() {
      if (!id) return;

      try {
        const response = await fetch(
          `/api/MarketingLabel/EtiquetaUpdate?id=${id}`
        );
        if (!response.ok) {
          throw new Error("Error al obtener los datos");
        }
        const data = await response.json();
        let prueba;

        try {
          // Si `data.selectedImages` es una cadena JSON, se puede parsear
          prueba = JSON.parse(data.selectedImages);
        } catch (e) {
          // Si falla el parsing, asumimos que ya es un objeto
          prueba = data.selectedImages;
        }

        setFormulario((prev) => ({
          ...data,
          selectedImages: prueba, // Manejamos como objeto, esté o no parseado
          ...Array.from({ length: verifiers.length }, (_, index) => ({
            [`readOnly-${index}`]: !!data[`verifier-${index}`], // Marcar readOnly si ya tiene valor
            [`readOnlyComments-${index}`]:
              !!data[`comments-${index}`] ||
              (!data[`comments-${index}`] &&
                data[`authorize-${index}`] === "si"), // Lo mismo para comentarios
            [`selectDisabled-${index}`]: !!data[`authorize-${index}`], // Desactivar el Select si ya tiene valor
          })).reduce((acc, curr) => ({ ...acc, ...curr }), {}), // Combina los estados en un solo objeto
          [`readOnly-10`]: !!data[`verifier-10`], // Marcar readOnly si ya tiene valor
          [`readOnlyComments-10`]:
            !!data[`comments-10`] ||
            (!data[`comments-10`] && data[`authorize-10`] === "si"), // Lo mismo para comentarios
          [`selectDisabled-10`]: !!data[`authorize-10`], // Desactivar el Select si ya tiene valor
        }));

        setLoading(false); // Datos listos
      } catch (error) {
        console.error("Error al obtener el formulario:", error);
        setLoading(false); // Termina la carga aunque haya un error
      }
    }

    fetchData();
  }, [id]);

  const tienePermiso = (seccion, campo) =>
    permisos?.campo?.[seccion]?.includes(campo) ?? false;

  const verificarCampos = (index) => {
    // Asegúrate de que el valor es una cadena
    const nombre = formulario[`verifier-${index}`] || ""; // Asignar cadena vacía si es undefined
    const autorizacion = formulario[`authorize-${index}`];

    // Verifica si el campo de nombre tiene un valor y el select es "sí" o "no"
    if (
      typeof nombre === "string" &&
      nombre.trim() !== "" &&
      (autorizacion === "si" || autorizacion === "no")
    ) {
      return true;
    }
    return false;
  };

  const verificarCamposMaquilas = () => {
    const nombre = formulario[`verifier-10`] || "";
    const autorizacion = formulario[`authorize-10`];

    return (
      typeof nombre === "string" &&
      nombre.trim() !== "" &&
      (autorizacion === "si" || autorizacion === "no")
    );
  };

  const verificarTodosLosCampos = () => {
    let contadorInicial = 0;

    verifiers.forEach((_, index) => {
      if (verificarCampos(index)) {
        contadorInicial++;
      }
    });

    if (formulario.tipo == "Maquilas" && verificarCamposMaquilas()) {
      contadorInicial++;
    }
    return contadorInicial;
  };

  // useEffect para ejecutar la verificación inicial cuando se cargan los datos del formulario
  useEffect(() => {
    const nuevoContador = verificarTodosLosCampos();
    setContadorFirmas(nuevoContador);

    setFormulario((prev) => ({
      ...prev,
      firmas: nuevoContador, // Actualiza la propiedad "firmas"
    })); // Verifica y ajusta el contador con los valores recuperados
  }, [
    formulario[`verifier-0`],
    formulario[`verifier-1`],
    formulario[`verifier-2`],
    formulario[`verifier-3`],
    formulario[`verifier-4`],
    formulario[`verifier-5`],
    formulario[`verifier-6`],
    formulario[`verifier-7`],
    formulario[`verifier-8`],
    formulario[`verifier-9`],
    formulario[`verifier-10`],
    formulario[`authorize-0`],
    formulario[`authorize-1`],
    formulario[`authorize-2`],
    formulario[`authorize-3`],
    formulario[`authorize-4`],
    formulario[`authorize-5`],
    formulario[`authorize-6`],
    formulario[`authorize-7`],
    formulario[`authorize-8`],
    formulario[`authorize-9`],
    formulario[`authorize-10`],
    formulario.tipo,
  ]); // Se ejecuta cada vez que el formulario cambie

  const handleInputChange = (e) => {
    if (!e || !e.target) {
      console.error("Evento o target no válido");
      return;
    }

    const { name, value, type, checked } = e.target;

    setFormulario((prevFormulario) => ({
      ...prevFormulario,
      [name]: type === "checkbox" ? checked : value, // Si es checkbox, guardamos true/false
    }));
  };

  const handleSelectChange = (value, name) => {
    setFormulario((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Función para manejar los cambios en los checkboxes
  const handleImageChange = (event) => {
    const imageIndex = parseInt(event.target.name.split("-")[1], 10);

    setFormulario((prevFormulario) => {
      const newSelectedImages = [...prevFormulario.selectedImages];
      newSelectedImages[imageIndex] = !newSelectedImages[imageIndex];
      return {
        ...prevFormulario,
        selectedImages: newSelectedImages,
      };
    });
  };

  const handleDropdownChange2 = (value) => {
    setFormulario((prevState) => ({
      ...prevState,
      estatus: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...formulario,
      selectedImages: formulario.selectedImages,
    };

    try {
      const response = await fetch(
        `/api/MarketingLabel/Act_etiqueta?id=${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Establecer el tipo de contenido a JSON
          },
          body: JSON.stringify(dataToSend), // Enviar el formulario como JSON
        }
      );

      if (response.ok) {
        Swal.fire({
          title: "Actualizada",
          text: "La etiqueta se ha actualizado correctamente",
          icon: "success",
          timer: 3000, // La alerta desaparecerá después de 1.5 segundos
          showConfirmButton: false,
        }).then(() => {
          window.location.href = "/marketing/etiquetas";
        });
      } else {
        Swal.fire("Error", "Error al actualizar la etiqueta", "error");
      }
    } catch (error) {
      console.error("Error al actualizar la etiqueta:", error);
    }

    try {
      const response2 = await fetch("/api/Reminder/EnvioEvento", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData2: {
            tipo: "Alerta de edición de etiqueta",
            descripcion: `<strong>${
              nombre + " " + apellidos
            }</strong> ha editado la etiqueta con el siguiente id: <strong>${id}</strong>.<br>
              Puedes revisarla haciendo clic en este enlace: <a href="/marketing/etiquetas/Editar?id=${id}" style="color: blue; text-decoration: underline;">Revisar etiqueta</a>`,
            id: idUser,
            dpto: departamento,
          },
        }),
      });

      if (response2.ok) {
        console.log("Notificacion enviada");
      } else {
        Swal.fire(
          "Error",
          "Error al enviar la alerta de edición de etiqueta",
          "error"
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (status === "loading" || userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className={styles.spinner} />
        <p className="ml-3">Cargando...</p>
      </div>
    );
  }
  if (status == "loading" || userLoading) {
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

  if (!formulario) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className={styles.spinner} />
        <p className="ml-3">Cargando...</p>
      </div>
    );
  }

  // Verifica el tipo de formulario
  if (!formulario.tipo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className={styles.spinner} />
        <p className="ml-3">Cargando...</p>
      </div>
    );
  }

  if (
    formulario.tipo === "Maquilas" &&
    (formulario["authorize-10"] === undefined ||
      formulario["authorize-10"] === "")
  ) {
    formulario["authorize-10"] = formulario["authorize-10"] || ""; // Asignar un valor por defecto
  }

  const handleSave = async () => {
    if (session) {
      const userEmail1 = session.user.email;

      let emailFlow1 = {
        "o.rivera@aionsuplementos.com": "p.gomez@aionsuplementos.com",
        "a.garcilita@aionsuplementos.com": "p.gomez@aionsuplementos.com",
        "p.gomez@aionsuplementos.com": [
          "b.solano@aionsuplementos.com",
          "c.alvarez@aionsuplementos.com",
        ],
        "b.solano@aionsuplementos.com": [
          "r.contreras@aionsuplementos.com",
          "j.alvarado@aionsuplementos.com",
        ],
        "c.alvarez@aionsuplementos.com": [
          "r.contreras@aionsuplementos.com",
          "j.alvarado@aionsuplementos.com",
        ],
        "r.contreras@aionsuplementos.com": [
          "j.corona@aionsuplementos.com",
          "f.cruz@aionsuplementos.com",
          "v.valenzuela@aionsuplementos.com",
        ],
        "j.alvarado@aionsuplementos.com": [
          "j.corona@aionsuplementos.com",
          "f.cruz@aionsuplementos.com",
          "v.valenzuela@aionsuplementos.com",
        ],
        "j.corona@aionsuplementos.com": [
          "j.leyva@aionsuplementos.com",
          "r.castellanos@aionsuplementos.com",
        ],
        "f.cruz@aionsuplementos.com": [
          "j.leyva@aionsuplementos.com",
          "r.castellanos@aionsuplementos.com",
        ],
        "j.leyva@aionsuplementos.com": "l.torres@aionsuplementos.com",
        "r.castellanos@aionsuplementos.com": "l.torres@aionsuplementos.com",
        "l.torres@aionsuplementos.com": [
          "t.alvarez@aionsuplementos.com",
          "m.uribe@aionsuplementos.com",
        ],
        "t.alvarez@aionsuplementos.com": "j.pérez@aionsuplementos.com",
        "m.uribe@aionsuplementos.com": "j.pérez@aionsuplementos.com",
      };

      // Ajustar emailFlow si tipo es "Maquilas"
      if (formulario.tipo && formulario.tipo == "Maquilas") {
        emailFlow1["j.pérez@aionsuplementos.com"] =
          "r.barberena@aionsuplementos.com";
      }

      // Buscar el siguiente destinatario
      const nextRecipient = emailFlow1[userEmail1];

      // Solo si existe un siguiente destinatario
      if (nextRecipient) {
        try {
          const response = await fetch("/api/Emails/send-mailEdit", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              recipientEmail: nextRecipient,
              subject: "Etiqueta editada",
              message: `La etiqueta ha sido editada por ${session.user.name}. Por favor, revísala.\nEste es el enlace de la etiqueta para que puedas editarla: https://aionnet.vercel.app/marketing/etiquetas/Editar?id=${id} \nAsegúrate de iniciar sesión con tu usuario antes de hacer clic en el enlace.`,
            }),
          });

          if (response.ok) {
            console.log("Correo enviado a:", nextRecipient);
          } else {
            console.error("Error al enviar el correo");
          }
        } catch (error) {
          console.error("Error al enviar la petición:", error);
        }
      } else {
        console.error(
          "No se encontró un destinatario siguiente en el flujo de correos para el correo:",
          userEmail1
        );
      }
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-12">
      <h1 className="text-3xl font-bold text-center mb-8">Editar etiqueta</h1>
      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1">
              <div>
                <div className="mt-2">
                  {formulario.pdf ? (
                    <iframe
                      src={`/api/MarketingLabel/obtenerPdf?pdf=${encodeURIComponent(
                        formulario?.pdf
                      )}`}
                      width="100%"
                      height="700px"
                      title="PDF"
                    />
                  ) : (
                    <p>No se ha cargado ningún PDF</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Tipo</CardTitle>
            <CardContent>
              <br />{" "}
              <u>
                <Label style={{ fontSize: "18px" }}>{formulario?.tipo}</Label>
              </u>
            </CardContent>
          </CardHeader>
        </Card>

        {(session && session.user.email === "o.rivera@aionsuplementos.com") ||
        session.user.email === "p.gomez@aionsuplementos.com" ||
        session.user.email === "a.garcilita@aionsuplementos.com" ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Estatus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Select
                  id="dropdown"
                  value={formulario?.estatus}
                  onValueChange={handleDropdownChange2}
                >
                  <SelectTrigger id="dropdown">
                    <SelectValue placeholder="Seleccionar estatus de la etiqueta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Completado">Completado</SelectItem>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="Rechazado">Rechazado</SelectItem>
                    <SelectItem value="Eliminado">Eliminado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Estatus</CardTitle>
                <CardContent>
                  <br />{" "}
                  <u>
                    <Label style={{ fontSize: "18px" }}>
                      {formulario?.estatus}
                    </Label>
                  </u>
                </CardContent>
              </CardHeader>
            </Card>
          </div>
        )}

        {/* Detalles del Producto */}
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
                    placeholder="..."
                    value={formulario[field.id] || ""}
                    onChange={handleInputChange}
                    readOnly={!tienePermiso("Diseño", field.id)} // Establece readOnly según los permisos
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
                  onChange={handleInputChange}
                  value={formulario?.description}
                  readOnly={!tienePermiso("Diseño", "description")}
                />
              </div>
              {modificacionesDiseñador.map((item, index) => (
                <div key={item} className="space-y-2">
                  <Label>{item}</Label>
                  {/* Usamos la clave dinámica `miSelectX` para cada select */}
                  <Select
                    name={`miSelectDiseñador${index + 1}`}
                    value={formulario[`miSelectDiseñador${index + 1}`] || ""} // Usamos la clave dinámica en `formulario`
                    onValueChange={(value) =>
                      handleSelectChange(value, `miSelectDiseñador${index + 1}`)
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

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              Investigación y desarrollo de nuevos productos
            </CardTitle>
            <CardDescription>Pedro Marin</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modificacionesIYDNP.map((item, index) => (
                <div key={item} className="space-y-2">
                  <Label>{item}</Label>
                  {/* Usamos la clave dinámica `miSelectX` para cada select */}
                  <Select
                    name={`miSelectInvestigacion${index + 1}`}
                    value={
                      formulario[`miSelectInvestigacion${index + 1}`] || ""
                    } // Usamos la clave dinámica en `formulario`
                    onValueChange={(value) =>
                      handleSelectChange(
                        value,
                        `miSelectInvestigacion${index + 1}`
                      )
                    }
                    disabled={
                      !tienePermiso(
                        "Investigación y Desarrollo de Nuevos Productos",
                        item
                      )
                    }
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

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Calidad</CardTitle>
            <CardDescription>Blanca Solano o Carmen Álvarez</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modificacionesCalidad.map((item, index) => (
                <div key={item} className="space-y-2">
                  <Label>{item}</Label>
                  {/* Usamos la clave dinámica `miSelectX` para cada select */}
                  <Select
                    name={`miSelectCalidad${index + 1}`}
                    value={formulario[`miSelectCalidad${index + 1}`] || ""} // Usamos la clave dinámica en `formulario`
                    onValueChange={(value) =>
                      handleSelectChange(value, `miSelectCalidad${index + 1}`)
                    }
                    disabled={!tienePermiso("Calidad", item)}
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

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Auditorías</CardTitle>
            <CardDescription>Rosa Contreras o Janette Alvarado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modificacionesAuditorias.map((item, index) => (
                <div key={item} className="space-y-2">
                  <Label>{item}</Label>
                  {/* Usamos la clave dinámica `miSelectX` para cada select */}
                  <Select
                    name={`miSelectAuditorias${index + 1}`}
                    value={formulario[`miSelectAuditorias${index + 1}`] || ""} // Usamos la clave dinámica en `formulario`
                    onValueChange={(value) =>
                      handleSelectChange(
                        value,
                        `miSelectAuditorias${index + 1}`
                      )
                    }
                    disabled={!tienePermiso("Auditorías", item)}
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

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Químico o Formulador</CardTitle>
            <CardDescription>
              Carlos Corona o Victoria Valenzuela
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modificacionesQuimico.map((item, index) => (
                <div key={item} className="space-y-2">
                  <Label>{item}</Label>
                  {/* Usamos la clave dinámica `miSelectX` para cada select */}
                  <Select
                    name={`miSelectQuimico${index + 1}`}
                    value={formulario[`miSelectQuimico${index + 1}`] || ""} // Usamos la clave dinámica en `formulario`
                    onValueChange={(value) =>
                      handleSelectChange(value, `miSelectQuimico${index + 1}`)
                    }
                    disabled={!tienePermiso("Laboratorio", item)}
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

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Ingeniería de productos</CardTitle>
            <CardDescription>Roger Castellanos o Elena Briseño</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 gap-6">
              {modificacionesIngenieíaNProducto.map((item, index) => (
                <div key={item}>
                  {item === "Impresión" ? (
                    <div className="space-y-2">
                      <Label>{item}</Label>
                      <Select
                        name={`miSelectIngenieria${index + 1}`}
                        value={
                          formulario[`miSelectIngenieria${index + 1}`] || ""
                        } // Usamos la clave dinámica en `formulario`
                        onValueChange={(value) =>
                          handleSelectChange(
                            value,
                            `miSelectIngenieria${index + 1}`
                          )
                        }
                        disabled={
                          !tienePermiso("Ingeniería de Productos", item)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Interior">Interior</SelectItem>
                          <SelectItem value="Exterior">Exterior</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label>{item}</Label>
                      <Select
                        name={`miSelectIngenieria${index + 1}`}
                        value={
                          formulario[`miSelectIngenieria${index + 1}`] || ""
                        } // Usamos la clave dinámica en `formulario`
                        onValueChange={(value) =>
                          handleSelectChange(
                            value,
                            `miSelectIngenieria${index + 1}`
                          )
                        }
                        disabled={
                          !tienePermiso("Ingeniería de Productos", item)
                        }
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
                  )}
                </div>
              ))}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`image-${index}`}
                      name={`image-${index}`}
                      checked={formulario?.selectedImages[index] || false} // Controlar si está seleccionado
                      onChange={handleImageChange} // Manejar el cambio
                      disabled={
                        !tienePermiso(
                          "Ingeniería de Productos",
                          "Seleccionar imágenes"
                        )
                      }
                    />
                    <label htmlFor={`image-${index}`}>
                      <div className="w-24 h-24 bg-gray-200 flex items-center justify-center">
                        <img
                          src={`/img${index + 1}.png`}
                          alt={`Imagen ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Gerente de marketing</CardTitle>
            <CardDescription>Tania Álvarez</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 gap-6">
              {modificacionesGerenteMkt.map((item, index) => (
                <div key={item} className="space-y-2">
                  <Label>{item}</Label>
                  {/* Usamos la clave dinámica `miSelectX` para cada select */}
                  <Select
                    name={`miSelectGerenteMkt${index + 1}`}
                    value={formulario[`miSelectGerenteMkt${index + 1}`] || ""} // Usamos la clave dinámica en `formulario`
                    onValueChange={(value) =>
                      handleSelectChange(
                        value,
                        `miSelectGerenteMkt${index + 1}`
                      )
                    }
                    disabled={!tienePermiso("Gerente de Marketing", item)}
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

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Compras</CardTitle>
            <CardDescription>Karla Bayardo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <div className="space-y-2">
                  <Label htmlFor="value">Valor ($)</Label>
                  <Input
                    id="value"
                    name="value"
                    type="number"
                    placeholder="$"
                    onChange={handleInputChange}
                    value={formulario?.value}
                    readOnly={!tienePermiso("Compras", "Valor")}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Planeación</CardTitle>
            <CardDescription>Jaret Pérez</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <div className="space-y-2">
                  <Label htmlFor="inventory">Inventario (pzs)</Label>
                  <Input
                    id="inventory"
                    name="inventory"
                    type="number"
                    placeholder="Pzs"
                    onChange={handleInputChange}
                    value={formulario?.inventory}
                    readOnly={!tienePermiso("Planeación", "Inventario")}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verificación */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Verificación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {verifiers.map((verifier, index) => (
              <div key={index} className="space-y-4">
                <Label style={{ fontSize: 16 }} htmlFor={`verifier-${index}`}>
                  {verifier}
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    id={`verifier-${index}`}
                    name={`verifier-${index}`}
                    placeholder="Nombre"
                    onChange={(e) => {
                      handleInputChange(e); // Llama a tu manejador de cambios

                      // Verificar si el campo de nombre tiene al menos un carácter
                      if (e.target.value.trim() !== "") {
                        // Establecer la fecha actual en el campo correspondiente
                        const today = new Date();
                        const localDate =
                          today.getFullYear() +
                          "-" +
                          String(today.getMonth() + 1).padStart(2, "0") +
                          "-" +
                          String(today.getDate()).padStart(2, "0");

                        setFormulario((prev) => ({
                          ...prev,
                          [`fecha_autorizacion-${index}`]: localDate,
                        }));
                      }

                      if (verificarCampos(index)) {
                        setContadorFirmas((prev) => prev + 1);
                      }
                    }}
                    value={formulario[`verifier-${index}`] || ""}
                    readOnly={
                      !tienePermiso("Verificación", verifier) ||
                      formulario[`readOnly-${index}`] ||
                      false
                    }
                  />
                  <div
                    style={{ width: "9rem" }}
                    className="flex items-center space-x-4"
                  >
                    <Select
                      name={`authorize-${index}`}
                      value={formulario[`authorize-${index}`]} // Usamos la clave dinámica en `formulario`
                      onValueChange={(value) => {
                        handleSelectChange(value, `authorize-${index}`);
                        // Cambiar el campo de comentarios a obligatorio si el valor es "no"
                        if (value === "no") {
                          setFormulario((prev) => ({
                            ...prev,
                            [`comments-${index}`]:
                              prev[`comments-${index}`] || "", // Mantener el valor actual
                            commentsRequired: {
                              ...prev.commentsRequired,
                              [`comments-${index}`]: true,
                            }, // Hacer que sea obligatorio
                          }));
                        } else {
                          setFormulario((prev) => ({
                            ...prev,
                            commentsRequired: {
                              ...prev.commentsRequired,
                              [`comments-${index}`]: false,
                            }, // No obligatorio
                          }));
                        }

                        if (verificarCampos(index)) {
                          setContadorFirmas((prev) => prev + 1);
                        }
                      }}
                      disabled={
                        !tienePermiso("Verificación", verifier) ||
                        formulario[`selectDisabled-${index}`]
                      } // Se desactiva si tiene un valor
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={"Seleccionar"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="si">Sí</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Input
                    type="date"
                    name={`fecha_autorizacion-${index}`}
                    onChange={handleInputChange}
                    value={formulario[`fecha_autorizacion-${index}`] || ""}
                    disabled // Campo de fecha no editable // name y value desde el evento
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`comments-${index}`}>Comentarios</Label>
                  <Textarea
                    id={`comments-${index}`}
                    name={`comments-${index}`}
                    placeholder="Ingrese sus comentarios aquí"
                    className="w-full"
                    onChange={handleInputChange}
                    readOnly={
                      !tienePermiso("Verificación", verifier) ||
                      formulario[`readOnlyComments-${index}`] ||
                      false
                    }
                    value={formulario[`comments-${index}`] || ""} // name y value desde el evento
                    required={
                      formulario?.commentsRequired?.[`comments-${index}`]
                    }
                  />
                </div>
              </div>
            ))}
            {formulario.tipo == "Maquilas" ? (
              <div className="space-y-4">
                <Label style={{ fontSize: 16 }} htmlFor={"verifier-10"}>
                  Maquilas
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    id={"verifier-10"}
                    name={"verifier-10"}
                    placeholder="Nombre"
                    onChange={(e) => {
                      handleInputChange(e); // Llama a tu manejador de cambios

                      // Verificar si el campo de nombre tiene al menos un carácter
                      if (e.target.value.trim() !== "") {
                        // Establecer la fecha actual en el campo correspondiente
                        const today = new Date().toISOString().split("T")[0];
                        setFormulario((prev) => ({
                          ...prev,
                          ["fecha_autorizacion-10"]: today,
                        }));
                      }

                      if (verificarCamposMaquilas()) {
                        setContadorFirmas((prev) => prev + 1);
                      }
                    }}
                    value={formulario["verifier-10"] || ""}
                    readOnly={
                      !tienePermiso("Verificación", "Maquilas") ||
                      formulario["readOnly-10"] ||
                      false
                    }
                  />
                  <div
                    style={{ width: "9rem" }}
                    className="flex items-center space-x-4"
                  >
                    <Select
                      name={"authorize-10"}
                      value={formulario["authorize-10"]} // Usamos la clave dinámica en `formulario`
                      onValueChange={(value) => {
                        handleSelectChange(value, "authorize-10");
                        // Cambiar el campo de comentarios a obligatorio si el valor es "no"
                        if (value === "no") {
                          setFormulario((prev) => ({
                            ...prev,
                            ["comments-10"]: prev["comments-10"] || "", // Mantener el valor actual
                            commentsRequired: {
                              ...prev.commentsRequired,
                              ["comments-10"]: true,
                            }, // Hacer que sea obligatorio
                          }));
                        } else {
                          setFormulario((prev) => ({
                            ...prev,
                            commentsRequired: {
                              ...prev.commentsRequired,
                              ["comments-10"]: false,
                            }, // No obligatorio
                          }));
                        }

                        if (verificarCamposMaquilas()) {
                          setContadorFirmas((prev) => prev + 1);
                        }
                      }}
                      disabled={
                        !tienePermiso("Verificación", "Maquilas") ||
                        formulario["selectDisabled-10"]
                      } // Se desactiva si tiene un valor
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={"Seleccionar"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="si">Sí</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Input
                    type="date"
                    name={`fecha_autorizacion-10`}
                    onChange={handleInputChange}
                    value={formulario[`fecha_autorizacion-10`] || ""}
                    disabled // Campo de fecha no editable // name y value desde el evento
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={"comments-10"}>Comentarios</Label>
                  <Textarea
                    id={`comments-10`}
                    name={`comments-10`}
                    placeholder="Ingrese sus comentarios aquí"
                    className="w-full"
                    onChange={handleInputChange}
                    readOnly={
                      !tienePermiso("Verificación", "Maquilas") ||
                      formulario[`readOnlyComments-10`] ||
                      false
                    }
                    value={formulario[`comments-10`] || ""} // name y value desde el evento
                    required={formulario?.commentsRequired?.[`comments-10`]}
                  />
                </div>
              </div>
            ) : (
              <div></div>
            )}
          </CardContent>
        </Card>
        <Button type="submit" className="w-full" onClick={handleSave}>
          Guardar cambios
        </Button>
      </form>
    </div>
  );
}

function Spinner() {
  return <div className="spinner" />;
}

export default EditarEtiqueta;
