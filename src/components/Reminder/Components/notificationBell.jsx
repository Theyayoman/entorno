"use client";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import "font-awesome/css/font-awesome.min.css";
import { Button } from "@mui/material";
import { useUserContext } from "@/utils/userContext";

export function NotificationBell() {
  const { userData, loading } = useUserContext();
  const idUser = userData?.user?.id;
  const [notificaciones, setNotificaciones] = useState([]);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (loading || !idUser) return;
    const fetchNotificaciones = async () => {
      try {
        const response = await fetch(
          `/api/Reminder/notificaciones?id=${idUser}`
        );
        const data = await response.json();
        setNotificaciones(data);
        setHasNotifications(data.some((n) => !n.leido));
      } catch (error) {
        console.error("Error al obtener notificaciones:", error);
      }
    };

    fetchNotificaciones();
  }, [loading, idUser]);

  const fetchNotificacionesUpdate = async () => {
    try {
      const response = await fetch(`/api/Reminder/notificaciones?id=${idUser}`);
      const data = await response.json();
      setNotificaciones(data);
      setHasNotifications(data.some((n) => !n.leido));
    } catch (error) {
      console.error("Error al obtener notificaciones:", error);
    }
  };

  const marcarComoLeida = async (idNotificacion) => {
    try {
      await fetch(`/api/Reminder/marcarLeida`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: idNotificacion, idUsuario: idUser }),
      });
      setNotificaciones((prev) =>
        prev.map((n) => (n.id === idNotificacion ? { ...n, leido: true } : n))
      );
      fetchNotificacionesUpdate();
    } catch (error) {
      console.error("Error al marcar como leída:", error);
    }
  };

  const eliminarNotificacion = async (idNotificacion) => {
    try {
      await fetch(`/api/Reminder/eliminarNotificacion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: idNotificacion, idUsuario: idUser }),
      });
      fetchNotificacionesUpdate();
    } catch (error) {
      console.error("Error al eliminar notificación:", error);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Campanita */}
      <button
        onClick={() => setIsModalOpen((prev) => !prev)}
        style={{
          position: "fixed",
          top: "15px",
          right: "15px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "10px",
          fontSize: "24px",
          zIndex: "1000",
        }}
      >
        <i className="fa fa-bell" style={{ fontSize: "24px", color: "#333" }} />
        {hasNotifications && (
          <div
            style={{
              position: "absolute",
              top: "-3px",
              right: "-3px",
              background: "red",
              color: "white",
              borderRadius: "50%",
              width: "16px",
              height: "16px",
              fontSize: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {notificaciones.filter((n) => !n.leido).length}
          </div>
        )}
      </button>

      {/* Modal de Notificaciones */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: "60px",
            right: "60px",
            width: "320px",
            maxHeight: "450px",
            background: "white",
            borderRadius: "12px",
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",
            overflowY: "auto",
            zIndex: "1000",
            padding: "15px",
          }}
        >
          <h3
            style={{
              textAlign: "center",
              borderBottom: "1px solid #ddd",
              paddingBottom: "10px",
              marginBottom: "10px",
            }}
          >
            Notificaciones
          </h3>
          {notificaciones.length > 0 ? (
            <ul style={{ listStyle: "none", padding: "0", margin: 0 }}>
              {notificaciones.map((notificacion) => (
                <li
                  key={notificacion.id_notificacion}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    marginBottom: "12px",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    backgroundColor: notificacion.leido
                      ? "rgba(0,0,0,0.1)"
                      : "#f9f9f9",
                    filter: notificacion.leido ? "blur(0.6px)" : "none",
                  }}
                >
                  <strong>{notificacion.tipo}</strong>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: notificacion.descripcion,
                    }}
                    style={{ fontSize: "14px" }}
                  />
                  <small style={{ color: "gray" }}>
                    {new Date(notificacion.fecha).toLocaleString()}
                  </small>
                  {notificacion.leido ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "5px",
                      }}
                    >
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() =>
                          eliminarNotificacion(notificacion.id_notificacion)
                        }
                        style={{
                          minWidth: "100px",
                          textTransform: "none",
                          background: "rgb(31 41 55)",
                        }}
                      >
                        Eliminar
                      </Button>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "5px",
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() =>
                          marcarComoLeida(notificacion.id_notificacion)
                        }
                        style={{
                          minWidth: "100px",
                          textTransform: "none",
                          background: "rgb(31 41 55)",
                        }}
                        disabled={notificacion.leido}
                      >
                        Marcar como leída
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() =>
                          eliminarNotificacion(notificacion.id_notificacion)
                        }
                        style={{
                          minWidth: "100px",
                          textTransform: "none",
                          background: "rgb(31 41 55)",
                        }}
                      >
                        Eliminar
                      </Button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ textAlign: "center", padding: "10px" }}>
              No tienes notificaciones nuevas.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
