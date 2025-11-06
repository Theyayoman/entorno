import { ExploradorArchivos as EA } from "@/components/FTP/Components/explorador_archivos";
import { MultiFileUploadModalComponent as Multi } from "@/components/FTP/Components/multi-file-upload-modal"
import { Suspense } from "react";
function page() {
    return (
        <Suspense>
        <div style={{display:"flex"}}>
            <EA />
            <Multi />
        </div>
        </Suspense>
    );
}

export default page;