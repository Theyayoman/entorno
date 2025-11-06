"use client";

import { useState, useEffect } from "react";
import styles from "../../../../public/CSS/spinner.css";
import { useSession } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { CornerDownLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useUserContext } from "@/utils/userContext";

export function ValidarProducto() {
  const { userData, loading } = useUserContext();
  const nombreUsuario = userData?.user?.nombre;
  const apellidosUsuario = userData?.user?.apellidos;
  const idUser = userData?.user?.id;
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const idProductoValidar = searchParams.get("id");
  const [productoAValidar, setProductoAValidar] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const [tipoProducto, setTipoProducto] = useState("");
  const [actores, setActores] = useState([]);

  const imagenesBolsas = [
    "/public/imagenesValidaciones/dibujo bolsa 1.jpg",
    "/public/imagenesValidaciones/dibujo bolsa 2.jpg",
  ];
  const imagenesPastilleros = [
    "/public/imagenesValidaciones/dibujo envase 1.jpg",
    "/public/imagenesValidaciones/dibujo envase 3.jpg",
    "/public/imagenesValidaciones/dibujo envase 2.jpg",
  ];

  useEffect(() => {
    switch (tipoProducto.toString()) {
      case "1":
        setImagenes(imagenesPastilleros);
        break;
      case "2":
        setImagenes(imagenesBolsas);
        break;
      case "3":
        setImagenes([]);
        break;
      default:
        break;
    }
  }, [tipoProducto]);

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
            };
          });

          setProductoAValidar({
            producto: producto.producto,
            identificadores: producto.identificadores,
            identificadoresProductos: registros,
          });

          setTipoProducto(producto.producto.tipoEvaluacion);
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
      (actor) => actor.tipo === 4 && actor.eliminado === 0
    );

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
      const response = await axios.post(
        "/api/ProductEngineering/validarProducto",
        { idUser, idProductoValidar, productoAValidar }
      );

      Swal.close();

      if (!response.data.success) {
        Swal.fire("Error", response.data.message, "error");
        return;
      }

      if (response.data.success) {
        if (
          tipoProducto.toString() !== "6" &&
          productoAValidar?.producto?.veredicto?.toString() === "1"
        ) {
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
                    tipo: "Alerta de producto validado",
                    descripcion: `<strong>${nombreUsuario} ${apellidosUsuario}</strong> ha validado el producto con el nombre: 
                        <strong>${productoAValidar?.producto.nombre}</strong>.<br>
                          Puedes revisarlo haciendo clic en este enlace: <a href="/configuraciones/cmd/Productos" style="color: blue; text-decoration: underline;">Revisar producto</a>`,
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
                text: "El producto ha sido evaluado correctamente",
                icon: "success",
                timer: 3000,
                showConfirmButton: false,
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
            title: "Éxito",
            text: "El producto ha sido evaluado correctamente",
            icon: "success",
            timer: 3000,
            showConfirmButton: false,
          }).then(() => {
            window.location.href = "/configuraciones/cmd/Productos";
          });
        }
      } else {
        Swal.fire("Error", "Error al evaluar el producto", "error");
      }
    } catch (err) {
      console.error("Error en el registro:", err);
      Swal.close();
      Swal.fire("Error", "Hubo un problema con la evaluación", "error");
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
        <CardTitle className="text-3xl font-bold">Evaluar producto</CardTitle>
      </div>
      <div className="flex justify-center mb-4">
        <form
          onSubmit={handleSubmit}
          className="w-[1400px] border border-gray-300 rounded-lg shadow-md p-6 bg-white"
        >
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

          <div
            style={{ backgroundColor: "lightgreen" }}
            className="grid grid-cols-2 gap-4 mb-6"
          >
            <div className="space-y-2 col-span-2 text-center">
              <Label style={{ fontSize: "20px" }}>Validación</Label>
            </div>
          </div>
          <div className="flex justify-center mt-4 mb-6">
            <Select
              id="veredicto"
              name="veredicto"
              value={productoAValidar?.producto?.veredicto?.toString() || ""}
              onValueChange={(value) =>
                setProductoAValidar({
                  ...productoAValidar,
                  producto: {
                    ...productoAValidar?.producto,
                    veredicto: value,
                  },
                })
              }
            >
              <SelectTrigger className="w-[400px] mx-auto">
                <SelectValue placeholder="Seleccione el valor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Positiva</SelectItem>
                <SelectItem value="0">Negativa</SelectItem>
              </SelectContent>
            </Select>
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
                (i) => i.medicion !== "MM."
              ).length === 0 ? (
                <p
                  style={{ marginTop: "45px" }}
                  className="text-center text-gray-500"
                >
                  No hay identificadores con otras mediciones.
                </p>
              ) : (
                productoAValidar?.identificadores
                  .filter((identificador) => identificador.medicion !== "MM.")
                  .map((identificador) => (
                    <div key={identificador.id} className="space-y-2">
                      <Label htmlFor={identificador.nombre}>
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

                          // Si es calculable (número), validamos dos decimales
                          if (identificador.calculable === 1) {
                            // Acepta vacío, enteros o decimales con hasta dos dígitos
                            if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
                              const nuevosIdentificadores =
                                productoAValidar.identificadoresProductos.map(
                                  (item) => {
                                    if (
                                      item.identificador_id === identificador.id
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
                                identificadoresProductos: nuevosIdentificadores,
                              });
                            }
                          } else {
                            // Para texto normal
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
                  .map((identificador) => (
                    <div key={identificador.id} className="space-y-2">
                      <Label htmlFor={identificador.nombre}>
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

                          // Si es calculable (número), validamos dos decimales
                          if (identificador.calculable === 1) {
                            // Acepta vacío, enteros o decimales con hasta dos dígitos
                            if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
                              const nuevosIdentificadores =
                                productoAValidar.identificadoresProductos.map(
                                  (item) => {
                                    if (
                                      item.identificador_id === identificador.id
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
                                identificadoresProductos: nuevosIdentificadores,
                              });
                            }
                          } else {
                            // Para texto normal
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
                  ))
              )}
            </div>
          </div>

          <div
            style={{ backgroundColor: "lightgreen" }}
            className="grid grid-cols-2 gap-4 mb-6 mt-6"
          >
            <div className="space-y-2 col-span-2 text-center">
              <Label style={{ fontSize: "20px" }}>Ejemplos</Label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 justify-items-center mb-4">
            {imagenes.map((src, index) => {
              const isLast = index === imagenes.length - 1;
              const isOdd = imagenes.length % 2 !== 0;
              const shouldSpan = isOdd && isLast;

              return (
                <div
                  key={index}
                  className={shouldSpan ? "col-span-2 flex justify-center" : ""}
                >
                  <img
                    src={
                      src.startsWith("/public/")
                        ? src.replace("/public", "")
                        : src
                    }
                    alt={`Ejemplo ${index + 1}`}
                    className="w-full max-w-xs rounded shadow"
                    style={{ maxWidth: "500px", maxHeight: "500px" }}
                  />
                </div>
              );
            })}
          </div>
          <Button type="submit" className="w-full mt-4">
            Terminar evaluación
          </Button>
        </form>
      </div>
    </div>
  );
}

function Spinner() {
  return <div className="spinner" />;
}
