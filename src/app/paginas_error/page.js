import { AccesoDenegado as Acceso } from "@/components/Error Pages/acceso_denegado";
import { Suspense } from 'react'
function page() {
      return (
        <Suspense>
        <div>
          <Acceso />
        </div>
        </Suspense>
      );
}

export default page;