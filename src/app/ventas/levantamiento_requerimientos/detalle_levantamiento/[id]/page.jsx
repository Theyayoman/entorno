"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Button } from "@mui/material";
import { Button as ButtonRadix } from "@/components/ui/button";
import { Undo2 } from "lucide-react";
import { SquarePen } from "lucide-react";
import { EditarProspecto } from "@/components/Ventas/Components/editar_prospecto";
import { CatalogoProductos } from "@/components/ING PRODUCTO/Components/catalogo_productos";
import DetalleProspecto from "@/components/Ventas/Components/detalle_prospecto";
import ContenedorReferencias from "@/components/Ventas/Components/contenedor_referencias";
import LevantamientoIdentidadForm from "@/components/Ventas/Components/levantamineto_identidad_form";
import { LevantamientoReferencias } from "@/components/Ventas/Components/levantamiento_referencias";
import { LevantamientoFormulaciones } from "@/components/Ventas/Components/levantamiento_formulaciones";
import { LevantamientoEtiquetado } from "@/components/Ventas/Components/levantamiento_etiquetado";
import { LevantamientoDistribuidores } from "@/components/Ventas/Components/levantamiento_distribuidores";
import { LevantamientoProducto } from "@/components/Ventas/Components/levantamiento_nombre_producto";
import Link from "next/link";
import { CornerDownLeft } from "lucide-react";

export default function Page() {
  const { id } = useParams();
  const red = "#0565ed";

  const [isVisible, setIsVisible] = useState({
    prospecto: true,
    identidad: false,
    referencia: false,
    formulacion: false,
    producto: false,
    etiqueta: false,
    distribucion: false,
    nombre: false,
  });
  const [isEditarActive, setIsEditarActive] = useState({
    prospecto: false,
    identidad: false,
    referencia: false,
    formulacion: false,
    producto: false,
    etiqueta: false,
    distribucion: false,
    nombre: false,
  });
  const [isLevantamientochange, setIsLevantamientochange] = useState(false);

  const [levantamiento, setLevantamiento] = useState({});
  useEffect(() => {
    if (!id) return;
    const fetchLevantamiento = async () => {
      await axios
        .get(`/api/Sales/getLevantamiento?id=${id}`)
        .then((res) => {
          setLevantamiento(res.data.levantamiento);
        })
        .catch((error) => {
          console.error("Error al obtener el levantamiento:", error);
        });
    };
    fetchLevantamiento();
  }, [isLevantamientochange]);

  const handleToggleVisbility = (key) => {
    setIsVisible(() => ({
      ...isVisible,
      [key]: !isVisible[key],
    }));
  };

  const handleEditarActivity = (key) => {
    if (key === "identidad") {
      setIsLevantamientochange(!isLevantamientochange);
    }

    setIsEditarActive(() => ({
      ...isEditarActive,
      [key]: !isEditarActive[key],
    }));
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <>
      <div className="mb-4 h-full">
        <div className="w-border border-gray-300 rounded-lg shadow-md p-6 bg-white">
          <div className="flex justify-between items-center">
            <Link href="/ventas/levantamiento_requerimientos">
              <ButtonRadix>
                <CornerDownLeft className="h-4 w-4" />
                Regresar
              </ButtonRadix>
            </Link>
          </div>
          <div className="flex justify-center items-center text-center mb-8">
            <h1 className="text-3xl font-bold">Detalles del levantamiento</h1>
          </div>

          {/* Prospecto */}
          <div className="py-1">
            {!isVisible.prospecto && (
              <div
                className="border border-gray-300 p-4 rounded-lg  my-2"
                onClick={() => handleToggleVisbility("prospecto")}
              >
                <label>Cliente</label>
              </div>
            )}
            {levantamiento.id_prospecto && (
              <>
                {isVisible.prospecto && !isEditarActive.prospecto && (
                  <DetalleProspecto
                    id={levantamiento.id_prospecto}
                    emitEdit={() => handleEditarActivity("prospecto")}
                    emitVisible={() => handleToggleVisbility("prospecto")}
                  />
                )}
              </>
            )}
            {isEditarActive.prospecto && (
              <>
                <div>
                  <Button
                    style={{ width: "25px", height: "25px", color: "black" }}
                    onClick={() => {
                      handleEditarActivity("prospecto");
                    }}
                  >
                    <Undo2 />
                  </Button>
                </div>
                <div>
                  <EditarProspecto
                    id={levantamiento.id_prospecto}
                    EmitUpdate={() => handleEditarActivity("prospecto")}
                  />
                </div>
              </>
            )}
          </div>

          {/* Identidad */}
          <div className="py-1">
            {!isVisible.identidad && (
              <div
                className="border border-gray-300 p-4 rounded-lg my-2"
                onClick={() => handleToggleVisbility("identidad")}
              >
                <label>Identidad del producto</label>
              </div>
            )}
            {isVisible.identidad && !isEditarActive.identidad && (
              <>
                {levantamiento.id && (
                  <fieldset className="relative border-2 border-gray-200 rounded-xl p-6 bg-gradient-to-br from-gray-50 to-white shadow-sm">
                    <legend className="px-3 py-1 text-lg font-bold text-gray-800 bg-white border border-gray-200 rounded-lg shadow-sm gap-2">
                      <Button
                        onClick={() => handleToggleVisbility("identidad")}
                        style={{ color: "black" }}
                      >
                        Identidad del producto
                      </Button>
                      <Button
                        style={{ width: "25px", height: "25px" }}
                        onClick={() => handleEditarActivity("identidad")}
                      >
                        <SquarePen />
                      </Button>
                    </legend>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label> Público objetivo: </label>
                        <p>{levantamiento.publico_objetivo}</p>
                      </div>
                      <div>
                        <label> Canales de distribución: </label>
                        <p>{levantamiento.canales_distribucion}</p>
                      </div>
                      <div>
                        <label> Monto de inversión:</label>
                        <p>${levantamiento.monto_inversion} MXN</p>
                      </div>
                    </div>
                  </fieldset>
                )}
              </>
            )}
            {isEditarActive.identidad && (
              <>
                {levantamiento.id && (
                  <>
                    <div>
                      <Button
                        style={{
                          width: "25px",
                          height: "25px",
                          color: "black",
                        }}
                        onClick={() => {
                          handleEditarActivity("identidad");
                        }}
                      >
                        <Undo2 />
                      </Button>
                    </div>
                    <LevantamientoIdentidadForm
                      id={levantamiento.id}
                      emitUpdate={() => handleEditarActivity("identidad")}
                    />
                  </>
                )}
              </>
            )}
          </div>

          {/* Referencia */}
          <div className="pb-1">
            {!isVisible.referencia && (
              <div
                className="border border-gray-300 p-4 rounded-lg my-2"
                onClick={() => handleToggleVisbility("referencia")}
              >
                <label>Referencia</label>
              </div>
            )}
            {isVisible.referencia && !isEditarActive.referencia && (
              <>
                {levantamiento.id && (
                  <ContenedorReferencias
                    id={levantamiento.id}
                    emitVisible={() => handleToggleVisbility("referencia")}
                    emitEdit={() => handleEditarActivity("referencia")}
                  />
                )}
              </>
            )}
            {isEditarActive.referencia && (
              <>
                {levantamiento.id && (
                  <>
                    <div>
                      <Button
                        style={{
                          width: "25px",
                          height: "25px",
                          color: "black",
                        }}
                        onClick={() => {
                          handleEditarActivity("referencia");
                        }}
                      >
                        <Undo2 />
                      </Button>
                    </div>
                    <LevantamientoReferencias
                      id={levantamiento.id}
                      emitUpdate={() => handleEditarActivity("referencia")}
                    />
                  </>
                )}
              </>
            )}
          </div>

          {/* Formulaciones */}
          <div className="py-1">
            {!isVisible.formulacion && (
              <div
                onClick={() => handleToggleVisbility("formulacion")}
                // style={{
                //   border: `3px solid black`,
                //   fontSize: "20px",
                //   color: "black",
                // }}
                className="border border-gray-300 p-4 rounded-lg my-2"
              >
                <label>Formulaciones</label>
              </div>
            )}
            {isVisible.formulacion && (
              <>
                {levantamiento.id && (
                  <fieldset className="relative border-2 border-gray-200 rounded-xl p-6 bg-gradient-to-br from-gray-50 to-white shadow-sm">
                    <legend className="px-3 py-1 text-lg font-bold text-gray-800 bg-white border border-gray-200 rounded-lg shadow-sm gap-2">
                      <Button
                        onClick={() => handleToggleVisbility("formulacion")}
                        style={{ color: "black" }}
                      >
                        Formulaciones
                      </Button>
                    </legend>

                    <LevantamientoFormulaciones
                      id={levantamiento.id}
                      emitUpdate={() => handleToggleVisbility("formulacion")}
                    />
                  </fieldset>
                )}
              </>
            )}
          </div>
          {/* Productos */}

          <div className="py-1">
            <div
              onClick={() => handleToggleVisbility("producto")}
              style={{}}
              className="border border-gray-300 p-4 rounded-lg my-2"
            >
              <label>producto</label>
            </div>
            {isVisible.producto && <CatalogoProductos />}
          </div>

          {/* Etiquetas */}
          <div className="py-1">
            {!isVisible.etiqueta && (
              <div
                onClick={() => handleToggleVisbility("etiqueta")}
                style={{}}
                className="border border-gray-300 p-4 rounded-lg my-2"
              >
                <label>Etiquetado</label>
              </div>
            )}
            {isVisible.etiqueta && (
              <>
                {levantamiento.id && (
                  <fieldset className="relative border-2 border-gray-200 rounded-xl p-6 bg-gradient-to-br from-gray-50 to-white shadow-sm">
                    <legend className="px-3 py-1 text-lg font-bold text-gray-800 bg-white border border-gray-200 rounded-lg shadow-sm gap-2">
                      <Button
                        onClick={() => handleToggleVisbility("etiqueta")}
                        style={{ color: "black" }}
                      >
                        Etiquetado
                      </Button>
                    </legend>
                    <LevantamientoEtiquetado
                      id={levantamiento.id}
                      emitUpdate={() => handleToggleVisbility("etiqueta")}
                    />
                  </fieldset>
                )}
              </>
            )}
          </div>

          {/* Distribuciones */}
          <div className="py-1">
            {!isVisible.distribucion && (
              <div
                onClick={() => handleToggleVisbility("distribucion")}
                style={{}}
                className="border border-gray-300 p-4 rounded-lg my-2"
              >
                <label>Distribución</label>
              </div>
            )}
            {isVisible.distribucion && (
              <>
                {levantamiento.id && (
                  <fieldset className="relative border-2 border-gray-200 rounded-xl p-6 bg-gradient-to-br from-gray-50 to-white shadow-sm">
                    <legend className="px-3 py-1 text-lg font-bold text-gray-800 bg-white border border-gray-200 rounded-lg shadow-sm gap-2">
                      <Button
                        onClick={() => handleToggleVisbility("distribucion")}
                        style={{ color: "black" }}
                      >
                        Distribución
                      </Button>
                    </legend>
                    <LevantamientoDistribuidores
                      id={levantamiento.id}
                      emitUpdate={() => handleToggleVisbility("distribucion")}
                    />
                  </fieldset>
                )}
              </>
            )}
          </div>

          {/* Nombre */}
          <div className="py-1">
            {!isVisible.nombre && (
              <div
                onClick={() => handleToggleVisbility("nombre")}
                style={{}}
                className="border border-gray-300 p-4 rounded-lg my-2"
              >
                <label>Nombre de Producto</label>
              </div>
            )}
            {isVisible.nombre && (
              <>
                {levantamiento.id && (
                  <fieldset className="relative border-2 border-gray-200 rounded-xl p-6 bg-gradient-to-br from-gray-50 to-white shadow-sm">
                    <legend className="px-3 py-1 text-lg font-bold text-gray-800 bg-white border border-gray-200 rounded-lg shadow-sm gap-2">
                      <Button
                        onClick={() => handleToggleVisbility("nombre")}
                        style={{ color: "black" }}
                      >
                        Nombre de Producto
                      </Button>
                    </legend>
                    <LevantamientoProducto
                      id={levantamiento.id}
                      emitUpdate={() => handleToggleVisbility("nombre")}
                    />
                  </fieldset>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
