import { EditarEstrategia as EditForm } from "@/components/Marketing Strategy/Components/editar_formulario";
import { Suspense } from 'react'
function page() {
      return (
        <Suspense>
        <div>
          <EditForm />
        </div>
        </Suspense>
      );
}

export default page;