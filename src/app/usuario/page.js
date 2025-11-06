import { UserManagementTable as S } from "@/components/Users/Components/user-management";
import { Suspense } from 'react'
function Usuario() {
  return (
    <Suspense>
    <div>
      <S />
    </div>
    </Suspense>
  );
}

export default Usuario;