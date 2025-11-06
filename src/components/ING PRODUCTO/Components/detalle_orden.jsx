import { Button } from "@mui/material";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function DetalleOrden(props) {
  const { productoData, closeDetalle } = props;
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const prepareFormData = () => {
      setFormData({
        envase_id: productoData.Envases?.id || null,
        tapa_id: productoData.Tapas?.id || null,
        sello_id: productoData.Sellos?.id || null,
        formato_id: productoData.Formatos?.id || null,
        aditamentoaditamento_id: productoData.Aditamentos?.id || null,
      });
    };
    if (productoData) {
      prepareFormData();
    }
  }, [productoData]);

  const orderData = {
    orderId: "Resumen del prototipo",
  };

  const handleSave = async () => {
    try {
      const result = await Swal.fire({
        title: "¿Deseas guardar el prototipo?",
        text: "No podrás revertir esta acción",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#292929",
        cancelButtonColor: "#d33",
        confirmButtonText: "Guardar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        await axios
          .post("/api/ProductEngineering/guardarPrototipo", formData)
          .then(
            Swal.fire({
              title: "Guardado",
              text: "El prototipo ha sido guardado correctamente",
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              window.location.reload();
            })
          )
          .catch((error) => {
            console.error("Error al guardar el prototipo:", error);
            Swal.fire({
              title: "Error",
              text: "No se pudo guardar el prototipo contacte al administrador",
              icon: "error",
              showConfirmButton: false,
              timer: 1500,
            });
          });
      }
    } catch (error) {}
  };

  const handleClose = () => {
    closeDetalle(false);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            {orderData.orderId}
          </h2>
        </div>
        <div className="flex items-center mt-2 text-sm text-gray-600">
          <span>Realizado el {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="flex items-start justify-evenly">
          <div>
            <p className="text-sm font-medium text-gray-800">Envase</p>
            <p className="text-sm text-gray-600">
              {productoData.Envases?.nombre || "No hay articulo seleccionado"}
            </p>
          </div>
          {productoData.Envases?.imagenes[0] && (
            <Image
              src={`/api/ProductEngineering/obtenerImagenes?rutaImagen=${encodeURIComponent(
                productoData.Envases?.imagenes[0] || ""
              )}`}
              width={50}
              height={50}
              alt={productoData.Envases?.nombre}
            />
          )}
        </div>

        <div className="flex items-start mt-4 justify-evenly">
          <div>
            <p className="text-sm font-medium text-gray-800">Tapa</p>
            <p className="text-sm text-gray-600">
              {productoData.Tapas?.nombre || "No hay articulo seleccionado"}
            </p>
          </div>
          {productoData.Tapas?.imagenes[0] && (
            <Image
              src={`/api/ProductEngineering/obtenerImagenes?rutaImagen=${encodeURIComponent(
                productoData.Tapas?.imagenes[0] || ""
              )}`}
              width={50}
              height={50}
              alt={productoData.Tapas?.nombre}
            />
          )}
        </div>

        <div className="flex items-start mt-4 justify-evenly">
          <div>
            <p className="text-sm font-medium text-gray-800">Sello</p>
            <p className="text-sm text-gray-600">
              {productoData.Sellos?.nombre || "No hay articulo seleccionado"}
            </p>
          </div>
          {productoData.Sellos?.imagenes[0] && (
            <Image
              src={`/api/ProductEngineering/obtenerImagenes?rutaImagen=${encodeURIComponent(
                productoData.Sellos?.imagenes[0] || ""
              )}`}
              width={50}
              height={50}
              alt={productoData.Sellos?.nombre}
            />
          )}
        </div>

        <div className="flex items-start mt-4 justify-evenly">
          <div>
            <p className="text-sm font-medium text-gray-800">Aditamento</p>
            <p className="text-sm text-gray-600">
              {productoData.Aditamentos?.nombre ||
                "No hay articulo seleccionado"}
            </p>
          </div>
          {productoData.Aditamentos?.imagenes[0] && (
            <Image
              src={`/api/ProductEngineering/obtenerImagenes?rutaImagen=${encodeURIComponent(
                productoData.Aditamentos?.imagenes[0] || ""
              )}`}
              width={50}
              height={50}
              alt={productoData.Aditamentos?.nombre}
            />
          )}
        </div>

        <div className="flex items-start mt-4 justify-evenly">
          <div>
            <p className="text-sm font-medium text-gray-800">formato</p>
            <p className="text-sm text-gray-600">
              {productoData.Formatos?.nombre || "No hay articulo seleccionado"}
            </p>
          </div>
          {productoData.Formatos?.imagenes[0] && (
            <Image
              src={`/api/ProductEngineering/obtenerImagenes?rutaImagen=${encodeURIComponent(
                productoData.Formatos?.imagenes[0] || ""
              )}`}
              width={50}
              height={50}
              alt={productoData.Formatos?.nombre}
            />
          )}
        </div>
      </div>
      <div className="flex justify-end">
        <Button className="m-2 w-1/2" onClick={handleClose}>
          Cancelar
        </Button>
        <Button className="m-2 w-1/2" onClick={handleSave}>
          Guardar
        </Button>
      </div>
    </div>
  );
}
