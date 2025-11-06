"use client";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { LevantamientoProducto as L } from "@/components/Ventas/Components/levantamiento_nombre_producto";
import { CornerDownLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
function NombreProducto() {
  const handleUpdate = () => {
    window.location.href = "/ventas/levantamiento_requerimientos";
  };
  return (
    <>
      <div className="flex justify-between items-center">
        <Link href="/ventas/levantamiento_requerimientos">
          <Button>
            <CornerDownLeft className="h-4 w-4" />
            Regresar
          </Button>
        </Link>
      </div>
      <div className="flex justify-center items-center text-center mb-8">
        <CardTitle className="text-3xl font-bold">
          Nombre del producto
        </CardTitle>
      </div>
      <Suspense>
        <div>
          <L emitUpdate={handleUpdate} />
        </div>
      </Suspense>
    </>
  );
}

export default NombreProducto;
