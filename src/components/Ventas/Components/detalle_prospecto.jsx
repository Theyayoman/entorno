"use client";
import React, { useEffect, useState } from "react";
import { SquarePen } from "lucide-react";
import { Button } from "@mui/material";
import axios from "axios";

export default function DetalleProspecto(props) {
  const { id, emitEdit, emitVisible } = props;
  const [prospecto, setProspecto] = useState(null);
  const [imagenSeleccionadaPreview, setImagenSeleccionadaPreview] =
    useState(null);

  const fetchArchivo = async (prospecto) => {
    const archivo = prospecto?.constancia;

    if (archivo) {
      const url = `/api/Sales/obtenerConstancia?rutaDocumento=${encodeURIComponent(
        archivo
      )}`;
      setImagenSeleccionadaPreview(url);
    }
  };

  useEffect(() => {
    if (!id) return;
    const fetchProspecto = async () => {
      try {
        const response = await axios.get(`/api/Sales/getProspecto?id=${id}`);
        if (response.data.success) {
          console.log({ prospecto: response.data.prospecto });
          setProspecto(response.data.prospecto);
          //   fetchArchivo(response.data.prospecto);
        } else {
          console.error(
            "Error al obtener el prospecto:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Error al hacer fetch del prospecto:", error);
      }
    };

    fetchProspecto();
  }, []);

  const handleEdit = () => {
    emitEdit();
  };
  return (
    <fieldset className="relative border-2 border-gray-200 rounded-xl p-6 bg-gradient-to-br from-gray-50 to-white shadow-sm">
      <legend className="px-3 py-1 text-lg font-bold text-gray-800 bg-white border border-gray-200 rounded-lg shadow-sm gap-2">
        <Button
          style={{ width: "25px", height: "25px", color: "black" }}
          onClick={() => emitVisible()}
        >
          {" "}
          <span>Cliente</span>{" "}
        </Button>
        <Button style={{ width: "25px", height: "25px" }} onClick={handleEdit}>
          <SquarePen />
        </Button>
      </legend>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre Completo
          </label>
          <p className="mt-1 text-sm text-gray-600">{prospecto?.nombre}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Número de Teléfono
          </label>
          <p className="mt-1 text-sm text-gray-600">{prospecto?.telefono}</p>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Correo Electrónico
          </label>
          <p className="mt-1 text-sm text-gray-600">{prospecto?.correo}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Marca
          </label>
          <p className="mt-1 text-sm text-gray-600">{prospecto?.marca}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Redes Sociales
          </label>
          <p className="mt-1 text-sm text-gray-600">
            {prospecto?.redes_sociales}
          </p>
        </div>
      </div>
    </fieldset>
  );
}
