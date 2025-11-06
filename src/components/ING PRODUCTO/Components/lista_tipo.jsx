"use client";
import axios from "axios";
import React, { useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
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

export default function ListaTipo(props) {
  const { nivel, skip, sendTipoToSelector, goBack, skipStep } = props;
  const [tipos, setTipos] = React.useState([]);

  const iconosPorTipo = {
    Envases: PillBottle,
    Bolsas: ShoppingBag,
    Tapas: CircleDot,
    Atomizadores: SprayCan,
    Botellas: Milk,
    Goteros: Pipette,
    Pastilleros: Tablets,
    Tarros: PillBottle,
    "Tubos depresibles": TestTube,
    Cápsulas: Pill,
    "Artículos antipiratería": ShieldBan,
    "Fórmulas estrella": FlaskConical,
    "Empaques bajo desarrollo": Package,
  };

  useEffect(() => {
    if (!nivel) return;

    const fetchTipos = async () => {
      await axios
        .get("/api/ProductEngineering/getCategoriaGeneral", {
          params: {
            nivel: nivel,
          },
        })
        .then((response) => {
          setTipos(response.data.categorias);
        });
    };
    fetchTipos();
  }, []);

  const handleClick = (data) => {
    sendTipoToSelector(data);
  };

  const handleGoBack = () => {
    goBack();
  };
  const handleSkip = () => {
    skipStep();
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {nivel != 1 && (
          <Card
            className="cursor-pointer py-4"
            key={"volver"}
            onClick={() => handleGoBack()}
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
        {skip != 0 && (
          <Card
            className="cursor-pointer py-4"
            key={"skip"}
            onClick={() => handleSkip()}
          >
            <Redo2 className="mx-auto" size={100} strokeWidth={2} />
            <CardContent>
              <Typography
                className="text-center"
                gutterBottom
                variant="h5"
                component="div"
              >
                Siguiente
              </Typography>
            </CardContent>
          </Card>
        )}

        {tipos.map((tipo) => {
          const Icono = iconosPorTipo[tipo.nombre] || Package;

          return (
            <Card
              className="cursor-pointer py-4"
              key={tipo.id}
              onClick={() => handleClick(tipo)}
            >
              <Icono className="mx-auto" size={100} strokeWidth={2} />
              <CardContent>
                <Typography
                  className="text-center"
                  gutterBottom
                  variant="h5"
                  component="div"
                >
                  {tipo.nombre}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
