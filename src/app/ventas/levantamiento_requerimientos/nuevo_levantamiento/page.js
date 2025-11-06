import { NuevoLevantamiento as N } from '@/components/Ventas/Components/nuevo_levantamiento';
import { Suspense } from 'react'
function NuevoLevantamiento() {
  return (
    <Suspense>
    <div>
      <N />
    </div>
    </Suspense>
  );
}

export default NuevoLevantamiento;