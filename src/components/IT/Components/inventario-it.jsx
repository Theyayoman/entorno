'use client';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import Swal from 'sweetalert2';
import { CheckIcon, PlusCircleIcon } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea';
import axios from "axios"

export function InventarioIT() {
  const [inventario, setInventario] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [nuevoEquipo, setNuevoEquipo] = useState({
    tipo: '',
    marca: '',
    modelo: '',
    serial: '',
    fecha: '',
    observacion: '',
    ubicacion: '',
    localidad: '',
    estatus: '',
    estado:'',
    etiquetas: []
  })
  const [archivo, setArchivo] = useState(null);
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [newTag, setNewTag] = useState('')
  const [tipoFilter, setTipoFilter] = useState('')
  const [marcaFilter, setMarcaFilter] = useState('')
  const localidadesPorUbicacion = {
    "Colli": ["B4", "B7","B13","B15","Mantenimiento","Calidad"],
    "Tepeyac": ["Marketing", "Ventas","Contabilidad","Recepción"],
    "Tilma": ["TI", "Gente & Cultura"],
    "Patria": ["Mezclado", "Acondicionado","Compras","Ingenería de productos","Maquilas","Dirección","Hornos","Vigilancia","Mantenimiento"],
    "Carlos": ["Contabilidad"],
    "Paraisos": ["Auditorias","Producción"],
    "Eca": ["Dirección"],
    // Agrega más opciones según tus ubicaciones
   
  };
  useEffect(() => {
    const fetchInventario = async () => {
      try {
        const response = await axios.get('/api/IT/getInventario');
        setInventario(response.data); // Guardar datos en el estado
      } catch (error) {
        console.error('Error al obtener inventario:', error);
      }
    };
    fetchInventario();
  }, []);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNuevoEquipo(prev => ({ ...prev, [name]: value }))
  }

  const handleArchivoChange = (e) => {
    setArchivo(e.target.files[0]);
 
  };

  const handleUpload = async () => {
    if (!archivo) {
      alert('Por favor selecciona un archivo.');
      return;
    }

    const formData = new FormData();
    formData.append('file', archivo);
    try {
      // const response = await axios.post('/api/IT/insertInventarioMasivo', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });
      fetch('/api/IT/insertInventarioMasivo', {
        method: 'POST', // Asegúrate de que sea POST
        body: formData, // FormData que contiene el archivo
      });

      alert('Guardado.');
    } catch (error) {
      console.error('Error al subir inventario:', error);
      alert('Hubo un error al subir el archivo.',error);
    }
  };
  const handleSelectChange = (value) => {
    setNuevoEquipo((prevState) => ({
      ...prevState,
      tipo: value,
      
    }));
  };
  
  const handleSelectChange2 = (value) => {
    setNuevoEquipo((prevState) => ({
      ...prevState,
      estado: value,
      
    }));
  };
  
  const handleSelectChange3 = (value) => {
    setNuevoEquipo((prevState) => ({
      ...prevState,
      estatus: value,
      
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    try{
      const response = await fetch('/api/IT/insertInventario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoEquipo),
      });
  
      const result = await response.json();
      if (response.ok) {
        Swal.fire({
          title: 'Subido',
          text: 'Se ha creado correctamente',
          icon: 'success',
          timer: 3000, // La alerta desaparecerá después de 1.5 segundos
          showConfirmButton: false,
        }).then(() => {
          window.location.href = "/it/inventario";
        });
      } else {
        Swal.fire('Error', 'Error al subir formulario', 'error');
      }
  if(result.sucess){
    setInventario(prev => [...prev, { id: Date.now(), ...nuevoEquipo }])
    setNuevoEquipo({ tipo: '', marca: '', modelo: '', serial: '', etiquetas: [] })
    setIsOpen(false)
  } 
  }catch(error){
    console.error('Error al agregar el equipo:', error);
    alert('Error de conexión con el servidor');
  }

 
   };
const handleAddTag = () => {
  if (newTag && !nuevoEquipo.etiquetas.includes(newTag)) {
    setNuevoEquipo(prev => ({ ...prev, etiquetas: [...prev.etiquetas, newTag] }))
    setNewTag('')
  }
}
  const handleRemoveTag = (tag) => {
    setNuevoEquipo(prev => ({
      ...prev,
      etiquetas: prev.etiquetas.filter(t => t !== tag)
    }))
  }


  

  const toggleTagFilter = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  const filteredInventario = inventario.filter(equipo => {
    const matchesSearch = Object.values(equipo).some(value =>
      typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => equipo.etiquetas.includes(tag))
    const matchesTipo = tipoFilter === '' || equipo.tipo === tipoFilter
    const matchesMarca = marcaFilter === '' || equipo.marca === marcaFilter
    return matchesSearch && matchesTags && matchesTipo && matchesMarca
  })

  const allTags = Array.from(new Set(inventario.flatMap(equipo => equipo.etiquetas)))
 
  const indexOfLastEvento = currentPage * itemsPerPage;
  const indexOfFirstEvento = indexOfLastEvento - itemsPerPage;
  const currentEventos = filteredInventario.slice(indexOfFirstEvento, indexOfLastEvento);
  const totalPages = Math.ceil(filteredInventario.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);



  
  return (
    (<div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Inventario de equipo de cómputo - TI</h1>
     
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4">Agregar nuevo equipo</Button>
          
        </DialogTrigger>
        <div className="mb-4 flex flex-wrap gap-2">
          <SearchIcon
            style={{ marginTop: "10px", marginLeft: "15px" }}
            className="absolute h-5 w-5 text-gray-400"
          />
        <Input
          placeholder="Buscar equipos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm pl-12" />
        <select
          value={tipoFilter}
          onChange={(e) => setTipoFilter(e.target.value)}
          className="border rounded px-2 py-1">
          <option value="">Todos los tipos</option>
          {Array.from(new Set(inventario.map(e => e.tipo))).map(tipo => (
            <option key={tipo} value={tipo}>{tipo}</option>
          ))}
        </select>
        <select
          value={marcaFilter}
          onChange={(e) => setMarcaFilter(e.target.value)}
          className="border rounded px-2 py-1">
          <option value="">Todas las marcas</option>
          {Array.from(new Set(inventario.map(e => e.marca))).map(marca => (
            <option key={marca} value={marca}>{marca}</option>
          ))}
        </select>
        {allTags.map(tag => (
          <Badge
            key={tag}
            variant={selectedTags.includes(tag) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => toggleTagFilter(tag)}>
            {tag}
          </Badge>
        ))}

<div>
      <input type="file" accept=".xlsx" onChange={handleArchivoChange} />
 <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Subir inventario
      </button>
    </div>  
      </div>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Equipo</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ubicacion" className="text-right">
                  Tipo
                </Label>
                <Select
                  value={nuevoEquipo.tipo}
                  onValueChange={handleSelectChange} // Usa el handler correcto
                  >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccione tipo de equipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pc">pc</SelectItem>
                    <SelectItem value="laptop">laptop</SelectItem>
                    <SelectItem value="nobreak">nobreak</SelectItem>
                    <SelectItem value="perifericos">perifericos</SelectItem>
                    <SelectItem value="monitores">monitores</SelectItem>
                    
                  </SelectContent>
                </Select>
              </div>


            <div>
              <Label htmlFor="marca">Marca</Label>
              <Input
                id="marca"
                name="marca"
                value={nuevoEquipo.marca}
                onChange={handleInputChange}
                required />
            </div>
            <div>
              <Label htmlFor="modelo">Modelo</Label>
              <Input
                id="modelo"
                name="modelo"
                value={nuevoEquipo.modelo}
                onChange={handleInputChange}
                required />
            </div>
            <div>
              <Label htmlFor="serial">Número de Serie</Label>
              <Input
                id="serial"
                name="serial"
                value={nuevoEquipo.serial}
                onChange={handleInputChange}
                required />
            </div>
            <div>
              <Label htmlFor="fecha">Fecha de ingreso</Label>
              <Input
                id="fecha"
                name="fecha"
                type="date"
                value={nuevoEquipo.fecha}
                onChange={handleInputChange}
                required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ubicacion" className="text-right">
                 Estado
                </Label>
                <Select
                  value={nuevoEquipo.estado}
                  onValueChange={handleSelectChange2} // Usa el handler correcto
                  >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccione tipo de equipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nuevo">NUEVO</SelectItem>
                    <SelectItem value="buen estado">BUEN ESTADO</SelectItem>
                    <SelectItem value="usado">USADO</SelectItem>
                    <SelectItem value="dañado">DAÑADO</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ubicacion" className="text-right">
                 Estatus
                </Label>
                <Select
                  value={nuevoEquipo.estatus}
                  onValueChange={handleSelectChange3} // Usa el handler correcto
                  >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccione tipo de equipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disponible">Disponible</SelectItem>
                    <SelectItem value="No disponible">No disponible</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ubicacion" className="text-right">
                  Ubicación
                </Label>
                <Select
                  value={nuevoEquipo.ubicacion}
                  onValueChange={(value) =>
                    setNuevoEquipo((prevState) => ({ ...prevState, ubicacion: value, localidad: '' }))
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccione la ubicacion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Colli">Colli</SelectItem>
                    <SelectItem value="Tepeyac">Tepeyac</SelectItem>
                    <SelectItem value="Tilma">Tilma</SelectItem>
                    <SelectItem value="Patria">Patria</SelectItem>
                    <SelectItem value="Carlos">Carlos Dickens</SelectItem>
                    <SelectItem value="Paraisos">Paraisos</SelectItem>
                    <SelectItem value="Eca">Eca</SelectItem>
               </SelectContent>
                </Select>
              </div>
              {nuevoEquipo.ubicacion && (
  <div className="grid grid-cols-4 items-center gap-4 mt-4">
    <Label htmlFor="localidad" className="text-right">
      Localidad
    </Label>
    <Select
      value={nuevoEquipo.localidad}
      onValueChange={(value) =>
        setNuevoEquipo((prevState) => ({ ...prevState, localidad: value }))
      }
    >
      <SelectTrigger className="col-span-3">
        <SelectValue placeholder="Seleccione la localidad" />
      </SelectTrigger>
      <SelectContent>
        {localidadesPorUbicacion[nuevoEquipo.ubicacion]?.map((localidad, index) => (
          <SelectItem key={index} value={localidad}>
            {localidad}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
)}
            <div>
              <Label htmlFor="newTag">Etiquetas</Label>
              <div className="flex gap-2">
                <Input
                  id="newTag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Nueva etiqueta" />
                <Button type="button" onClick={handleAddTag} size="icon">
                  <PlusCircleIcon className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {nuevoEquipo.etiquetas.map(tag => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleRemoveTag(tag)}>
                    {tag} <CheckIcon className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
              <div>
              <Label htmlFor="observacion">Observaciones</Label>
              <Textarea
                id="observacion"
                name="observacion"
                value={nuevoEquipo.observacion}
                onChange={handleInputChange}
                required />
            </div>
            </div>
            <Button type="submit">Agregar Equipo</Button>
          </form>
        </DialogContent>
      </Dialog>
      <Card>
        <CardHeader>
          <CardTitle>Inventario actual</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
              <TableHead>Fecha</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Número de serie</TableHead>
                <TableHead>Características</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Observaciones</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Estatus</TableHead>
              </TableRow>
            </TableHeader>
                        <TableBody>
              {currentEventos.map((inventario) => (
                <TableRow key={inventario.id}>
                  <TableCell>{inventario.fecha}</TableCell>
                  <TableCell>{inventario.tipo}</TableCell>
                  <TableCell>{inventario.marca}</TableCell>
                  <TableCell>{inventario.modelo}</TableCell>
                  <TableCell>{inventario.serie}</TableCell>
                  
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(inventario.etiqueta) && 
                        inventario.etiqueta.map((tag) => (
                          <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))
                      }
                    </div>
                   </TableCell>
                   <TableCell>{inventario.estado}</TableCell>
                   <TableCell>{inventario.observacion}</TableCell>
                   <TableCell>{inventario.ubicacion}</TableCell>
                   <TableCell>{inventario.estatus}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
       {/* Paginación */}
       <div className="flex justify-center mt-4 mb-4">
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
          Anterior
        </button><span style={{marginRight:"2rem"}}></span>
        {Array.from({ length: totalPages }, (_, index) => (
          <button style={{marginLeft:"1rem", marginRight: "1rem"}} key={index} onClick={() => paginate(index + 1)} className={currentPage === index + 1 ? "font-bold" : ""}>
            {index + 1}
          </button>
        ))}
        <span style={{marginLeft:"2rem"}}></span>
        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
          Siguiente
        </button>
      </div>
          </div>)
  );
}

function SearchIcon(props) {
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
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}