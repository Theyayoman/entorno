import React, { useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import axios from "axios";
import {
  PillBottle,
  Milk,
  Pill,
  CircleDot,
  Pipette,
  CircleSlash2,
  CircleDotDashed,
  Undo2,
} from "lucide-react";

export default function ListaSubCategoria(props) {
  const {
    tipoId,
    categoriaId,
    sendSubcategoriaToSelector,
    goBack,
    tieneSubcategorias,
  } = props;
  const [subcategorias, setSubcategorias] = React.useState([]);
  const iconosPorTipo = {
    Bulbos: Pipette,
    Insertos: Pipette,
    Pomaderas: PillBottle,
    "Redonda industrial": Milk,
    "Tarros especiales": PillBottle,
    Plásticas: Milk,
    Cosméticas: Milk,
    Altas: CircleSlash2,
    Bajas: CircleDot,
    "Flip top": CircleSlash2,
    "Disc top": CircleDotDashed,
  };

  useEffect(() => {
    if (!categoriaId) {
      setSubcategorias([]);
      return;
    }

    const fetchSubcategorias = async () => {
      await axios
        .get("/api/ProductEngineering/getEspecificaciones", {
          params: {
            tipoId: tipoId,
            categoriaId: categoriaId,
          },
        })
        .then((response) => {
          setSubcategorias(response.data.especificaciones);
        })
        .catch((error) => {
          console.error("Error al hacer fetch de las subcategorias:", error);
        });
    };

    fetchSubcategorias();
  }, [categoriaId]);

  const handleClick = (subcategoria) => {
    sendSubcategoriaToSelector(subcategoria);
  };
  const handleBack = () => {
    goBack();
  };

  return (
    <>
      <div>
        {tieneSubcategorias}
        <div className="grid grid-cols-3 gap-4">
          {categoriaId && tieneSubcategorias && (
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
          {subcategorias.map((subcategoria) => {
            const Icono = iconosPorTipo[subcategoria.nombre] || Package;

            return (
              <Card
                className="cursor-pointer py-4"
                key={subcategoria.id}
                onClick={() => handleClick(subcategoria)}
              >
                <Icono className="mx-auto" size={100} strokeWidth={2} />
                <CardContent>
                  <Typography
                    className="text-center"
                    gutterBottom
                    variant="h5"
                    component="div"
                  >
                    {subcategoria.nombre}
                  </Typography>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}
