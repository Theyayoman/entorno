"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, X } from "lucide-react";
import styles from "../../../../public/CSS/spinner.css";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { useUserContext } from "@/utils/userContext";

export function EventPlanningForm() {
  const { userData, loading } = useUserContext();
  const idUser = userData?.user?.id;
  const nombre = userData?.user?.nombre;
  const apellidos = userData?.user?.apellidos;
  const departamento = userData?.user?.departamento_id;
  const [formData, setFormData] = useState({
    evento: "",
    marca: "",
    lugar: "",
    fecha: "",
    horarioEvento: "",
    horarioMontaje: "",
    estrategia: "",
    objetivo: "",
    costos: {
      organizador: {
        descripcion: "Costos para organizador",
        presupuestado: "",
        real: "",
      },
      pagoStand: {
        descripcion: "Pago de stand o material de montaje",
        presupuestado: "",
        real: "",
      },
      transporte: {
        descripcion: "Gasto de transporte",
        presupuestado: "",
        real: "",
      },
      alimentos: {
        descripcion: "Gastos de alimentos",
        presupuestado: "",
        real: "",
      },
      hospedaje: {
        descripcion: "Gasto de hospedaje",
        presupuestado: "",
        real: "",
      },
      guiasEnvios: {
        descripcion: "Gasto de guías de envíos",
        presupuestado: "",
        real: "",
      },
      otros: [],
    },
    resultadoVenta: "",
    especificaciones: {
      fechaListo: "",
      envioMaterial: "",
      personalEvento: "",
      materialMontaje: "",
      descripcion: [],
    },
    productosVenta: [],
    facturasProveedores: [],
    piezasDigitales: [],
    dropdownValue: "",
  });

  const [totals, setTotals] = useState({ presupuestado: 0, real: 0 });
  const [roi, setRoi] = useState(0);

  useEffect(() => {
    calculateTotals();
  }, [formData.costos, formData.resultadoVenta]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((formData) => ({
      ...formData,
      [name]: value,
    }));
  };

  const handleEspecificacionesChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      especificaciones: {
        ...prevData.especificaciones,
        [field]: value,
      },
    }));
  };

  const handleDescripcionChange = (index, field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      especificaciones: {
        ...prevData.especificaciones,
        descripcion: prevData.especificaciones.descripcion.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        ),
      },
    }));
  };

  const addDescripcionItem = () => {
    setFormData((prevData) => ({
      ...prevData,
      especificaciones: {
        ...prevData.especificaciones,
        descripcion: [
          ...prevData.especificaciones.descripcion,
          { item: "", cantidad: "" },
        ],
      },
    }));
  };

  const removeDescripcionItem = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      especificaciones: {
        ...prevData.especificaciones,
        descripcion: prevData.especificaciones.descripcion.filter(
          (_, i) => i !== index
        ),
      },
    }));
  };

  const handleCostoChange = (key, field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      costos: {
        ...prevData.costos,
        [key]: {
          ...prevData.costos[key],
          [field]: value,
        },
      },
    }));
  };

  const handleOtrosCostoChange = (index, field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      costos: {
        ...prevData.costos,
        otros: prevData.costos.otros.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        ),
      },
    }));
  };

  const addOtroCosto = () => {
    setFormData((prevData) => ({
      ...prevData,
      costos: {
        ...prevData.costos,
        otros: [
          ...prevData.costos.otros,
          { descripcion: "", presupuestado: "", real: "" },
        ],
      },
    }));
  };

  const removeOtroCosto = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      costos: {
        ...prevData.costos,
        otros: prevData.costos.otros.filter((_, i) => i !== index),
      },
    }));
  };

  const handleProductoVentaChange = (index, field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      productosVenta: prevData.productosVenta.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addProductoVenta = () => {
    setFormData((prevData) => ({
      ...prevData,
      productosVenta: [
        ...prevData.productosVenta,
        { descripcion: "", cantidad: "" },
      ],
    }));
  };

  const removeProductoVenta = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      productosVenta: prevData.productosVenta.filter((_, i) => i !== index),
    }));
  };

  const handleFacturaProveedorChange = (index, field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      facturasProveedores: prevData.facturasProveedores.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addFacturaProveedor = () => {
    setFormData((prevData) => ({
      ...prevData,
      facturasProveedores: [
        ...prevData.facturasProveedores,
        { descripcion: "", valor: "", estatus: "Pendiente de pago" },
      ],
    }));
  };

  const removeFacturaProveedor = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      facturasProveedores: prevData.facturasProveedores.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handlePiezaDigitalChange = (index, field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      piezasDigitales: prevData.piezasDigitales.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addPiezaDigital = () => {
    setFormData((prevData) => ({
      ...prevData,
      piezasDigitales: [
        ...prevData.piezasDigitales,
        { descripcion: "", comentarios: "", fechaLista: "", canal: "" },
      ],
    }));
  };

  const removePiezaDigital = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      piezasDigitales: prevData.piezasDigitales.filter((_, i) => i !== index),
    }));
  };

  const calculateTotals = () => {
    let presupuestadoTotal = 0;
    let realTotal = 0;

    Object.values(formData.costos).forEach((costo) => {
      if (Array.isArray(costo)) {
        costo.forEach((item) => {
          presupuestadoTotal += parseFloat(item.presupuestado) || 0;
          realTotal += parseFloat(item.real) || 0;
        });
      } else {
        presupuestadoTotal += parseFloat(costo.presupuestado) || 0;
        realTotal += parseFloat(costo.real) || 0;
      }
    });

    setTotals({ presupuestado: presupuestadoTotal, real: realTotal });

    const resultadoVenta = parseFloat(formData.resultadoVenta) || 0;
    const roiValue =
      realTotal !== 0 ? ((resultadoVenta - realTotal) / realTotal) * 100 : 0;
    setRoi(roiValue);
  };

  const handleDropdownChange = (value) => {
    setFormData((prevState) => ({
      ...prevState,
      dropdownValue: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/MarketingStrategy/guardarFormulario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData }), // Enviar todo el objeto formData como JSON
      });
      if (response.ok) {
        Swal.fire({
          title: "Creada",
          text: "La estrategia se ha creado correctamente",
          icon: "success",
          timer: 3000, // La alerta desaparecerá después de 1.5 segundos
          showConfirmButton: false,
        }).then(() => {
          window.location.href = "/marketing/estrategias";
        });
      } else {
        Swal.fire("Error", "Error al crear la estrategia", "error");
      }
    } catch (error) {
      console.error("Error:", error);
    }

    try {
      const response2 = await fetch("/api/Reminder/EnvioEvento", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData2: {
            tipo: "Alerta de estrategia",
            descripcion: `<strong>${nombre} ${apellidos}</strong> ha subido una nueva estrategia con el nombre: <strong>${formData.evento}</strong>`,
            id: idUser,
            dpto: departamento,
          },
        }),
      });

      if (response2.ok) {
        console.log("Notificacion enviada");
      } else {
        Swal.fire(
          "Error",
          "Error al enviar la alerta de creación de nueva estrategia",
          "error"
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const { data: session, status } = useSession();
  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className={styles.spinner} />
        <p className="ml-3">Cargando...</p>
      </div>
    );
  }
  if (status == "loading" || loading) {
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
    <Card style={{ maxWidth: "100rem" }} className="w-full mx-auto">
      <CardHeader>
        <CardTitle>Nueva planificación de evento</CardTitle>
        <CardDescription>
          Complete los detalles del evento, costos, especificaciones, productos
          para venta, datos de proveedores y piezas digitales.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} className="space-y-6">
        <CardContent>
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold">Detalles del evento</h3>
            <div className="space-y-2">
              <Label htmlFor="evento">Evento</Label>
              <Input
                id="evento"
                name="evento"
                value={formData.evento}
                onChange={handleChange}
                placeholder="..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="marca">Marca que va</Label>
              <Input
                id="marca"
                name="marca"
                value={formData.marca}
                onChange={handleChange}
                placeholder="..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lugar">Lugar del evento</Label>
              <Input
                id="lugar"
                name="lugar"
                value={formData.lugar}
                onChange={handleChange}
                placeholder="..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha del evento</Label>
              <Input
                id="fecha"
                name="fecha"
                type="date"
                value={formData.fecha}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="horarioEvento">Horario del evento</Label>
              <Input
                id="horarioEvento"
                name="horarioEvento"
                type="time"
                value={formData.horarioEvento}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="horarioMontaje">Horario de montaje</Label>
              <Input
                id="horarioMontaje"
                name="horarioMontaje"
                type="time"
                value={formData.horarioMontaje}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estrategia">Estrategia para el evento</Label>
              <Textarea
                id="estrategia"
                name="estrategia"
                value={formData.estrategia}
                onChange={handleChange}
                placeholder="..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="objetivo">Objetivo</Label>
              <Textarea
                id="objetivo"
                name="objetivo"
                value={formData.objetivo}
                onChange={handleChange}
                placeholder="..."
              />
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold">Costos</h3>
            <div className="grid grid-cols-3 gap-4 font-semibold">
              <div>Descripción</div>
              <div>Presupuestado</div>
              <div>Real</div>
            </div>
            {Object.keys(formData.costos).map((key) => {
              if (key === "otros") return null;
              const costo = formData.costos[key];
              return (
                <div key={key} className="grid grid-cols-3 gap-4 items-center">
                  <Label>{costo.descripcion}</Label>
                  <Input
                    type="number"
                    value={costo.presupuestado}
                    onChange={(e) =>
                      handleCostoChange(key, "presupuestado", e.target.value)
                    }
                    placeholder="$"
                  />
                  <Input
                    type="number"
                    value={costo.real}
                    onChange={(e) =>
                      handleCostoChange(key, "real", e.target.value)
                    }
                    placeholder="$"
                  />
                </div>
              );
            })}

            <div className="space-y-2">
              <Label>Otros gastos</Label>
              <br />
              {formData.costos.otros.map((otro, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 gap-4 items-center"
                >
                  <Input
                    placeholder="Descripción"
                    value={otro.descripcion}
                    onChange={(e) =>
                      handleOtrosCostoChange(
                        index,
                        "descripcion",
                        e.target.value
                      )
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Presupuestado"
                    value={otro.presupuestado}
                    onChange={(e) =>
                      handleOtrosCostoChange(
                        index,
                        "presupuestado",
                        e.target.value
                      )
                    }
                  />
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Real"
                      value={otro.real}
                      onChange={(e) =>
                        handleOtrosCostoChange(index, "real", e.target.value)
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOtroCosto(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                style={{ background: "rgb(31 41 55)", color: "white" }}
                type="button"
                variant="outline"
                onClick={addOtroCosto}
                className="mt-2"
              >
                <PlusCircle className="h-4 w-4" />
                Agregar otro gasto
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 font-semibold pt-4 border-t">
              <div>Total</div>
              <div>{totals.presupuestado.toFixed(2)}</div>
              <div>{totals.real.toFixed(2)}</div>
            </div>

            <div className="grid grid-cols-3 gap-4 items-center">
              <Label htmlFor="resultadoVenta">Resultado de venta</Label>
              <div></div>
              <Input
                id="resultadoVenta"
                name="resultadoVenta"
                type="number"
                value={formData.resultadoVenta}
                onChange={handleChange}
                placeholder="$"
              />
            </div>

            <div className="grid grid-cols-3 gap-4 font-semibold">
              <div>ROI</div>
              <div></div>
              <div
                style={{
                  color: (() => {
                    const roiFixed = parseFloat(roi.toFixed(2)); // Convertir a número para comparación
                    if (roiFixed >= 50.0) {
                      return "green";
                    } else if (roiFixed > 0.0 && roiFixed < 50.0) {
                      return "orange";
                    } else if (roiFixed < 0.0) {
                      return "red";
                    } else {
                      return "black"; // color por defecto
                    }
                  })(),
                }}
              >
                {roi.toFixed(2)}%
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold">Especificaciones</h3>
            <div className="space-y-2">
              <Label htmlFor="fechaListo">
                Fecha para tener todo listo para envío
              </Label>
              <Input
                id="fechaListo"
                type="date"
                value={formData.especificaciones.fechaListo}
                onChange={(e) =>
                  handleEspecificacionesChange("fechaListo", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="envioMaterial">
                Cómo/a dónde se envía el material
              </Label>
              <Textarea
                id="envioMaterial"
                value={formData.especificaciones.envioMaterial}
                onChange={(e) =>
                  handleEspecificacionesChange("envioMaterial", e.target.value)
                }
                placeholder="..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="personalEvento">
                Personal que cubre el evento
              </Label>
              <Textarea
                id="personalEvento"
                value={formData.especificaciones.personalEvento}
                onChange={(e) =>
                  handleEspecificacionesChange("personalEvento", e.target.value)
                }
                placeholder="..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="materialMontaje">Material para montaje</Label>
              <Textarea
                id="materialMontaje"
                value={formData.especificaciones.materialMontaje}
                onChange={(e) =>
                  handleEspecificacionesChange(
                    "materialMontaje",
                    e.target.value
                  )
                }
                placeholder="..."
              />
            </div>
            <div className="space-y-2">
              <Label>Descripción</Label>
              <br />
              {formData.especificaciones.descripcion.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder="Item"
                    value={item.item}
                    onChange={(e) =>
                      handleDescripcionChange(index, "item", e.target.value)
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Cantidad"
                    value={item.cantidad}
                    onChange={(e) =>
                      handleDescripcionChange(index, "cantidad", e.target.value)
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeDescripcionItem(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                style={{ background: "rgb(31 41 55)", color: "white" }}
                onClick={addDescripcionItem}
                className="mt-2"
              >
                <PlusCircle className="h-4 w-4" />
                Agregar item
              </Button>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold">Producto para venta</h3>
            {formData.productosVenta.map((producto, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder="Descripción"
                  value={producto.descripcion}
                  onChange={(e) =>
                    handleProductoVentaChange(
                      index,
                      "descripcion",
                      e.target.value
                    )
                  }
                />
                <Input
                  type="number"
                  placeholder="Cantidad"
                  value={producto.cantidad}
                  onChange={(e) =>
                    handleProductoVentaChange(index, "cantidad", e.target.value)
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeProductoVenta(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              style={{ background: "rgb(31 41 55)", color: "white" }}
              onClick={addProductoVenta}
              className="mt-2"
            >
              <PlusCircle className="h-4 w-4" />
              Agregar producto
            </Button>
          </div>

          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold">
              Datos de proveedores y seguimiento al pago
            </h3>
            {formData.facturasProveedores.map((factura, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 items-center">
                <Input
                  placeholder="Descripción de factura"
                  value={factura.descripcion}
                  onChange={(e) =>
                    handleFacturaProveedorChange(
                      index,
                      "descripcion",
                      e.target.value
                    )
                  }
                />
                <Input
                  type="number"
                  placeholder="Valor"
                  value={factura.valor}
                  onChange={(e) =>
                    handleFacturaProveedorChange(index, "valor", e.target.value)
                  }
                />
                <div className="flex items-center gap-2">
                  <Select
                    value={factura.estatus}
                    onValueChange={(value) =>
                      handleFacturaProveedorChange(index, "estatus", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar estatus" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pagada">Pagada</SelectItem>
                      <SelectItem value="Pendiente de pago">
                        Pendiente de pago
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFacturaProveedor(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              style={{ background: "rgb(31 41 55)", color: "white" }}
              onClick={addFacturaProveedor}
              className="mt-2"
            >
              <PlusCircle className="h-4 w-4" />
              Agregar factura de proveedor
            </Button>
          </div>

          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold">Piezas digitales</h3>
            {formData.piezasDigitales.map((pieza, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 items-center">
                <Input
                  placeholder="Descripción de la pieza"
                  value={pieza.descripcion}
                  onChange={(e) =>
                    handlePiezaDigitalChange(
                      index,
                      "descripcion",
                      e.target.value
                    )
                  }
                />
                <Input
                  placeholder="Comentarios"
                  value={pieza.comentarios}
                  onChange={(e) =>
                    handlePiezaDigitalChange(
                      index,
                      "comentarios",
                      e.target.value
                    )
                  }
                />
                <Input
                  type="date"
                  placeholder="Fecha para estar lista"
                  value={pieza.fechaLista}
                  onChange={(e) =>
                    handlePiezaDigitalChange(
                      index,
                      "fechaLista",
                      e.target.value
                    )
                  }
                />
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Canal"
                    value={pieza.canal}
                    onChange={(e) =>
                      handlePiezaDigitalChange(index, "canal", e.target.value)
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removePiezaDigital(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              style={{ background: "rgb(31 41 55)", color: "white" }}
              onClick={addPiezaDigital}
              className="mt-2"
            >
              <PlusCircle className="h-4 w-4" />
              Agregar pieza digital
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Estatus de la planificación
            </h3>
            <div className="space-y-2">
              <Select
                id="dropdown"
                value={formData.dropdownValue}
                onValueChange={handleDropdownChange}
              >
                <SelectTrigger id="dropdown" className="w-full">
                  <SelectValue placeholder="Seleccionar estatus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Completado">Completado</SelectItem>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="En progreso">En progreso</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Guardar planificación
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

function Spinner() {
  return <div className="spinner" />;
}
