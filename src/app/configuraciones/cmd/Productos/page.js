'use client'

import { CMDProductos as C } from "@/components/ING PRODUCTO/Components/cmd_productos";
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