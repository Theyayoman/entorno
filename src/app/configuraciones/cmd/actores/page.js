import { CMDActores as C } from "@/components/ING PRODUCTO/Components/cmd_actores";
import { Suspense } from 'react'
function Usuario() {
  return (
    <Suspense>
    <div>
      <C />
    </div>
    </Suspense>
  );
}

export default Usuario;