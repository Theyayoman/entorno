import Producto from "@/models/Productos";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Método no permitido" });
    }

    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ error: "Faltan parámetros requeridos" });
    }

    try {
        const [updated] = await Producto.update(
            { catalogo: 1 },
            { where: { id } }
        );

        if (updated > 0) {
            return res.status(200).json({ success: true, message: "Producto agregado al catalogo correctamente", });
        } else {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error("Error al agregar al catalogo:", error);
        res.status(500).json({ error: "Error al agregar al catalogo" });
    }
}