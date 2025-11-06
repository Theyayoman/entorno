import React from 'react';
import { Page, Text, View, Image, Document, StyleSheet } from '@react-pdf/renderer';

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20, // Aumenta el padding para evitar cortes
  },
  section: {
    marginBottom: 15,
  },
  heading: {
    fontSize: 12,
    marginBottom: 5,
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 15,
    padding: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '50%',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderColor: '#000',
    backgroundColor: '#f2f2f2',
    padding: 5,
    fontWeight: 'bold',
    fontSize: 10,
  },
  tableCol: {
    width: '50%',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderColor: '#000',
    padding: 5,
    fontSize: 10,
  },
  totalRow: {
    fontWeight: 'bold',
  },
  tableCell: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    textAlign: 'center',
    flexGrow: 1,
    fontSize: 10,
  },
  tableCellHeader: {
    fontWeight: 'bold',
    fontSize: 10,
    textAlign: "center",
  },
  image: {
    width: '100%',
    height: '30px',
  },
  logoCell: {
    flex: 1,
    paddingRight: 10,
  },
  avoidBreak: {
    break: 'avoid', // Evita que se dividan elementos grandes en páginas distintas
  },
  pageBreak: {
    break: 'before', // Fuerza que una sección grande comience en una nueva página
  },
});

// Componente PDF para el evento
const PDFDocument = ({ evento }) => {
  // Calcular totales y ROI
  const totalCostosPresupuestados = Object.keys(evento.costos).reduce((total, key) => {
    if (key !== 'otros') {
      return total + parseFloat(evento.costos[key].presupuestado || 0);
    }
    return total;
  }, 0) + evento.costos.otros.reduce((total, item) => total + parseFloat(item.presupuestado || 0), 0);

  const totalCostosReales = Object.keys(evento.costos).reduce((total, key) => {
    if (key !== 'otros') {
      return total + parseFloat(evento.costos[key].real || 0);
    }
    return total;
  }, 0) + evento.costos.otros.reduce((total, item) => total + parseFloat(item.real || 0), 0);

  const ganancia = parseFloat(evento.resultadoVenta || 0);
  const roi = totalCostosReales > 0 ? ((ganancia - totalCostosReales) / totalCostosReales) * 100 : 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Tabla al principio del PDF */}
        <View style={styles.table}>
          {/* Primera fila */}
          <View style={styles.tableRow}>
            {/* Celda con rowspan simulada para el logo */}
            <View style={{ ...styles.tableCell, flex: 1, flexDirection: "column", justifyContent: "center" }} rowspan={2}>
              <Image src="/aion.png" alt="logo" style={styles.image} />
            </View>

            <View style={{ ...styles.tableCell, flex: 3 }}>
              <Text style={styles.tableCellHeader}>Especialidades AION S.A. de C.V.</Text>
            </View>
            <View style={{...styles.tableCell, flex: 3}}>
              <Text style={styles.tableCellHeader}>Última revisión</Text>
              <Text>22 de abril de 2022</Text>
            </View>
            <View style={{...styles.tableCell, flex: 3}}>
              <Text style={styles.tableCellHeader}>Vigencia</Text>
              <Text>22 de abril de 2025</Text>
            </View>
            <View style={{...styles.tableCell, flex: 3}}>
              <Text style={styles.tableCellHeader}>Código</Text>
              <Text>RH-RE-1</Text>
            </View>
          </View>

          {/* Segunda fila */}
          <View style={styles.tableRow}>
            <View style={{ ...styles.tableCell, flex: 4 }}>
              <Text style={styles.tableCellHeader}>FACTURA DE ESTRATEGIAS</Text>
            </View>
            <View style={{ ...styles.tableCell, flex: 2 }}>
              <Text style={styles.tableCellHeader}>Edición</Text>
              <Text>0</Text>
            </View>
            <View style={{ ...styles.tableCell, flex: 2 }}>
              <Text style={styles.tableCellHeader}>Nivel</Text>
              <Text>2</Text>
            </View>
            <View style={{ ...styles.tableCell, flex: 2 }}>
              <Text render={({ pageNumber, totalPages }) => `Pág. ${pageNumber} de ${totalPages}`} />
            </View>
          </View>
        </View>
      
        {/* Información del evento */}
        <View style={[styles.section]} wrap={false}>
          <Text style={styles.heading}>Planificación de evento</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Evento</Text>
              <Text style={styles.tableCol}>{evento.evento}</Text>
              <Text style={styles.tableColHeader}>Marca</Text>
              <Text style={styles.tableCol}>{evento.marca}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Lugar</Text>
              <Text style={styles.tableCol}>{evento.lugar}</Text>
              <Text style={styles.tableColHeader}>Fecha</Text>
              <Text style={styles.tableCol}>{evento.fecha}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Horario evento</Text>
              <Text style={styles.tableCol}>{evento.horarioEvento}</Text>
              <Text style={styles.tableColHeader}>Horario montaje</Text>
              <Text style={styles.tableCol}>{evento.horarioMontaje}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Estrategia</Text>
              <Text style={styles.tableCol}>{evento.estrategia}</Text>
              <Text style={styles.tableColHeader}>Objetivo</Text>
              <Text style={styles.tableCol}>{evento.objetivo}</Text>
            </View>
          </View>
        </View>

        {/* Tabla de Costos */}
        <View style={[styles.section]} wrap={false}>
          <Text style={styles.heading}>Costos</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Descripción</Text>
              <Text style={styles.tableColHeader}>Presupuestado</Text>
              <Text style={styles.tableColHeader}>Real</Text>
            </View>
            {Object.keys(evento.costos).map((key) => (
              key !== 'otros' && (
                <View key={key} style={styles.tableRow}>
                  <Text style={styles.tableCol}>{evento.costos[key].descripcion}</Text>
                  <Text style={styles.tableCol}>{evento.costos[key].presupuestado}</Text>
                  <Text style={styles.tableCol}>{evento.costos[key].real}</Text>
                </View>
              )
            ))}
            {/* Otros costos */}
            {evento.costos.otros.length > 0 && (
              evento.costos.otros.map((otros, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCol}>{otros.descripcion}</Text>
                  <Text style={styles.tableCol}>{otros.presupuestado}</Text>
                  <Text style={styles.tableCol}>{otros.real}</Text>
                </View>
              ))
            )}
            {/* Mostrar totales */}
            <View style={[styles.tableRow, styles.totalRow]}>
              <Text style={styles.tableCol}>Totales</Text>
              <Text style={styles.tableCol}>{totalCostosPresupuestados.toFixed(2)}</Text>
              <Text style={styles.tableCol}>{totalCostosReales.toFixed(2)}</Text>
            </View>
          </View>
          <Text style={{fontSize:10}}>Resultado de venta: {evento.resultadoVenta}</Text>
          <Text style={{ fontSize:10 }}>ROI: <Text style={{ color: roi < 0.00 ? 'red' : roi > 0.00 && roi < 50.00 ? 'orange' : roi >= 50.00 ? 'green' : 'black' }}> {roi.toFixed(2)}%</Text>
          </Text>
        </View>

        {/* Especificaciones */}
        <View style={[styles.section]} wrap={false}>
          <Text style={styles.heading}>Especificaciones</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Fecha listo</Text>
              <Text style={styles.tableCol}>{evento.especificaciones.fechaListo}</Text>
              <Text style={styles.tableColHeader}>Envio material</Text>
              <Text style={styles.tableCol}>{evento.especificaciones.envioMaterial}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Personal</Text>
              <Text style={styles.tableCol}>{evento.especificaciones.personalEvento}</Text>
              <Text style={styles.tableColHeader}>Material montaje</Text>
              <Text style={styles.tableCol}>{evento.especificaciones.materialMontaje}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Item</Text>
              <Text style={styles.tableColHeader}>Cantidad</Text>
            </View>
            {evento.especificaciones.descripcion.length > 0 ? (
              evento.especificaciones.descripcion.map((desc, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCol}>{desc.item}</Text>
                  <Text style={styles.tableCol}>{desc.cantidad}</Text>
                </View>
              ))
            ) : (
              <View style={styles.tableRow}>
                <Text style={styles.tableCol}>No hay descripción disponible</Text>
              </View>
            )}
          </View>
        </View>

        {/* Productos para venta */}
        <View style={[styles.section]} wrap={false}>
          <Text style={styles.heading}>Productos para venta</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Descripción</Text>
              <Text style={styles.tableColHeader}>Cantidad</Text>
            </View>
            {evento.productosVenta.length > 0 ? (
              evento.productosVenta.map((producto, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCol}>{producto.descripcion}</Text>
                  <Text style={styles.tableCol}>{producto.cantidad}</Text>
                </View>
              ))
            ) : (
              <View style={styles.tableRow}>
                <Text style={styles.tableCol}>No hay productos para venta</Text>
              </View>
            )}
          </View>
        </View>

        {/* Datos de proveedores */}
        <View style={[styles.section]} wrap={false}>
          <Text style={styles.heading}>Datos de proveedores y seguimiento al pago</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Descripción</Text>
              <Text style={styles.tableColHeader}>Valor</Text>
              <Text style={styles.tableColHeader}>Estatus</Text>
            </View>
            {evento.facturasProveedores.length > 0 ? (
              evento.facturasProveedores.map((factura, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCol}>{factura.descripcion}</Text>
                  <Text style={styles.tableCol}>{factura.valor}</Text>
                  <Text style={styles.tableCol}>{factura.estatus}</Text>
                </View>
              ))
            ) : (
              <View style={styles.tableRow}>
                <Text style={styles.tableCol}>No hay datos de proveedores</Text>
              </View>
            )}
          </View>
        </View>

        {/* Piezas digitales */}
        <View style={[styles.section]} wrap={false}>
          <Text style={styles.heading}>Piezas digitales</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Descripción</Text>
              <Text style={styles.tableColHeader}>Comentarios</Text>
              <Text style={styles.tableColHeader}>Fecha lista</Text>
              <Text style={styles.tableColHeader}>Canal</Text>
            </View>
            {evento.piezasDigitales.length > 0 ? (
              evento.piezasDigitales.map((pieza, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCol}>{pieza.descripcion}</Text>
                  <Text style={styles.tableCol}>{pieza.comentarios}</Text>
                  <Text style={styles.tableCol}>{pieza.fechaLista}</Text>
                  <Text style={styles.tableCol}>{pieza.canal}</Text>
                </View>
              ))
            ) : (
              <View style={styles.tableRow}>
                <Text style={styles.tableCol}>No hay piezas digitales</Text>
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PDFDocument;