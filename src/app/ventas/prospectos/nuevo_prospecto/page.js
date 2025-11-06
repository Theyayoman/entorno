import { NuevoProspecto as N } from "@/components/Ventas/Components/nuevo_prospecto";
import { Suspense } from 'react'
function NuevoProspecto() {
  return (
    <Suspense>
    <div>
      <N />
    </div>
    </Suspense>
  );
}

export default NuevoProspecto;