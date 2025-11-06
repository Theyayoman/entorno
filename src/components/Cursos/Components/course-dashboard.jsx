'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Calendar, FileText, Download, Award, FilePlus } from "lucide-react";

export function CourseDashboard() {
  return (
    (<div className="bg-gray-100 min-h-screen p-8">
      <div
        className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">M1G01</h1>
              <p className="text-sm text-gray-500">(Tiene 180 días para que pueda terminar el curso)</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Avance</p>
              <div className="flex items-center">
                <Progress value={100} className="w-32 mr-2" />
                <span className="text-2xl font-bold text-blue-600">100%</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600">Inicio de Curso: 14/12/2020</p>
              <p className="text-sm text-gray-600">Siguiente Clase: --/--/--</p>
              <p className="text-sm text-gray-600">Título de Sesión:</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Fin de Curso: 29/03/2021</p>
              <p className="text-sm text-gray-600">Examen: 14/12/2020</p>
              <p className="text-sm text-gray-600">Participación: 0 / 17</p>
              <p className="text-sm text-gray-600">Exámenes (5 de 5)</p>
              <p className="text-sm text-gray-600">Promedio: 87 / 100</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 mb-8">
            <Card
              className="p-4 flex flex-col items-center justify-center text-center bg-gray-200">
              <FileText className="h-8 w-8 text-gray-500 mb-2" />
              <span className="text-xs">Clase no iniciada</span>
            </Card>
            <Card
              className="p-4 flex flex-col items-center justify-center text-center bg-blue-600 text-white">
              <Calendar className="h-8 w-8 mb-2" />
              <span className="text-xs">Ver Calendario</span>
            </Card>
            <Card
              className="p-4 flex flex-col items-center justify-center text-center bg-blue-600 text-white">
              <FileText className="h-8 w-8 mb-2" />
              <span className="text-xs">Manual</span>
            </Card>
            <Card
              className="p-4 flex flex-col items-center justify-center text-center bg-blue-600 text-white">
              <FileText className="h-8 w-8 mb-2" />
              <span className="text-xs">Exámenes</span>
            </Card>
            <Card
              className="p-4 flex flex-col items-center justify-center text-center bg-blue-600 text-white">
              <Download className="h-8 w-8 mb-2" />
              <span className="text-xs">Diploma</span>
            </Card>
            <Card
              className="p-4 flex flex-col items-center justify-center text-center bg-gray-200">
              <Award className="h-8 w-8 text-gray-500 mb-2" />
              <span className="text-xs">Certificados</span>
            </Card>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold mb-4">Última Sesión Grabada</h2>
              <div
                className="bg-gray-200 h-48 flex items-center justify-center rounded-lg mb-4">
                <div
                  className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                  <div
                    className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1"></div>
                </div>
              </div>
              <p className="font-semibold">Six Sigma y los costos de No Calidad</p>
              <p className="text-sm text-gray-600">Sesión: Videos M1</p>
              <p className="text-sm text-gray-600">23/03/2021 11:43 am</p>
              <Button className="w-full mt-4 bg-blue-600 text-white">Ver más Sesiones</Button>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4">Material de Apoyo</h2>
              <ul className="space-y-2">
                <li className="text-sm">1. Manual de uso i-PMS 4.0</li>
                <li className="text-sm">2. Instrucciones Tablero</li>
                <li className="text-sm">3. Itinerario Módulo 1</li>
                <li className="text-sm">4. Taller 1: Video Fabricación de lápices</li>
                <li className="text-sm">5. Taller 1: Caso</li>
                <li className="text-sm">6. Solución a ejercicios del Tablero M1</li>
              </ul>
              <h2 className="text-lg font-semibold mt-8 mb-4">Archivos de Proyecto</h2>
              <div className="flex justify-center">
                <FilePlus className="h-12 w-12 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>)
  );
}