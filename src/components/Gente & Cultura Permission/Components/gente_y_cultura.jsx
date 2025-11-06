'use client'
import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Filter, Star } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useSession,  signOut } from "next-auth/react";
import styles from '../../../../public/CSS/spinner.css';
import { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export function TimeTracker() {
  const [year, setYear] = useState(2024)
  const [selectedDate, setSelectedDate] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [mostrarTabla, setMostrarTabla] = useState(false);
  const [mostrarBotones, setMostrarBotones] = useState(true);
  const modalRef = useRef();

  const handleGeneratePDF = async () => {
    await setMostrarTabla(true);
    await setMostrarBotones(false);
    const element = modalRef.current;
    const canvas = await html2canvas(element, {
        scale: 2, // Escala para aumentar la resolución de la imagen
        useCORS: true // Habilita el uso de CORS para cargar imágenes externas
    });
    const imgData = canvas.toDataURL('image/png');

    // Crear el PDF en formato horizontal ('landscape')
    const pdf = new jsPDF('l', 'mm', 'a4'); // 'l' para landscape

    const pageWidth = 210; // A4 width in mm for landscape
    const pageHeight = 297; // A4 height in mm for landscape
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 30;

    // Ajusta la imagen para que se ajuste al ancho de la página
    pdf.addImage(imgData, 'PNG', 45, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save('Papeleta de permiso.pdf');

    setMostrarTabla(false);
    setMostrarBotones(true);
  };

  const [formData, setFormData] = useState({
    empleado: false,
    sindicalizado: false,
    planta: false,
    inasistencia: {
      justificada: false,
      injustificada: false,
      dias: 0,
      del: "",
      al: ""
    },
    llegadaTarde: {
      hora: "",
      fecha: ""
    },
    suspension: {
      dias: 0,
      del: "",
      al: ""
    },
    permiso: {
      conSueldo: false,
      sinSueldo: false,
      dias: 0,
      del: "",
      al: ""
    },
    vacaciones: {
      dias: 0,
      del: "",
      al: ""
    },
    tiempoPorTiempo: {
      dias: 0,
      horas: 0,
      del: "",
      al: ""
    },
    observaciones: "",
    autorizado: "Pendiente"
  });

  const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']
  const days = ['D', 'L', 'M', 'M', 'J', 'V', 'S']

  // Aquí puedes definir el estado de los días, por ejemplo:
  const dayStatus = {
    [`${year}-08-16`]: 'validado',
    [`${year}-08-19`]: 'por_aprobar',
    [`${year}-08-20`]: 'rechazado',
    [`${year}-01-01`]: 'festivo',
    [`${year}-02-05`]: 'festivo',
    [`${year}-03-21`]: 'festivo',
    [`${year}-05-01`]: 'festivo',
    [`${year}-09-16`]: 'festivo',
    [`${year}-10-01`]: 'festivo',
    [`${year}-11-20`]: 'festivo',
    [`${year}-12-25`]: 'festivo',
  }

  const renderMonth = (month, index) => {
    const daysInMonth = new Date(year, index + 1, 0).getDate()
    const firstDay = new Date(year, index, 1).getDay()
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    
    // Ajustar el estilo de los días según el estado
    const getDayStyle = (day, monthIndex) => {
      const dateKey = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      switch (dayStatus[dateKey]) {
        case 'validado':
          return 'bg-green'
        case 'por_aprobar':
          return 'bg-yellow'
        case 'rechazado':
          return 'bg-red'
        case 'festivo':
          return 'bg-purple'
        default:
          return ''
      }
    }

    return (
      <div key={month} className="mb-4">
        <h3 className="text-sm font-semibold mb-2">{`${month} ${year}`}</h3>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <div key={index} className="text-xs text-center p-1 font-semibold">
              {day}
            </div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={i} className="text-xs p-1" />
          ))}
          {daysArray.map((day, dayIndex) => (
            <div
              key={day}
              className={`text-xs text-center p-1 cursor-pointer ${getDayStyle(day, index)}`}
              onClick={() => handleDateClick(day, index)}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const handleChange = (e) => {
    const { name, value, type, checked, dataset } = e.target;
    const isCheckbox = type === "checkbox";
    
    // Si el input pertenece a una sección anidada, manejamos el cambio de forma adecuada
    if (dataset.section) {
      setFormData((prevData) => ({
        ...prevData,
        [dataset.section]: {
          ...prevData[dataset.section],
          [name]: isCheckbox ? checked : value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: isCheckbox ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Enviar los datos a la API
      fetch(`/api/guardarPapeleta?formData=${JSON.stringify(formData)}&emailUsuario=${session.user.email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }).then((response) => {
        if (response.ok) {
          console.log("Formulario guardado");
        }
      });
      setModalVisible(false)
      window.location.href="/gente_y_cultura"
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDateClick = (day, monthIndex) => {
    const month = months[monthIndex]
    const fullDate = `${day} ${month} ${year}`
    setSelectedDate(fullDate)
    setModalVisible(true)
  }

  const handlePreviousYear = () => {
    setYear(prevYear => prevYear - 1)
  }

  const handleNextYear = () => {
    setYear(prevYear => prevYear + 1)
  }

  const {data: session,status}=useSession ();
  
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className={styles.spinner} />
        <p className="ml-3">Cargando...</p>
      </div>
    );
  }
  if (status=="loading") {
    return <p>cargando...</p>;
  }
  if (!session || !session.user) {
    return (
      window.location.href = "/",
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className={styles.spinner} />
        <p className="ml-3">No has iniciado sesión</p>
      </div>
    );
  }

  const genteCultura = "gente_y_cultura";

  return (
    <div style={{marginTop: "70px"}} className={`p-4 max-w-6xl mx-auto ${modalVisible ? 'overflow-hidden' : ''}`}>
      <Link href={`/explorador_archivos?id=${genteCultura}`}>
        <Button variant="outline" size="sm" className="fixed h-9 gap-2 right-4 bottom-10 bg-blue-500 text-white p-2 rounded-lg shadow-lg">
          <div className="h-3.5 w-3.5" />
          <FolderIcon className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Explorador de archivos</span>
        </Button>
      </Link>
      <div className={`flex items-center justify-between mb-4 ${modalVisible ? 'hidden' : ''}`}>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={handlePreviousYear}><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="outline">HOY</Button>
          <Button variant="outline" size="icon" onClick={handleNextYear}><ChevronRight className="h-4 w-4" /></Button>
          <Select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value={year}>{year}</option>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="default" onClick={() => setModalVisible(true)} >NUEVO TIEMPO PERSONAL</Button>
          <Button variant="outline">NUEVO SOLICITUD DE ASIGNACIÓN</Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm"><Filter className="h-4 w-4 mr-2" />Filtros</Button>
          <Button variant="ghost" size="sm"><Star className="h-4 w-4 mr-2" />Favoritos</Button>
        </div>
      </div>
      
      <div className={`flex ${modalVisible ? 'hidden' : ''}`}>
        <div className="grid grid-cols-4 gap-4 flex-grow">
          {months.map((month, index) => renderMonth(month, index))}
        </div>
        <div className="w-64 ml-4">
          <div className="mb-4">
            <Input type="search" placeholder="Buscar..." className="w-full" />
          </div>
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Tipo de tiempo personal</h4>
            <div className="flex items-center mb-2">
              <Checkbox id="tiempo-personal" />
              <label htmlFor="tiempo-personal" className="ml-2 text-sm">Tiempo personal por enfermedad</label>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Leyenda</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green mr-2"></div>
                <span className="text-sm">Validado</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow mr-2"></div>
                <span className="text-sm">Por aprobar</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red mr-2"></div>
                <span className="text-sm">Rechazado</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple mr-2"></div>
                <span className="text-sm">Día festivo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalVisible && (
        <div className="p-4" ref={modalRef}>
        <table style={{ textAlign: "center" }} className={`w-full border-collapse border border-gray-300 ${mostrarTabla ? '' : 'hidden'}`}>
            <tr>
              <td rowspan="2"><img
              src="/pasiLogo.png"
              alt="Logo"
              style={{paddingLeft: "0px", width: "100%", height: "60px"}} /></td>
              <td className="border border-gray-300 p-2" style={{fontWeight:"bold"}}>Especialidades Nutriton S.A. de C.V.</td>
              <td className="border border-gray-300 p-2" style={{fontWeight:"bold"}}>Última revisión<br /><span style={{fontWeight:"normal"}}>22 de abril de 2022</span></td>
              <td className="border border-gray-300 p-2" style={{fontWeight:"bold"}}>Vigencia<br /><span style={{fontWeight:"normal"}}>22 de abril de 2025</span></td>
              <td className="border border-gray-300 p-2" style={{fontWeight:"bold"}}>Código<br /><span style={{fontWeight:"normal"}}>RH-RE-1</span></td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2" style={{fontWeight:"bold"}}>MOVIMIENTOS DE PERSONAL</td>
              <td className="border border-gray-300 p-2" style={{fontWeight:"bold"}}>Edición<br /><span style={{fontWeight:"normal"}}>0</span></td>
              <td className="border border-gray-300 p-2" style={{fontWeight:"bold"}}>Nivel<br /><span style={{fontWeight:"normal"}}>2</span></td>
              <td className="border border-gray-300 p-2">Pág. 1 de 2</td>
            </tr>
          </table><br />
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="font-bold">Empleado <input type="checkbox" name="empleado" checked={formData.empleado} onChange={handleChange} className="mr-2" /></label>
              </div>
              <div>
                <label className="font-bold">Sindicalizado <input type="checkbox" name="sindicalizado" checked={formData.sindicalizado} onChange={handleChange} className="mr-2" /></label>
              </div>
              <div>
                <label className="font-bold">Planta <input type="checkbox" name="planta" checked={formData.planta} onChange={handleChange} className="mr-2" /></label>
              </div>
            </div>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2" style={{textAlign:"justify"}} >Inasistencia</th>
                  <th className="border border-gray-300 p-2" style={{ fontWeight:"normal", textAlign: "justify" }} >Justificada <input type="checkbox" name="justificada" data-section="inasistencia" checked={formData.inasistencia.justificada} onChange={handleChange} /></th>
                  <th className="border border-gray-300 p-2" style={{ fontWeight:"normal", textAlign: "justify" }} >Injustificada <input type="checkbox" name="injustificada" data-section="inasistencia" checked={formData.inasistencia.injustificada} onChange={handleChange} /></th>
                  <th className="border border-gray-300 p-2" style={{ fontWeight:"normal" }} ><span style={{display:"flex"}}>Dias: <input style={{marginLeft: "0.5rem", width: "2.5rem"}} type="number" name="dias" data-section="inasistencia" value={formData.inasistencia.dias} onChange={handleChange} /></span></th>
                  <th className="border border-gray-300 p-2" style={{ fontWeight:"normal" }} ><span style={{display:"flex"}}>del: <input style={{marginLeft: "0.5rem", width: "7.5rem"}} type="date" name="del" data-section="inasistencia" value={formData.inasistencia.del} onChange={handleChange} /></span></th>
                  <th className="border border-gray-300 p-2" style={{ fontWeight:"normal" }} ><span style={{display:"flex"}}>al: <input style={{marginLeft: "0.5rem", width: "7.5rem"}} type="date" name="al" data-section="inasistencia" value={formData.inasistencia.al} onChange={handleChange} /></span></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2" style={{ fontWeight:"bold" }} >Llegada tarde / Salida antes</td>
                  <td className="border border-gray-300 p-2">
                    <span style={{display: "flex"}}>Hora: <input style={{marginLeft: "0.5rem"}} type="time" name="hora" data-section="llegadaTarde" value={formData.llegadaTarde.hora} onChange={handleChange} /></span>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <span style={{display:"flex"}}>Fecha: <input style={{marginLeft: "0.5rem", width: "7.5rem"}} type="date" name="fecha" data-section="llegadaTarde" value={formData.llegadaTarde.fecha} onChange={handleChange} /></span>
                  </td>
                  <td className="border border-gray-300 p-2" />
                  <td className="border border-gray-300 p-2" />
                  <td className="border border-gray-300 p-2" />
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2" style={{ fontWeight:"bold" }} >Suspensión</td>
                  <td className="border border-gray-300 p-2">
                    <span style={{display:"flex"}}>Dias: <input style={{marginLeft: "0.5rem", width: "2.5rem"}} type="number" name="dias" data-section="suspension" value={formData.suspension.dias} onChange={handleChange} /></span>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <span style={{display:"flex"}}>del: <input style={{marginLeft: "0.5rem", width: "7.5rem"}} type="date" name="del" data-section="suspension" value={formData.suspension.del} onChange={handleChange} /></span>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <span style={{display:"flex"}}>al: <input style={{marginLeft: "0.5rem", width: "7.5rem"}} type="date" name="al" data-section="suspension" value={formData.suspension.al} onChange={handleChange} /></span>
                  </td>
                  <td className="border border-gray-300 p-2" />
                  <td className="border border-gray-300 p-2" />
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2" style={{ fontWeight:"bold" }} >Permiso</td>
                  <td className="border border-gray-300 p-2">
                    <label className="flex items-center">
                      Con sueldo <input type="checkbox" name="conSueldo" data-section="permiso" checked={formData.permiso.conSueldo} onChange={handleChange} />
                    </label>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <label className="flex items-center">
                      Sin sueldo <input type="checkbox" name="sinSueldo" data-section="permiso" checked={formData.permiso.sinSueldo} onChange={handleChange} /> 
                    </label>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <span style={{display:"flex"}}>Dias: <input style={{marginLeft: "0.5rem", width: "2.5rem"}} type="number" name="dias" data-section="permiso" value={formData.permiso.dias} onChange={handleChange} /></span>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <span style={{display:"flex"}}>del: <input style={{marginLeft: "0.5rem", width: "7.5rem"}} type="date" name="del" data-section="permiso" value={formData.permiso.del} onChange={handleChange} /></span>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <span style={{display:"flex"}}>al: <input style={{marginLeft: "0.5rem", width: "7.5rem"}} type="date" name="al" data-section="permiso" value={formData.permiso.al} onChange={handleChange} /></span>
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2" style={{ fontWeight:"bold" }} >Vacaciones</td>
                  <td className="border border-gray-300 p-2">
                    <span style={{display:"flex"}}>Dias: <input style={{marginLeft: "0.5rem", width: "2.5rem"}} type="number" name="dias" data-section="vacaciones" value={formData.vacaciones.dias} onChange={handleChange} /></span>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <span style={{display:"flex"}}>del: <input style={{marginLeft: "0.5rem", width: "7.5rem"}} type="date" name="del" data-section="vacaciones" value={formData.vacaciones.del} onChange={handleChange} /></span>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <span style={{display:"flex"}}>al: <input style={{marginLeft: "0.5rem", width: "7.5rem"}} type="date" name="al" data-section="vacaciones" value={formData.vacaciones.al} onChange={handleChange} /></span>
                  </td>
                  <td className="border border-gray-300 p-2" />
                  <td className="border border-gray-300 p-2" />
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2" style={{ fontWeight:"bold" }} >Tiempo por tiempo</td>
                  <td className="border border-gray-300 p-2">
                    <span style={{display:"flex"}}>Dias: <input style={{marginLeft: "0.5rem", width: "2.5rem"}} type="number" name="dias" data-section="tiempoPorTiempo" value={formData.tiempoPorTiempo.dias} onChange={handleChange} /></span>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <span style={{display:"flex"}}>Horas: <input style={{marginLeft: "0.5rem", width: "2.5rem"}} type="number" name="horas" data-section="tiempoPorTiempo" value={formData.tiempoPorTiempo.horas} onChange={handleChange} /></span>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <span style={{display:"flex"}}>del: <input style={{marginLeft: "0.5rem", width: "7.5rem"}} type="date" name="del" data-section="tiempoPorTiempo" value={formData.tiempoPorTiempo.del} onChange={handleChange} /></span>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <span style={{display:"flex"}}>al: <input style={{marginLeft: "0.5rem", width: "7.5rem"}} type="date" name="al" data-section="tiempoPorTiempo" value={formData.tiempoPorTiempo.al} onChange={handleChange} /></span>
                  </td>
                  <td className="border border-gray-300 p-2" />
                </tr>
              </tbody>
            </table>
            <div className="mt-4">
              <label className="font-bold">Observaciones:</label>
              <textarea name="observaciones" value={formData.observaciones} onChange={handleChange} className="border border-gray-300 p-2 mt-2" rows="4" style={{ width: "100%" }} />
            </div>
            <Button
            className={`${mostrarBotones ? '' : 'hidden'}`}
            variant="outline"
            onClick={() => setModalVisible(false)}
            >
              Cerrar
            </Button>
            <Button style={{marginLeft: "0.5rem"}} type="submit" variant="outline" className={`${mostrarBotones ? '' : 'hidden'}`}>Enviar Papeleta</Button>
          </form>
          <Button
            className={`${mostrarBotones ? '' : 'hidden'}`}
            style={{marginLeft: "14.4rem", bottom:"2.5rem", position:"relative"}}
            variant="outline"
            onClick={handleGeneratePDF}
          >
            Guardar como PDF
          </Button>
        </div>
      )}
    </div>
  )
}

function FolderIcon(props) {
  return(
    <svg
      className="h-4 w-4 text-gray-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 7h6l2 2h9a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V8a1 1 0 011-1z"
      />
    </svg>
  )
}

function Spinner() {
  return (
    <div className="spinner" />
  );
}