"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import styles from '../../../../public/CSS/spinner.css'
import { useSearchParams } from 'next/navigation';

export function ExploradorArchivos() {
  const [openSection, setOpenSection] = useState(null)
  const [files, setFiles] = useState([]) // Aquí almacenaremos los archivos FTP
  const { data: session, status } = useSession()
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [selectedFiles, setSelectedFiles] = useState([]);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section)
  }

  useEffect(() => {
    if (id) {
      // Llama a la API para obtener los archivos en la carpeta especificada
      fetch(`/api/Users/list-files?folderId=${id}&correo=${session.user.email}`)
        .then(response => response.json())
        .then(data => {
          if (data.files) {
            setFiles(data.files);
          } else {
            console.error('Error:', data.error);
          }
        })
        .catch(error => console.error('Error al obtener los archivos:', error));
    }
  }, [id]);

  const handleFileSelection = (event, file) => {
    if (event.target.checked) {
      setSelectedFiles([...selectedFiles, file.name]);
    } else {
      setSelectedFiles(selectedFiles.filter(f => f !== file.name));
    }
  };

  const handleDownload = () => {
    if (selectedFiles.length === 0) {
      alert("Por favor selecciona al menos un archivo para descargar.");
      return;
    }
  
    selectedFiles.forEach(file => {
      // Llamar a la API para descargar el archivo
      fetch(`/api/FTP/download?fileName=${file}`)
        .then(response => response.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', file); // Archivo descargado con el mismo nombre
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
        })
        .catch(error => console.error('Error al descargar el archivo:', error));
    });
  };

  const fileExtensions = {
    image: ['.jpg', '.jpeg', '.png', '.gif', '.bmp'],
    document: ['.pdf', '.doc', '.docx', '.txt', '.xlsx'],
    video: ['.mp4', '.avi', '.mov', '.mkv'],
  };
  
  const listFiles = (type) => {
    if (id) {
      fetch(`/api/Users/list-files?folderId=${id}&correo=${session.user.email}`)
        .then(response => response.json())
        .then(data => {
          if (data.files) {
            let filteredFiles = data.files;
  
            if (type !== 'all') {
              const extensions = fileExtensions[type];
  
              filteredFiles = data.files.filter(file => {
                const fileExtension = file.name.split('.').pop().toLowerCase();
                return extensions.includes(`.${fileExtension}`);
              });
            }
  
            setFiles(filteredFiles);
          } else {
            console.error('Error:', data.error);
          }
        })
        .catch(error => console.error('Error al obtener los archivos:', error));
    }
  };

  if (status === "loading") {
    return (
      <div style={{marginLeft:"45rem"}} className="flex items-center justify-center min-h-screen">
        <Spinner className={styles.spinner} />
        <p className="ml-3">Cargando...</p>
      </div>
    )
  }

  if (!session || !session.user) {
    return (
      window.location.href = "/",
      <div style={{marginLeft:"45rem"}} className="flex items-center justify-center min-h-screen">
        <Spinner className={styles.spinner} />
        <p className="ml-3">No has iniciado sesión</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full">
      <div className="bg-background border-r w-64 p-4 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <FolderIcon className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-medium">Explorador de Archivos</h2>
        </div>
        <div className="flex-1 overflow-auto">
          <nav className="space-y-1">
            <Link
              href={`/${id}`}
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted"
              prefetch={false}>
              <BackIcon className="w-4 h-4 text-muted-foreground" />
              <span>Regresar</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted"
              prefetch={false}
              onClick={() => listFiles('document')}>
              <FolderIcon className="w-4 h-4 text-muted-foreground" />
              <span>Documentos</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted"
              prefetch={false}
              onClick={() => listFiles('image')}>
              <ImageIcon className="w-4 h-4 text-muted-foreground" />
              <span>Imágenes</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted"
              prefetch={false}
              onClick={() => listFiles('video')}>
              <VideoIcon className="w-4 h-4 text-muted-foreground" />
              <span>Videos</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted"
              prefetch={false}
              onClick={() => listFiles('all')}>
              <AllFilesIcon className="w-4 h-4 text-muted-foreground" />
              <span>Todos los archivos</span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button style={{fontSize: "12px"}} variant="outline" onClick={handleDownload}>
            <DownloadIcon className="w-3 h-3 mr-1" />
            Descargar
          </Button>
        </div>
      </div>

      <div className="flex-1 p-4">
        <div className="flex items-center justify-between mb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Archivos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex items-center gap-2">
            {/* Aquí puedes agregar filtros o botones adicionales */}
          </div>
        </div>

        {/* Mostrar archivos recuperados del FTP */}
        <div className="grid grid-cols-4 gap-4">
          {files.length > 0 ? (
            files.map((file, index) => (
              <div key={index} className="bg-background rounded-md shadow-sm overflow-hidden">
                <input
                  type="checkbox"
                  checked={selectedFiles.includes(file.name)} // Verifica si el archivo está seleccionado
                  onChange={(e) => handleFileSelection(e, file)}
                />
                <div className="h-32 bg-muted/20 flex items-center justify-center">
                  <FileIcon className="w-10 h-10 text-muted-foreground" />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium truncate">{file.name}</h3>
                  <p className="text-xs text-muted-foreground">{file.size} bytes</p>
                </div>
              </div>
            ))
          ) : (
            <p>No hay archivos disponibles.</p>
          )}
        </div>
      </div>
    </div>
  )
}

function DownloadIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>)
  );
}

function FileArchiveIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M16 22h2a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v18" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <circle cx="10" cy="20" r="2" />
      <path d="M10 7V6" />
      <path d="M10 12v-1" />
      <path d="M10 18v-2" />
    </svg>)
  );
}

function FileIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>)
  );
}

function FileSpreadsheetIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M8 13h2" />
      <path d="M14 13h2" />
      <path d="M8 17h2" />
      <path d="M14 17h2" />
    </svg>)
  );
}

function FilterIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>)
  );
}

function FolderIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path
        d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </svg>)
  );
}

function HomeIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>)
  );
}

function ImageIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>)
  );
}

function ListOrderedIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <line x1="10" x2="21" y1="6" y2="6" />
      <line x1="10" x2="21" y1="12" y2="12" />
      <line x1="10" x2="21" y1="18" y2="18" />
      <path d="M4 6h1v4" />
      <path d="M4 10h2" />
      <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
    </svg>)
  );
}

function UploadIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>)
  );
}

function VideoIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path
        d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
      <rect x="2" y="6" width="14" height="12" rx="2" />
    </svg>)
  );
}

function BackIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function AllFilesIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
    </svg>
  );
}

function Spinner() {
  return (
    <div className="spinner" />
  );
}