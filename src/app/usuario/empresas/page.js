import { EmpresasTabla as Empresas } from "@/components/Company/Components/empresasTabla";
import { Suspense } from 'react'
function Usuario() {
  return (
    <Suspense>
    <div>
      <Empresas />
    </div>
    </Suspense>
  );
}

export default Usuario;