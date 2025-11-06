"use client";

import { useState, useEffect } from "react";
import styles from "../../../../public/CSS/spinner.css";
import { useSession } from "next-auth/react";
import { CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Swal from "sweetalert2";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CornerDownLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useUserContext } from "@/utils/userContext";

export function ValidarProductoFormula() {
  const { userData, loading } = useUserContext();
  const idUser = userData?.user?.id;
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const idProductoValidar = searchParams.get("id");
  const [productoAValidar, setProductoAValidar] = useState(null);

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
              registroV: existente?.registroV ?? "",
            };
          });

          setProductoAValidar({
            producto: producto.producto,
            identificadores: producto.identificadores,
            identificadoresProductos: registros,
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
      const productoAValidarConVeredicto = {
        ...productoAValidar,
        producto: {
          ...productoAValidar?.producto,
          veredicto: "1",
        },
      };

      const response = await axios.post(
        "/api/ProductEngineering/validarProducto",
        {
          idUser,
          idProductoValidar,
          productoAValidar: productoAValidarConVeredicto,
        }
      );

      Swal.close();

      if (!response.data.success) {
        Swal.fire("Error", response.data.message, "error");
        return;
      }

      if (response.data.success) {
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
          <div className="grid grid-cols-2 gap-4 mb-4">
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

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoría</Label>
              <Select
                id="categoria"
                name="categoria"
                value={
                  productoAValidar?.identificadoresProductos[0]?.registroV || ""
                }
                onValueChange={(value) => {
                  const nuevosIdentificadores = [
                    ...productoAValidar.identificadoresProductos,
                  ];
                  nuevosIdentificadores[0] = {
                    ...nuevosIdentificadores[0],
                    registroV: value,
                  };
                  setProductoAValidar({
                    ...productoAValidar,
                    identificadoresProductos: nuevosIdentificadores,
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione la categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Herbal</SelectItem>
                  <SelectItem value="2">Categoría 2</SelectItem>
                  <SelectItem value="3">Categoría 3</SelectItem>
                  <SelectItem value="4">Categoría 4</SelectItem>
                  <SelectItem value="5">Categoría 5</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="linea">Línea</Label>
              <Select
                id="linea"
                name="linea"
                value={
                  productoAValidar?.identificadoresProductos[1]?.registroV || ""
                }
                onValueChange={(value) => {
                  const nuevosIdentificadores = [
                    ...productoAValidar.identificadoresProductos,
                  ];
                  nuevosIdentificadores[1] = {
                    ...nuevosIdentificadores[1],
                    registroV: value,
                  };
                  setProductoAValidar({
                    ...productoAValidar,
                    identificadoresProductos: nuevosIdentificadores,
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione la línea" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Económica</SelectItem>
                  <SelectItem value="2">Línea 2</SelectItem>
                  <SelectItem value="3">Línea 3</SelectItem>
                  <SelectItem value="4">Línea 4</SelectItem>
                  <SelectItem value="5">Línea 5</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="formato">Formato</Label>{" "}
              {/* Subfiltro de las categorias 'Deportivos'  */}
              <Select
                id="formato"
                name="formato"
                value={
                  productoAValidar?.identificadoresProductos[2]?.registroV || ""
                }
                onValueChange={(value) => {
                  const nuevosIdentificadores = [
                    ...productoAValidar.identificadoresProductos,
                  ];
                  nuevosIdentificadores[2] = {
                    ...nuevosIdentificadores[2],
                    registroV: value,
                  };
                  setProductoAValidar({
                    ...productoAValidar,
                    identificadoresProductos: nuevosIdentificadores,
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el formato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Líquido</SelectItem>
                  <SelectItem value="2">Formato 2</SelectItem>
                  <SelectItem value="3">Formato 3</SelectItem>
                  <SelectItem value="4">Formato 4</SelectItem>
                  <SelectItem value="5">Formato 5</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="presentacionSugerida">
                Presentación sugerida
              </Label>
              <Input
                id="presentacionSugerida"
                name="presentacionSugerida"
                type="text"
                value={
                  productoAValidar?.identificadoresProductos[3]?.registroV || ""
                }
                onChange={(e) => {
                  const value = e.target.value;
                  const nuevosIdentificadores = [
                    ...productoAValidar.identificadoresProductos,
                  ];
                  nuevosIdentificadores[3] = {
                    ...nuevosIdentificadores[3],
                    registroV: value,
                  };
                  setProductoAValidar({
                    ...productoAValidar,
                    identificadoresProductos: nuevosIdentificadores,
                  });
                }}
                placeholder="Presentación"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="modoEmpleo">Modo de empleo</Label>
              <Input
                id="modoEmpleo"
                name="modoEmpleo"
                type="text"
                value={
                  productoAValidar?.identificadoresProductos[4]?.registroV || ""
                }
                onChange={(e) => {
                  const value = e.target.value;
                  const nuevosIdentificadores = [
                    ...productoAValidar.identificadoresProductos,
                  ];
                  nuevosIdentificadores[4] = {
                    ...nuevosIdentificadores[4],
                    registroV: value,
                  };
                  setProductoAValidar({
                    ...productoAValidar,
                    identificadoresProductos: nuevosIdentificadores,
                  });
                }}
                placeholder="Modo"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="ingredientes">Ingredientes</Label>
              <Textarea
                id="ingredientes"
                name="ingredientes"
                value={
                  productoAValidar?.identificadoresProductos[5]?.registroV || ""
                }
                onChange={(e) => {
                  const value = e.target.value;
                  const nuevosIdentificadores = [
                    ...productoAValidar.identificadoresProductos,
                  ];
                  nuevosIdentificadores[5] = {
                    ...nuevosIdentificadores[5],
                    registroV: value,
                  };
                  setProductoAValidar({
                    ...productoAValidar,
                    identificadoresProductos: nuevosIdentificadores,
                  });
                }}
                placeholder="Ingredientes"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="funcionPrincipal">Función principal</Label>
              <Input
                id="funcionPrincipal"
                name="funcionPrincipal"
                type="text"
                value={
                  productoAValidar?.identificadoresProductos[6]?.registroV || ""
                }
                onChange={(e) => {
                  const value = e.target.value;
                  const nuevosIdentificadores = [
                    ...productoAValidar.identificadoresProductos,
                  ];
                  nuevosIdentificadores[6] = {
                    ...nuevosIdentificadores[6],
                    registroV: value,
                  };
                  setProductoAValidar({
                    ...productoAValidar,
                    identificadoresProductos: nuevosIdentificadores,
                  });
                }}
                placeholder="Función principal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="funcionEspecifica">Función específica</Label>
              <Input
                id="funcionEspecifica"
                name="funcionEspecifica"
                type="text"
                value={
                  productoAValidar?.identificadoresProductos[7]?.registroV || ""
                }
                onChange={(e) => {
                  const value = e.target.value;
                  const nuevosIdentificadores = [
                    ...productoAValidar.identificadoresProductos,
                  ];
                  nuevosIdentificadores[7] = {
                    ...nuevosIdentificadores[7],
                    registroV: value,
                  };
                  setProductoAValidar({
                    ...productoAValidar,
                    identificadoresProductos: nuevosIdentificadores,
                  });
                }}
                placeholder="Función específica"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="recomendadoPara">Recomendado para</Label>
              <Input
                id="recomendadoPara"
                name="recomendadoPara"
                type="text"
                value={
                  productoAValidar?.identificadoresProductos[8]?.registroV || ""
                }
                onChange={(e) => {
                  const value = e.target.value;
                  const nuevosIdentificadores = [
                    ...productoAValidar.identificadoresProductos,
                  ];
                  nuevosIdentificadores[8] = {
                    ...nuevosIdentificadores[8],
                    registroV: value,
                  };
                  setProductoAValidar({
                    ...productoAValidar,
                    identificadoresProductos: nuevosIdentificadores,
                  });
                }}
                placeholder="Recomendado para"
              />
            </div>
            <div className="space-y-2">
              <div className="space-y-2">
                <Label htmlFor="productosComplementarios">
                  Productos complementarios
                </Label>
                <Input
                  id="productosComplementarios"
                  name="productosComplementarios"
                  type="text"
                  value={
                    productoAValidar?.identificadoresProductos[9]?.registroV ||
                    ""
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    const nuevosIdentificadores = [
                      ...productoAValidar.identificadoresProductos,
                    ];
                    nuevosIdentificadores[9] = {
                      ...nuevosIdentificadores[9],
                      registroV: value,
                    };
                    setProductoAValidar({
                      ...productoAValidar,
                      identificadoresProductos: nuevosIdentificadores,
                    });
                  }}
                  placeholder="Productos complementarios"
                />
              </div>
            </div>
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
