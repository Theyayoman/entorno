"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CatalogoSelector from "./catalogo_selector";
import DetalleOrden from "./detalle_orden";
import TablaPrototipos from "./tabla_prototipos";
import { CardTitle } from "@/components/ui/card";

export function CatalogoProductos() {
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [productoData, setProductoData] = useState({});
  const [viewDetail, setViewDetail] = useState(false);
  const [verPedidos, setVerPedidos] = useState(false);
  useEffect(() => {
    const fetchSteps = async () => {
      await axios
        .get("/api/ProductEngineering/getCategoriaGeneral", {
          params: {
            group: "nivel",
          },
        })
        .then((response) => {
          setSteps(response.data.categorias);
        })
        .catch((error) => {
          console.error("Error al hacer fetch de las categorias:", error);
        });
    };
    fetchSteps();
  }, []);

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    } else {
    }
  };

  const handleProcutoEnCatalogo = (data) => {
    setProductoData((prevProductoData) => {
      const newProductoData = { ...prevProductoData, ...data };
      return newProductoData;
    });

    nextStep();
  };
  const handleDetail = (data) => {
    setViewDetail(data);
  };

  const handleCancel = (data) => {
    setViewDetail(data);
    // window.location.reload();
  };

  return (
    <>
      <div className="flex justify-center items-center text-center mb-4">
        <CardTitle className="text-3xl font-bold">CMD</CardTitle>
      </div>
      <div>
        <Button
          onClick={() => {
            setVerPedidos(!verPedidos);
          }}
          style={{
            background: "#1f2937",
            padding: "10px 15px",
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          {!verPedidos ? <span>Ver Pedidos</span> : <span>Hacer Pedido</span>}
        </Button>
      </div>
      {verPedidos && <TablaPrototipos />}
      {viewDetail && !verPedidos && (
        <DetalleOrden productoData={productoData} closeDetalle={handleCancel} />
      )}

      {!viewDetail && !verPedidos && (
        <div className="w-full mx-auto p-4">
          {steps.map((step, index) => (
            <Accordion key={step.id} expanded={index === currentStepIndex}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{step.nombre}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <CatalogoSelector
                  id={step.id}
                  nombre={step.nombre}
                  nivel={step.nivel}
                  skip={step.skip}
                  currentStepIndex={currentStepIndex}
                  lastStep={steps.length - 1}
                  handlePrevStep={prevStep}
                  handleNextStep={nextStep}
                  sendProductoToCatalogo={handleProcutoEnCatalogo}
                  goToDetail={handleDetail}
                />
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      )}
    </>
  );
}
