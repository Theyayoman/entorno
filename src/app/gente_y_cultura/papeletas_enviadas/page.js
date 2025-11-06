import { TablaPermisosLevantados as PermisosLevantados } from "@/components/Gente & Cultura Permission/Components/tabla_permisos_levantados";
import { Suspense } from "react";
function page() {
  return (
    <Suspense>
      <div>
        <PermisosLevantados />
      </div>
    </Suspense>
  );
}

export default page;
