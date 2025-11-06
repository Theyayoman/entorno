"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Login() {
  const [empresa, setEmpresa] = useState("");
  const [correo, setEmail] = useState("");
  const [numero, setNumero] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica si se usará correo o número de empleado
    const loginField = correo || numero;

    // Valida que haya al menos un campo (correo o número) y la contraseña
    if (!loginField || !password) {
      setError("Correo o número de empleado, y contraseña son requeridos.");
      return;
    }

    try {
      // Llama a NextAuth para iniciar sesión con credenciales
      const result = await signIn("credentials", {
        redirect: false, // Evita redirigir automáticamente
        correo, // Envía el correo si está definido
        numero, // Envía el número de empleado si está definido
        password, // Envía la contraseña
      });

      if (result?.error) {
        // Muestra el mensaje de error proporcionado por NextAuth
        setError(result.error);
      } else {
        // Redirige al inicio si la autenticación es exitosa
        window.location.href = "/inicio";
      }
    } catch (error) {
      setError("Error al intentar iniciar sesión. Intente nuevamente.");
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center">
      <div className="w-full max-w-md space-y-6 p-6">
        <div className="space-y-2 text-center">
          <img src="/logo.png" alt="" />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              value={correo}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="juana@example.com"
              style={{ marginBottom: "1rem" }}
            />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div
                className="relative flex justify-center text-xs uppercase"
                style={{ marginBottom: "1rem" }}
              >
                <span className="bg-background px-2 text-muted-foreground">
                  O continua con número de empleado
                </span>
              </div>
            </div>
            <Label>Número empleado</Label>
            <Input
              id="numero"
              type="number"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              placeholder="1234"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Introduce tu contraseña"
              required
            />
          </div>
          {error && <p className="text-center text-red-500">{error}</p>}
          <Button type="submit" className="w-full">
            Iniciar sesión
          </Button>
        </form>
        <div className="text-center text-sm text-muted-foreground" hidden>
          ¿Aún no tienes una cuenta?{" "}
          <Link href="/login/registro" className="underline">
            Regístrate
          </Link>
        </div>
      </div>
    </div>
  );
}

function ChromeIcon(props) {
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
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" x2="12" y1="8" y2="8" />
      <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
      <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
    </svg>
  );
}
