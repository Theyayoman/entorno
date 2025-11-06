import Proveedor from "@/models/Proveedores";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Método no permitido" });
    }

    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).json({ error: "Faltan parámetros requeridos" });
    }

    try {
        const result = await Proveedor.create({
            nombre: nombre,
        });
    
        res.status(200).json({ success: true, message: "Proveedor agregado", proveedor: result });
    } catch (error) {
        console.error("Error al eliminar la notificación:", error);
        res.status(500).json({ error: "Error al eliminar la notificación" });
    }
}