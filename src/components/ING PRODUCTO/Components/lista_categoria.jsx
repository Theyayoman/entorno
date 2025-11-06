import React, { useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import axios from "axios";
import {
  PillBottle,
  ShoppingBag,
  FlaskConical,
  Package,
  SprayCan,
  Milk,
  Pill,
  ShieldBan,
  CircleDot,
  Pipette,
  Tablets,
  TestTube,
  Undo2,
  Redo2,
} from "lucide-react";
export default function ListaCategoria(props) {
  const { tipoId, sendCategoriaToSelector, goBack } = props;
  const [categorias, setCategorias] = React.useState([]);
  const iconosPorTipo = {
    Atomizadores: SprayCan,
    Botellas: Milk,
    Goteros: Pipette,
    Pastilleros: Tablets,
    Tarros: PillBottle,
    "Tubos depresibles": TestTube,
    Envases: PillBottle,
    Bolsas: ShoppingBag,
    Cápsulas: Pill,
    Tapas: CircleDot,
    "Artículos antipiratería": ShieldBan,
    "Fórmulas estrella": FlaskConical,
    "Empaques bajo desarrollo": Package,
  };

  useEffect(() => {
    if (!tipoId) {
      setCategorias([]);
      return;
    }

    const fetchCategorias = async () => {
      await axios
        .get("/api/ProductEngineering/getSubcategorias", {
          params: {
            tipoId: tipoId,
          },
        })
        .then((response) => {
          setCategorias(response.data.subcategorias);
        })
        .catch((error) => {
          console.error("Error al hacer fetch de las subcategorias:", error);
        });
    };

    fetchCategorias();
  }, [tipoId]);

  const handleClick = async (categoria) => {
    try {
      const response = await axios.get(
        "/api/ProductEngineering/getEspecificaciones",
        {
          params: {
            tipoId: tipoId,
            categoriaId: categoria.id,
          },
        }
      );

      if (response.data.especificaciones.length > 0) {
        const tieneSubcategorias = true;

        sendCategoriaToSelector({
          ...categoria,
          tiene_subcategorias: tieneSubcategorias,
        });
      } else {
        const tieneSubcategorias = false;
        sendCategoriaToSelector({
          ...categoria,
          tiene_subcategorias: tieneSubcategorias,
        });
      }
    } catch (error) {
      console.error("Error comprobando subcategorías:", error);
      sendCategoriaToSelector({
        ...categoria,
        tiene_subcategorias: false, // asumimos que no tiene
      });
    }
  };
  const handleBack = () => {
    goBack();
  };

  return (
    <>
      <div>
        <div className="grid grid-cols-3 gap-4">
          {tipoId && (
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
          {categorias.map((categoria) => {
            const Icono = iconosPorTipo[categoria.nombre] || Package;
            return (
              <Card
                className="cursor-pointer py-4"
                key={categoria.id}
                onClick={() => handleClick(categoria)}
              >
                <Icono className="mx-auto" size={100} strokeWidth={2} />
                <CardContent>
                  <Typography
                    className="text-center"
                    gutterBottom
                    variant="h5"
                    component="div"
                  >
                    {categoria.nombre}
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
