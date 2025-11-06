"use client";

import { useState, useEffect } from "react";
import styles from '../../../../public/CSS/spinner.css';
import { useSession } from "next-auth/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";

export default function LevantamientoIdentidadForm(props) {
  const { id, emitUpdate } = props;
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const idLevantamiento = searchParams.get("id") || id;
  const [levantamiento, setLevantamiento] = useState(null);
  const [imagenSeleccionadaPreview, setImagenSeleccionadaPreview] =
    useState(null);

  useEffect(() => {
    const fetchLevantamiento = async () => {
      try {
        const response = await axios.get(
          `/api/Sales/getLevantamiento?id=${idLevantamiento}`
        );
        if (response.data.success) {
          setLevantamiento(response.data.levantamiento);
        } else {
          console.error(
            "Error al obtener el levantamiento:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Error al hacer fetch del levantamiento:", error);
      }
    };

    fetchLevantamiento();
  }, []);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className={styles.spinner} />
        <p className="ml-3">Cargando...</p>
      </div>
    );
  }

  if (status == "loading") {
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
      allowOutsideClick: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await axios.post("/api/Sales/actualizarLevantamiento", {
        levantamiento,
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
          text: "Se ha actualizado correctamente",
          icon: "success",
          timer: 3000,
          showConfirmButton: false,
        }).then(() => {
          emitUpdate();
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Error al actualizar el registro",
          icon: "error",
          timer: 3000,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error("Error en la actualización:", err);
      Swal.close();
      Swal.fire({
        title: "Error",
        text: "Hubo un problema con la actualización",
        icon: "error",
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };

  const formularioCompleto = () => {
    return (
      levantamiento?.publico_objetivo &&
      levantamiento?.canales_distribucion &&
      levantamiento?.monto_inversion
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-center mb-4">
        <form
          onSubmit={handleSubmit}
          className="w-[1400px] border border-gray-300 rounded-lg shadow-md p-6 bg-white"
        >
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="publico_objetivo">Público objetivo</Label>
              <Textarea
                id="publico_objetivo"
                name="publico_objetivo"
                value={levantamiento?.publico_objetivo || ""}
                onChange={(e) =>
                  setLevantamiento({
                    ...levantamiento,
                    publico_objetivo: e.target.value,
                  })
                }
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
                value={levantamiento?.canales_distribucion || ""}
                onChange={(e) =>
                  setLevantamiento({
                    ...levantamiento,
                    canales_distribucion: e.target.value,
                  })
                }
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
                value={levantamiento?.monto_inversion || ""}
                onChange={(e) =>
                  setLevantamiento({
                    ...levantamiento,
                    monto_inversion: e.target.value,
                  })
                }
                placeholder="$"
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full mt-4"
            disabled={!formularioCompleto()}
          >
            Editar levantamiento
          </Button>
        </form>
      </div>
    </div>
  );
}

function Spinner() {
  return <div className="spinner" />;
}