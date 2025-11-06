'use client'

import { FichaTecnica as Fi } from "@/components/ING PRODUCTO/Components/generar_ficha_tecnica";
import { Suspense } from 'react'

function Estrategias() {
  return (
    <Suspense>
      <div>
        <Fi />
      </div>
    </Suspense>
  );
}

export default Estrategias;