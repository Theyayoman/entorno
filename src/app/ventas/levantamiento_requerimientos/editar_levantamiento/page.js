import { EditarLevantamiento as E } from '@/components/Ventas/Components/editar_levantamiento';
import { Suspense } from 'react'
function EditarLevantamiento() {
  return (
    <Suspense>
    <div>
      <E />
    </div>
    </Suspense>
  );
}

export default EditarLevantamiento;