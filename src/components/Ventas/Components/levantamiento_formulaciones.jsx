"use client";

import { useState, useEffect, useRef } from "react";
import styles from "../../../../public/CSS/spinner.css";
import { useSession } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { CornerDownLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function LevantamientoFormulaciones(props) {
  const { id, emitUpdate } = props;
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const idLevantamiento = searchParams.get("id") || id;
  const [levantamiento, setLevantamiento] = useState(null);

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
      allowOutsideClick: false, // Evita que se cierre haciendo clic fuera de la alerta
      willOpen: () => {
        Swal.showLoading(); // Muestra el indicador de carga (spinner)
      },
    });

    try {
      const response = await axios.post("/api/Sales/guardarFormulaciones", {
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
          text: "Las formulaciones se han guardado correctamente",
          icon: "success",
          timer: 3000,
          showConfirmButton: false,
        }).then(() => {
          emitUpdate();
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Error al guardar las formulaciones",
          icon: "error",
          timer: 3000,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error("Error en el guardado de las formulaciones:", err);
      Swal.close();
      Swal.fire({
        title: "Error",
        text: "Hubo un problema con el guardado de las formulaciones",
        icon: "error",
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-center mb-4">
        <form
          onSubmit={handleSubmit}
          className="w-full border border-gray-300 rounded-lg shadow-md p-6 bg-white"
        >
          <div
            style={{ backgroundColor: "rgb(31 41 55)" }}
            className="grid grid-cols-2 gap-4 mb-6"
          >
            <div className="space-y-2 col-span-2 text-center">
              <Label style={{ fontSize: "20px", color: "white" }}>
                Fórmula
              </Label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="tipoFormula">Tipo</Label>
              <Select
                onValueChange={(value) => {
                  setLevantamiento({
                    ...levantamiento,
                    formula: value,
                    formula_text: "",
                  });
                }}
                value={levantamiento?.formula?.toString() || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un valor" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="1">
                    Cliente proporciona propia fórmula
                  </SelectItem>
                  <SelectItem value="2">
                    Cliente solicita formulación
                  </SelectItem>
                  <SelectItem value="3">
                    Igualar a producto de referencia
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {levantamiento?.formula && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2 col-span-2">
                {levantamiento?.formula?.toString() === "1" ? (
                  <Label htmlFor="formula">Fórmula</Label>
                ) : (
                  <Label htmlFor="formula">Notas</Label>
                )}
                <Textarea
                  id="formula"
                  name="formula"
                  value={levantamiento?.formula_text || ""}
                  onChange={(e) =>
                    setLevantamiento({
                      ...levantamiento,
                      formula_text: e.target.value,
                    })
                  }
                  placeholder="..."
                />
              </div>
            </div>
          )}
          <div
            style={{ backgroundColor: "rgb(31 41 55)" }}
            className="grid grid-cols-2 gap-4 mb-6"
          >
            <div className="space-y-2 col-span-2 text-center">
              <Label style={{ fontSize: "20px", color: "white" }}>
                Dosificación
              </Label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="tipoDosificacion">Tipo</Label>
              <Select
                onValueChange={(value) => {
                  setLevantamiento({
                    ...levantamiento,
                    dosificacion: value,
                    dosificacion_text: "",
                  });
                }}
                value={levantamiento?.dosificacion?.toString() || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un valor" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="1">
                    Cantidad específica de contenido neto
                  </SelectItem>
                  <SelectItem value="2">
                    Duración específica de tratamiento
                  </SelectItem>
                  <SelectItem value="3">
                    Ajuste de dosis según costo unitario
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {levantamiento?.dosificacion && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2 col-span-2">
                {levantamiento?.dosificacion?.toString() === "1" ? (
                  <Label htmlFor="dosificacion">
                    Especifique cantidad deseada
                  </Label>
                ) : levantamiento?.dosificacion?.toString() === "2" ? (
                  <Label htmlFor="dosificacion">
                    Especifique cuánto quiere que dure el tratamiento
                  </Label>
                ) : (
                  <Label htmlFor="dosificacion">
                    ¿Cuánto espera pagar por pieza?
                  </Label>
                )}
                {levantamiento?.dosificacion?.toString() === "2" ? (
                  <Textarea
                    id="dosificacion"
                    name="dosificacion"
                    value={levantamiento?.dosificacion_text || ""}
                    onChange={(e) =>
                      setLevantamiento({
                        ...levantamiento,
                        dosificacion_text: e.target.value,
                      })
                    }
                    placeholder="..."
                  />
                ) : (
                  <Input
                    id="dosificacion"
                    name="dosificacion"
                    type="number"
                    value={levantamiento?.dosificacion_text || ""}
                    onChange={(e) =>
                      setLevantamiento({
                        ...levantamiento,
                        dosificacion_text: e.target.value,
                      })
                    }
                    placeholder={
                      levantamiento?.dosificacion?.toString() === "1"
                        ? "#"
                        : "$"
                    }
                  />
                )}
              </div>
            </div>
          )}
          <div
            style={{ backgroundColor: "rgb(31 41 55)" }}
            className="grid grid-cols-2 gap-4 mb-6"
          >
            <div className="space-y-2 col-span-2 text-center">
              <Label style={{ fontSize: "20px", color: "white" }}>
                Loteado
              </Label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="tipoLoteado">Tipo</Label>
              <Select
                onValueChange={(value) =>
                  setLevantamiento({
                    ...levantamiento,
                    loteado: value,
                    loteado_lenguaje: "",
                    loteado_caducidad: "",
                  })
                }
                value={levantamiento?.loteado?.toString() || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un valor" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="1">Sin loteado</SelectItem>
                  <SelectItem value="2">Loteado regular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {levantamiento?.loteado?.toString() === "2" && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="lenguajeLoteado">Lenguaje del loteado</Label>
                <RadioGroup
                  id={"lenguajeLoteado"}
                  value={levantamiento?.loteado_lenguaje?.toString() || ""}
                  onValueChange={(value) =>
                    setLevantamiento({
                      ...levantamiento,
                      loteado_lenguaje: value,
                    })
                  }
                  className="flex space-x-8"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id={"espanol"} />
                    <Label htmlFor={"espanol"}>Español</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2" id={"ingles"} />
                    <Label htmlFor={"ingles"}>Inglés</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="fecha_caducidad">Fecha de caducidad</Label>
                <RadioGroup
                  id={"fecha_caducidad"}
                  value={levantamiento?.loteado_caducidad?.toString() || ""}
                  onValueChange={(value) =>
                    setLevantamiento({
                      ...levantamiento,
                      loteado_caducidad: value,
                    })
                  }
                  className="flex space-x-8"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2" id={"si"} />
                    <Label htmlFor={"si"}>Sí</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id={"no"} />
                    <Label htmlFor={"no"}>No</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}
          <Button type="submit" className="w-full mt-4">
            Guardar formulaciones
          </Button>
        </form>
      </div>
    </div>
  );
}

function Spinner() {
  return <div className="spinner" />;
}
