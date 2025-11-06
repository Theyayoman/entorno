import React, { useEffect } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { Undo2, Redo2 } from "lucide-react";

export default function ListaProducto(props) {
  const {
    nivel,
    tipoId,
    categoriaId,
    subcategoriaId,
    tieneSubcategorias,
    lastStep,
    currentStepIndex,
    goBack,
    sendProductoToSelector,
    goToDetail,
  } = props;
  const [productos, setProductos] = React.useState([]);

  useEffect(() => {
    const debeEsperarSubcategoria = tieneSubcategorias && !subcategoriaId;
    const codigoProducto = localStorage.getItem("envase");

    if (
      !tipoId ||
      (!categoriaId && !subcategoriaId) ||
      debeEsperarSubcategoria
    ) {
      setProductos([]);
      return;
    }
    const fetchProductos = async (code) => {
      if (code) {
        await axios
          .get("/api/ProductEngineering/getProductosCompatibles", {
            params: {
              codigo: code,
              tipo: tipoId,
              categoria: categoriaId,
              subcategoria: subcategoriaId ?? null,
            },
          })
          .then((response) => {
            setProductos(response.data.products);
          })
          .catch((error) => {
            console.error("Error al hacer fetch de los productos:", error);
          });
      } else {
        await axios
          .get("/api/ProductEngineering/getProductosImagenes", {
            params: {
              tipoId: tipoId,
              categoriaId: categoriaId,
              subcategoriaId: subcategoriaId ?? null,
            },
          })
          .then((response) => {
            setProductos(response.data.products);
          })
          .catch((error) => {
            console.error("Error al hacer fetch de los productos:", error);
          });
      }
    };

    fetchProductos(codigoProducto);
  }, [tipoId, categoriaId, subcategoriaId, tieneSubcategorias]);

  const handleBack = () => {
    goBack();
  };

  const handleClick = (producto) => {
    sendProductoToSelector(producto);
    if (currentStepIndex === lastStep) {
      goToDetail(true);
    }
  };

  return (
    <>
      <div>
        <div className="grid grid-cols-3 gap-4">
          {tipoId && (!tieneSubcategorias || subcategoriaId) && (
            <Card
              className="cursor-pointer py-4"
              key={"volver"}
              onClick={() => handleBack()}
            >
              <Undo2 className="mx-auto" size={100} strokeWidth={2} />
              <CardContent>
                <Typography
                  className="text-center"
                  gutterBottom
                  variant="h5"
                  component="div"
                >
                  Anterior
                </Typography>
              </CardContent>
            </Card>
          )}

          {productos.map((producto) => (
            <Card key={producto.id} onClick={() => handleClick(producto)}>
              {/* <Package /> */}
              <CardContent className="flex flex-col text-center">
                <div className="mx-auto">
                  <Image
                    src={`/api/ProductEngineering/obtenerImagenes?rutaImagen=${encodeURIComponent(
                      producto.imagenes?.[0] || ""
                    )}`}
                    width={200}
                    height={150}
                    alt={producto.nombre}
                  />
                </div>
                <Typography
                  className="text-center"
                  gutterBottom
                  variant="h5"
                  component="div"
                >
                  {producto.nombre}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
