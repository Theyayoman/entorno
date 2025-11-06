import { AutorizarPapeletas as Auto } from "@/components/Gente & Cultura Permission/Components/autorizar_papeletas";
import { Suspense } from 'react'
function page() {
      return (
        <Suspense>
        <div>
          <Auto />
        </div>
        </Suspense>
      );
}

export default page;