"use client";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { EditarProspecto as E } from "@/components/Ventas/Components/editar_prospecto";
import { CornerDownLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function EditarProspecto() {
  const { id } = useParams();
  const handleUpdate = () => {
    window.location.href = "/ventas/prospectos";
  };

  return (
    <>
      <Link href="/ventas/prospectos">
        <Button>
          <CornerDownLeft className="h-4 w-4" />
          Regresar
        </Button>
      </Link>
      <div>
        <div className="flex justify-center items-center text-center mb-8">
          <CardTitle className="text-3xl font-bold">Editar prospecto</CardTitle>
        </div>
        <E id={id} EmitUpdate={handleUpdate} />
      </div>
    </>
  );
}
