'use client'

import { LevantamientoRequerimientos as L } from '@/components/Ventas/Components/crud_levantamiento';
import { Suspense } from 'react'
function Levantamientos() {
  return (
    <Suspense>
    <div>
      <L />
    </div>
    </Suspense>
  );
}

export default Levantamientos;