import { createContext, useContext, useEffect, useState } from "react";
import { getSession } from "next-auth/react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const session = await getSession();
      if (!session) {
        setError("No hay sesión activa");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/Users/getUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo: session.user.email,
          numero_empleado: session.user.numero_empleado,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setUserData(data);
      } else {
        setError("No se pudo obtener el usuario");
      }
    } catch (err) {
      console.error("Error al obtener usuario:", err);
      setError("Error en el servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
        loading,
        error,
        refreshUserData: fetchUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
