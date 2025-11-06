"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import styles from "../../../../public/CSS/spinner.css";
import Swal from "sweetalert2";
import Link from "next/link";
import { CornerDownLeft } from "lucide-react";
import { CardTitle } from "@/components/ui/card";
import { useUserContext } from "@/utils/userContext";

export function Perfil() {
  const { userData, setUserData, loading: userLoading } = useUserContext();
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (userData) {
      setNombre(userData.user.nombre);
      setCorreo(userData.user.correo);
      setApellidos(userData.user.apellidos);
    }
  }, [userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/Users/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre, apellidos, correo, password }),
    });

    const result = await response.json();
    if (result.success) {
      // Actualizar el contexto con los nuevos datos
      setUserData((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          nombre,
          apellidos,
          correo,
        },
      }));

      setPassword("");

      Swal.fire({
        title: "Actualizado",
        text: "Los datos se han actualizado correctamente",
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
      });
    } else {
      Swal.fire("Error", "Error al actualizar los datos", "error");
    }
  };

  const { data: session, status } = useSession();

  if (status === "loading" || userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className={styles.spinner} />
        <p className="ml-3">Cargando...</p>
      </div>
    );
  }
  if (status == "loading" || userLoading) {
    return <p>cargando...</p>;
  }
  if (!session || !session.user) {
    return (
      (window.location.href = "/"),
      (
        <div className="flex items-center justify-center min-h-screen">
          <Spinner className={styles.spinner} />
          <p className="ml-3">No has iniciado sesión</p>
        </div>
      )
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div>
        <Link href="/inicio">
          <Button>
            <CornerDownLeft className="h-4 w-4" />
            Regresar
          </Button>
        </Link>
      </div>
      <div className="flex justify-center items-center text-center mb-12">
        <CardTitle className="text-3xl font-bold">Perfil</CardTitle>
      </div>
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit}>
          <div className="bg-background rounded-lg shadow-md p-6 space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">
                  {nombre + " " + apellidos}
                </h2>
                <p className="text-muted-foreground">
                  {correo ? correo : "Usuario sin correo"}
                </p>
              </div>
            </div>
            <div>
              <Label htmlFor="email">Correo</Label>
              <Input
                id="email"
                type="email"
                className="w-full mt-1"
                value={correo || "Usuario sin correo"}
                onChange={(e) => setCorreo(e.target.value)}
                readOnly={true}
              />
            </div>
            <div>
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                type="text"
                className="w-full mt-1"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="apellidos">Apellidos</Label>
              <Input
                id="apellidos"
                type="text"
                className="w-full mt-1"
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Cambia tu contraseña"
                className="w-full mt-1"
                defaultValue="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div hidden>
              <Label htmlFor="notification">Configurar notificaciones</Label>
              <Select id="notification" className="w-full mt-1">
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    Recibir todas las notificaciones
                  </SelectItem>
                  <SelectItem value="important">
                    Sólo notificaciones importantes
                  </SelectItem>
                  <SelectItem value="none">
                    No recibir notificaciones
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end">
              <Button type="submit" size="sm">
                Guardar cambios
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function Spinner() {
  return <div className="spinner" />;
}
