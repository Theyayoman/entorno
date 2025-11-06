import { Prospectos as P } from "@/components/Ventas/Components/crud_prospectos";
import { Suspense } from 'react'
function Prospectos() {
  return (
    <Suspense>
    <div>
      <P />
    </div>
    </Suspense>
  );
}

export default Prospectos;