"use client";
import { Button } from "@/components/ui/button";
import { LevantamientoReferencias as L } from "@/components/Ventas/Components/levantamiento_referencias";
import { CornerDownLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
function Referencias() {
  const handleUpdate = () => {
    window.location.href = "/ventas/levantamiento_requerimientos";
  };

  return (
    <Suspense>
      <div>
        <Link href="/ventas/levantamiento_requerimientos">
          <Button>
            <CornerDownLeft className="h-4 w-4" />
            Regresar
          </Button>
        </Link>
        <L emitUpdate={handleUpdate} />
      </div>
    </Suspense>
  );
}

export default Referencias;
