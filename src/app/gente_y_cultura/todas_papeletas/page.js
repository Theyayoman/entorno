import { TablaPermisosFalta as EditForm } from "@/components/Gente & Cultura Permission/Components/tabla_permisos_faltas";
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