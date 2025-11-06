import { TablaVacantes as Tabla } from "@/components/Gente & Cultura Permission/Components/tabla_vacantes";
import { Suspense } from 'react'
function page() {
      return (
        <Suspense>
        <div>
          <Tabla />
        </div>
        </Suspense>
      );
}

export default page;