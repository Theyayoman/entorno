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
    /*borderStyle: "solid",
    borderWidth: 1,*/
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
    width: 250,
    height: 250,
    marginLeft: "auto",
    marginRight: "auto",
    objectFit: "contain",
  },
});

const Encabezado = ({ producto, imagenAdicional }) => (
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
              <Text style={{...styles.tableCellHeader, fontFamily: 'Helvetica-Bold'}}>Última revisión</Text>
              <View style={styles.divider} />
              <Text>14/03/2025</Text>
            </View>
            <View style={{ ...styles.tableCell, flex: 1 }}>
              <Text style={{...styles.tableCellHeader, fontFamily: 'Helvetica-Bold'}}>Vigencia</Text>
              <View style={styles.divider} />
              <Text>06-ene-28</Text>
            </View>
            <View style={{ ...styles.tableCell, flex: 1 }}>
              <Text style={{...styles.tableCellHeader, fontFamily: 'Helvetica-Bold'}}>Código</Text>
              <View style={styles.divider} />
              <Text>{ `${producto.producto.codigoIso}`}</Text>
              {/* <Text>IP-FT-001</Text> */}
            </View>
          </View>

          {/* Segunda fila interna */}
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ ...styles.tableCell, flex: 2.21 }}>
              <Text style={{fontFamily: 'Helvetica-Bold'}}>FICHA TÉCNICA DE {producto.producto?.tipo?.toUpperCase().replace(/[S]$/, '')}</Text>
            </View>
            <View style={{ ...styles.tableCell, flex: 2.16 }}>
              <Text style={{fontFamily: 'Helvetica-Bold'}}>Edición</Text>
              <View style={styles.divider} />
              <Text>000</Text>
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

// Componente principal
const FichaTecnicaPDF = ({ producto, imagenAdicional, nombreCreado, nombreValidacion, nombreTolerancias }) => {
    const body = [
    ["Característica", "Unidad", "Máximo", "Mínimo", "Método de inspección"],
    ...producto.identificadores
        .map((i) => {
        const match = producto.identificadoresProductos.find(
            (p) => p.identificador_id === i.id
        );
        const valorRaw = i.calculable === 1 ? match?.registroN ?? "" : match?.registroV ?? "";
        const toleranciaRaw = match?.tolerancia ?? "";
    
        const valor = parseFloat(valorRaw);
        const tolerancia = parseFloat(toleranciaRaw);
    
        let maximo = "";
        let minimo = "";
    
        if (!isNaN(valor) && !isNaN(tolerancia)) {
            const ajuste = valor * (tolerancia / 100);
            maximo = (valor + ajuste).toFixed(2);
            minimo = (valor - ajuste).toFixed(2);
        }
    
        // Método de inspección
        let metodo = "";
        let medicion = "";
        const unidad = i.medicion;
        if (unidad === "MM.") metodo = producto.producto.tipo, medicion = "mm";
        else if (unidad === "G.") metodo = "Método interno 2", medicion = "g";
        else if (unidad === "ML.") metodo = "Método interno 3", medicion = "ml";
        else metodo = "Método interno 4", medicion = valorRaw, maximo = "No aplica", minimo = "No aplica";
    
        return [i.nombre, medicion, maximo, minimo, metodo];
        }),
    ];

    const imagenPlano = producto.imagenes?.find(
      (img) => img.tipo === 1 || img.tipo === 3
    );
    
    const rutaPlano = imagenPlano?.ruta
      ? `/api/ProductEngineering/obtenerImagenes?rutaImagen=${encodeURIComponent(imagenPlano.ruta)}`
      : null;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Encabezado producto={producto} imagenAdicional={imagenAdicional} />

        {/* Información del evento */}
        <View style={[styles.section]} wrap={false}>
          <View style={styles.table}>

              {/* Fila 1 */}
              <View style={styles.tableRow}>
                <Text style={{...styles.tableColHeader, fontFamily: 'Helvetica-Bold'}}>Fecha de elaboración</Text>
                <Text style={{...styles.tableCol, width: '28%'}}>14/03/2025</Text>
              </View>

              {/* Fila 2 */}
              {/* <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Folio</Text>
              <Text style={styles.tableCol}>001</Text>
              </View>   */}

              {/* Fila 3 */}
              <View style={styles.tableRow}>
                {/* Nombre del producto */}
                <Text style={{...styles.tableColHeaderSameRow, fontFamily: 'Helvetica-Bold', flex: 1.735}}>Nombre del producto</Text>
                <Text style={{...styles.tableColSameRow, flex: 3.265}}>{producto.producto?.nombre}</Text>

                {/* Código del producto */}
                <Text style={{...styles.tableColHeaderSameRow, fontFamily: 'Helvetica-Bold', flex: 1.6}}>Código del producto</Text>
                <Text style={{...styles.tableColSameRow, flex: 1.4}}>{producto.producto?.codigo}</Text>
              </View>

              {/* Fila 4 
              <View style={styles.tableRow}>
                <Text style={{...styles.tableColHeader, fontFamily: 'Helvetica-Bold'}}>Código del producto</Text>
                <Text style={styles.tableCol}>{producto.producto?.codigo}</Text>
              </View>*/}

              {/* Fila 5 */}
              <View style={styles.tableRow}>
                <Text style={{...styles.tableColHeader, fontFamily: 'Helvetica-Bold'}}>Composición</Text>
                <Text style={styles.tableCol}>{producto.producto?.composicion || "Sin datos"}</Text>
              </View>

              {/* Fila 6 */}
              <View style={styles.tableRow}>
                <Text style={{...styles.tableColHeader, fontFamily: 'Helvetica-Bold'}}>Descripción</Text>
                <Text style={styles.tableCol}>{producto.producto?.descripcion}</Text>
              </View>

              {/* Fila 7 */}
              {/* <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Modo de empleo (Uso)</Text>
              <Text style={styles.tableCol}>{producto.producto?.modo_empleo || "Sin datos"}</Text>
              </View> */}

          </View>
        </View>

        {/* Tabla de datos */}
        <View style={styles.table} wrap={false}>
          <Text style={{...styles.tableColHeaderFull, fontFamily: "Helvetica-Bold"}}>Inspección Dimensional</Text>

          {body.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.tableRow}>
              {(() => {
                if (rowIndex === 0) {
                  // Fila de encabezado normal
                  return row.map((cell, cellIndex) => {
                    let cellStyle = [styles.tableCell];
                    if (cellIndex === 0) cellStyle.push(styles.colCaracteristica);
                    else if (cellIndex === 1) cellStyle.push(styles.colUnidad);
                    else if (cellIndex === 2) cellStyle.push(styles.colMax);
                    else if (cellIndex === 3) cellStyle.push(styles.colMin);
                    else if (cellIndex === 4) cellStyle.push(styles.colMetodo);

                    return (
                      <View key={cellIndex} style={cellStyle}>
                        <Text style={styles.tableCellHeader}>{cell}</Text>
                      </View>
                    );
                  });
                } else {
                  const metodo = row[4];

                  if (metodo === "Método interno 4") {
                    return (
                      <>
                        {/* Característica */}
                        <View style={[styles.tableCell, styles.colCaracteristica, { flex: 4 }]}>
                          <Text>{row[0]}</Text>
                        </View>

                        {/* Celda combinada: Unidad + Máximo + Mínimo */}
                        <View style={[styles.tableCell, { flex: 3.5 }]}>
                          <Text>{row[1]}</Text>
                        </View>

                        {/* Método */}
                        <View style={[styles.tableCell, styles.colMetodo, { flex: 3 }]}>
                          <Text>{metodo}</Text>
                        </View>
                      </>
                    );
                  }

                  // Fila normal
                  return row.map((cell, cellIndex) => {
                    let cellStyle = [styles.tableCell];
                    if (cellIndex === 0) cellStyle.push(styles.colCaracteristica);
                    else if (cellIndex === 1) cellStyle.push(styles.colUnidad);
                    else if (cellIndex === 2) cellStyle.push(styles.colMax);
                    else if (cellIndex === 3) cellStyle.push(styles.colMin);
                    else if (cellIndex === 4) cellStyle.push(styles.colMetodo);

                    return (
                      <View key={cellIndex} style={cellStyle}>
                        <Text>{cell}</Text>
                      </View>
                    );
                  });
                }
              })()}
            </View>
          ))}

          {/* Fila fija: Materia Extraña */}
          <View style={styles.tableRow}>
            {/* Columna 1: Característica */}
            <View style={[styles.tableCell, styles.colCaracteristica, { flex: 4 }]}>
              <Text>Materia extraña</Text>
            </View>

            {/* Columna combinada: Unidad + Máx + Mín */}
            <View style={[styles.tableCell, { flex: 3.5 }]}>
              <Text>{producto.producto?.materia_extraña}</Text>
            </View>

            {/* Columna final: Método */}
            <View style={[styles.tableCell, styles.colMetodo, { flex: 3 }]}>
              <Text>Método interno 4</Text>
            </View>
          </View>
        </View>

        {/* Plano mecánico */}
        <View style={styles.table} wrap={false}>
          {/* Fila 1: Encabezado (una sola columna) */}
          <View style={styles.tableRow}>
            <View style={{ ...styles.tableCell, flex: 1 }}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>Plano mecánico</Text>
            </View>
          </View>

          {/* Fila 2: Contenido en dos columnas */}
          <View style={styles.tableRow}>
            <View style={{ ...styles.tableCell, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {rutaPlano && (
              <Image src={rutaPlano} style={styles.planoMecanico} />
            )}
            </View>
            {imagenAdicional ? (
              <View style={{ ...styles.tableCell, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image src={imagenAdicional} style={styles.planoMecanico} />
              </View>
            ) : (
              <View style={{ ...styles.tableCell, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image src={"/banIcon.png"} style={styles.planoMecanico} />
                <Text>Sin plano mecánico agregado</Text>
              </View>
            )
            }
          </View>
        </View>

        {/* Sección 1 */}
        <View style={styles.table} wrap={false}>
          {/* Fila 1: Encabezado */}
          <View style={{...styles.tableRow, fontFamily: "Helvetica-Bold"}}>
              <View style={styles.tableCell}>
              <Text style={{ fontWeight: 'bold' }}>Condiciones de almacenamiento</Text>
              </View>
          </View>

          {/* Fila 2: Contenido */}
          <View style={styles.tableRow}>
              <View style={styles.tableCell}>
              <Text>
                  {producto.producto?.condiciones}
              </Text>
              </View>
          </View>
        </View>

        {/* Sección 2 */}
        {/* <View style={styles.table} wrap={false}> */}
        {/* Fila 1: Encabezado */}
        {/* <View style={styles.tableRow}>
            <View style={styles.tableCell}>
            <Text style={{ fontWeight: 'bold' }}>Distribución</Text>
            </View>
        </View> */}

        {/* Fila 2: Contenido */}
        {/* <View style={styles.tableRow}>
            <View style={styles.tableCell}>
            <Text>
                {producto.producto?.distribucion}
            </Text>
            </View>
        </View> */}
        {/* </View> */}
        
        {/* Sección 3 */}
        <View style={styles.table} wrap={false}>
          {/* Fila 1: Encabezado */}
          <View style={{...styles.tableRow, fontFamily: "Helvetica-Bold"}}>
              <View style={styles.tableCell}>
              <Text style={{ fontWeight: 'bold' }}>Consideración sobre la disposición</Text>
              </View>
          </View>

          {/* Fila 2: Contenido */}
          <View style={styles.tableRow}>
              <View style={styles.tableCell}>
              <Text>
                  {producto.producto?.consideracion}
              </Text>
              </View>
          </View>
        </View>

        {/* Footer - Información legal */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
            paddingRight: 325,            // espacio desde el borde derecho
          }}
          wrap={false}
        >
          {/* Columna izquierda */}
          <Text style={{ fontFamily: "Helvetica-Bold" }}>Información legal:</Text>

          {/* Columna derecha */}
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'flex-start',  // que los textos empiecen en el inicio del bloque
              // marginRight:335,           // margen extra si lo quieres todavía más separado
            }}
          >
            <Text>NMX‑E‑285‑NYCE‑2021</Text>
            <Text>ISO 15270:2008</Text>
            <Text>FDA 21 CFR 174, 176, 177</Text>
          </View>
        </View>

        {/* Footer - Texto */}
        <View wrap={false}>
          <Text style={{ fontSize: 7, textAlign: 'center', marginBottom: 20 }}>Documento informativo, queda prohibida su reproducción total o parcial sin la aprobación emitida por Asesorías y Desarrollo de Productos Naturistas S.A. de C.V.</Text>
        </View>

        {/* Footer - Tabla de involucrados */}
        <View style={styles.table} wrap={false}>
          {/* Fila 1: Encabezado */}
          <View style={styles.tableRow}>
            <View style={{...styles.tableCell, fontFamily: "Helvetica-Bold"}}>
              <Text style={{ fontWeight: 'bold' }}>Elaboró</Text>
            </View>
            <View style={{...styles.tableCell, fontFamily: "Helvetica-Bold"}}>
              <Text style={{ fontWeight: 'bold' }}>Aprobó</Text>
            </View>
            <View style={{...styles.tableCell, fontFamily: "Helvetica-Bold"}}>
              <Text style={{ fontWeight: 'bold' }}>Revisó</Text>
            </View>
          </View>

          {/* Fila 2: Contenido */}
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text>{nombreCreado ?? ""}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>{nombreValidacion ?? ""}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>{nombreTolerancias ?? ""}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default FichaTecnicaPDF;