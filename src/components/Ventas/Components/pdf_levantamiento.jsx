import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Estilos
const styles = StyleSheet.create({
  page: {
    paddingTop: 130, // deja espacio para el encabezado
    paddingHorizontal: 30,
    paddingBottom: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 10,
    position: "absolute",
    top: 30,
    left: 30,
    right: 30,
  },
  heading: {
    fontSize: 12,
    marginBottom: 5,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    borderWidth: 1,
    padding: 5,
    flex: 1,
    textAlign: "center",
  },
  headerText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  logo: {
    width: 80,
    height: 80,
    marginLeft: "auto",
    marginRight: "auto",
    objectFit: "contain",
  },  
  tableColHeader: {
    width: '22%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    padding: 5,
    fontWeight: 'bold',
    fontSize: 10,
    textAlign: 'left',
  },
  tableColHeaderSameRow: {
    width: '22%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    padding: 5,
    fontWeight: 'bold',
    fontSize: 10,
    textAlign: 'left',
  },
  tableColHeaderFull: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    padding: 5,
    fontWeight: 'bold',
    fontSize: 10,
    textAlign: 'center',
  },
  tableCellHeader: {
    fontFamily: 'Helvetica-Bold',
  },
  // Columnas específicas
  colCaracteristica: {
    flex: 4,
  },
  colUnidad: {
    flex: 1, // más pequeña
  },
  colMax: {
    flex: 1,
  },
  colMin: {
    flex: 1,
  },
  colMetodo: {
    flex: 3,
  },
  ///////
  tableCol: {
    width: '78%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    padding: 5,
    fontSize: 10,
    textAlign: 'left',
  },
  tableColSameRow: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    padding: 5,
    fontSize: 10,
    textAlign: 'left',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginVertical: 2,
  },  
  planoMecanico: {
    width: 100,
    height: 100,
    marginLeft: "auto",
    marginRight: "auto",
    objectFit: "contain",
  },
  footer: {
    paddingHorizontal: 40,
  },
  firmasContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  firma: {
    width: '40%',
    textAlign: 'center',
  },
  linea: {
    marginTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    width: '100%',
    marginBottom: 5,
  },
});

const Encabezado = () => (
  <View style={styles.header} fixed>
    <View style={styles.table}>
      {/* Fila grande que simula 2 filas */}
      <View style={{ ...styles.tableRow, height: 80 }}> 
        {/* Columna que ocupa 2 filas */}
        <View style={{ ...styles.tableCell, flex: 1 }}>
          <Image src="/logoAion.png" style={styles.logo} />
        </View>

        {/* Las otras columnas divididas en 2 filas dentro */}
        <View style={{ flex: 6, flexDirection: 'column' }}>
          {/* Primera fila interna */}
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ ...styles.tableCell, flex: 2.2 }}>
              <Text style={{...styles.tableCellHeader, fontFamily: 'Helvetica-Bold'}}>Asesoría y Desarrollo de Productos Naturistas S.A. de C.V.</Text>
            </View>
            <View style={{ ...styles.tableCell, flex: 1 }}>
              <Text style={{...styles.tableCellHeader, fontFamily: 'Helvetica-Bold'}}>Fecha</Text>
              <View style={styles.divider} />
              <Text>
                {new Date().toLocaleDateString("es-ES",
                    {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    }
                )}
              </Text>
            </View>
          </View>

          {/* Segunda fila interna */}
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ ...styles.tableCell, flex: 2.2 }}>
              <Text style={{fontFamily: 'Helvetica-Bold'}}>LEVANTAMIENTO DE REQUERIMIENTOS</Text>
            </View>
            <View style={{ ...styles.tableCell, flex: 1 }}>
              <Text render={({ pageNumber, totalPages }) => `Pág. ${pageNumber} de ${totalPages}`} />
            </View>
          </View>
        </View>
      </View>
    </View>
  </View>
);

const Footer = () => (
  <View style={styles.footer} wrap={false}>
    <View style={styles.firmasContainer}>
      <View style={styles.firma}>
        <View style={styles.linea} />
        <Text>Firma del responsable</Text>
      </View>
      <View style={styles.firma}>
        <View style={styles.linea} />
        <Text>Firma del cliente</Text>
      </View>
    </View>
  </View>
);

const getTipoFormulacion = (levantamiento) => {
  switch (levantamiento?.toString()) {
    case "1":
      return "Cliente proporciona propia fórmula";
    case "2":
      return "Cliente solicita formulación";
    case "3":
      return "Igualar a producto de referencia";
    default:
      return "Sin datos";
  }
}

const getLabelTipoFormulacion = (levantamiento) => {
  switch (levantamiento?.toString()) {
    case "1":
      return "Fórmula";
    case "2":
      return "Notas";
    case "3":
      return "Notas";
    default:
      return "Fórmula";
  }
}

const getTipoDosificacion = (levantamiento) => {
  switch (levantamiento?.toString()) {
    case "1":
      return "Cantidad específica de contenido neto";
    case "2":
      return "Duración específica de tratamiento";
    case "3":
      return "Ajuste de dosis según costo unitario";
    default:
      return "Sin datos";
  }
}

const getLabelTipoDosificacion = (levantamiento) => {
  switch (levantamiento?.toString()) {
    case "1":
      return "Cantidad deseada";
    case "2":
      return "Duración del tratamiento";
    case "3":
      return "Pago por pieza";
    default:
      return "Cantidad deseada";
  }
}

const getTipoLoteado = (levantamiento) => {
  switch (levantamiento?.toString()) {
    case "1":
      return "Sin loteado";
    case "2":
      return "Loteado regular";
    default:
      return "Sin datos";
  }
}

const getTipoLenguaje = (levantamiento) => {
  switch (levantamiento?.toString()) {
    case "1":
      return "Español";
    case "2":
      return "Inglés";
    default:
      return "Sin datos";
  }
}

const getTipoCaducidad = (levantamiento) => {
  switch (levantamiento?.toString()) {
    case "1":
      return "No";
    case "2":
      return "Sí";
    default:
      return "Sin datos";
  }
}

const getTipoEtiquetado = (levantamiento) => {
  switch (levantamiento?.toString()) {
    case "1":
      return "Etiqueta consignada";
    case "2":
      return "Solicitud de servicio de diseño";
    case "3":
      return "Diseño consignado";
    default:
      return "Sin datos";
  }
}

const getCofepris = (levantamiento) => {
  switch (levantamiento?.toString()) {
    case "1":
      return "No";
    case "2":
      return "Sí";
    default:
      return "Sin datos";
  }
}

const getEcommerce = (levantamiento) => {
  switch (levantamiento?.toString()) {
    case "1":
      return "No";
    case "2":
      return "Sí";
    default:
      return "Sin datos";
  }
}

// Componente principal
const LevantamientoAPDF = ({ levantamiento, codigoBarras, codigoQR }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Encabezado />

        {/* Información del evento */}
        <View style={[styles.section]} wrap={false}>
          <View style={styles.table}>
              <Text style={{...styles.tableColHeaderFull, fontFamily: "Helvetica-Bold", fontSize: 11}}>Datos del cliente</Text>

              {/* Nombre del cliente */}
              <View style={styles.tableRow}>
                <Text style={{...styles.tableColHeader, fontFamily: 'Helvetica-Bold'}}>Nombre completo</Text>
                <Text style={{...styles.tableCol}}>{levantamiento?.prospecto?.nombre || "Sin datos"}</Text>
              </View>

              <View style={styles.tableRow}>
                {/* Número de teléfono */}
                <Text style={{...styles.tableColHeaderSameRow, fontFamily: 'Helvetica-Bold', flex: 1.5}}>Número de teléfono</Text>
                <Text style={{...styles.tableColSameRow, flex: 1}}>{levantamiento?.prospecto?.telefono || "Sin datos"}</Text>

                {/* Redes sociales */}
                <Text style={{...styles.tableColHeaderSameRow, fontFamily: 'Helvetica-Bold', flex: 1.2}}>Redes sociales</Text>
                <Text style={{...styles.tableColSameRow, flex: 3.251}}>{levantamiento?.prospecto?.redes_sociales || "Sin datos"}</Text>
              </View>

              {/* Correo del cliente */}
              <View style={styles.tableRow}>
                <Text style={{...styles.tableColHeader, fontFamily: 'Helvetica-Bold'}}>Correo</Text>
                <Text style={{...styles.tableCol}}>{levantamiento?.prospecto?.correo || "Sin datos"}</Text>
              </View>

              {/* Marca del cliente */}
              <View style={styles.tableRow}>
                <Text style={{...styles.tableColHeader, fontFamily: 'Helvetica-Bold'}}>Marca</Text>
                <Text style={{...styles.tableCol}}>{levantamiento?.prospecto?.marca || "Sin datos"}</Text>
              </View>

          </View>
        </View>

        {/* Información del evento */}
        {(levantamiento?.publico_objetivo || levantamiento?.canales_distribucion || levantamiento?.monto_inversion) && 
        <View style={[styles.section]} wrap={false}>
          <View style={styles.table}>
              <Text style={{...styles.tableColHeaderFull, fontFamily: "Helvetica-Bold", fontSize: 11}}>Enfoque e inversión</Text>

              {/* Nombre del cliente */}
              <View style={styles.tableRow}>
                <Text style={{...styles.tableColHeader, fontFamily: 'Helvetica-Bold', width: '24%'}}>Público objetivo</Text>
                <Text style={{...styles.tableCol}}>{levantamiento?.publico_objetivo || "Sin datos"}</Text>
              </View>

              {/* Correo del cliente */}
              <View style={styles.tableRow}>
                <Text style={{...styles.tableColHeader, fontFamily: 'Helvetica-Bold', width: '24%'}}>Canales de distribución</Text>
                <Text style={{...styles.tableCol}}>{levantamiento?.canales_distribucion || "Sin datos"}</Text>
              </View>

              {/* Marca del cliente */}
              <View style={styles.tableRow}>
                <Text style={{...styles.tableColHeader, fontFamily: 'Helvetica-Bold', width: '24%'}}>Monto de inversión</Text>
                <Text style={{...styles.tableCol}}>${levantamiento?.monto_inversion || "Sin datos"}</Text>
              </View>

          </View>
        </View>
        }

        {/* Información del evento */}
        {(levantamiento?.formula || levantamiento?.formula_text) && 
        <View style={[styles.section]} wrap={false}>
          <View style={styles.table}>
              <Text style={{...styles.tableColHeaderFull, fontFamily: "Helvetica-Bold", fontSize: 11}}>Fórmula</Text>

              {/* Nombre del cliente */}
              <View style={styles.tableRow}>
                <Text style={{...styles.tableColHeader, fontFamily: 'Helvetica-Bold', width: '10%'}}>Tipo</Text>
                <Text style={{...styles.tableCol, width: '90%'}}>{getTipoFormulacion(levantamiento?.formula)}</Text>
              </View>

              {/* Correo del cliente */}
              <View style={styles.tableRow}>
                <Text style={{...styles.tableColHeader, fontFamily: 'Helvetica-Bold', width: '10%'}}>{getLabelTipoFormulacion(levantamiento?.formula)}</Text>
                <Text style={{...styles.tableCol, width: '90%'}}>{levantamiento?.formula_text || "Sin datos"}</Text>
              </View>

          </View>
        </View>
        }

        {/* Información del evento */}
        {(levantamiento?.dosificacion || levantamiento?.dosificacion_text) &&
        <View style={[styles.section]} wrap={false}>
          <View style={styles.table}>
              <Text style={{...styles.tableColHeaderFull, fontFamily: "Helvetica-Bold", fontSize: 11}}>Dosificación</Text>

              {/* Nombre del cliente */}
              <View style={styles.tableRow}>
                <Text style={{...styles.tableColHeader, fontFamily: 'Helvetica-Bold', width: '20%'}}>Tipo</Text>
                <Text style={{...styles.tableCol, width: '80%'}}>{getTipoDosificacion(levantamiento?.dosificacion)}</Text>
              </View>

              {/* Correo del cliente */}
              <View style={styles.tableRow}>
                <Text style={{...styles.tableColHeader, fontFamily: 'Helvetica-Bold', width: '20%'}}>{getLabelTipoDosificacion(levantamiento?.dosificacion)}</Text>
                <Text style={{...styles.tableCol, width: '80%'}}>{levantamiento?.dosificacion?.toString() === "3" && "$"}{levantamiento?.dosificacion_text || "Sin datos"}</Text>
              </View>

          </View>
        </View>
        }

        {/* Información del evento */}
        {(levantamiento?.loteado || levantamiento?.loteado_lenguaje || levantamiento?.loteado_caducidad) &&
        <View style={[styles.section]} wrap={false}>
          <View style={styles.table}>
              <Text style={{...styles.tableColHeaderFull, fontFamily: "Helvetica-Bold", fontSize: 11}}>Loteado</Text>

              <View style={styles.tableRow}>
                {/* Número de teléfono */}
                <Text style={{...styles.tableColHeaderSameRow, fontFamily: 'Helvetica-Bold', width: '10%'}}>Tipo</Text>
                <Text style={{...styles.tableCol, width: '22%'}}>{getTipoLoteado(levantamiento?.loteado)}</Text>

                {/* Redes sociales */}
                <Text style={{...styles.tableColHeaderSameRow, fontFamily: 'Helvetica-Bold', width: '12%'}}>Lenguaje</Text>
                <Text style={{...styles.tableCol, width: '22%'}}>{getTipoLenguaje(levantamiento?.loteado_lenguaje)}</Text>

                {/* Redes sociales */}
                <Text style={{...styles.tableColHeaderSameRow, fontFamily: 'Helvetica-Bold', width: '12%'}}>Caducidad</Text>
                <Text style={{...styles.tableCol, width: '22%'}}>{getTipoCaducidad(levantamiento?.loteado_caducidad)}</Text>
              </View>

          </View>
        </View>
        }

        {/* Información del evento */}
        {(levantamiento?.etiqueta || levantamiento?.cofepris || levantamiento?.ecommerce) &&
        <View style={[styles.section]} wrap={false}>
          <View style={styles.table}>
              <Text style={{...styles.tableColHeaderFull, fontFamily: "Helvetica-Bold", fontSize: 11}}>Etiquetado</Text>

              {/* Nombre del cliente */}
              <View style={styles.tableRow}>
                <Text style={{...styles.tableColHeader, fontFamily: 'Helvetica-Bold', width: '25%'}}>Tipo</Text>
                <Text style={{...styles.tableCol, width: '75%'}}>{getTipoEtiquetado(levantamiento?.etiqueta)}</Text>
              </View>

              <View style={styles.tableRow}>
                {/* Redes sociales */}
                <Text style={{...styles.tableColHeaderSameRow, fontFamily: 'Helvetica-Bold', width: '25%'}}>Regulaciones COFEPRIS</Text>
                <Text style={{...styles.tableCol, width: '30%'}}>{getCofepris(levantamiento?.cofepris)}</Text>

                {/* Redes sociales */}
                <Text style={{...styles.tableColHeaderSameRow, fontFamily: 'Helvetica-Bold', width: '14%'}}>E-commerce</Text>
                <Text style={{...styles.tableCol, width: '31%'}}>{getEcommerce(levantamiento?.ecommerce)}</Text>
              </View>

              {codigoBarras ? (
                <View style={{...styles.tableColHeaderFull}}>
                    <Image src={codigoBarras} style={styles.planoMecanico} />
                </View>
                ) : (
                <View style={{...styles.tableColHeaderFull}}>
                    <Image src={"/banIcon.png"} style={styles.planoMecanico} />
                    <Text>Sin código de barras agregado</Text>
                </View>
                )
              }
          </View>
        </View>
        }

        <View style={[styles.section]} wrap={false}>
          <View style={styles.table}>
              <Text style={{...styles.tableColHeaderFull, fontFamily: "Helvetica-Bold", fontSize: 11}}>Prototipo</Text>

              <View style={styles.tableRow}>
                <Text style={{...styles.tableColHeaderFull}}>Aquí va el prototipo</Text>
              </View>

          </View>
        </View>

        {/* Información del evento */}
        {(levantamiento?.distribuidor?.nombre || levantamiento?.distribuidor?.telefono || levantamiento?.distribuidor?.redes ||
         levantamiento?.distribuidor?.direccion || levantamiento?.distribuidor?.correo || levantamiento?.distribuidor?.ecommerce) &&
        <View style={[styles.section]} wrap={false}>
          <View style={styles.table}>
              <Text style={{...styles.tableColHeaderFull, fontFamily: "Helvetica-Bold", fontSize: 11}}>Distribuidor</Text>

              {/* Nombre del cliente */}
              <View style={styles.tableRow}>
                <Text style={{...styles.tableColHeader, fontFamily: 'Helvetica-Bold', width: '32%'}}>Nombre de la persona/empresa</Text>
                <Text style={{...styles.tableCol, width: '68%'}}>{levantamiento?.distribuidor?.nombre || "Sin datos"}</Text>
              </View>

              <View style={styles.tableRow}>
                {/* Número de teléfono */}
                <Text style={{...styles.tableColHeaderSameRow, fontFamily: 'Helvetica-Bold', width: '32%'}}>Número telefónico</Text>
                <Text style={{...styles.tableColSameRow, width: '15%'}}>{levantamiento?.distribuidor?.telefono || "Sin datos"}</Text>

                {/* Redes sociales */}
                <Text style={{...styles.tableColHeaderSameRow, fontFamily: 'Helvetica-Bold', width: '16%'}}>Redes sociales</Text>
                <Text style={{...styles.tableColSameRow, width: '37%'}}>{levantamiento?.distribuidor?.redes || "Sin datos"}</Text>
              </View>

              {/* Nombre del cliente */}
              <View style={styles.tableRow}>
                <Text style={{...styles.tableColHeader, fontFamily: 'Helvetica-Bold', width: '32%'}}>Dirección</Text>
                <Text style={{...styles.tableCol, width: '68%'}}>{levantamiento?.distribuidor?.direccion || "Sin datos"}</Text>
              </View>

              {/* Nombre del cliente */}
              <View style={styles.tableRow}>
                <Text style={{...styles.tableColHeader, fontFamily: 'Helvetica-Bold', width: '32%'}}>Correos de contacto</Text>
                <Text style={{...styles.tableCol, width: '68%'}}>{levantamiento?.distribuidor?.correo || "Sin datos"}</Text>
              </View>

              {/* Nombre del cliente */}
              <View style={styles.tableRow}>
                <Text style={{...styles.tableColHeader, fontFamily: 'Helvetica-Bold', width: '32%'}}>Páginas de e-commerce</Text>
                <Text style={{...styles.tableCol, width: '68%'}}>{levantamiento?.distribuidor?.ecommerce || "Sin datos"}</Text>
              </View>

              {codigoQR ? (
                <View style={{...styles.tableColHeaderFull}}>
                    <Image src={codigoQR} style={styles.planoMecanico} />
                </View>
                ) : (
                <View style={{...styles.tableColHeaderFull}}>
                    <Image src={"/banIcon.png"} style={styles.planoMecanico} />
                    <Text>Sin código QR agregado</Text>
                </View>
                )
              }
          </View>
        </View>
        }

        <Footer />
      </Page>
    </Document>
  );
};

export default LevantamientoAPDF;