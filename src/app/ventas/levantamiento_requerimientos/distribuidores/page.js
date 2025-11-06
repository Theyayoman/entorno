"use client";
import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { LevantamientoDistribuidores as L } from "@/components/Ventas/Components/levantamiento_distribuidores";
import { CornerDownLeft } from "lucide-react";
function Distribuidores() {
  const handleUpdate = () => {
    window.location.href = "/ventas/levantamiento_requerimientos";
  };
  return (
    <>
      <div>
        <Link href="/ventas/levantamiento_requerimientos">
          <Button>
            <CornerDownLeft className="h-4 w-4" />
            Regresar
          </Button>
        </Link>
      </div>
      <div className="flex justify-center items-center text-center mb-8">
        <CardTitle className="text-3xl font-bold">Distribuidores</CardTitle>
      </div>
      <Suspense>
        <div>
          <L emitUpdate={handleUpdate} />
        </div>
      </Suspense>
    </>
  );
}

export default Distribuidores;
