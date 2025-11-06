import { ValidarProductoFormula as V } from "@/components/ING PRODUCTO/Components/validar_producto_formula";
import { Suspense } from 'react'
function Page() {
  return (
    <Suspense>
    <div>
      <V />
    </div>
    </Suspense>
  );
}

export default Page;