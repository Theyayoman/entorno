"use client";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link"

export function Registro() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      
      return;
    }

    try {
      const res = await fetch('/api/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      // Redirigir al usuario a la página de inicio de sesión
      router.push('/login');
    } catch (err) {
      console.error('Error en el registro:', err);
      setError('Hubo un problema con el registro. Por favor, intenta nuevamente.');
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center">
      <form onSubmit={handleSubmit} className="w-full max-w-[450px] space-y-6 p-6">
        <div className="space-y-2 text-center">
          <img src="/logo.png" alt="" />
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input 
                id="name" 
                placeholder="Juana Pérez" 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="juana@example.com" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="Introduce una contraseña" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
            <Input 
              id="confirmPassword" 
              type="password" 
              placeholder="Vuelve a introducir la contraseña" 
              required 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
            />
          </div>
          {error && <div className="text-red-500">{error}</div>}
          <Button type="submit" className="w-full">Registrarse</Button>
        </div>
        <div className="text-center text-sm text-muted-foreground">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="underline" prefetch={false}>Iniciar sesión</Link>
        </div>
      </form>
    </div>
  );
}