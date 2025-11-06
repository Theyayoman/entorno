import { TablaSolicitudes as Soli } from "@/components/Gente & Cultura Permission/Components/tabla_solicitudes";
import { Suspense } from 'react'
function page() {
      return (
        <Suspense>
        <div>
          <Soli />
        </div>
        </Suspense>
      );
}

export default page;