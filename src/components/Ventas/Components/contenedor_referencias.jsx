"use client";
import { Button } from "@mui/material";
import axios from "axios";
import { SquarePen } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function ContenedorReferencias(props) {
  const { id, emitVisible, emitEdit } = props;
  const [referencias, setReferencias] = useState([]);

  useEffect(() => {
    const fetchReferencias = async () => {
      await axios.get(`/api/Sales/getReferencias?id=${id}`).then((res) => {
        const referenciasConImagenes = res.data.referencias.map((ref) => {
          const imagenes = [ref.img1, ref.img2, ref.img3, ref.img4]
            .filter(Boolean)
            .map((img) => ({
              id: crypto.randomUUID(),
              file: img,
            }));

          return {
            id: ref.id || "",
            nombre: ref.nombre || "",
            link: ref.link || "",
            notas: ref.notas || "",
            tipo: ref.tipo || "",
            imagenes,
          };
        });
        setReferencias(referenciasConImagenes);
      });
    };

    if (id) fetchReferencias();
  }, [id]);
  return (
    <fieldset className="relative border-2 border-gray-200 rounded-xl p-6 bg-gradient-to-br from-gray-50 to-white shadow-sm">
      <legend className="px-3 py-1 text-lg font-bold text-gray-800 bg-white border border-gray-200 rounded-lg shadow-sm">
        <Button onClick={emitVisible} style={{ color: "black" }}>
          Referencias
        </Button>
        <Button style={{ width: "25px", height: "25px" }} onClick={emitEdit}>
          <SquarePen />
        </Button>
      </legend>

      <div className="space-y-6 mt-4">
        {referencias.length === 0 && (
          <div className="text-center p-4 bg-gray-100 rounded-lg shadow-sm border border-gray-100">
            <p className="text-lx text-gray-500">
              No se han agregado referencias.
            </p>
          </div>
        )}
        {referencias.map((referencia) => (
          <div
            key={referencia.id}
            className="group bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-300"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {referencia.nombre}
              </h3>
            </div>

            <div className="space-y-3">
              {referencia.link && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-500">
                    Enlace:
                  </span>
                  <a
                    href={referencia.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline break-all"
                  >
                    {referencia.link}
                  </a>
                </div>
              )}

              {referencia.notas && (
                <div className="flex items-start gap-2">
                  <span className="text-sm font-medium text-gray-500 mt-0.5">
                    Notas:
                  </span>
                  <p className="text-sm text-gray-700 flex-1">
                    {referencia.notas}
                  </p>
                </div>
              )}
            </div>

            {referencia.imagenes && referencia.imagenes.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-500 mb-3">
                  Imágenes:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {referencia.imagenes.map((imagen) => (
                    <div
                      key={imagen.id}
                      className="relative group/image overflow-hidden rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200"
                    >
                      <Image
                        src={`/api/Sales/obtenerImagenesReferencias?rutaImagen=${encodeURIComponent(
                          imagen.file
                        )}`}
                        width={150}
                        height={150}
                        alt={referencia.nombre}
                        className="w-full h-32 group-hover/image:scale-105 transition-transform duration-300 object-contain"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover/image:bg-opacity-10 transition-all duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </fieldset>
  );
}
