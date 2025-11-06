"use client"

import React from 'react'
import { XCircle, Home, Mail } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function AccesoDenegado() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center">
            <XCircle className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center mt-4">Acceso Denegado</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 dark:text-gray-400">
            Lo sentimos, no tienes permiso para acceder a esta página. Si crees que esto es un error, por favor contacta con el equipo de soporte.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full" onClick={() => window.location.href = '/inicio'}>
            <Home className="mr-2 h-4 w-4" />
            Volver a la página de inicio
          </Button>
          {/*<Button variant="outline" className="w-full" onClick={() => window.location.href = '/contacto'}>
            <Mail className="mr-2 h-4 w-4" />
            Contactar con soporte
          </Button>*/}
        </CardFooter>
      </Card>
    </div>
  )
}