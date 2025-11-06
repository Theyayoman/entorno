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
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";
import { pdf } from "@react-pdf/renderer";
import FichaTecnicaPDF from "./ficha_tecnica";
import { useUserContext } from "@/utils/userContext";

export function FichaTecnica() {
  const { userData, loading } = useUserContext();
  const nombreUsuario = userData?.user?.nombre;
  const apellidosUsuario = userData?.user?.apellidos;
  const idUser = userData?.user?.id;
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const idProductoValidar = searchParams.get("id");
  const [productoAValidar, setProductoAValidar] = useState(null);
  const [imagenSeleccionadaPreview, setImagenSeleccionadaPreview] =
    useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [actores, setActores] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/Users/getUsers");
        if (response.data.success) {
          setAllUsers(response.data.users);
        } else {
          console.error(
            "Error al obtener los usuarios:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Error al hacer fetch de los usuarios:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const imagenTipo2 = productoAValidar?.imagenes?.find(
      (img) => img.tipo === 2
    );

    if (imagenTipo2?.ruta) {
      const url = `/api/ProductEngineering/obtenerImagenes?rutaImagen=${encodeURIComponent(
        imagenTipo2.ruta
      )}`;
      setImagenSeleccionadaPreview(url);
    }
  }, [productoAValidar]);

  useEffect(() => {
    const fetchProductoAValidar = async () => {
      if (!idProductoValidar) {
        console.error("ID de producto no proporcionado");
        return;
      }

      try {
        const response = await axios.post(
          `/api/ProductEngineering/getProductoValidar?id=${idProductoValidar}`
        );
        if (response.data.success) {
          const producto = response.data.producto;
          const registros = producto.identificadores.map((identificador) => {
            const existente = producto.identificadoresProductos.find(
              (p) => p.identificador_id === identificador.id
            );

            return {
              identificador_id: identificador.id,
              registroN: existente?.registroN ?? "",
              registroV: existente?.registroV ?? "",
              tolerancia: existente?.tolerancia ?? "",
            };
          });

          setProductoAValidar({
            producto: producto.producto,
            identificadores: producto.identificadores,
            identificadoresProductos: registros,
            imagenes: producto.imagenes,
          });
        } else {
          console.error(
            "Error al obtener el producto a validar:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Error al hacer fetch del producto a validar:", error);
      }
    };

    fetchProductoAValidar();
  }, [idProductoValidar]);

  useEffect(() => {
    const fetchActores = async () => {
      try {
        const response = await axios.get("/api/ProductEngineering/getActores");
        if (response.data.success) {
          setActores(response.data.actores);
        } else {
          console.error("Error al obtener los actores:", response.data.message);
        }
      } catch (error) {
        console.error("Error al hacer fetch de los actores:", error);
      }
    };

    fetchActores();
  }, []);

  const getNombreCompleto = (id) => {
    const user = allUsers.find((user) => user.id === id);
    return user ? `${user.nombre} ${user.apellidos}` : "";
  };

  const handleAbrirPDF = async () => {
    // Mostrar alerta de carga
    Swal.fire({
      title: "Generando...",
      text: "Estamos procesando el archivo, por favor espere...",
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const creadoPor = getNombreCompleto(
        productoAValidar.producto?.creado_por
      );
      const validadoPor = getNombreCompleto(
        productoAValidar.producto?.validado_por
      );
      const toleranciasPor = getNombreCompleto(
        productoAValidar.producto?.tolerancias_por
      );
      const blob = await pdf(
        <FichaTecnicaPDF
          producto={productoAValidar}
          imagenAdicional={imagenSeleccionadaPreview}
          nombreCreado={creadoPor}
          nombreValidacion={validadoPor}
          nombreTolerancias={toleranciasPor}
        />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");

      Swal.close(); // solo cerrar cuando termine
    } catch (error) {
      console.error("Error al generar PDF:", error);
      Swal.fire({
        icon: "error",
        title: "Error...",
        text: "Hubo un error al generar el PDF.",
      });
    }
  };

  const handleImagenSeleccionada = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Validar tipo MIME
    if (!file.type.startsWith("image/")) {
      Swal.fire({
        title: "Error",
        text: `El archivo "${file.name}" no tiene un formato permitido. Solo se permiten archivos de tipo imagen.`,
        icon: "error",
        timer: 3000,
        showConfirmButton: false,
      });
      document.getElementById("imagen").value = null;
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
      document.getElementById("imagen").value = null;
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagenSeleccionadaPreview(reader.result); // Guardar base64
    };
    reader.readAsDataURL(file);
  };

  const todasToleranciasLlenas = productoAValidar?.identificadoresProductos
    ?.filter((p) => {
      const identificador = productoAValidar.identificadores.find(
        (i) => i.id === p.identificador_id
      );
      return identificador?.medicion?.trim(); // Solo pasa si existe y no está vacía
    })
    .every((p) => p.tolerancia !== undefined && p.tolerancia !== "");

  const formularioCompleto = () => {
    return (
      productoAValidar?.producto?.composicion?.trim() &&
      // productoAValidar?.producto?.modo_empleo?.trim() &&
      productoAValidar?.producto?.condiciones?.trim() &&
      productoAValidar?.producto?.materia_extraña?.trim() &&
      productoAValidar?.producto?.consideracion?.trim() &&
      todasToleranciasLlenas
    );
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

    const usuariosANotificar = actores.filter(
      (actor) => actor.tipo === 2 && actor.eliminado === 0
    );

    try {
      const response = await axios.post(
        "/api/ProductEngineering/generarFichaTecnica",
        {
          idProductoValidar,
          productoAValidar,
          imagenSeleccionadaPreview,
          idUser,
        }
      );

      if (response.data.success) {
        try {
          const enviarNotificacion = await fetch(
            "/api/Reminder/envioEventoActores",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                formData2: {
                  tipo: "Alerta de nueva ficha técnica",
                  descripcion: `<strong>${nombreUsuario} ${apellidosUsuario}</strong> ha generado una nueva ficha técnica del producto con el nombre: 
                <strong>${productoAValidar?.producto.nombre}</strong>.`,
                  id: idUser,
                  dpto: null,
                  actores: usuariosANotificar,
                },
              }),
            }
          );

          if (enviarNotificacion.ok) {
            Swal.fire({
              title: "Éxito",
              text: "Ficha técnica generada correctamente",
              icon: "success",
              showConfirmButton: true,
            }).then(() => {
              window.location.href = "/configuraciones/cmd/Productos";
            });
          } else {
            console.error("Error al enviar la notificación");
            Swal.fire("Error", "Error al enviar la notificación", "error");
          }
        } catch (error) {
          console.error("Error en la solicitud de notificación:", error);
          Swal.fire("Error", "Error en la notificación", "error");
        }
      } else {
        Swal.fire({
          title: "Error",
          text: response.data.message,
          icon: "error",
          showConfirmButton: true,
        });
      }
    } catch (error) {
      console.error("Error al agregar proveedor:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo generar la ficha técnica",
        icon: "error",
        showConfirmButton: true,
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div>
        <Link href="/configuraciones/cmd/Productos">
          <Button>
            <CornerDownLeft className="h-4 w-4" />
            Regresar
          </Button>
        </Link>
      </div>
      <div className="flex justify-center items-center text-center mb-8">
        <CardTitle className="text-3xl font-bold">
          Generar ficha técnica
        </CardTitle>
      </div>
      <div className="flex justify-center mb-4">
        <form
          onSubmit={handleSubmit}
          className="w-[1400px] border border-gray-300 rounded-lg shadow-md p-6 bg-white"
        >
          <div
            style={{ backgroundColor: "lightgreen" }}
            className="grid grid-cols-2 gap-4 mb-6"
          >
            <div className="space-y-2 col-span-2 text-center">
              <Label style={{ fontSize: "20px" }}>
                Información general del producto
              </Label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                style={{
                  borderColor: "black",
                  borderWidth: "2px",
                  backgroundColor: "#f7f7f7",
                }}
                id="nombre"
                name="nombre"
                type="text"
                value={productoAValidar?.producto.nombre || ""}
                onChange={(e) =>
                  setProductoAValidar({
                    ...productoAValidar,
                    producto: {
                      ...productoAValidar?.producto,
                      nombre: e.target.value,
                    },
                  })
                }
                placeholder="Nombre del producto"
                readOnly={true}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="no_articulo">No. de artículo (Código Odoo)</Label>
              <Input
                style={{
                  borderColor: "black",
                  borderWidth: "2px",
                  backgroundColor: "#f7f7f7",
                }}
                id="no_articulo"
                name="no_articulo"
                type="text"
                value={productoAValidar?.producto.codigo || ""}
                onChange={(e) =>
                  setProductoAValidar({
                    ...productoAValidar,
                    producto: {
                      ...productoAValidar?.producto,
                      codigo: e.target.value,
                    },
                  })
                }
                placeholder="Código Odoo"
                readOnly={true}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="nombre">Composición</Label>
              <Input
                id="nombre"
                name="nombre"
                type="text"
                value={productoAValidar?.producto?.composicion || ""}
                onChange={(e) =>
                  setProductoAValidar({
                    ...productoAValidar,
                    producto: {
                      ...productoAValidar?.producto,
                      composicion: e.target.value,
                    },
                  })
                }
                placeholder="Composición del producto"
                required
              />
            </div>
            {/* <div className="space-y-2">
                    <Label htmlFor="no_articulo">Modo de empleo (uso)</Label>
                    <Input id="no_articulo" name="no_articulo" type="text" value={productoAValidar?.producto?.modo_empleo || ''} onChange={(e) => setProductoAValidar({...productoAValidar, producto: {...productoAValidar?.producto, modo_empleo: e.target.value},})} placeholder="Modo de empleo del producto" required/>
                </div> */}
          </div>

          <div
            style={{ backgroundColor: "lightgreen" }}
            className="grid grid-cols-2 gap-4 mb-6"
          >
            <div className="space-y-2 col-span-2 text-center">
              <Label style={{ fontSize: "20px" }}>
                Pruebas de identificación
              </Label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Columna izquierda: otras mediciones diferentes de mm */}
            <div className="space-y-2">
              <div className="space-y-2 text-center">
                <Label style={{ fontSize: "18px" }}>Otras mediciones</Label>
              </div>

              {productoAValidar?.identificadores?.filter(
                (i) =>
                  i.medicion && i.medicion.trim() !== "" && i.medicion !== "MM."
              ).length === 0 ? (
                <p
                  style={{ marginTop: "45px" }}
                  className="text-center text-gray-500"
                >
                  No hay identificadores con otras mediciones.
                </p>
              ) : (
                productoAValidar?.identificadores
                  .filter(
                    (identificador) =>
                      identificador.medicion &&
                      identificador.medicion.trim() !== "" &&
                      identificador.medicion !== "MM."
                  )
                  .map((identificador, index) => (
                    <div
                      key={identificador.id}
                      className="flex gap-4 items-start"
                    >
                      {/* Columna izquierda: identificador */}
                      <div className="flex flex-col flex-1 gap-y-1.5">
                        <Label htmlFor={identificador.nombre} className="mb-1">
                          {identificador.nombre}
                        </Label>
                        <Input
                          id={identificador.nombre}
                          name={identificador.nombre}
                          type={
                            identificador.calculable === 1 ? "number" : "text"
                          }
                          step={
                            identificador.calculable === 1 ? "0.01" : undefined
                          }
                          readOnly={true}
                          value={
                            productoAValidar.identificadoresProductos.find(
                              (i) => i.identificador_id === identificador.id
                            )?.[
                              identificador.calculable === 1
                                ? "registroN"
                                : "registroV"
                            ] || ""
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            if (identificador.calculable === 1) {
                              if (
                                value === "" ||
                                /^\d*\.?\d{0,2}$/.test(value)
                              ) {
                                const nuevosIdentificadores =
                                  productoAValidar.identificadoresProductos.map(
                                    (item) => {
                                      if (
                                        item.identificador_id ===
                                        identificador.id
                                      ) {
                                        return {
                                          ...item,
                                          registroN: value,
                                        };
                                      }
                                      return item;
                                    }
                                  );
                                setProductoAValidar({
                                  ...productoAValidar,
                                  identificadoresProductos:
                                    nuevosIdentificadores,
                                });
                              }
                            } else {
                              const nuevosIdentificadores =
                                productoAValidar.identificadoresProductos.map(
                                  (item) => {
                                    if (
                                      item.identificador_id === identificador.id
                                    ) {
                                      return {
                                        ...item,
                                        registroV: value,
                                      };
                                    }
                                    return item;
                                  }
                                );
                              setProductoAValidar({
                                ...productoAValidar,
                                identificadoresProductos: nuevosIdentificadores,
                              });
                            }
                          }}
                          placeholder={`Valor de ${identificador.nombre.toLowerCase()}`}
                        />
                      </div>

                      {/* Columna derecha: tolerancia */}
                      <div className="flex flex-col w-40 gap-y-1.5">
                        {index === 0 ? (
                          <Label
                            htmlFor={`${identificador.nombre}-tolerancia`}
                            className="mb-1"
                          >
                            Tolerancia %
                          </Label>
                        ) : (
                          <div className="h-[18px]" /> // Espaciador visual igual al alto del label anterior
                        )}
                        <Input
                          id={`${identificador.nombre}-tolerancia`}
                          name={`${identificador.nombre}-tolerancia`}
                          type="number"
                          required
                          value={
                            productoAValidar.identificadoresProductos.find(
                              (i) => i.identificador_id === identificador.id
                            )?.tolerancia || ""
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            const nuevosIdentificadores =
                              productoAValidar.identificadoresProductos.map(
                                (item) => {
                                  if (
                                    item.identificador_id === identificador.id
                                  ) {
                                    return {
                                      ...item,
                                      tolerancia: value,
                                    };
                                  }
                                  return item;
                                }
                              );

                            setProductoAValidar({
                              ...productoAValidar,
                              identificadoresProductos: nuevosIdentificadores,
                            });
                          }}
                          placeholder="± Tolerancia"
                        />
                      </div>
                    </div>
                  ))
              )}
            </div>

            {/* Columna derecha: solo mediciones en mm */}
            <div className="space-y-2">
              <div className="space-y-2 text-center">
                <Label style={{ fontSize: "18px" }}>Medidas en mm</Label>
              </div>

              {productoAValidar?.identificadores?.filter(
                (i) => i.medicion === "MM."
              ).length === 0 ? (
                <p
                  style={{ marginTop: "45px" }}
                  className="text-center text-gray-500"
                >
                  No hay identificadores con medición en mm.
                </p>
              ) : (
                productoAValidar?.identificadores
                  .filter((identificador) => identificador.medicion === "MM.")
                  .map((identificador, index) => (
                    <div
                      key={identificador.id}
                      className="flex gap-4 items-start"
                    >
                      {/* Columna izquierda: identificador */}
                      <div className="flex flex-col flex-1 gap-y-1.5">
                        <Label htmlFor={identificador.nombre} className="mb-1">
                          {identificador.nombre}
                        </Label>
                        <Input
                          id={identificador.nombre}
                          name={identificador.nombre}
                          type={
                            identificador.calculable === 1 ? "number" : "text"
                          }
                          step={
                            identificador.calculable === 1 ? "0.01" : undefined
                          }
                          readOnly={true}
                          value={
                            productoAValidar.identificadoresProductos.find(
                              (i) => i.identificador_id === identificador.id
                            )?.[
                              identificador.calculable === 1
                                ? "registroN"
                                : "registroV"
                            ] || ""
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            if (identificador.calculable === 1) {
                              if (
                                value === "" ||
                                /^\d*\.?\d{0,2}$/.test(value)
                              ) {
                                const nuevosIdentificadores =
                                  productoAValidar.identificadoresProductos.map(
                                    (item) => {
                                      if (
                                        item.identificador_id ===
                                        identificador.id
                                      ) {
                                        return {
                                          ...item,
                                          registroN: value,
                                        };
                                      }
                                      return item;
                                    }
                                  );
                                setProductoAValidar({
                                  ...productoAValidar,
                                  identificadoresProductos:
                                    nuevosIdentificadores,
                                });
                              }
                            } else {
                              const nuevosIdentificadores =
                                productoAValidar.identificadoresProductos.map(
                                  (item) => {
                                    if (
                                      item.identificador_id === identificador.id
                                    ) {
                                      return {
                                        ...item,
                                        registroV: value,
                                      };
                                    }
                                    return item;
                                  }
                                );
                              setProductoAValidar({
                                ...productoAValidar,
                                identificadoresProductos: nuevosIdentificadores,
                              });
                            }
                          }}
                          placeholder={`Valor de ${identificador.nombre.toLowerCase()}`}
                        />
                      </div>

                      {/* Columna derecha: tolerancia */}
                      <div className="flex flex-col w-40 gap-y-1.5">
                        {index === 0 ? (
                          <Label
                            htmlFor={`${identificador.nombre}-tolerancia`}
                            className="mb-1"
                          >
                            Tolerancia %
                          </Label>
                        ) : (
                          <div className="h-[18px]" /> // Espaciador visual igual al alto del label anterior
                        )}
                        <Input
                          id={`${identificador.nombre}-tolerancia`}
                          name={`${identificador.nombre}-tolerancia`}
                          type="number"
                          required
                          value={
                            productoAValidar.identificadoresProductos.find(
                              (i) => i.identificador_id === identificador.id
                            )?.tolerancia || ""
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            const nuevosIdentificadores =
                              productoAValidar.identificadoresProductos.map(
                                (item) => {
                                  if (
                                    item.identificador_id === identificador.id
                                  ) {
                                    return {
                                      ...item,
                                      tolerancia: value,
                                    };
                                  }
                                  return item;
                                }
                              );

                            setProductoAValidar({
                              ...productoAValidar,
                              identificadoresProductos: nuevosIdentificadores,
                            });
                          }}
                          placeholder="± Tolerancia"
                        />
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>

          <div
            style={{ backgroundColor: "lightgreen" }}
            className="grid grid-cols-2 gap-4 mb-6 mt-6"
          >
            <div className="space-y-2 col-span-2 text-center">
              <Label style={{ fontSize: "20px" }}>Información adicional</Label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="materia_extraña">Materia extraña</Label>
              <Textarea
                id="materia_extraña"
                name="materia_extraña"
                value={productoAValidar?.producto?.materia_extraña || ""}
                onChange={(e) =>
                  setProductoAValidar({
                    ...productoAValidar,
                    producto: {
                      ...productoAValidar?.producto,
                      materia_extraña: e.target.value,
                    },
                  })
                }
                placeholder="..."
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="condiciones">Condiciones de almacenamiento</Label>
              <Textarea
                id="condiciones"
                name="condiciones"
                value={productoAValidar?.producto?.condiciones || ""}
                onChange={(e) =>
                  setProductoAValidar({
                    ...productoAValidar,
                    producto: {
                      ...productoAValidar?.producto,
                      condiciones: e.target.value,
                    },
                  })
                }
                placeholder="..."
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="consideracion">
                Consideración sobre la disposición
              </Label>
              <Textarea
                id="consideracion"
                name="consideracion"
                value={productoAValidar?.producto?.consideracion || ""}
                onChange={(e) =>
                  setProductoAValidar({
                    ...productoAValidar,
                    producto: {
                      ...productoAValidar?.producto,
                      consideracion: e.target.value,
                    },
                  })
                }
                placeholder="..."
                required
              />
            </div>
          </div>

          <div
            style={{ backgroundColor: "lightgreen" }}
            className="grid grid-cols-2 gap-4 mb-6"
          >
            <div className="space-y-2 col-span-2 text-center">
              <Label style={{ fontSize: "20px" }}>Imagen</Label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2 col-span-2">
              <Input
                id="imagen"
                name="imagen"
                type="file"
                accept="image/*"
                onChange={(e) => handleImagenSeleccionada(e)}
                className="mx-auto"
              />
              {imagenSeleccionadaPreview && (
                <img
                  src={imagenSeleccionadaPreview}
                  alt="Previsualización"
                  className="mx-auto mt-2 max-h-48 rounded-md border"
                />
              )}
            </div>
          </div>
          <Button
            onClick={handleAbrirPDF}
            type="submit"
            className="w-full"
            disabled={!formularioCompleto()}
          >
            Guardar ficha técnica
          </Button>
        </form>
      </div>
    </div>
  );
}

function Spinner() {
  return <div className="spinner" />;
}
